import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StatusBar, TextInput, Alert } from "react-native";
import Dialog from "react-native-dialog";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, onSnapshot, getDoc, serverTimestamp } from "firebase/firestore";
import { FIREBASE_DB as db, FIREBASE_AUTH as auth } from "../Firebaseconfig";
import { HomeContainer, TestHomecontainer, HomeText, DeviceStatus } from "../components/styles";
import Octicons from "react-native-vector-icons/Octicons";
import KbAvoidWrapper from "../components/KbAvoidWrapper";

const DeviceScreen = () => {
  const [user, setUser] = useState(null);
  const [detectionMode, setDetectionMode] = useState("visible");
  const [threshold, setThreshold] = useState("0.5");
  const [deviceStatus, setDeviceStatus] = useState("Ready");
  const [isScanning, setIsScanning] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    changeNavigationBarColor("transparent", true, true);
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        loadUserData(u.uid);
        subscribeToUserData(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid) => {
    try {
      if (!db) {
        console.error("Firestore database not initialized");
        return;
      }
      
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        
        // Load settings
        if (data.settings) {
          setDetectionMode(data.settings.detection_mode || "visible");
          setThreshold(data.settings.detection_threshold?.toString() || "0.5");
        }
        
        // Load status
        if (data.status) {
          setDeviceStatus(data.status.device_status || "Ready");
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const subscribeToUserData = (uid) => {
    try {
      if (!db) {
        console.error("Firestore database not initialized");
        return;
      }
      
      const userRef = doc(db, "users", uid);
      return onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          
          // Update status
          if (data.status) {
            setDeviceStatus(data.device_status || "Ready");
          }
        }
      }, (error) => {
        console.error("Error in real-time listener:", error);
      });
    } catch (error) {
      console.error("Error setting up real-time listener:", error);
    }
  };

  const saveSettings = async () => {
    if (!user || !db) return;
    
    try {
      const uid = user.uid;
      const userRef = doc(db, "users", uid);
      
      await setDoc(
        userRef,
        {
          settings: {
            detection_mode: detectionMode,
            detection_threshold: parseFloat(threshold) || 0.5,
          },
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };

  const sendStartCommand = async () => {
    if (!user || !db) return;
    
    try {
      const uid = user.uid;
      
      // Save current settings first
      await saveSettings();
      
      // Send start command
      const userRef = doc(db, "users", uid);
      await setDoc(
        userRef,
        {
          commands: {
            start_detection: true,
            detection_mode: detectionMode,
            detection_threshold: parseFloat(threshold) || 0.5,
            timestamp: serverTimestamp(),
          },
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error sending start command:", error);
    }
  };

  const sendStopCommand = async () => {
    if (!user || !db) return;
    
    try {
      const uid = user.uid;
      
      const userRef = doc(db, "users", uid);
      await setDoc(
        userRef,
        {
          commands: {
            start_detection: false,
            timestamp: serverTimestamp(),
          },
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error sending stop command:", error);
    }
  };



  return (
    <HomeContainer style={{ backgroundColor: "#1E3D58", padding: 20}}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <TestHomecontainer>
        <HomeText>Device Control</HomeText>
      </TestHomecontainer>

      {/* Status & Buttons */}
      <KbAvoidWrapper>
        <View style={{ flex: 1, marginTop: 10 }}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
            }}> 
            <View>
              <DeviceStatus status={deviceStatus || "Disconnected"}>
                {deviceStatus|| "Disconnected"}
              </DeviceStatus>
            </View>
            <View
              style={{
                width: "100%",
                height: 200,
                margin: 5,
                padding: 10,
                backgroundColor: "#f0f0f0",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: "#333", fontWeight: "bold" }}>
                Start detection to view feed
              </Text>
            </View>
            <View style={{ flexDirection: "column",width: "100%" }}>
              <Dialog.Container contentStyle={{ borderRadius: 10, backgroundColor: "#E8EEF1"}} visible={showDialog}>
                      <Dialog.Title style={{color: "#1E3D58"}}>Device Disconnected</Dialog.Title>
                      <Dialog.Description style={{color: "#1E3D58"}}>Cannot start detection when device is disconnected.</Dialog.Description>
                      <Dialog.Button label="OK"  style={{color: "#00B2FF", fontWeight: "bold", fontSize: 15}} onPress={() => setShowDialog(false)} />
                    </Dialog.Container>
              {!isScanning ? (
                <TouchableOpacity
                style={{
                  backgroundColor: "#00B2FF",
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  if(deviceStatus==="Disconnected"){
                    setShowDialog(true);
                  }else {
                    sendStartCommand(); setIsScanning(true);
                  }
                  }}
              >
                <Text style={{ color: "#FFFF", fontSize: 16 }}>Start Detection</Text>
              </TouchableOpacity>
              ):(
                <TouchableOpacity
                style={{
                  backgroundColor: "#69509A",
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {sendStopCommand(); setIsScanning(false);}}
              >
                <Text style={{ color: "#FFFF", fontSize: 16 }}>Stop Detection</Text>
              </TouchableOpacity>
              )}
              
            </View>
          </View>

          {/* Scan Parameters */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#fff",
              padding: 10,
              paddingRight:20,
              borderRadius: 10,
              marginTop: 15,
            }}
          >
            <Text style={{ fontSize: 20, color: "#1E3D58", fontWeight: "bold" }}>Scan Parameters</Text>

              {/* Detection Mode */}
              <View
                style={{
                  width: "100%",
                  margin: 5,
                  padding: 10,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 16, color: "#1E3D58", fontWeight: "bold" }}>
                  Detection Mode
                </Text>
                <View style={{ flexDirection: "column", justifyContent: "flex-start" }}>
                  {/* Visible Light */}
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                    onPress={() => setDetectionMode("visible")}
                  >
                    <View
                      style={{
                        backgroundColor: detectionMode === "visible" ? "#00B2FF" : "#ccc",
                        height: 25,
                        width: 25,
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {detectionMode === "visible" && <Octicons name={"check"} size={20} color={"#fff"} />}
                    </View>
                    <Text style={{ fontSize: 16, color: "#1E3D58", marginLeft: 5 }}>Visible Light</Text>
                  </TouchableOpacity>

                  {/* UV Light */}
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                    onPress={() => setDetectionMode("uv")}
                  >
                    <View
                      style={{
                        backgroundColor: detectionMode === "uv" ? "#69509A" : "#ccc",
                        height: 25,
                        width: 25,
                        borderRadius: 25,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {detectionMode === "uv" && <Octicons name={"check"} size={20} color={"#fff"} />}
                    </View>
                    <Text style={{ fontSize: 16, color: "#1E3D58", marginLeft: 5 }}>UV Light</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Detection Threshold */}
              <View
                style={{
                  width: "100%",
                  margin: 5,
                  padding: 10,
                  backgroundColor: "#f0f0f0",
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 16, color: "#1E3D58", fontWeight: "bold" }}>
                  Detection Threshold
                </Text>
                <Text style={{ fontSize: 14, color: "#1E3D58" }}>Enter value between 0.5 and 1.0</Text>
                <TextInput
                  style={{
                    height: 40,
                    borderColor: "#ccc",
                    borderWidth: 1,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    marginTop: 10,
                    width: "80%",
                    color: "#1E3D58",
                  }}
                  placeholder="Enter threshold value"
                  keyboardType="numeric"
                  value={threshold}
                  onChangeText={setThreshold}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
          </View>
        </View>
      </KbAvoidWrapper>
    </HomeContainer>
  );
};

export default DeviceScreen;
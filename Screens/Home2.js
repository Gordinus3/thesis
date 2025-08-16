import React, { useEffect, useState, useRef } from "react";
import {
  HomeContainer,
  HeaderContainer,
  HeaderText,
  DeviceCard,
  DeviceTitle,
  DeviceStatus,
  SectionHeader,
  SectionTitle,
  SectionLink,
  ScanPlaceholder,
} from "../components/styles";
import LinearGradient from "react-native-linear-gradient";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import Octicons from "react-native-vector-icons/Octicons";
import { CommonActions } from "@react-navigation/native";
import { ref, listAll, getDownloadURL, getMetadata, getStorage } from "firebase/storage";

const Home2 = ({ navigation }) => {
  const auth = getAuth();
  const db = getFirestore();
  const [visible, setVisible] = useState(false);
  const translateX = useRef(new Animated.Value(-300)).current;

  const [userData, setUserData] = useState(null);
  const [latestImageUrl, setLatestImageUrl] = useState(null);

  const show = () => {
    setVisible(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hide = () => {
    Animated.timing(translateX, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  const signoutpress = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login2" }],
        })
      );
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const fetchLatestImageFromStorage = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const storage = getStorage();
      const folderRef = ref(storage, `${user.uid}/detections`);
      const result = await listAll(folderRef);

      if (result.items.length === 0) return null;

      let latestFile = null;
      let latestTimestamp = 0;

      for (const itemRef of result.items) {
        const metadata = await getMetadata(itemRef);
        const fileTime = new Date(metadata.timeCreated).getTime();

        if (fileTime > latestTimestamp) {
          latestTimestamp = fileTime;
          latestFile = itemRef;
        }
      }

      if (latestFile) {
        const url = await getDownloadURL(latestFile);
        return url;
      }

      return null;
    } catch (error) {
      console.error("Error fetching latest image:", error);
      return null;
    }
  };

  useEffect(() => {
    changeNavigationBarColor('transparent', true, true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (userSnapshot.exists()) {
            const data = userSnapshot.data();
            setUserData(data);

            const url = await fetchLatestImageFromStorage();
            if (url) {
              setLatestImageUrl(url);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
        setLatestImageUrl(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <HomeContainer style={{ backgroundColor: "#1E3D58" }}>
      <StatusBar  translucent backgroundColor= "transparent" barStyle="light-content"/>
      {/* Header */}
      <HeaderContainer>
        <TouchableOpacity onPress={show}>
          <Octicons name="person" size={30} color="#fff" />
        </TouchableOpacity>
        <HeaderText>Welcome, {userData?.fullName || "User"}</HeaderText>
      </HeaderContainer>

      {/* Device Status Card */}
      <DeviceCard>
        <Image
          source={require("./../images/device.png")}
          style={{ width: 60, height: 60, marginRight: 15 }}
        />
        <View>
          <DeviceTitle>MicroVision</DeviceTitle>
          <DeviceStatus status={userData?.device_status || "Disconnected"}>
            {userData?.device_status || "Disconnected"}
          </DeviceStatus>
        </View>
      </DeviceCard>

      {/* Recent Scans Header */}
      

      {/* Recent Scan Card */}
      {latestImageUrl ? (
        <View style={{ 
              backgroundColor: "#E8EEF1", 
              borderRadius: 10,
              padding: 20,
              height: 350,
              marginBottom: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 10,
              overflow: "hidden",
            }}>
          <SectionHeader>
            <SectionTitle>Recent Scans</SectionTitle>
            <TouchableOpacity onPress={() => navigation.navigate("ResultScreen2")}>
              <SectionLink>View all</SectionLink>
            </TouchableOpacity>
          </SectionHeader>
          <View
            style={{
              backgroundColor: "#e8eef1",
              borderRadius: 10,
              padding: 20,
              overflow: "hidden",
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 10,
                },
              }),
            }}
          >
            <Image source={{ uri: latestImageUrl }} style={{ width: "100%", height: 200}} resizeMode="contain" />
          </View>
        </View>
        
      ) : (
        <View style={{ 
              backgroundColor: "#E8EEF1", 
              borderRadius: 10,
              padding: 20,
              height: 350,
              marginBottom: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 10,
              overflow: "hidden",
            }}>
          <SectionHeader>
            <SectionTitle>Recent Scans</SectionTitle>
            <TouchableOpacity onPress={() => navigation.navigate("ResultScreen2")}>
              <SectionLink>View all</SectionLink>
            </TouchableOpacity>
          </SectionHeader>
          <View
            style={{
              backgroundColor: "#e8eef1",
              borderRadius: 10,
              padding: 20,
              overflow: "hidden",
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                },
                android: {
                  elevation: 10,
                },
              }),
            }}
          >
          </View>
        </View>
      )}

      {/* Modal Menu */}
      <Modal visible={visible} transparent animationType="none">
        <TouchableWithoutFeedback onPress={hide}>
          <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.2)" }}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "60%",
                  backgroundColor: "white",
                  padding: 20,
                  justifyContent:"space-between",
                  transform: [{ translateX }],
                }}
              >
                <View>
                  <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>
                    Profile Menu
                  </Text>
                  <Text>{userData?.fullName || "User"}</Text>
                  <Text>{userData?.email || "Email"}</Text>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("UpdatePass")}
                    style={{ marginTop: 20 }}
                  >
                    <Text>Reset Password</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={signoutpress} style={{ marginTop: 20 }}>
                    <Text style={{ color: "red" }}>Logout</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={{ fontSize: 18, marginBottom: 20, color: "#c0c6c9ff" }}>
                    MicroVision 2025
                  </Text>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </HomeContainer>
  );
};

export default Home2;

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
} from "../components/styles";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
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
  Linking,
} from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import Octicons from "react-native-vector-icons/Octicons";
import { CommonActions } from "@react-navigation/native";
import {
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  getStorage,
} from "firebase/storage";

const Home2 = ({ navigation }) => {
  const auth = getAuth();
  const db = getFirestore();
  const [visible, setVisible] = useState(false);
  const translateX = useRef(new Animated.Value(-300)).current;

  const [userData, setUserData] = useState(null);
  const [latestScan, setLatestScan] = useState(null); // ✅ store both image+pdf

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

  // 🔹 Helper: fetch latest image with matching PDF
  const fetchLatestImageWithPdf = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;

      const storage = getStorage();

      const reportsRef = ref(storage, `${user.uid}/reports`);
      const detectionsRef = ref(storage, `${user.uid}/detections`);

      // Get PDFs
      const reportResult = await listAll(reportsRef);
      const reportFiles = await Promise.all(
        reportResult.items.map(async (itemRef) => {
          const metadata = await getMetadata(itemRef);
          return {
            name: itemRef.name,
            time: new Date(metadata.timeCreated).getTime(),
            url: await getDownloadURL(itemRef),
          };
        })
      );

      if (reportFiles.length === 0) return null;

      reportFiles.sort((a, b) => b.time - a.time);
      const latestPdf = reportFiles[0];

      // Get images
      const detectionResult = await listAll(detectionsRef);
      const detectionFiles = await Promise.all(
        detectionResult.items.map(async (itemRef) => {
          const metadata = await getMetadata(itemRef);
          return {
            name: itemRef.name,
            time: new Date(metadata.timeCreated).getTime(),
            url: await getDownloadURL(itemRef),
          };
        })
      );

      // Match prefix
      const pdfPrefix = latestPdf.name.split("_")[0];
      const matchingImages = detectionFiles.filter((img) =>
        img.name.startsWith(pdfPrefix)
      );

      if (matchingImages.length === 0) return null;

      return {
        pdfUrl: latestPdf.url,
        imageUrl: matchingImages[0].url,
      };
    } catch (error) {
      console.error("Error fetching latest image with PDF:", error);
      return null;
    }
  };

  useEffect(() => {
    changeNavigationBarColor("transparent", true, true);

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);

          // Real-time Firestore listener
          const unsubscribeUser = onSnapshot(userDocRef, async (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              setUserData(data);

              // Only fetch scans once
              if (!latestScan) {
                const scan = await fetchLatestImageWithPdf();
                if (scan) setLatestScan(scan);
              }
            } else {
              setUserData(null);
              setLatestScan(null);
            }
          });

          return () => unsubscribeUser();
        } catch (error) {
          console.error("Error setting up user listener:", error);
        }
      } else {
        setUserData(null);
        setLatestScan(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  return (
    <HomeContainer style={{ backgroundColor: "#1E3D58" }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <HeaderContainer>
        <TouchableOpacity onPress={show}>
          <Octicons name="person" size={30} color="#fff" />
        </TouchableOpacity>
        <HeaderText>Welcome, {userData?.fullName || "User"}</HeaderText>
      </HeaderContainer>

      {/* Device Status Card */}
      <TouchableOpacity
        onPress={() => navigation.navigate("DeviceScreen")}
      >
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
      </TouchableOpacity>
      {/* Recent Scans */}
      <View
        style={{
          backgroundColor: "#E8EEF1",
          borderRadius: 10,
          padding: 20,
          marginBottom: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 10,
          overflow: "hidden",
        }}
      >
        <SectionHeader>
          <SectionTitle>Recent Scans</SectionTitle>
          <TouchableOpacity onPress={() => navigation.navigate("ResultScreen2")}>
            <SectionLink>View all</SectionLink>
          </TouchableOpacity>
        </SectionHeader>

        {latestScan ? (
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
            <Image
              source={{ uri: latestScan.imageUrl }}
              style={{ width: "100%", height: 200 }}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => Linking.openURL(latestScan.pdfUrl)}
              style={{
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                backgroundColor: "#00B2FF",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#E8EEF1", fontWeight: "bold" }}>
                View PDF Report
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
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
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "#1E3D58" }}>
              No recent scans
            </Text>
          </View>
        )}
      </View>

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
                  justifyContent: "space-between",
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

import React, { useEffect, useState, useRef } from "react";
import {
  HomeContainer,
  TestHomecontainer,
  StatusText,
  StatusLink,
  SectionHeader,
  HomeText,
} from "../components/styles";
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
} from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import { CommonActions } from "@react-navigation/native";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../Firebaseconfig";

const Home = ({ navigation }) => {
  const auth = getAuth();
  const db = getFirestore();
  const [visible, setVisible] = useState(false);
  const translateX = useRef(new Animated.Value(-300)).current;

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
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const [userData, setUserData] = useState(null);
  const [latestImageUrl, setLatestImageUrl] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          setUserData(data);

          try {
            const folderRef = ref(storage, `${uid}/detections`);
            const listResult = await listAll(folderRef);

            if (listResult.items.length === 0) return;

            const metadataList = await Promise.all(
              listResult.items.map(async (itemRef) => {
                const metadata = await getMetadata(itemRef);
                return {
                  ref: itemRef,
                  updated: metadata.updated,
                };
              })
            );

            const latest = metadataList.reduce((a, b) =>
              new Date(a.updated) > new Date(b.updated) ? a : b
            );

            const latestUrl = await getDownloadURL(latest.ref);
            console.log("Fetched latest image URL:", latestUrl);
            setLatestImageUrl(latestUrl);
          } catch (error) {
            console.error("Error fetching latest image:", error.message);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <HomeContainer>
      <View
        style={{
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <TouchableOpacity style={{ left: 10 }} onPress={show}>
          <Octicons name="person" size={30} color="black" />
        </TouchableOpacity>

        <StatusText style={{ left: 10, fontWeight: "bold", fontSize: 20 }}>
          Welcome, {userData?.fullName || "User"}
        </StatusText>
      </View>

      {/* Modal */}
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
                  transform: [{ translateX }],
                }}
              >
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}
                >
                  Profile Menu
                </Text>
                <StatusText>{userData?.fullName || "User"}</StatusText>
                <StatusText>{userData?.email || "Email"}</StatusText>

                <TouchableOpacity
                  onPress={() => navigation.navigate("UpdatePass")}
                  style={{ marginBottom: 10 }}
                >
                  <Text>Reset Password</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={signoutpress}>
                  <Text>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={hide} style={{ marginTop: 20 }}>
                  <Text style={{ color: "red" }}>Close</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 🔹 Latest Image Display */}
      <TestHomecontainer style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResultScreen")}
        >
          <StatusText
            style={{
              left: 268,
              fontWeight: "bold",
              fontSize: 20,
              marginTop: 12,
            }}
          >
            View All ➜
          </StatusText>
        </TouchableOpacity>

        {latestImageUrl ? (
          <View style={{ alignItems: "center", margin: 5 }}>
            <Image
              source={{ uri: latestImageUrl }}
              style={{
                width: 350,
                height: 200,
                marginBottom: 10,
                marginTop: 15,
              }}
            />
          </View>
        ) : (
          <View>
            <Text style={{ left: 100, paddingTop: 100 }}>
                 No test results available
            </Text>
          </View>
        )}
      </TestHomecontainer>
      {/* //Led container, for controlling led power/intensity */}
    </HomeContainer>
  );
};

export default Home;

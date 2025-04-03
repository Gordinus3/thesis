import React, { useEffect, useState, useRef } from "react";
import {
  HomeContainer,
  TestHomecontainer,
  HomeText,
  StatusText,
  StatusLink,
} from "../components/styles";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { View, Text, TouchableOpacity, Modal, Animated, TouchableWithoutFeedback, Image } from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import { CommonActions } from '@react-navigation/native';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { storage } from "../Firebaseconfig";

// const storage = getStorage();
const Home = ({ navigation }) => {
  const auth = getAuth();
  const db = getFirestore();
  const [visible, setVisible] = useState(false); // Modal visibility state
  const translateX = useRef(new Animated.Value(-300)).current; // Start off-screen

  const show = () => {
    setVisible(true);
    Animated.timing(translateX, {
      toValue: 0, // Slide in to view
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const signoutpress = async () => {
    try {
      await signOut(auth);

      // Reset navigation to prevent back navigation to Homescween
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const hide = () => {
    Animated.timing(translateX, {
      toValue: -300, // Slide back out
      duration: 300,
      useNativeDriver: true,
    }).start(() => setVisible(false)); // Hide modal after animation
  };

  // Fetch user data
  const [userData, setUserData] = useState(null);
  const [latestImageUrl, setLatestImageUrl] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserData(userData);

          // Fetch latest image URL from Firebase Storage
          const imageCount = userData.imageCount || 0;
          if (imageCount > 0) {
            const latestImageIndex = imageCount - 1;

            const imageRef = ref(storage, `${user.uid}/image${latestImageIndex}.png`);

            try {
              const latestImageUrl = await getDownloadURL(imageRef);
              setLatestImageUrl(latestImageUrl);
            } catch (error) {
              console.error("Error fetching latest image URL:", error.message);
            }
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <HomeContainer>
      <View style={{ height: 50, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TouchableOpacity style={{ left: 10 }} onPress={show}>
          <Octicons name="person" size={30} color="black" />
        </TouchableOpacity>

        <StatusText style={{ left: 10, fontWeight: "bold", fontSize: 20 }}>
          Welcome, {userData?.fullName || "User"}
        </StatusText>
      </View>

      {/* 🔹 Profile Icon to Open Modal */}



      {/* 🔹 Animated Sliding Modal */}
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
                  width: "60%", // Adjust menu width
                  backgroundColor: "white",
                  padding: 20,
                  transform: [{ translateX }],
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>Profile Menu</Text>
                <StatusText>{userData?.fullName || "User"}</StatusText>
                <StatusText>{userData?.email || "Email"}</StatusText>

                {/* 🔹 Reset Password Button */}
                <TouchableOpacity onPress={() => navigation.navigate('UpdatePass')} style={{ marginBottom: 10 }}>
                  <Text>Reset Password</Text>
                </TouchableOpacity>

                {/* 🔹 Logout Button */}
                <TouchableOpacity onPress={signoutpress}>
                  <Text>Logout</Text>
                </TouchableOpacity>

                {/* 🔹 Close Button */}
                <TouchableOpacity onPress={hide} style={{ marginTop: 20 }}>
                  <Text style={{ color: "red" }}>Close</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      {/* 🔹 Scanning Section */}
      <TestHomecontainer style={{ height: 80 }}>
        <HomeText>Scanning in Progress</HomeText>
        <StatusLink onPress={() => navigation.navigate("ScanScreen")}>
          <StatusText>View Status</StatusText>
        </StatusLink>
      </TestHomecontainer>

      {/* 🔹 Latest Image Display */}
      <TestHomecontainer style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => navigation.navigate('ResultScreen')}>
          <Text style={{ left: 10, fontWeight: "bold", fontSize: 20 }}>See more...</Text>
        </TouchableOpacity>

        {latestImageUrl && latestImageUrl !== '' ? (
          <View style={{alignItems:"center",margin:5,color:"black"}}>
            <Image
              source={{ uri: latestImageUrl }}
              style={{ width: 350, height: 200, marginBottom: 10,marginTop:15}}
            />
          </View>


        ) : (
          <View>
            <Text style={{}}>No test results available</Text>
          </View>

        )}
      </TestHomecontainer>
      {/* //Led container, for controlling led power/intensity */}
      <TestHomecontainer style={{ height: 100 }} />
    </HomeContainer>
  );
};



export default Home;

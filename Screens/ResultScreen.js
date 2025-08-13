import React, { useEffect, useState } from "react";
import { HomeContainer, TestHomecontainer, HomeText, StatusText } from "../components/styles";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { View, Text, ScrollView, Image } from "react-native";
import { getStorage, ref, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../Firebaseconfig";
import { Link } from "@react-navigation/native";

const ResultScreen = ({ navigation }) => {
  const auth = getAuth();
  const db = getFirestore();
  const [userData, setUserData] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserData(userData);

          const imageCount = userData.imageCount||0;
          const fetchedImages = [];
          const fetchedTimestamps = [];

          for (let i = 0; i < imageCount; i++) {
            const imageRef = ref(storage, `${user.uid}/detections/image${i}.jpg`);

            try {
              const imageUrl = await getDownloadURL(imageRef);
              const metadata = await getMetadata(imageRef); // Get metadata
              const timeCreated = metadata.timeCreated; // Get upload timestamp

              fetchedImages.push(imageUrl);
              fetchedTimestamps.push(timeCreated); // Store the timestamp

            } catch (error) {
              console.error(`Error fetching image${i}.png:`, error.message);
            }
          }

          setImageUrls(fetchedImages);
          setTimestamps(fetchedTimestamps); // Save timestamps to state
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <HomeContainer>
      <TestHomecontainer>
        <HomeText>All Test Results</HomeText>
      </TestHomecontainer>

      {imageUrls.length > 0 ? (
        <ScrollView>
          {imageUrls.map((url, index) => (
            <View key={index} style={{ marginBottom: 20, alignItems: "center" }}>
              <Image source={{ uri: url }} style={{ width: 350, height: 200, marginBottom: 10 }} />
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Test Result {index + 1}</Text>
              {/* Display timestamp */}
              <Text style={{ fontSize: 12, color: "gray" }}>
                Uploaded on: {new Date(timestamps[index]).toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={{ padding: 20 }}>No test results available</Text>
      )}
    </HomeContainer>
  );
};

export default ResultScreen;

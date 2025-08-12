import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { storage } from "../Firebaseconfig";
import { HomeContainer, TestHomecontainer, HomeText } from "../components/styles";

const ResultScreen = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) return;

      const uid = user.uid;
      const db = getFirestore();
      const folderRef = ref(storage, `${uid}/detections/`);

      try {
        const result = await listAll(folderRef);

        const fetchedImages = await Promise.all(
          result.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const metadata = await getMetadata(itemRef);

            const name = metadata.name; // e.g., "20250724_032067_image0.jpg"

            // Strip file extension and "_image0" suffix if it exists
            const nameWithoutExt = name.split(".")[0]; // "20250724_032067_image0"
            const timestampMatch = nameWithoutExt.match(/^(\d{8}_\d{6})/); // Extract "20250724_032067"
            const timestamp = timestampMatch ? timestampMatch[1] : null;

            let pdfUrl = null;

            if (timestamp) {
              const reportRef = doc(db, "users", uid, "reports", `report_${timestamp}`);
              const reportSnap = await getDoc(reportRef);

              if (reportSnap.exists()) {
                const reportData = reportSnap.data();
                pdfUrl = reportData?.pdf_url || null;
              }
            }

            return {
              url,
              name,
              timeCreated: metadata.timeCreated,
              pdfUrl,
            };
          })
        );

        setImages(fetchedImages);
      } catch (error) {
        console.error("Error fetching images or reports:", error.message);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <HomeContainer>
      <TestHomecontainer>
        <HomeText>All Test Results</HomeText>
      </TestHomecontainer>

      {images.length > 0 ? (
        <ScrollView>
          {images.map((img, index) => (
            <View key={index} style={{ marginBottom: 20, alignItems: "center" }}>
              <Image
                source={{ uri: img.url }}
                style={{ width: 350, height: 200, marginBottom: 10 }}
              />
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>{img.name}</Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                Uploaded on: {new Date(img.timeCreated).toLocaleString()}
              </Text>

              {img.pdfUrl ? (
                <TouchableOpacity onPress={() => Linking.openURL(img.pdfUrl)}>
                  <Text style={{ color: "blue", textDecorationLine: "underline", marginTop: 5 }}>
                    View PDF Report
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
                  No PDF report found
                </Text>
              )}
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

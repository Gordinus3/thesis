import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, StatusBar} from "react-native";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../Firebaseconfig";
import { HomeContainer, TestHomecontainer, HomeText, background } from "../components/styles";

const ResultScreen2 = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    changeNavigationBarColor('transparent', true, true);
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) return;

      const uid = user.uid;

      try {
        // ---------- Get PDFs from reports/ ----------
        const reportsRef = ref(storage, `${uid}/reports/`);
        const pdfPattern = /^\d{8}_session\d+\.pdf$/;
        const pdfMap = {};

        const reportsResult = await listAll(reportsRef);
        await Promise.all(
          reportsResult.items
            .filter(itemRef => pdfPattern.test(itemRef.name))
            .map(async (itemRef) => {
              const pdfUrl = await getDownloadURL(itemRef);
              const sessionKey = itemRef.name.split(".")[0]; // e.g., "20250813_session1"
              pdfMap[sessionKey] = pdfUrl;
            })
        );

        // ---------- Get images from detections/ ----------
        const detectionsRef = ref(storage, `${uid}/detections/`);
        const imagePattern = /^\d{8}_session\d+_image\d+\.jpg$/;
        const detectionsResult = await listAll(detectionsRef);

        // Group images by sessionKey
        const sessionImageMap = {};

        await Promise.all(
          detectionsResult.items
            .filter(itemRef => imagePattern.test(itemRef.name))
            .map(async (itemRef) => {
              const url = await getDownloadURL(itemRef);
              const metadata = await getMetadata(itemRef);
              const timeCreated = new Date(metadata.timeCreated);
              const sessionKey = itemRef.name.replace(/_image\d+\.jpg$/, "");

              // Keep only the newest image per session
              if (!sessionImageMap[sessionKey] || timeCreated > sessionImageMap[sessionKey].timeCreated) {
                sessionImageMap[sessionKey] = {
                  url,
                  name: itemRef.name,
                  timeCreated,
                  pdfUrl: pdfMap[sessionKey] || null
                };
              }
            })
        );

        // Convert to array & sort newest first
        const finalResults = Object.values(sessionImageMap).sort((a, b) => b.timeCreated - a.timeCreated);

        setResults(finalResults);
      } catch (error) {
        console.error("Error fetching results:", error.message);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <HomeContainer style={{ backgroundColor: "#1E3D58", padding: 20 }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
        
      <TestHomecontainer>
        <HomeText>Scan Results</HomeText>
      </TestHomecontainer>

      {results.length > 0 ? (
        <ScrollView>
          {results.map((item, index) => (
            <View key={index} style={{ marginBottom: 20, alignItems: "center", backgroundColor: "#E8EEF1", borderRadius: 10, padding: 20 }}>
              <Image
                source={{ uri: item.url }}
                style={{ width: "100%", height: 200, marginBottom: 10 }}
              />
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                Uploaded on: {item.timeCreated.toLocaleString()}
              </Text>
              {item.pdfUrl ? (
                <TouchableOpacity onPress={() => Linking.openURL(item.pdfUrl)} style={{ marginTop: 10, backgroundColor: "#00B2FF", padding: 10, borderRadius: 10 }}>
                    <Text style={{ color: "#E8EEF1", fontWeight: "bold" }}>
                         View PDF Report
                    </Text>
                </TouchableOpacity>
              ) : (
                <View>
                    <Image source={require("./../images/box.png")} style={{ width: 60, height: 60, marginRight: 15 }}></Image>
                    <Text style={{ fontSize: 12, color: "gray", marginTop: 5 }}>
                        No PDF report found
                    </Text>
                </View>
                )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style ={{ justifyContent: "center", alignItems: "center", marginTop: 200}}>
            <Image source={require("./../images/box.png")} style={{ width: 200, height: 200, marginRight: 15}}></Image>
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "#E8EEF1", marginTop: 5 }}>
                    No scan results available
                </Text>
        </View>
      )}
    </HomeContainer>
  );
};

export default ResultScreen2;

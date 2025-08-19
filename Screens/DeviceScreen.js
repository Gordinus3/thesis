import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, StatusBar} from "react-native";
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../Firebaseconfig";
import { HomeContainer, TestHomecontainer, HomeText, background } from "../components/styles";

const DeviceScreen = () => {
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
        <HomeText>Device Control</HomeText>
      </TestHomecontainer>
      <View style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 10 }}>
            <View style={{ width: '100%', height: 200, margin: 5, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#333', fontWeight: "bold" }}>MicroVision Deactivated</Text>
            </View>
            <View>
                <TouchableOpacity
                    style={{ backgroundColor: '#00B2FF', padding: 10, borderRadius: 5, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => Linking.openURL('https://microvision.com/device-control')}
            >
                    <Text style={{ color: '#E8EEF1', fontSize: 16 }}>Start Detection</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ backgroundColor: '#69509A', padding: 10, borderRadius: 5, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => Linking.openURL('https://microvision.com/device-control')}
            >
                    <Text style={{ color: '#FFFF', fontSize: 16 }}>Stop Detection</Text>
                </TouchableOpacity>
            </View>
        </View>

        <ScrollView style={{ width: '100%' }}>  
            <View style={{ flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 10 }}>
                
            </View>
        </ScrollView>
    </HomeContainer>
  );
};

export default DeviceScreen;

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import changeNavigationBarColor from "react-native-navigation-bar-color";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../Firebaseconfig";
import {
  HomeContainer,
  TestHomecontainer,
  HomeText,
} from "../components/styles";

const ResultScreen2 = () => {
  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // 🔹 new state

  // 🔹 Reusable fetch function
  const fetchResults = useCallback(async () => {
    const user = getAuth().currentUser;
    if (!user) {
      setResults([]);
      setLoading(false);
      return;
    }

    const uid = user.uid;

    try {
      setLoading(true); // start loading

      // ---------- Get PDFs from reports/ ----------
      const reportsRef = ref(storage, `${uid}/reports/`);
      const pdfPattern = /^\d{8}_session\d+\.pdf$/;
      const pdfMap = {};

      const reportsResult = await listAll(reportsRef);
      await Promise.all(
        reportsResult.items
          .filter((itemRef) => pdfPattern.test(itemRef.name))
          .map(async (itemRef) => {
            const pdfUrl = await getDownloadURL(itemRef);
            const sessionKey = itemRef.name.split(".")[0];
            pdfMap[sessionKey] = pdfUrl;
          })
      );

      // ---------- Get images from detections/ ----------
      const detectionsRef = ref(storage, `${uid}/detections/`);
      const imagePattern = /^\d{8}_session\d+_image\d+\.jpg$/;
      const detectionsResult = await listAll(detectionsRef);

      const sessionImageMap = {};

      await Promise.all(
        detectionsResult.items
          .filter((itemRef) => imagePattern.test(itemRef.name))
          .map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const metadata = await getMetadata(itemRef);
            const timeCreated = new Date(metadata.timeCreated);
            const sessionKey = itemRef.name.replace(/_image\d+\.jpg$/, "");

            if (
              !sessionImageMap[sessionKey] ||
              timeCreated > sessionImageMap[sessionKey].timeCreated
            ) {
              sessionImageMap[sessionKey] = {
                url,
                name: itemRef.name,
                timeCreated,
                pdfUrl: pdfMap[sessionKey] || null,
              };
            }
          })
      );

      const finalResults = Object.values(sessionImageMap).sort(
        (a, b) => b.timeCreated - a.timeCreated
      );

      setResults(finalResults);
    } catch (error) {
      console.error("Error fetching results:", error.message);
    } finally {
      setLoading(false); // stop loading
    }
  }, []);

  useEffect(() => {
    changeNavigationBarColor("transparent", true, true);

    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        await fetchResults();
      } else {
        setResults([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchResults]);

  // 🔹 Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchResults();
    setRefreshing(false);
  };

  return (
    <HomeContainer style={{ backgroundColor: "#1E3D58", padding: 20 }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <TestHomecontainer>
        <HomeText>Scan Reports</HomeText>
      </TestHomecontainer>

      {loading ? (
        // 🔹 Show spinner while loading
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#00B2FF" />
          <Text style={{ marginTop: 10, color: "#E8EEF1" }}>
            Loading reports...
          </Text>
        </View>
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View
              style={{
                marginBottom: 20,
                alignItems: "center",
                backgroundColor: "#E8EEF1",
                borderRadius: 10,
                padding: 20,
              }}
            >
              <Image
                source={{ uri: item.url }}
                style={{ width: "100%", height: 200, marginBottom: 10 }}
              />
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 12, color: "gray" }}>
                Uploaded on: {item.timeCreated.toLocaleString()}
              </Text>

              {item.pdfUrl ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.pdfUrl)}
                  style={{
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
              ) : (
                <View style={{ alignItems: "center", marginTop: 10 }}>
                  <Image
                    source={require('./../images/box.png')}
                    style={{ width: 60, height: 60, marginRight: 15 }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "gray",
                      marginTop: 5,
                      textAlign: "center",
                    }}
                  >
                    No PDF report found
                  </Text>
                </View>
              )}
            </View>
          )}
        />
      ) : (
        // 🔹 Empty state
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 200,
          }}
        >
          <Image
            source={require("./../images/box.png")}
            style={{ width: 200, height: 200, marginRight: 15 }}
          />
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "#E8EEF1",
              marginTop: 5,
            }}
          >
            No scan reports available
          </Text>
        </View>
      )}
    </HomeContainer>
  );
};

export default ResultScreen2;

// StreamViewer.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import {
  RTCPeerConnection,
  RTCView,
} from "react-native-webrtc";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_DB as db, FIREBASE_AUTH as auth } from "../Firebaseconfig";
import Orientation from "react-native-orientation-locker";

export default function StreamViewer({ navigation }) {
  const [status, setStatus] = useState("Connecting...");
  const [stream, setStream] = useState(null);
  const [connected, setConnected] = useState(false);
  const [showExit, setShowExit] = useState(false);

  const pcRef = useRef(null);

  const updateStatus = (msg) => {
    setStatus(msg);
  };

  const startStream = async (ip) => {
    try {
      updateStatus("Connecting...");
      setConnected(false);

      const pc = new RTCPeerConnection({ iceServers: [] });
      pcRef.current = pc;

      pc.ontrack = (event) => {
        if (event.track.kind === "video") {
          setStream(event.streams[0]);
          updateStatus("Connected - Stream active");
          setConnected(true);
        }
      };

      pc.onconnectionstatechange = () => {
        if (
          pc.connectionState === "failed" ||
          pc.connectionState === "closed"
        ) {
          updateStatus("Connection failed");
          stopStream();
        }
      };

      // Create offer
      const offer = await pc.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      await pc.setLocalDescription(offer);

      // 🔹 Build WHEP URL using rpiIp
      const url = `http://${ip}:8889/stream/whep`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }

      const answerSdp = await response.text();
      await pc.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      });
    } catch (err) {
      console.error("Stream error:", err);
      updateStatus("Error: " + err.message);
      stopStream();
    }
  };

  const stopStream = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setStream(null);
    setConnected(false);
    updateStatus("Disconnected");
  };

  useEffect(() => {
    // Lock to landscape when entering
    Orientation.lockToLandscape();

    const auth = getAuth();
    const user = auth.currentUser;

    let unsubscribe;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);

        unsubscribe = onSnapshot(
          userRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              if (data.rpiIp) {
                startStream(data.rpiIp);
              }
            }
          },
          (error) => {
            console.error("Error in real-time listener:", error);
          }
        );
      } catch (error) {
        console.error("Error setting up real-time listener:", error);
      }
    } else {
      updateStatus("Not logged in");
    }

    return () => {
      if (unsubscribe) unsubscribe();
      stopStream();
      Orientation.lockToPortrait(); // restore portrait when leaving
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => setShowExit(!showExit)}>
        <View style={{ flex: 1, width: "100%" }}>
          {stream ? (
            <RTCView
              streamURL={stream.toURL()}
              style={styles.video}
              objectFit="cover"
            />
          ) : (
            <Text style={styles.loading}>{status}</Text>
          )}

          {showExit && (
            <TouchableOpacity
              style={styles.exitButton}
              onPress={() => {
                stopStream();
                navigation.goBack();
              }}
            >
              <Text style={styles.exitText}>End Stream</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  loading: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  exitButton: {
    position: "absolute",
    top: 40,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,0,0,0.7)",
    borderRadius: 10,
  },
  exitText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

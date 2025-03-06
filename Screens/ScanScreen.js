import React from 'react';
import {
  ButtonText,
  Colors,
  HomeContainer,
  LogoutButton,
  ScanContainer,
  DetailsContainer,
  LedContainer,
  HomeText,
  StatusText,
  StatusLink,
} from '../components/styles';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { CommonActions } from '@react-navigation/native'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

const { brand, darklight, primary } = Colors;

const ScanScreen = ({ navigation }) => {
  const auth = getAuth();

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

///add 1
const [userData, setUserData] = useState(null);
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user details from Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data()); // Store user details in state
        }
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

///add 1
  return (
    <HomeContainer>
      <ScanContainer>
        <HomeText>Scanning in Progress</HomeText>
        <StatusLink onPress ={() => navigation.navigate ('Signup')}>
          <StatusText>View Status</StatusText>
        </StatusLink>
      </ScanContainer>
      <DetailsContainer/>
      <LedContainer/>
    </HomeContainer>
      

  );
};

export default ScanScreen;

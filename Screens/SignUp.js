import React, { useState } from 'react';
import {
  StyleContainer,
  InnerContainer,
  PageTitle,
  StyledFormArea,
  StyledInputLabel,
  StyledTextInput,
  LeftIcon,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
  SignupSpace,
  MessageBox,
} from '../components/styles';

import { Formik } from 'formik';
import { View, Text } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import KbAvoidWrapper from '../components/KbAvoidWrapper';
import { FIREBASE_AUTH, FIREBASE_DB } from '../Firebaseconfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import * as Yup from 'yup';
import { getFirestore, doc, setDoc } from 'firebase/firestore';


const { brand, darklight, primary } = Colors;

const handleSignup = async (values) => {
  try {
    setErrorMessage(""); // Clear previous errors
    // If username is unique, proceed with account creation
    const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, values.email, values.password);
    const user = userCredential.user;

    // Save user details (username, email) to Firestore
    await addDoc(usersRef, {
      uid: user.uid,
      username: values.fullName,
      email: values.email,
    });

    // Navigate to Home or Verification Page
    navigation.navigate("VerifyEmail");

  } catch (error) {
    console.error("Signup error:", error.message);
    setErrorMessage("Signup failed. Please try again.");
  }
};

const SignUp = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);

  
  const validationSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(3, 'Full name must be at least 3 characters')
      .required('Full name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  return (
    <KbAvoidWrapper>
      <StyleContainer>
        <InnerContainer>
          <PageTitle>Create an account</PageTitle>

          <Formik
            initialValues={{ fullName: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema} 
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              try {
                const userCredential = await createUserWithEmailAndPassword(
                  FIREBASE_AUTH,
                  values.email,
                  values.password
                );
                
                const user = userCredential.user;

                   // Save user data in Firestore
                   try {
                    await setDoc(doc(FIREBASE_DB, "users", user.uid), {
                      fullName: values.fullName,
                      email: values.email,
                    });
                    
                  } catch (dbError) {
                    console.error("Error saving user to Firestore:", dbError.message);
                    alert("Failed to save user data. Please try again.");
                  }
                  

            
                // Send email verification
                await sendEmailVerification(user);
                console.log("Verification email sent!");
            
                // Optionally, show a message to the user
                alert("A verification email has been sent. Please check your inbox and verify your email before logging in.");
            
                // Navigate to the login screen after signing up
                navigation.navigate('Login');
            
              } catch (error) {
                console.error("Signup error:", error.message);
                alert(error.message);
              }
              setSubmitting(false);
            }}
            
            
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <StyledFormArea>                
                <MyTextInput
                  label="Full Name"
                  icon="person"
                  placeholder="Emman Matalimbag"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
                />
                {errors.fullName && touched.fullName && <MessageBox>{errors.fullName}</MessageBox>}

                <MyTextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="emmanuel@gmail.com"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />
                {errors.email && touched.email && <MessageBox>{errors.email}</MessageBox>}

                <MyTextInput
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * * * *"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                {errors.password && touched.password && <MessageBox>{errors.password}</MessageBox>}

                <MyTextInput
                  label="Confirm Password"
                  icon="lock"
                  placeholder="* * * * * * * * *"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <MessageBox>{errors.confirmPassword}</MessageBox>
                )}

                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Sign Up</ButtonText>
                </StyledButton>

                <ExtraView>
                  <ExtraText>Already have an account? </ExtraText>
                  <TextLink onPress={() => navigation.navigate('Login')}>
                    <TextLinkContent>Login</TextLinkContent>
                  </TextLink>
                </ExtraView>
              </StyledFormArea>
            )}
          </Formik>
        </InnerContainer>
      </StyleContainer>
    </KbAvoidWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />

      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Octicons name={hidePassword ? 'eye-closed' : 'eye'} size={30} color={darklight} />
        </RightIcon>
      )}
      <SignupSpace />
    </View>
  );
};

export default SignUp;

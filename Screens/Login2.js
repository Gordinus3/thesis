import React, { useState, useEffect } from 'react';
import {
  StyleContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  StyledInputLabel,
  StyledTextInput,
  LeftIcon,
  RightIcon,
  StyledButton,
  ButtonText,
  Colors,
  MessageBox,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
  Spacer,
  SubPageTitle,
} from './../components/styles';

import LinearGradient from 'react-native-linear-gradient';
import { Image, StyleSheet, StatusBar, View, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import Octicons from 'react-native-vector-icons/Octicons';
import KbAvoidWrapper from '../components/KbAvoidWrapper';
import { FIREBASE_AUTH } from '../Firebaseconfig';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const { brand, darklight } = Colors;

const Login2 = ({ navigation }) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); // check if Firebase is still loading session
  const auth = FIREBASE_AUTH;

  // 🔹 Auto-redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace("Home2"); // skip login, go straight to Home2
      } else {
        setLoading(false); // show login form if no user
      }
    });
    return unsubscribe; // cleanup
  }, []);

  const handleLogin = async (values) => {
    try {
      setErrorMessage("");
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      if (user.email === "microvision2025@gmail.com") {
        setErrorMessage("Invalid user");
        return;
      }
      if (!user.emailVerified) {
        setErrorMessage("Please verify your email before logging in.");
      } else {
        navigation.replace("Home2"); // ✅ replace prevents going back to login
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMessage("Invalid username/email or password. Please try again.");
    }
  };

  if (loading) {
    // 🔹 Show loading spinner while checking persistence
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#69509A" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#69509A', '#00B2FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <KbAvoidWrapper>
        <StyleContainer showsHorizontalScrollIndicator={false}>
          <InnerContainer>
            <Image style={{ width: 300, height: 200 }} resizeMode="contain" source={require('./../images/Logo.png')} />
            <PageTitle>MicroVision</PageTitle>
            <SubTitle>Account Login</SubTitle>

            <Formik initialValues={{ email: '', password: '' }} onSubmit={handleLogin}>
              {({ handleChange, handleBlur, handleSubmit, values }) => (
                <StyledFormArea>
                  <MyTextInput
                    label="Email Address"
                    icon="mail"
                    placeholder="emmanuel@gmail.com"
                    placeholderTextColor={darklight}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
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

                  <ExtraView>
                    <TextLink onPress={() => navigation.navigate('ForgotPass')} >
                      <TextLinkContent>Forgot your password?</TextLinkContent>
                    </TextLink>
                  </ExtraView>

                  {errorMessage ? <MessageBox>{errorMessage}</MessageBox> : null}

                  <StyledButton onPress={handleSubmit}>
                    <ButtonText>Login</ButtonText>
                  </StyledButton>

                  <ExtraView>
                    <ExtraText>Don't have an account yet? </ExtraText>
                    <TextLink onPress={() => navigation.navigate('Signup')} >
                      <TextLinkContent>Sign Up</TextLinkContent>
                    </TextLink>
                  </ExtraView>
                </StyledFormArea>
              )}
            </Formik>
          </InnerContainer>
        </StyleContainer>
      </KbAvoidWrapper>
    </LinearGradient>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => (
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
  </View>
);

export default Login2;

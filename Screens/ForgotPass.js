import React from 'react';
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
  ExtraView,
  TextLink,
  TextLinkContent,
  MessageBox,
  Spacer,
} from '../components/styles';

import { Formik } from 'formik';
import { View } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import KbAvoidWrapper from '../components/KbAvoidWrapper';
import { FIREBASE_AUTH } from '../Firebaseconfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import * as Yup from 'yup';


const { brand, darklight } = Colors;

const ForgotPass = ({ navigation }) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  return (
    <KbAvoidWrapper>
      <StyleContainer>
        <InnerContainer>
          <PageTitle>Reset Your Password</PageTitle>
          <Spacer />
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              setSubmitting(true);
            
              try {
                await sendPasswordResetEmail(FIREBASE_AUTH, values.email);
                alert("If this email is registered, a password reset link has been sent.");
                navigation.navigate('Login');
              } catch (error) {
                console.error("Error sending password reset:", error.code, error.message);
            
                if (error.code === 'auth/user-not-found') {
                  setErrors({ email: 'No account found with this email.' });
                } else if (error.code === 'auth/invalid-email') {
                  setErrors({ email: 'Invalid email format.' });
                } else {
                  setErrors({ email: 'Something went wrong. Try again later.' });
                }
              }
            
              setSubmitting(false);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <StyledFormArea>
                <MyTextInput
                  label="Email Address"
                  icon="mail"
                  placeholder="Enter your email"
                  placeholderTextColor={darklight}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                />
                {errors.email && touched.email && <MessageBox>{errors.email}</MessageBox>}

                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Reset Password</ButtonText>
                </StyledButton>

                <ExtraView>
                  <TextLink onPress={() => navigation.navigate('Login')}>
                    <TextLinkContent>Back to Login</TextLinkContent>
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
    </View>
  );
};

export default ForgotPass;

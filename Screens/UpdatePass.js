import React, { useState } from "react";
import {
  StyleContainer,
  InnerContainer,
  SubTitle,
  StyledFormArea,
  StyledInputLabel,
  StyledTextInput,
  LeftIcon,
  StyledButton,
  ButtonText,
  Colors,
  MessageBox,
  Spacer,
  ExtraView,
} from "./../components/styles";

import { StyleSheet, View, StatusBar } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Formik } from "formik";
import * as Yup from "yup";
import Octicons from "react-native-vector-icons/Octicons";
import KbAvoidWrapper from "../components/KbAvoidWrapper";
import { getAuth, updatePassword } from "firebase/auth";
import { Text } from "react-native-gesture-handler";

const { brand, darklight } = Colors;

const UpdatePass = ({ navigation }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  // Validation Schema
  const passwordValidationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleChangePassword = async (values, { setSubmitting, resetForm }) => {
    setErrorMessage(""); // Clear previous errors
    if (user) {
      try {
        await updatePassword(user, values.newPassword);
        resetForm(); // Clear form after success
        navigation.navigate("Home");
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage("No user is logged in.");
    }
    setSubmitting(false);
  };

  return (
    <LinearGradient
          colors={['#69509A', '#00B2FF']} // top → bottom
          start={{ x: 0, y: 0 }}          // gradient start point
          end={{ x: 1, y: 1 }}            // gradient end point
          style={{flex: 1}}>
          <StatusBar translucent backgroundColor="transparent" barStyle= "light-content"/>
        <KbAvoidWrapper>

          <StyleContainer showsHorizontalScrollIndicator={false}>

            <InnerContainer>

              <Spacer />

              <SubTitle>Update Password</SubTitle>

              <Formik
                initialValues={{ newPassword: "", confirmPassword: "" }}
                validationSchema={passwordValidationSchema}
                onSubmit={handleChangePassword}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  isSubmitting,
                }) => (
                  <StyledFormArea>
                    <MyTextInput
                      label="New Password"
                      icon="lock"
                      placeholderTextColor={darklight}
                      onChangeText={handleChange("newPassword")}
                      onBlur={handleBlur("newPassword")}
                      value={values.newPassword}
                      secureTextEntry={true}

                    />
                    {touched.newPassword && errors.newPassword && (
                      <MessageBox>{errors.newPassword}</MessageBox>
                    )}

                    <MyTextInput
                      label="Confirm Password"
                      icon="lock"
                      placeholderTextColor={darklight}
                      onChangeText={handleChange("confirmPassword")}
                      onBlur={handleBlur("confirmPassword")}
                      value={values.confirmPassword}
                      secureTextEntry={true}

                    />
                    {touched.confirmPassword && errors.confirmPassword && (
                      <MessageBox>{errors.confirmPassword}</MessageBox>
                    )}

                    {errorMessage ? <MessageBox>{errorMessage}</MessageBox> : null}

                    <StyledButton onPress={handleSubmit} disabled={isSubmitting}>
                      <ButtonText>
                        {isSubmitting ? "Updating..." : "Update Password"}
                      </ButtonText>
                    </StyledButton>

                  </StyledFormArea>
                )}

              </Formik>
            </InnerContainer>

          </StyleContainer>
        </KbAvoidWrapper>
    </LinearGradient>
  );
};

const MyTextInput = ({ label, icon, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={brand} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} style={{ width: "250" }} />
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UpdatePass;

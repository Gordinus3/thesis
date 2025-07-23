import React,{useState} from 'react';
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
} from '../components/styles';

import { Image, ImageBackground,StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { View } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import KbAvoidWrapper from '../components/KbAvoidWrapper';
import { FIREBASE_AUTH } from '../Firebaseconfig';
import { signInWithEmailAndPassword } from 'firebase/auth';


const {brand,darklight,primary} = Colors;

const Login = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [errorMessage, setErrorMessage] = useState('')
    const auth = FIREBASE_AUTH;
   
    const handleLogin = async (values) => {
      try {
        setErrorMessage(''); // Clear any previous error messages
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const user = userCredential.user;
        if (!user.emailVerified) {
          setErrorMessage('Please verify your email before logging in.');
        } else {
          navigation.navigate('Home');
        }
      } catch (error) {
        console.error('Login error:', error.message);
        setErrorMessage('Invalid email or password. Please try again.');
      }
    };

  return (
    <ImageBackground source={require("./../images/bg.png")} style={styles.background}  resizeMode="cover">
    <KbAvoidWrapper>
      <StyleContainer>
        <InnerContainer>
          <Spacer></Spacer>
          <Image style = {{width:300,height:200}} resizeMode="contain" source = {require('./../images/Logo.png')}/>
          <PageTitle>MicroVision</PageTitle>
          <SubPageTitle></SubPageTitle>
          <SubTitle>Account Login</SubTitle>

          <Formik
            initialValues={{email: '', password: ''}}
            onSubmit={handleLogin}
          >
            {({handleChange,handleBlur,handleSubmit,values}) => (
              <StyledFormArea>
              <MyTextInput 
                  label="Email Address"
                  icon="mail"
                  placeholder="emmanuel@gmail.com"
                  placeholderTextColor= {darklight}
                  onChangeText= {handleChange('email')}
                  onBlur= {handleBlur('email')}
                  value= {values.email}
      
              />
                  <MyTextInput 
                  label="Password"
                  icon="lock"
                  placeholder="* * * * * * * * *"
                  placeholderTextColor= {darklight}
                  onChangeText= {handleChange('password')}
                  onBlur= {handleBlur('password')}
                  value= {values.password}
                  secureTextEntry={hidePassword}
                  isPassword={true}
                  hidePassword={hidePassword}
                  setHidePassword={setHidePassword}
              />
   
               {errorMessage ? <MessageBox>{errorMessage}</MessageBox> : null}


                <StyledButton onPress={handleSubmit}>
                  <ButtonText>Login</ButtonText>
                </StyledButton>

                {/* <Line>or</Line> */}

                {/* <StyledButton google={true} onPress={handleSubmit}>
                  <AntDesign name="google" color={primary} size={25}/>
                  <ButtonText google={true}>Continue with Google</ButtonText>
                </StyledButton> */}
                
                <ExtraView>
                  <ExtraText>Don't have an account yet? </ExtraText>
                  <TextLink onPress ={() => navigation.navigate ('Signup')} >
                    <TextLinkContent>Sign Up</TextLinkContent>
                  </TextLink>
                </ExtraView>


            </StyledFormArea>)}
          </Formik>
        </InnerContainer>
      </StyleContainer>
  </KbAvoidWrapper>  
  </ImageBackground>
  );
};

const MyTextInput = ({label,icon,isPassword,hidePassword,setHidePassword,...props}) =>{
    return(
      <View>
        <LeftIcon>
          <Octicons name ={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <StyledTextInput {...props} />  
        {isPassword && (
          <RightIcon onPress={() => setHidePassword(!hidePassword)}>
              <Octicons name={hidePassword ? 'eye-closed' : 'eye'}size={30} color={darklight}/>
          </RightIcon>
        )}
      </View>
    )
}
const styles = StyleSheet.create({
  background: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, 

  }});
export default Login;

import React,{useState} from 'react';
import {
  StyleContainer,
  InnerContainer,
  PageLogo,
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
  Line,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
  Spacer,
  SubPageTitle,
} from './../components/styles';
import { Image, ImageBackground,StyleSheet } from 'react-native';
import { Formik } from 'formik';
import { View } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import KbAvoidWrapper from '../components/KbAvoidWrapper';


const {brand,darklight,primary} = Colors;

const Login = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
  
  return (
    <ImageBackground source={require("./../images/bg.png")} style={styles.background}  resizeMode="cover">
    <KbAvoidWrapper>
      <StyleContainer>
        <InnerContainer>
          <Spacer></Spacer>
          <Image style = {{width:300,height:200}} resizeMode="contain" source = {require('./../images/AppLogo2.png')}/>
          <PageTitle>Plasdetect</PageTitle>
          <SubPageTitle></SubPageTitle>
          <SubTitle>Account Login</SubTitle>

          <Formik
            initialValues={{email: '', password: ''}}
            onSubmit={(values) =>{
                console.log(values);
            }}
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
              <MessageBox>...</MessageBox>

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
    ...StyleSheet.absoluteFillObject, // Creates a full-screen overlay

  }});
export default Login;

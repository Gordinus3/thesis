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
  SignupSpace,
} from '../components/styles';
import { Image } from 'react-native';
import { Formik } from 'formik';
import { View, TouchableOpacity } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import KbAvoidWrapper from '../components/KbAvoidWrapper';


const {brand,darklight,primary} = Colors;

const SignUp = ({navigation}) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);

  return (
    <KbAvoidWrapper>
    <StyleContainer>
      <InnerContainer>
        <PageTitle>Create an acount</PageTitle>
        <SubTitle></SubTitle>

        <Formik
          initialValues={{fullName: '',email: '', dateOfBirth: '', password: '', confirmPassword: ''}}
          onSubmit={(values) =>{
              console.log(values);
          }}
        >
          {({handleChange,handleBlur,handleSubmit,values}) => (
            <StyledFormArea>
            <MyTextInput 
                label="Full Name"
                icon="person"
                placeholder="Emman Matalimbag"
                placeholderTextColor= {darklight}
                onChangeText= {handleChange('fullName')}
                onBlur= {handleBlur('fullName')}
                value= {values.fullName}
            />
             <MyTextInput 
                label="Email Address"
                icon="mail"
                placeholder="emmanuel@gmail.com"
                placeholderTextColor= {darklight}
                onChangeText= {handleChange('email')}
                onBlur= {handleBlur('email')}
                value= {values.email}
                keyboardType="email-address"
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
                 <MyTextInput 
                label="Confirm Password"
                icon="lock"
                placeholder="* * * * * * * * *"
                placeholderTextColor= {darklight}
                onChangeText= {handleChange('confirmPassword')}
                onBlur= {handleBlur('confirmPassword')}
                value= {values.confirmPassword}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword}
            />
            <MessageBox>...</MessageBox>

              <StyledButton onPress={handleSubmit}>
                <ButtonText>Sign Up</ButtonText>
              </StyledButton>

              <ExtraView>
                <ExtraText>Already have an account?  </ExtraText>
                <TextLink onPress = {() => navigation.navigate('Login')}>
                  <TextLinkContent>Login</TextLinkContent>
                </TextLink>
              </ExtraView>


          </StyledFormArea>)}
        </Formik>
      </InnerContainer>
    </StyleContainer>
   </KbAvoidWrapper>
  );
};

const MyTextInput = ({label,icon,isPassword,hidePassword,setHidePassword,isDate,showDatePicker, ...props}) =>{
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
       <SignupSpace/>
      </View>
    )
}
export default SignUp;

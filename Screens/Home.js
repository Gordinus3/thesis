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
} from '../components/styles';
import { Image } from 'react-native';
import { Formik } from 'formik';
import { View, TouchableOpacity } from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';


const {brand,darklight,primary} = Colors;

const Home = ({navigation}) => {

  return (
    <StyleContainer>
          <LeftIcon>
        <EvilIcons name ="user" size={60} color={brand} />
        </LeftIcon>
        <Spacer></Spacer>
      <InnerContainer>
 
       

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
            />
                        <MyTextInput 
                label="Email Address"
                icon="mail"

            />


                <MyTextInput 
                label="Password"
                icon="lock"

            />
                 <MyTextInput 
                label="Confirm Password"
                icon="lock"

            />
            <MessageBox>...</MessageBox>



          </StyledFormArea>)}
        </Formik>
      </InnerContainer>
    </StyleContainer>
  );
};

const MyTextInput = ({label,icon, ...props}) =>{
    return(
      <View>
        <LeftIcon>
          <Octicons name ={icon} size={30} color={brand} />
        </LeftIcon>
        
        <StyledTextInput {...props} /> 
      </View>
    )
}
export default Home;

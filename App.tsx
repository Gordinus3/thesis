import React from 'react';
import Login from './Screens/Login';
import { StyleSheet, Text, View } from 'react-native';
import SignUp from './Screens/SignUp';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import Home from './Screens/Home';
import ForgotPass from './Screens/ForgotPass';
import ScanScreen from './Screens/ScanScreen';
import Profile from './Screens/UpdatePass'
import ProfileScreen from './Screens/UpdatePass';
import UpdatePass from './Screens/UpdatePass';
import ResultScreen from './Screens/ResultScreen';

const Stack = createStackNavigator(); 

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={SignUp} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="ScanScreen" component={ScanScreen}/>
        <Stack.Screen name="UpdatePass" component={UpdatePass}/>
        <Stack.Screen name="ResultScreen" component={ResultScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



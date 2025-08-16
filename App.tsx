import React from 'react';
import SplashScreen from './Screens/SplashScreen';
import Login from './Screens/Login';
import Login2 from './Screens/Login2';
import { StyleSheet, Text, View } from 'react-native';
import SignUp from './Screens/SignUp';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; 
import Home from './Screens/Home';
import Home2 from './Screens/Home2';
import ForgotPass from './Screens/ForgotPass';
import ScanScreen from './Screens/ScanScreen';
import Profile from './Screens/UpdatePass'
import ProfileScreen from './Screens/UpdatePass';
import UpdatePass from './Screens/UpdatePass';
import ResultScreen2 from './Screens/ResultScreen2';
import { background } from './components/styles';

const Stack = createStackNavigator(); 

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{headerShown:false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Login2" component={Login2} />
        <Stack.Screen name="Home2" component={Home2} />
        <Stack.Screen name ="ResultScreen2" component={ResultScreen2}/>
        <Stack.Screen name="Signup" component={SignUp} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="ScanScreen" component={ScanScreen}/>
        <Stack.Screen name="UpdatePass" component={UpdatePass}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8eef1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



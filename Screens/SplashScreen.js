import React, { useEffect } from 'react';
import { View, Image, StatusBar, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Simulate loading before going to main screen
    changeNavigationBarColor('transparent', true, true);
    const timer = setTimeout(() => {
      navigation.replace('Login2'); // change to your main screen
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#69509A', '#00B2FF']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <Image
        source={require('./../images/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
});

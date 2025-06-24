import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/Home/HomeScreen';
import LuncherScreen from '../screen/splash/LuncherScreen';
import SplashScreen from '../screen/splash/SplashScreen';
import LoginScreen from '../screen/auth/LoginScreen';

const Stack = createNativeStackNavigator();

export default function routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lunch">
        <Stack.Screen name="Lunch" component={LuncherScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

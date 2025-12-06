import { Platform } from "react-native";
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Notifications from "expo-notifications";

const Stack = createStackNavigator()

import Payrex from './screens/Payrex';
import Splash from './screens/Splash';
import Dashboard from './screens/Dashboard';
import DeliveryScreen from './screens/DeliveryScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentSuccess from './screens/PaymentSuccess';
import SignIn from './screens/SignIn';
import Camera from './screens/Camera';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner:true,
      shouldShowList:true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

export default function App() {
  async function registerLocalPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission for notifications not granted!");
    }
  }

  useEffect(() => {
    // Ask permission
    registerLocalPermissions();

    // Android: ensure proper channel (required for local notifications)
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SignIn' screenOptions={{headerShown:false,gestureEnabled:true}}>
        <Stack.Screen name='SignIn' component={SignIn}/>
        <Stack.Screen name='Splash' component={Splash}/>
        <Stack.Screen name='Dashboard' component={Dashboard}/>
        <Stack.Screen name='Payrex' component={Payrex}/>
        <Stack.Screen name='OrderScreen' component={OrderScreen}/>
        <Stack.Screen name='PaymentSuccess' component={PaymentSuccess}/>
        <Stack.Screen name='DeliveryScreen' component={DeliveryScreen}/>
        <Stack.Screen name='Camera' component={Camera}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

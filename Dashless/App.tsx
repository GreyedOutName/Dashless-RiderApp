import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator()

import Payrex from './screens/Payrex';
import Splash from './screens/Splash';
import Dashboard from './screens/Dashboard';
import DeliveryScreen from './screens/DeliveryScreen';
import OrderScreen from './screens/OrderScreen';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Splash' screenOptions={{headerShown:false}}>
        <Stack.Screen name='Splash' component={Splash}/>
        <Stack.Screen name='Dashboard' component={Dashboard}/>
        <Stack.Screen name='Payrex' initialParams={{amount:10000}} component={Payrex}/>
        <Stack.Screen name='OrderScreen' component={OrderScreen}/>
        <Stack.Screen name='DeliveryScreen' component={DeliveryScreen}/>
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

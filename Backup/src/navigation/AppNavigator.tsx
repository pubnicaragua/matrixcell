import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screens/LoginScreen';
import DevicesListScreen from '../screens/DevicesListScreen';
import DeviceDetailScreen from '../screens/DeviceDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Pantalla de inicio de sesión */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        {/* Lista de dispositivos */}
        <Stack.Screen
          name="DevicesList"
          component={DevicesListScreen}
          options={{ title: 'Lista de Dispositivos' }}
        />
        {/* Detalle del dispositivo */}
        <Stack.Screen
          name="DeviceDetail"
          component={DeviceDetailScreen}
          options={{ title: 'Detalle del Dispositivo' }}
        />
        {/* Configuraciones */}
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Configuraciones' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

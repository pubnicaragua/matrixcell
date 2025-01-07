import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // IMPORTAR AQUÍ
import LoginScreen from '../screens/LoginScreen';
import DevicesListScreen from '../screens/DevicesListScreen';
import DeviceDetailScreen from '../screens/DeviceDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return null; // Evita errores si el contexto no está inicializado
  }

  const { isAuthenticated } = authContext;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'DevicesList' : 'Login'}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="DevicesList" component={DevicesListScreen} />
            <Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

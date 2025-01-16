import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BlockAppScreen from '../screens/BlockAppScreen';
import UnlockRequestScreen from '../screens/UnlockRequestScreen';
import DeviceContext from '../context/DeviceContext';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const deviceContext = useContext(DeviceContext);

  if (!deviceContext) {
    console.error('DeviceContext no está disponible.');
    return null;
  }

  const { isBlocked } = deviceContext;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UnlockRequestScreen">
        <Stack.Screen
          name="UnlockRequestScreen"
          component={UnlockRequestScreen}
          options={{ title: 'Solicitud de Desbloqueo' }}
        />
        <Stack.Screen
          name="BlockAppScreen"
          component={BlockAppScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

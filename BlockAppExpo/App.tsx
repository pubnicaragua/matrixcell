import React from "react";
import { StatusBar, Alert, Platform } from 'react-native';
import AppNavigator from "./src/navigation/AppNavigator";
import { DeviceProvider } from "./src/context/DeviceContext";
import { PermissionsAndroid } from 'react-native';
const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.INTERNET, // Ejemplo de permisos válidos
        PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE,
      ]);

      if (
        granted[PermissionsAndroid.PERMISSIONS.INTERNET] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_NETWORK_STATE] === PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert('Permisos concedidos', 'Todos los permisos necesarios fueron otorgados.');
      } else {
        Alert.alert('Permiso denegado', 'No se concedieron todos los permisos necesarios.');
      }
    } catch (err) {
      console.error('Error al solicitar permisos:', err);
    }
  }
};


// Solicitar permisos al iniciar la aplicación
if (Platform.OS === 'android') {
  requestPermissions();
}

export default function App() {
  return (
    <DeviceProvider>
      <StatusBar barStyle="dark-content" />
      <AppNavigator />
    </DeviceProvider>
  );
}
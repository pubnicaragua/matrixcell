import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BlockAppScreen from "../screens/BlockAppScreen";
import DeviceDetailScreen from "../screens/DeviceDetailScreen";
import UnlockRequestScreen from "../screens/UnlockRequestScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="UnlockRequest">
      <Stack.Screen
        name="UnlockRequest"
        component={UnlockRequestScreen}
        options={{ title: 'Solicitud de Desbloqueo' }}
      />
      <Stack.Screen
        name="BlockApp"
        component={BlockAppScreen}
        options={{ title: 'Pantalla de Bloqueo' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

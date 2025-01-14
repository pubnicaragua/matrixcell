import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BlockAppScreen from "../screens/BlockAppScreen";
import UnlockRequestScreen from "../screens/UnlockRequestScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="UnlockRequest">
      <Stack.Screen
        name="UnlockRequest"
        component={UnlockRequestScreen}
        options={{ title: "Solicitud de Desbloqueo" }}
      />
      <Stack.Screen
        name="BlockAppScreen" // Asegúrate de que coincide con el navigate
        component={BlockAppScreen}
        options={{ title: "Pantalla de Bloqueo" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
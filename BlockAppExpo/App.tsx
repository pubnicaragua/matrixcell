import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import 'react-native-gesture-handler';


export default function App() {
  return (
    <View style={styles.container}>
      <Text>¡Hola, Expo está funcionando correctamente!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

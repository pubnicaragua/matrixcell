import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const DevicesListScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Dispositivos</Text>
      <Button title="Ver Detalle de Dispositivo" onPress={() => navigation.navigate('DeviceDetail')} />
      <Button title="Configuraciones" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
});

export default DevicesListScreen;

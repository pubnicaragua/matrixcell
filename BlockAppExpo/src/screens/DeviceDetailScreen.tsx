import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const DeviceDetailScreen = ({ route }: any) => {
  const { device } = route.params;

  const handleUnlockDevice = async () => {
    try {
      const response = await axios.patch(`https://matrixcell.onrender.com/devices/${device.id}/unlock`);

      if (response.data.success) {
        Alert.alert('Desbloqueado', 'El dispositivo ha sido desbloqueado correctamente.');
      } else {
        Alert.alert('Error', 'No se pudo desbloquear el dispositivo.');
      }
    } catch (error) {
      console.error('Error al desbloquear el dispositivo:', error);
      Alert.alert('Error', 'Ocurrió un problema al desbloquear el dispositivo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{device.name}</Text>
      <Text style={styles.status}>Estado: {device.status}</Text>
      <Button title="Desbloquear Dispositivo" onPress={handleUnlockDevice} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  status: { fontSize: 18, color: '#777', marginBottom: 20 },
});

export default DeviceDetailScreen;

import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const DeviceDetailScreen = ({ route }: any) => {
  const { device } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{device.name}</Text>
      <Text style={styles.status}>Estado: {device.status}</Text>
      <Button
        title="Desbloquear Dispositivo"
        onPress={() => Alert.alert('Desbloqueado', 'El dispositivo ha sido desbloqueado correctamente.')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  status: { fontSize: 18, color: '#777', marginBottom: 20 },
});

export default DeviceDetailScreen;

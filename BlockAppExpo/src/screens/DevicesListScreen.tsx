import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const devices = [
  { id: '1', name: 'Dispositivo 1', status: 'Bloqueado' },
  { id: '2', name: 'Dispositivo 2', status: 'Desbloqueado' },
  { id: '3', name: 'Dispositivo 3', status: 'En mora' },
];

const DevicesListScreen = ({ navigation }: any) => {
  const renderDevice = ({ item }: any) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => navigation.navigate('DeviceDetail', { device: item })}
    >
      <Text style={styles.deviceName}>{item.name}</Text>
      <Text style={styles.deviceStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  deviceItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  deviceName: { fontSize: 18, fontWeight: 'bold' },
  deviceStatus: { fontSize: 14, color: '#777' },
});

export default DevicesListScreen;

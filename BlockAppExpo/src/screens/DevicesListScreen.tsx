import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const DevicesListScreen = ({ navigation }: any) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <View style= { styles.container } >
      <Text style={ styles.errorText }> Error: El contexto de autenticación no está disponible.</Text>
        </View>
    );
  }

const { token } = authContext;

useEffect(() => {
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://matrixcell.onrender.com/devices', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setDevices(response.data);
      } else {
        Alert.alert('Error', 'No se pudieron obtener los dispositivos.');
      }
    } catch (error) {
      console.error('Error al obtener dispositivos:', error);
      Alert.alert('Error', 'Ocurrió un problema al obtener los dispositivos.');
    } finally {
      setLoading(false);
    }
  };

  fetchDevices();
}, [token]);

const renderDevice = ({ item }: any) => (
  <TouchableOpacity
      style= { styles.deviceItem }
onPress = {() => navigation.navigate('DeviceDetail', { device: item })}
    >
  <Text style={ styles.deviceName }> { item.imei } </Text>
    <Text Text style = { styles.deviceStatus } > { item.status } </Text>
      </TouchableOpacity>
  );

if (loading) {
  return (
    <View style= { styles.loadingContainer } >
    <ActivityIndicator size="large" color = "#0000ff" />
      <Text>Cargando dispositivos...</Text>
        </View>
    );
}

return (
  <View style= { styles.container } >
  {
    devices.length > 0 ? (
      <FlatList
          data= { devices }
          renderItem={ renderDevice }
          keyExtractor={(item) => item.id.toString()
  }
  />
      ) : (
  <Text style= { styles.noDevicesText } > No hay dispositivos disponibles.</Text>
      )}
</View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f4f4f4' },
  deviceItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  deviceName: { fontSize: 18, fontWeight: 'bold' },
  deviceStatus: { fontSize: 14, color: '#777' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 },
  noDevicesText: { fontSize: 16, color: '#555', textAlign: 'center', marginTop: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default DevicesListScreen;

import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuraciones</Text>
      <Button
        title="Cerrar Sesión"
        onPress={() => Alert.alert('Sesión cerrada', 'Has salido de tu cuenta correctamente.')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default SettingsScreen;

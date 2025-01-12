import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { error } from 'console';

const BlockAppScreen = () => {
  const [unlockCode, setUnlockCode] = useState('');
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeout, setBlockTimeout] = useState(0);

  const handleUnlock = async () => {
    const correctCode = 'ABC123'; // Este código se debe obtener de un servicio backend o similar
    const response = await axios.post('https://matrixcell.onrender.com/devices/unlock-validate', {
      code: correctCode
        });
    if (response.status === 200) {
      await AsyncStorage.setItem('isUnlocked', 'true');
      Alert.alert('Desbloqueado', 'El dispositivo ha sido desbloqueado hasta la próxima fecha de corte.');
    } else {
      setError('Código incorrecto. Inténtelo de nuevo en 2 minutos.');
      setIsBlocked(true);
      setBlockTimeout(Date.now() + 120000); // Bloquea por 2 minutos
    }
  };

  useEffect(() => {
    const checkBlockTimeout = () => {
      if (blockTimeout > Date.now()) {
        const remainingTime = blockTimeout - Date.now();
        setTimeout(() => setIsBlocked(false), remainingTime);
      } else {
        setIsBlocked(false);
      }
    };

    checkBlockTimeout();
  }, [blockTimeout]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispositivo Bloqueado</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el código de desbloqueo"
        value={unlockCode}
        onChangeText={setUnlockCode}
        editable={!isBlocked}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title="Desbloquear"
        onPress={handleUnlock}
        disabled={isBlocked}
      />
      {isBlocked && <Text style={styles.blockMessage}>Espere 2 minutos antes de intentar nuevamente.</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    width: '80%',
    padding: 8,
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  blockMessage: {
    color: 'orange',
    marginTop: 16,
  },
});

export default BlockAppScreen;

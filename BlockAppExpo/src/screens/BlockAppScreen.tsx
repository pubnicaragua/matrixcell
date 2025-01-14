import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BlockAppScreen = () => {
  const [unlockCode, setUnlockCode] = useState('');
  const [error, setError] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeout, setBlockTimeout] = useState(0);

  const handleUnlock = async () => {
    if (!unlockCode) {
      setError('Por favor, ingrese el código de desbloqueo.');
      return;
    }

    try {
      const response = await axios.post('https://matrixcell.onrender.com/devices/unlock-validate', {
        code: unlockCode,
      });

      if (response.status === 200) {
        console.log('Desbloqueado');
        
        await AsyncStorage.setItem('isUnlocked', 'true');
        Alert.alert('Desbloqueado', 'El dispositivo ha sido desbloqueado hasta la próxima fecha de corte.');
      } else {
        setError('Código incorrecto. Inténtelo de nuevo en 2 minutos.');
        setIsBlocked(true);
        setBlockTimeout(Date.now() + 120000);
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor. Verifique su conexión.');
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
        placeholderTextColor="#ccc"
        value={unlockCode}
        onChangeText={setUnlockCode}
        editable={!isBlocked}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity
        style={[styles.button, isBlocked && styles.buttonDisabled]}
        onPress={handleUnlock}
        disabled={isBlocked}
      >
        <Text style={styles.buttonText}>Desbloquear</Text>
      </TouchableOpacity>
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
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    width: '80%',
    padding: 10,
    marginBottom: 16,
    color: '#fff',
    backgroundColor: '#333',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  blockMessage: {
    color: 'orange',
    marginTop: 16,
  },
});

export default BlockAppScreen;
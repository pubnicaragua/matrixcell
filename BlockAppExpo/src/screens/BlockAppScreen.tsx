import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  Platform,
  AppState,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import DeviceContext from '../context/DeviceContext';

type Props = {
  navigation: any;
};

const BlockAppScreen: React.FC<Props> = ({ navigation }) => {
  const [unlockCode, setUnlockCode] = useState('');
  const [emergencyCode, setEmergencyCode] = useState('');
  const [error, setError] = useState('');
  const deviceContext = useContext(DeviceContext);

  if (!deviceContext) {
    console.error('DeviceContext no está disponible.');
    return null;
  }

  const { imei, blockDevice, unblockDevice } = deviceContext;

  // Monitorear el estado de la aplicación para evitar minimizar
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState !== 'active') {
        Alert.alert('Atención', 'No puedes minimizar la aplicación.');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, []);

  // Bloquear el botón "Atrás"
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Atención', 'No puedes salir de la aplicación.');
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [])
  );

  const handleUnlock = async () => {
    if (!unlockCode) {
      setError('Por favor, ingrese el código de desbloqueo.');
      return;
    }

    try {
      const response = await axios.post('https://matrixcell.onrender.com/devices/unlock-validate', {
        code: unlockCode,
        imei,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem('isUnlocked', 'true');
        unblockDevice(unlockCode);
        Alert.alert('Éxito', 'El dispositivo ha sido desbloqueado.');
        navigation.navigate('UnlockRequest');
      } else {
        setError('Código incorrecto. Inténtelo de nuevo.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor. Inténtelo nuevamente o use el código de emergencia.');
    }
  };

  const handleEmergencyCode = async () => {
    if (emergencyCode === 'Matrixcell2025') {
      await AsyncStorage.setItem('isUnlocked', 'true');
      unblockDevice(emergencyCode);
      Alert.alert('Emergencia', 'Desbloqueo de emergencia activado.');
      navigation.navigate('UnlockRequest');
    } else {
      setError('Código de emergencia incorrecto.');
    }
  };

  const handleCallSupport = () => {
    const phone = '+593987808614';
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Error', 'No se pudo realizar la llamada.')
    );
  };

  const handleWhatsAppSupport = () => {
    const phone = '+593987808614';
    const message = 'Hola, necesito soporte con mi dispositivo.';
    const url = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se pudo abrir WhatsApp.')
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dispositivo Bloqueado</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingrese el código de desbloqueo"
        placeholderTextColor="#ccc"
        value={unlockCode}
        onChangeText={setUnlockCode}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingrese el código de emergencia"
        placeholderTextColor="#ccc"
        value={emergencyCode}
        onChangeText={setEmergencyCode}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleUnlock}>
        <Text style={styles.buttonText}>Desbloquear</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCode}>
        <Text style={styles.buttonText}>Código de Emergencia</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.supportButton} onPress={handleCallSupport}>
        <Text style={styles.buttonText}>Llamar al Soporte</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.supportButton} onPress={handleWhatsAppSupport}>
        <Text style={styles.buttonText}>WhatsApp al Soporte</Text>
      </TouchableOpacity>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceText}>IMEI: {imei}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  title: { fontSize: 24, color: '#fff', marginBottom: 16 },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#333',
    color: '#fff',
    padding: 10,
    marginBottom: 16,
  },
  button: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, marginBottom: 10 },
  emergencyButton: { backgroundColor: '#dc3545', padding: 10, borderRadius: 5, marginBottom: 10 },
  supportButton: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginBottom: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  error: { color: 'red', textAlign: 'center', marginBottom: 8 },
  deviceInfo: { marginTop: 20 },
  deviceText: { color: '#fff', fontSize: 16 },
});

export default BlockAppScreen;

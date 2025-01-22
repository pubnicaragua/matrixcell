import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  BackHandler,
  AppState,
} from 'react-native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import DeviceContext from '../context/DeviceContext';

type RootStackParamList = {
  UnlockRequest: undefined;
  BlockAppScreen: undefined;
};

type UnlockRequestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'UnlockRequest'
>;

type Props = {
  navigation: UnlockRequestScreenNavigationProp;
};

const UnlockRequestScreen: React.FC<Props> = ({ navigation }) => {
  const [codigoId, setCodigoId] = useState('');
  const [voucherPago, setVoucherPago] = useState('');
  const [emergencyCode, setEmergencyCode] = useState('');
  const [error, setError] = useState('');
  const [isEmergencyEnabled, setIsEmergencyEnabled] = useState(false);
  const deviceContext = useContext(DeviceContext);

  if (!deviceContext) {
    console.error('DeviceContext no está disponible.');
    return null;
  }

  const { imei, ip } = deviceContext;

  // Monitorear el estado de la aplicación
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState !== 'active') {
        Alert.alert('Atención', 'No puedes minimizar la aplicación.');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => subscription.remove();
  }, []);

  // Bloquear el botón de "Atrás"
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

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background') {
        Alert.alert('Bloqueo', 'No puedes salir de la aplicación.');
      }
    };
  
    AppState.addEventListener('change', handleAppStateChange);
  
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleSubmit = async () => {
    if (!codigoId || !voucherPago) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await axios.post('https://matrixcell.onrender.com/devices/unlock-request', {
        CODIGO_ID_SUJETO: codigoId,
        VOUCHER_PAGO: voucherPago,
        imei,
        ip,
      });

      if (response.status === 200) {
        Alert.alert('Solicitud enviada', 'Su solicitud ha sido enviada correctamente.');
        navigation.navigate('BlockAppScreen');
      } else {
        setError('Hubo un problema al enviar la solicitud. Inténtelo de nuevo.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor. Habilitando código de emergencia.');
      setIsEmergencyEnabled(true);
    }
  };

  const handleEmergencyCode = () => {
    if (emergencyCode === 'Matrixcell2025') {
      Alert.alert('Emergencia', 'Código de emergencia ingresado. Desbloqueo activado.');
      navigation.navigate('BlockAppScreen');
    } else {
      setError('Código de emergencia incorrecto.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitud de Desbloqueo</Text>
      <TextInput
        style={styles.input}
        placeholder="Código ID"
        placeholderTextColor="#ccc"
        value={codigoId}
        onChangeText={setCodigoId}
      />
      <TextInput
        style={styles.input}
        placeholder="Voucher de Pago"
        placeholderTextColor="#ccc"
        value={voucherPago}
        onChangeText={setVoucherPago}
      />
      {isEmergencyEnabled && (
        <TextInput
          style={styles.input}
          placeholder="Ingrese código de emergencia"
          placeholderTextColor="#ccc"
          value={emergencyCode}
          onChangeText={setEmergencyCode}
        />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Solicitud</Text>
      </TouchableOpacity>
      {isEmergencyEnabled && (
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCode}>
          <Text style={styles.buttonText}>Código de Emergencia</Text>
        </TouchableOpacity>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>IMEI: {imei}</Text>
        <Text style={styles.infoText}>IP: {ip}</Text>
      </View>
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
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
});

export default UnlockRequestScreen;

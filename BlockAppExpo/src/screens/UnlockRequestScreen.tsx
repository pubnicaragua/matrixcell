import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!codigoId || !voucherPago) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await axios.post(
        'https://matrixcell.onrender.com/devices/unlock-request',
        {
          CODIGO_ID_SUJETO: codigoId,
          VOUCHER_PAGO: voucherPago,
        }
      );

      if (response.status === 200) {
        Alert.alert(
          'Solicitud enviada',
          'La solicitud ha sido enviada correctamente. Su desbloqueo será procesado.'
        );
        navigation.navigate('BlockAppScreen');
      } else {
        setError('Hubo un problema al enviar la solicitud. Inténtelo de nuevo.');
      }
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el servidor. Verifique su conexión.');
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
      {error && <Text style={styles.error}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar Solicitud</Text>
      </TouchableOpacity>
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UnlockRequestScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const UnlockRequestScreen = ({ navigation }: { navigation: any }) => {
  const [codigoId, setCodigoId] = useState('');
  const [voucherPago, setVoucherPago] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!codigoId || !voucherPago) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const response = await axios.post('https://matrix-cell.com/devices/unlock-request', {
        CODIGO_ID_SUJETO: codigoId,
        VOUCHER_PAGO: voucherPago,
      });

      if (response.status === 200) {
        Alert.alert(
          'Solicitud enviada',
          `La solicitud ha sido enviada correctamente. Su desbloqueo será procesado.`
        );
        navigation.navigate('BlockAppScreen'); // Navega a la pantalla de bloqueo
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
        placeholder="Ingrese su Cédula o Código ID Sujeto"
        value={codigoId}
        onChangeText={setCodigoId}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingrese el número del Voucher de Pago"
        value={voucherPago}
        onChangeText={setVoucherPago}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button title="Enviar Solicitud" onPress={handleSubmit} />
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
});

export default UnlockRequestScreen;

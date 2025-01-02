import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  // Llama todos los hooks al inicio del componente
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Si el contexto no está disponible, maneja esto más abajo
  if (!authContext) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: El contexto de autenticación no está disponible.</Text>
      </View>
    );
  }

  const { login } = authContext;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigation.replace('DevicesList');
    } else {
      Alert.alert('Error', 'Credenciales incorrectas.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Ingresar" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f4f4f4' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 20 },
});

export default LoginScreen;

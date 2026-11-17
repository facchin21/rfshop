import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSession } from '@/context/Session';

export default function LoginComponent() {
  const session = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError('');
    if (!email.includes('@') || password.length < 6) {
      setError('Ingresá un correo y una contraseña de al menos 6 caracteres.');
      return;
    }
    setBusy(true);
    try {
      const account = await session.login(email, password);
      router.replace(account.role?.name === 'BARBER' ? '/index_app' : '/explore');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos iniciar sesión.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Text style={styles.title}>Iniciar sesión</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          style={styles.input}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="ana@barber.test"
          placeholderTextColor="#999"
          accessibilityLabel="Correo"
        />
        <AntDesign name="closecircleo" size={20} color="#999" onPress={() => setEmail('')} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={password}
          style={styles.input}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Contraseña"
          placeholderTextColor="#999"
          accessibilityLabel="Contraseña"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={() => void submit()} disabled={busy} accessibilityRole="button">
        {busy ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Ingresar</Text>}
      </TouchableOpacity>
      <Text style={styles.hint}>Cliente: ana@barber.test / usuario123</Text>
      <Text style={styles.hint}>Barbero: martin@barber.test / barber123</Text>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'black',
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 15,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#8A2B2B',
    marginBottom: 12,
  },
  hint: {
    color: '#666',
    fontSize: 13,
    marginBottom: 4,
  },
});

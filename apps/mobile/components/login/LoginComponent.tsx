import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
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
    <View>
      <Text style={styles.title}>Iniciar sesión</Text>
      <Text style={styles.lead}>Entrá para reservar o para publicar tu agenda.</Text>
      <TextField label="Correo" value={email} onChangeText={setEmail} placeholder="ana@barber.test" keyboardType="email-address" />
      <TextField label="Contraseña" value={password} onChangeText={setPassword} placeholder="Contraseña" secure />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button label="Ingresar" onPress={() => void submit()} busy={busy} />
      <Text style={styles.hint}>Cliente: ana@barber.test / usuario123</Text>
      <Text style={styles.hint}>Barbero: martin@barber.test / barber123</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', marginBottom: 6 },
  lead: { color: '#444', marginBottom: 20, lineHeight: 20 },
  error: { color: '#8A2B2B', marginBottom: 12 },
  hint: { color: '#666', fontSize: 13, marginTop: 8 },
});

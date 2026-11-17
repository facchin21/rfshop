import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { router, useGlobalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { fetchRoles, registerAccount } from '@/lib/api';
import { useSession } from '@/context/Session';

export default function Register() {
  const { role } = useGlobalSearchParams();
  const session = useSession();
  const wanted = String(role ?? 'user').toLowerCase() === 'barber' ? 'BARBER' : 'USER';
  const [rolId, setRolId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetchRoles()
      .then((roles) => {
        const match = roles.find((item) => item.name === wanted);
        if (active) {
          setRolId(match?.id ?? null);
          if (!match) {
            setError('No encontramos ese tipo de cuenta.');
          }
        }
      })
      .catch((caught: unknown) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : 'No pudimos cargar los roles.');
        }
      });
    return () => {
      active = false;
    };
  }, [wanted]);

  const submit = async () => {
    setError('');
    if (!rolId) {
      setError('Todavía no está listo el tipo de cuenta.');
      return;
    }
    if (name.trim().length < 3 || !lastName.trim() || !email.includes('@')) {
      setError('Completá nombre, apellido y un correo válido.');
      return;
    }
    if (password.length < 6 || password !== secondPassword) {
      setError('La contraseña tiene que tener 6 caracteres y coincidir.');
      return;
    }
    setBusy(true);
    try {
      await registerAccount({ email: email.trim(), name: name.trim(), lastName: lastName.trim(), password, rolId });
      const account = await session.login(email.trim(), password);
      router.replace(account.role?.name === 'BARBER' ? '/index_app' : '/explore');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos crear la cuenta.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button" accessibilityLabel="Volver">
          <AntDesign name="arrowleft" size={20} color="black" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Creá tu cuenta</Text>
        <Text style={styles.lead}>{wanted === 'BARBER' ? 'Vas a publicar tu local y los horarios.' : 'Vas a reservar turnos en las barberías.'}</Text>
        <TextField label="Correo" value={email} onChangeText={setEmail} placeholder="ana@correo.com" keyboardType="email-address" />
        <TextField label="Nombre" value={name} onChangeText={setName} placeholder="Ana" autoCapitalize="words" />
        <TextField label="Apellido" value={lastName} onChangeText={setLastName} placeholder="Pérez" autoCapitalize="words" />
        <TextField label="Contraseña" value={password} onChangeText={setPassword} secure />
        <TextField label="Confirmar contraseña" value={secondPassword} onChangeText={setSecondPassword} secure />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button label="Crear cuenta" onPress={() => void submit()} busy={busy} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  top: { paddingHorizontal: 16, paddingVertical: 8 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 24, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '700' },
  lead: { color: '#444', marginTop: 6, marginBottom: 20, lineHeight: 20 },
  error: { color: '#8A2B2B', marginBottom: 12 },
});

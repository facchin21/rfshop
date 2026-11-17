import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ContainerTitle from '@/components/welcome/ContainerTitle';
import { useGlobalSearchParams, router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { Modal } from '@/components/Modal';
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
    <ScrollView style={styles.container}>
      <ContainerTitle />
      <Text style={styles.role}>Cuenta de tipo: {wanted === 'BARBER' ? 'barbero' : 'cliente'}</Text>
      <Modal>
        <Text style={styles.title}>Crea tu cuenta</Text>
        <Field label="Correo" value={email} onChangeText={setEmail} placeholder="ana@correo.com" />
        <Field label="Nombre" value={name} onChangeText={setName} placeholder="Ana" />
        <Field label="Apellido" value={lastName} onChangeText={setLastName} placeholder="Pérez" />
        <Field label="Contraseña" value={password} onChangeText={setPassword} placeholder="******" secure />
        <Field label="Confirmar contraseña" value={secondPassword} onChangeText={setSecondPassword} placeholder="******" secure />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={() => void submit()} disabled={busy} accessibilityRole="button">
          {busy ? <ActivityIndicator color="white" /> : <Text style={styles.textButton}>Crear cuenta</Text>}
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  secure,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secure?: boolean;
}) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          style={styles.input}
          secureTextEntry={secure}
          autoCapitalize="none"
          accessibilityLabel={label}
        />
        <AntDesign name="closecircleo" size={20} color="gray" onPress={() => onChangeText('')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 35,
  },
  role: {
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    marginTop: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
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
    width: '100%',
    paddingVertical: 12,
    marginBottom: 12,
    marginTop: 5,
    borderRadius: 12,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  textButton: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
  error: {
    color: '#8A2B2B',
    marginBottom: 12,
  },
});

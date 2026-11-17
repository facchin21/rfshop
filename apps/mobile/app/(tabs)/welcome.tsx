import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/Button';
import { useSession } from '@/context/Session';

export default function Welcome() {
  const session = useSession();
  const user = session.user;
  const initials = user ? `${user.name[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase() : '';
  const role = user?.role?.name === 'BARBER' ? 'Barbero' : 'Cliente';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {user ? (
        <View style={styles.account}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>
            {user.name} {user.lastName}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.role}>{role}</Text>
          <View style={styles.menu}>
            <MenuRow label="Mis turnos" onPress={() => router.push('/index_app')} />
            <MenuRow label="Explorar barberías" onPress={() => router.push('/explore')} />
          </View>
          <Button
            label="Salir"
            variant="ghost"
            onPress={() => {
              session.logout();
            }}
          />
        </View>
      ) : (
        <View style={styles.guest}>
          <View>
            <Text style={styles.wordmark}>Barber</Text>
            <Text style={styles.subtitle}>Tu corte, cuando te quede bien.</Text>
            <View style={styles.points}>
              <Text style={styles.point}>Buscá un local por ciudad o calle.</Text>
              <Text style={styles.point}>Elegí el día y un horario de 30 minutos.</Text>
              <Text style={styles.point}>El turno queda guardado en tu cuenta.</Text>
            </View>
          </View>
          <View>
            <Button label="Explorar barberías" onPress={() => router.push('/explore')} />
            <View style={styles.gap} />
            <Button label="Iniciar sesión" variant="ghost" onPress={() => router.push('/login')} />
            <Pressable onPress={() => router.push('/selectrol')} style={styles.link} accessibilityRole="button">
              <Text style={styles.linkText}>Crear cuenta</Text>
            </Pressable>
          </View>
        </View>
      )}
      <NavBar />
    </SafeAreaView>
  );
}

function MenuRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.row} accessibilityRole="button">
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  guest: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 28, paddingBottom: 120 },
  wordmark: { fontFamily: 'Arizonia', fontSize: 72, lineHeight: 84 },
  subtitle: { fontSize: 18, marginTop: -8, marginBottom: 22, color: '#333' },
  points: { gap: 10 },
  point: { fontSize: 16, lineHeight: 22 },
  gap: { height: 10 },
  link: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  linkText: { fontWeight: '700', fontSize: 16 },
  account: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: 'white', fontSize: 24, fontWeight: '700' },
  name: { marginTop: 16, fontSize: 26, fontWeight: '700' },
  email: { marginTop: 4, color: '#555' },
  role: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 24,
    backgroundColor: '#F3F3F3',
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontWeight: '700',
  },
  menu: { marginBottom: 20 },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  rowLabel: { fontSize: 16, fontWeight: '600' },
  chevron: { fontSize: 22, color: '#888' },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

const roles = [
  {
    role: 'user',
    title: 'Quiero reservar',
    detail: 'Buscás una barbería y elegís un horario libre.',
    icon: 'user' as const,
  },
  {
    role: 'barber',
    title: 'Tengo un local',
    detail: 'Publicás tu barbería y los turnos de 30 minutos.',
    icon: 'cut' as const,
  },
];

export default function SelectRol() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button" accessibilityLabel="Volver">
          <AntDesign name="arrowleft" size={20} color="black" />
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>¿Cómo vas a usar Barber?</Text>
        <Text style={styles.lead}>Elegí el tipo de cuenta. Después se puede entrar con el mismo correo.</Text>
        {roles.map((item) => (
          <Pressable
            key={item.role}
            style={styles.card}
            onPress={() => router.push({ pathname: '/register', params: { role: item.role } })}
            accessibilityRole="button"
            accessibilityLabel={item.title}
          >
            <View style={styles.icon}>
              <FontAwesome5 name={item.icon} size={18} color="black" />
            </View>
            <View style={styles.copy}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDetail}>{item.detail}</Text>
            </View>
          </Pressable>
        ))}
      </View>
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
  content: { paddingHorizontal: 24, paddingTop: 12 },
  title: { fontSize: 28, fontWeight: '700' },
  lead: { color: '#444', marginTop: 8, marginBottom: 20, lineHeight: 20 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#F6F6F6',
    marginBottom: 12,
    minHeight: 92,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700' },
  cardDetail: { marginTop: 4, color: '#444', lineHeight: 19 },
});

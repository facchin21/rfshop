import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useFavorites } from '@/context/Favorites';
import { useSession } from '@/context/Session';
import { fetchMonthSlots, fetchShop, reserveSlot } from '@/lib/api';
import { buenosAiresParts, formatStamp, isPastStamp } from '@/lib/time';
import type { Shop, Slot } from '@/lib/types';

export default function ShopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const favorites = useFavorites();
  const session = useSession();
  const [shop, setShop] = useState<Shop | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      return;
    }
    setError('');
    const month = buenosAiresParts(new Date()).month;
    const [nextShop, nextSlots] = await Promise.all([fetchShop(id), fetchMonthSlots(id, month)]);
    setShop(nextShop);
    setSlots(nextSlots);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      load().catch((caught: unknown) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : 'No pudimos abrir la barbería.');
        }
      });
      return () => {
        active = false;
      };
    }, [load]),
  );

  const reserve = async (slot: Slot) => {
    if (!session.user) {
      router.push('/login');
      return;
    }
    setBusyId(slot.id);
    setError('');
    try {
      await reserveSlot(slot.id);
      router.replace('/index_app');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos reservar el turno.');
    } finally {
      setBusyId(null);
    }
  };

  const ownsShop = shop != null && session.user?.id === shop.ownerId;
  const free = slots
    .filter((slot) => !slot.reserved && !isPastStamp(slot.bookingStart))
    .sort((left, right) => left.bookingStart.localeCompare(right.bookingStart));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver" hitSlop={8}>
          <AntDesign name="arrowleft" size={22} color="black" />
        </Pressable>
        {shop ? (
          <Pressable
            onPress={() => favorites.toggle(String(shop.id))}
            accessibilityRole="button"
            accessibilityLabel={favorites.has(String(shop.id)) ? 'Quitar de guardadas' : 'Guardar barbería'}
            hitSlop={8}
          >
            <AntDesign name={favorites.has(String(shop.id)) ? 'heart' : 'hearto'} size={22} color="black" />
          </Pressable>
        ) : (
          <View />
        )}
      </View>
      {!shop && !error ? <ActivityIndicator color="black" style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {shop ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.name}>{shop.name}</Text>
          <Text style={styles.address}>
            {shop.street} {shop.streetNumber}, {shop.city}
          </Text>
          {shop.phone ? <Text style={styles.phone}>{shop.phone}</Text> : null}
          <Text style={styles.section}>Turnos libres</Text>
          {ownsShop ? (
            <Text style={styles.note}>Este local es tuyo. Los horarios se publican desde Reservas.</Text>
          ) : null}
          {free.length === 0 ? <Text style={styles.note}>No hay turnos libres este mes.</Text> : null}
          {free.map((slot) => (
            <Pressable
              key={slot.id}
              style={styles.slot}
              onPress={() => void reserve(slot)}
              disabled={ownsShop || busyId === slot.id}
              accessibilityRole="button"
              accessibilityLabel={`Reservar ${formatStamp(slot.bookingStart)}`}
              testID={`slot-${slot.id}`}
            >
              <Text style={styles.slotText}>{formatStamp(slot.bookingStart)}</Text>
              <Text style={styles.slotAction}>{busyId === slot.id ? '...' : ownsShop ? 'Publicado' : 'Reservar'}</Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  top: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 12 },
  loader: { marginTop: 40 },
  content: { paddingHorizontal: 18, paddingBottom: 40 },
  name: { fontSize: 28, fontWeight: '700' },
  address: { marginTop: 8, fontSize: 16, color: '#333' },
  phone: { marginTop: 4, color: '#555' },
  section: { marginTop: 28, marginBottom: 12, fontSize: 18, fontWeight: '700' },
  note: { color: '#555', marginBottom: 12 },
  slot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  slotText: { fontSize: 15, flex: 1, paddingRight: 12 },
  slotAction: { fontWeight: '700' },
  error: { paddingHorizontal: 18, color: '#8A2B2B' },
});

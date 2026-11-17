import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { useFavorites } from '@/context/Favorites';
import { useSession } from '@/context/Session';
import { fetchMonthSlots, fetchShop, reserveSlot } from '@/lib/api';
import { buenosAiresParts, dateBadge, formatStamp, isPastStamp, stampParts } from '@/lib/time';
import type { Shop, Slot } from '@/lib/types';

const ACCENTS = ['#1C1C1C', '#3D2B1F', '#1E3A2F', '#243044', '#4A3728'];

export default function ShopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const favorites = useFavorites();
  const session = useSession();
  const [shop, setShop] = useState<Shop | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [day, setDay] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

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

  const ownsShop = shop != null && session.user?.id === shop.ownerId;
  const free = slots
    .filter((slot) => !slot.reserved && !isPastStamp(slot.bookingStart))
    .sort((left, right) => left.bookingStart.localeCompare(right.bookingStart));
  const days = [...new Set(free.map((slot) => stampParts(slot.bookingStart).date))];
  const activeDay = day && days.includes(day) ? day : days[0] ?? null;
  const daySlots = free.filter((slot) => stampParts(slot.bookingStart).date === activeDay);
  const selected = daySlots.find((slot) => slot.id === selectedId) ?? null;

  const reserve = async () => {
    if (!selected) {
      return;
    }
    if (!session.user) {
      router.push('/login');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await reserveSlot(selected.id);
      router.replace('/index_app');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos reservar el turno.');
    } finally {
      setBusy(false);
    }
  };

  const accent = ACCENTS[Math.abs(Number(id) || 0) % ACCENTS.length];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.iconButton} accessibilityRole="button" accessibilityLabel="Volver">
          <AntDesign name="arrowleft" size={20} color="black" />
        </Pressable>
        {shop ? (
          <Pressable
            onPress={() => favorites.toggle(String(shop.id))}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel={favorites.has(String(shop.id)) ? 'Quitar de guardadas' : 'Guardar barbería'}
          >
            <AntDesign name={favorites.has(String(shop.id)) ? 'heart' : 'hearto'} size={18} color="black" />
          </Pressable>
        ) : (
          <View />
        )}
      </View>
      {!shop && !error ? <ActivityIndicator color="black" style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {shop ? (
        <View style={styles.detail}>
          <ScrollView contentContainerStyle={{ paddingBottom: 120 + insets.bottom }}>
            <View style={[styles.hero, { backgroundColor: accent }]}>
              <Text style={styles.heroMark}>
                {shop.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('')}
              </Text>
              <Text style={styles.heroCity}>{shop.city}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.name}>{shop.name}</Text>
              <Text style={styles.address}>
                {shop.street} {shop.streetNumber}, {shop.city}
              </Text>
              <View style={styles.facts}>
                <Text style={styles.fact}>{shop.chair} {shop.chair === 1 ? 'sillón' : 'sillones'}</Text>
                {shop.phone ? <Text style={styles.fact}>{shop.phone}</Text> : null}
              </View>
              <Text style={styles.section}>Elegí un día</Text>
              {ownsShop ? <Text style={styles.note}>Este local es tuyo. Los horarios se publican desde Turnos.</Text> : null}
              {days.length === 0 ? <Text style={styles.note}>No hay turnos libres este mes.</Text> : null}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
                {days.map((iso) => {
                  const badge = dateBadge(iso);
                  const active = iso === activeDay;
                  return (
                    <Pressable
                      key={iso}
                      onPress={() => {
                        setDay(iso);
                        setSelectedId(null);
                      }}
                      style={[styles.day, active && styles.dayActive]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={`${badge.label} ${badge.day}`}
                    >
                      <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>{badge.label}</Text>
                      <Text style={[styles.dayNumber, active && styles.dayLabelActive]}>{badge.day}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Text style={styles.section}>Horarios</Text>
              <View style={styles.times}>
                {daySlots.map((slot) => {
                  const active = slot.id === selected?.id;
                  const time = stampParts(slot.bookingStart).time;
                  return (
                    <Pressable
                      key={slot.id}
                      onPress={() => setSelectedId(slot.id)}
                      disabled={ownsShop}
                      style={[styles.time, active && styles.timeActive]}
                      accessibilityRole="button"
                      accessibilityLabel={`Reservar ${formatStamp(slot.bookingStart)}`}
                      accessibilityState={{ selected: active }}
                      testID={`slot-${slot.id}`}
                    >
                      <Text style={[styles.timeText, active && styles.timeTextActive]}>{time}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>
          <View style={[styles.bar, { paddingBottom: 12 + insets.bottom }]}>
            <View style={styles.barCopy}>
              <Text style={styles.barTitle}>{selected ? stampParts(selected.bookingStart).time : '30 min'}</Text>
              <Text style={styles.barMeta}>
                {ownsShop ? 'Publicá horarios desde Turnos' : selected ? formatStamp(selected.bookingStart) : 'Elegí un horario'}
              </Text>
            </View>
            <View style={styles.barButton}>
              <Button
                label={ownsShop ? 'Tu local' : session.user ? 'Reservar' : 'Entrar'}
                onPress={() => void reserve()}
                disabled={ownsShop || !selected}
                busy={busy}
              />
            </View>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  detail: { flex: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F3F3',
  },
  loader: { marginTop: 40 },
  hero: { height: 140, marginHorizontal: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  heroMark: { color: 'white', fontSize: 36, fontWeight: '700', letterSpacing: 2 },
  heroCity: { color: 'rgba(255,255,255,0.82)', marginTop: 4, fontWeight: '600' },
  content: { paddingHorizontal: 20 },
  name: { marginTop: 16, fontSize: 28, fontWeight: '700' },
  address: { marginTop: 6, fontSize: 15, color: '#333', lineHeight: 21 },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  fact: { backgroundColor: '#F3F3F3', borderRadius: 12, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 6, fontSize: 13, fontWeight: '600' },
  section: { marginTop: 22, marginBottom: 10, fontSize: 18, fontWeight: '700' },
  note: { color: '#555', marginBottom: 8, lineHeight: 20 },
  days: { gap: 8, paddingRight: 8 },
  day: {
    width: 64,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayActive: { backgroundColor: '#111' },
  dayLabel: { fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  dayNumber: { fontSize: 18, fontWeight: '700', marginTop: 2 },
  dayLabelActive: { color: 'white' },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  time: {
    minWidth: 84,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeActive: { backgroundColor: '#111', borderColor: '#111' },
  timeText: { fontWeight: '700' },
  timeTextActive: { color: 'white' },
  error: { paddingHorizontal: 20, color: '#8A2B2B' },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E6E6E6',
  },
  barCopy: { flex: 1 },
  barTitle: { fontSize: 18, fontWeight: '700' },
  barMeta: { color: '#555', marginTop: 2, fontSize: 12 },
  barButton: { width: 132 },
});

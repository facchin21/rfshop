import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import { useSession } from '@/context/Session';
import { createShop, fetchMonthSlots, fetchMyBookings, fetchMyShops, publishSlots } from '@/lib/api';
import { buenosAiresParts, dateBadge, formatStamp, isPastStamp, plusMinutes, slotStamp, stampParts, todayISO } from '@/lib/time';
import type { Shop, Slot } from '@/lib/types';

const QUICK_TIMES = ['11:00', '12:00', '17:00', '18:00', '18:30'];

export default function Reservations() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const session = useSession();
  const [bookings, setBookings] = useState<Slot[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    if (!session.user) {
      setLoading(false);
      return;
    }
    setError('');
    try {
      if (session.user.role?.name === 'BARBER') {
        const mine = await fetchMyShops();
        setShops(mine);
        if (mine[0]) {
          setSlots(await fetchMonthSlots(mine[0].id, buenosAiresParts(new Date()).month));
        } else {
          setSlots([]);
        }
      } else {
        setBookings(await fetchMyBookings());
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos cargar tu agenda.');
    } finally {
      setLoading(false);
    }
  }, [session.user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      void load();
    }, [load]),
  );

  const upcoming = bookings.filter((booking) => !isPastStamp(booking.bookingStart));
  const previous = bookings.filter((booking) => isPastStamp(booking.bookingStart)).reverse();
  const isBarber = session.user?.role?.name === 'BARBER';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 108 + insets.bottom, paddingHorizontal: 20 }}>
        <Text style={styles.lead}>{isBarber ? 'Mi local' : 'Tus turnos'}</Text>
        {!session.ready || loading ? <ActivityIndicator color="black" style={styles.loader} /> : null}
        {session.ready && !session.user ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Entrá para ver tus turnos</Text>
            <Text style={styles.emptyText}>Las reservas quedan en tu cuenta.</Text>
            <Button label="Iniciar sesión" onPress={() => router.push('/login')} />
          </View>
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        {isBarber && !loading ? (
          <BarberAgenda
            shop={shops[0] ?? null}
            slots={slots}
            onCreated={() => {
              setNotice('Listo, ya está en la agenda.');
              void load();
            }}
            onError={setError}
          />
        ) : null}
        {session.user && !isBarber && !loading && upcoming.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Todavía no tenés turnos</Text>
            <Text style={styles.emptyText}>Explorá barberías y reservá un horario publicado.</Text>
            <Button label="Explorar barberías" onPress={() => router.push('/explore')} />
          </View>
        ) : null}
        {!isBarber ? upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} />) : null}
        {previous.length > 0 && !isBarber ? <Text style={styles.section}>Anteriores</Text> : null}
        {!isBarber ? previous.map((booking) => <BookingCard key={booking.id} booking={booking} muted />) : null}
      </ScrollView>
      <NavBar />
    </SafeAreaView>
  );
}

function BookingCard({ booking, muted }: { booking: Slot; muted?: boolean }) {
  const badge = dateBadge(stampParts(booking.bookingStart).date);
  return (
    <View style={[styles.card, muted && styles.cardMuted]}>
      <View style={styles.badge}>
        <Text style={styles.badgeDay}>{badge.day}</Text>
        <Text style={styles.badgeMonth}>{badge.month}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{booking.barberShopName ?? 'Barbería'}</Text>
        <Text style={styles.cardMeta}>{formatStamp(booking.bookingStart)}</Text>
      </View>
    </View>
  );
}

function BarberAgenda({
  shop,
  slots,
  onCreated,
  onError,
}: {
  shop: Shop | null;
  slots: Slot[];
  onCreated: () => void;
  onError: (message: string) => void;
}) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Buenos Aires');
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [chair, setChair] = useState('1');
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState('17:00');
  const [busy, setBusy] = useState(false);
  const grouped = useMemo(() => {
    const ordered = [...slots].sort((left, right) => left.bookingStart.localeCompare(right.bookingStart));
    const map = new Map<string, Slot[]>();
    ordered.forEach((slot) => {
      const key = stampParts(slot.bookingStart).date;
      map.set(key, [...(map.get(key) ?? []), slot]);
    });
    return [...map.entries()];
  }, [slots]);

  const create = async () => {
    const chairs = Number(chair);
    const number = Number(streetNumber);
    if (name.trim().length < 3 || !city.trim() || !street.trim() || !Number.isInteger(number) || !Number.isInteger(chairs)) {
      onError('Completá el local con calle, altura y sillones.');
      return;
    }
    setBusy(true);
    try {
      await createShop({
        name: name.trim(),
        city: city.trim(),
        street: street.trim(),
        streetNumber: number,
        phone: phone.trim() || undefined,
        chair: chairs,
      });
      onCreated();
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : 'No pudimos crear el local.');
    } finally {
      setBusy(false);
    }
  };

  const publish = async () => {
    if (!shop || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
      onError('Usá una fecha AAAA-MM-DD y una hora HH:mm.');
      return;
    }
    const end = plusMinutes(date, time, 30);
    setBusy(true);
    try {
      await publishSlots(shop.id, [{ bookingStart: slotStamp(date, time), bookingEnd: slotStamp(end.date, end.time) }]);
      onCreated();
    } catch (caught) {
      onError(caught instanceof Error ? caught.message : 'No pudimos publicar el turno.');
    } finally {
      setBusy(false);
    }
  };

  if (!shop) {
    return (
      <View>
        <Text style={styles.emptyText}>Publicá tu barbería para abrir la agenda.</Text>
        <TextField label="Nombre" value={name} onChangeText={setName} autoCapitalize="words" />
        <TextField label="Ciudad" value={city} onChangeText={setCity} autoCapitalize="words" />
        <TextField label="Calle" value={street} onChangeText={setStreet} autoCapitalize="words" />
        <TextField label="Altura" value={streetNumber} onChangeText={setStreetNumber} keyboardType="number-pad" />
        <TextField label="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextField label="Sillones" value={chair} onChangeText={setChair} keyboardType="number-pad" />
        <Button label="Crear local" onPress={() => void create()} busy={busy} />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.shopCard}>
        <Text style={styles.cardTitle}>{shop.name}</Text>
        <Text style={styles.cardMeta}>
          {shop.street} {shop.streetNumber}, {shop.city}
        </Text>
      </View>
      <Text style={styles.section}>Publicar 30 minutos</Text>
      <TextField label="Fecha" value={date} onChangeText={setDate} placeholder="AAAA-MM-DD" />
      <Text style={styles.fieldLabel}>Hora</Text>
      <View style={styles.times}>
        {QUICK_TIMES.map((option) => (
          <Pressable
            key={option}
            onPress={() => setTime(option)}
            style={[styles.time, time === option && styles.timeActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: time === option }}
          >
            <Text style={[styles.timeText, time === option && styles.timeTextActive]}>{option}</Text>
          </Pressable>
        ))}
      </View>
      <TextField label="Otra hora" value={time} onChangeText={setTime} placeholder="HH:mm" />
      <Button label="Publicar turno" onPress={() => void publish()} busy={busy} testID="publish-slot" />
      <Text style={styles.section}>Agenda del mes</Text>
      {grouped.length === 0 ? <Text style={styles.emptyText}>Todavía no hay horarios este mes.</Text> : null}
      {grouped.map(([iso, daySlots]) => {
        const badge = dateBadge(iso);
        return (
          <View key={iso} style={styles.dayGroup}>
            <Text style={styles.dayTitle}>
              {badge.label} {badge.day} {badge.month}
            </Text>
            {daySlots.map((slot) => (
              <View key={slot.id} style={styles.slotRow}>
                <Text style={styles.slotTime}>{stampParts(slot.bookingStart).time}</Text>
                <Text style={[styles.pill, slot.reserved && styles.pillTaken]}>
                  {slot.reserved ? slot.user ? `${slot.user.name} ${slot.user.lastName}` : 'Reservado' : 'Libre'}
                </Text>
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  lead: { fontSize: 26, fontWeight: '700', marginBottom: 16 },
  loader: { marginVertical: 16 },
  empty: { paddingVertical: 8, gap: 8 },
  emptyTitle: { fontSize: 20, fontWeight: '700' },
  emptyText: { color: '#444', marginBottom: 8, lineHeight: 20 },
  error: { color: '#8A2B2B', marginBottom: 12 },
  notice: { color: '#1E3A2F', marginBottom: 12, fontWeight: '600' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
  },
  cardMuted: { opacity: 0.6 },
  badge: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDay: { color: 'white', fontSize: 18, fontWeight: '700' },
  badgeMonth: { color: 'white', fontSize: 11, textTransform: 'uppercase' },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardMeta: { marginTop: 4, color: '#444' },
  section: { marginTop: 22, marginBottom: 10, fontSize: 18, fontWeight: '700' },
  shopCard: { padding: 14, borderRadius: 16, backgroundColor: '#F6F6F6', marginBottom: 8 },
  fieldLabel: { marginBottom: 6, fontSize: 13, fontWeight: '600', color: '#333' },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  time: {
    minWidth: 72,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeActive: { backgroundColor: '#111' },
  timeText: { fontWeight: '700' },
  timeTextActive: { color: 'white' },
  dayGroup: { marginBottom: 14 },
  dayTitle: { fontWeight: '700', marginBottom: 8, textTransform: 'capitalize' },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  slotTime: { fontSize: 16, fontWeight: '700' },
  pill: { color: '#1E3A2F', fontWeight: '700' },
  pillTaken: { color: '#333' },
});

import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { useSession } from '@/context/Session';
import { createShop, fetchMonthSlots, fetchMyBookings, fetchMyShops, publishSlots } from '@/lib/api';
import { buenosAiresParts, formatStamp, isPastStamp, plusMinutes, slotStamp, todayISO } from '@/lib/time';
import type { Shop, Slot } from '@/lib/types';

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

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 96 + insets.bottom, paddingHorizontal: 18 }}>
        <Text style={styles.lead}>{session.user?.role?.name === 'BARBER' ? 'Mi local' : 'Próximas reservas'}</Text>
        {!session.ready || loading ? <ActivityIndicator color="black" style={styles.loader} /> : null}
        {session.ready && !session.user ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Entrá para ver tus turnos</Text>
            <Pressable style={styles.button} onPress={() => router.push('/login')} accessibilityRole="button">
              <Text style={styles.buttonText}>Iniciar sesión</Text>
            </Pressable>
          </View>
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {notice ? <Text style={styles.notice}>{notice}</Text> : null}
        {session.user?.role?.name === 'BARBER' && !loading ? (
          <BarberAgenda
            shop={shops[0] ?? null}
            slots={slots}
            onCreated={() => {
              setNotice('Listo.');
              void load();
            }}
            onError={setError}
          />
        ) : null}
        {session.user && session.user.role?.name !== 'BARBER' && !loading && upcoming.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Todavía no tenés turnos</Text>
            <Text style={styles.emptyText}>Explorá barberías y reservá un horario publicado.</Text>
            <Pressable style={styles.button} onPress={() => router.push('/explore')} accessibilityRole="button">
              <Text style={styles.buttonText}>Explorar barberías</Text>
            </Pressable>
          </View>
        ) : null}
        {session.user?.role?.name !== 'BARBER'
          ? upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} />)
          : null}
        {previous.length > 0 && session.user?.role?.name !== 'BARBER' ? <Text style={styles.previousTitle}>Anteriores</Text> : null}
        {session.user?.role?.name !== 'BARBER' ? previous.map((booking) => <BookingCard key={booking.id} booking={booking} />) : null}
      </ScrollView>
      <NavBar />
    </SafeAreaView>
  );
}

function BookingCard({ booking }: { booking: Slot }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{booking.barberShopName ?? 'Barbería'}</Text>
      <Text style={styles.cardMeta}>{formatStamp(booking.bookingStart)}</Text>
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

  const create = async () => {
    const chairs = Number(chair);
    const number = Number(streetNumber);
    if (name.trim().length < 3 || !city.trim() || !street.trim() || !Number.isInteger(number) || !Number.isInteger(chairs)) {
      onError('Completá el local con calle, altura y sillones.');
      return;
    }
    setBusy(true);
    try {
      await createShop({ name: name.trim(), city: city.trim(), street: street.trim(), streetNumber: number, phone: phone.trim() || undefined, chair: chairs });
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
        <Field label="Nombre" value={name} onChangeText={setName} />
        <Field label="Ciudad" value={city} onChangeText={setCity} />
        <Field label="Calle" value={street} onChangeText={setStreet} />
        <Field label="Altura" value={streetNumber} onChangeText={setStreetNumber} />
        <Field label="Teléfono" value={phone} onChangeText={setPhone} />
        <Field label="Sillones" value={chair} onChangeText={setChair} />
        <Pressable style={styles.button} onPress={() => void create()} disabled={busy} accessibilityRole="button">
          <Text style={styles.buttonText}>{busy ? 'Creando...' : 'Crear local'}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.cardTitle}>{shop.name}</Text>
      <Text style={styles.cardMeta}>
        {shop.street} {shop.streetNumber}, {shop.city}
      </Text>
      <Text style={styles.section}>Publicar un turno de 30 minutos</Text>
      <Field label="Fecha" value={date} onChangeText={setDate} />
      <Field label="Hora" value={time} onChangeText={setTime} />
      <Pressable style={styles.button} onPress={() => void publish()} disabled={busy} accessibilityRole="button" testID="publish-slot">
        <Text style={styles.buttonText}>{busy ? 'Publicando...' : 'Publicar turno'}</Text>
      </Pressable>
      <Text style={styles.section}>Agenda del mes</Text>
      {slots.length === 0 ? <Text style={styles.emptyText}>Todavía no hay horarios este mes.</Text> : null}
      {slots.map((slot) => (
        <View key={slot.id} style={styles.card}>
          <Text style={styles.cardTitle}>{formatStamp(slot.bookingStart)}</Text>
          <Text style={styles.cardMeta}>
            {slot.reserved ? `Reservado${slot.user ? ` · ${slot.user.name} ${slot.user.lastName}` : ''}` : 'Libre'}
          </Text>
        </View>
      ))}
    </View>
  );
}

function Field({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} style={styles.input} accessibilityLabel={label} autoCapitalize="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  lead: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  loader: { marginVertical: 16 },
  empty: { paddingVertical: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyText: { color: '#444', marginBottom: 12 },
  button: { backgroundColor: 'black', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignSelf: 'flex-start', marginBottom: 16 },
  buttonText: { color: 'white', fontWeight: '700' },
  error: { color: '#8A2B2B', marginBottom: 12 },
  notice: { color: '#1E3A2F', marginBottom: 12 },
  card: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardMeta: { marginTop: 4, color: '#444' },
  previousTitle: { marginTop: 22, marginBottom: 8, fontSize: 16, fontWeight: '700' },
  section: { marginTop: 18, marginBottom: 8, fontSize: 16, fontWeight: '700' },
  field: { marginBottom: 10 },
  fieldLabel: { marginBottom: 4, color: '#333' },
  input: { borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 10, paddingHorizontal: 12, height: 44 },
});

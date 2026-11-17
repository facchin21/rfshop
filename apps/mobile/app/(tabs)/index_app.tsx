import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { cancelReservation, fetchBookings } from '@/lib/api';
import { formatARS } from '@/lib/money';
import { formatAppointment, isPastSlot } from '@/lib/time';
import type { BookingView } from '@/lib/types';

export default function Reservations() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [bookings, setBookings] = useState<BookingView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const response = await fetchBookings();
      setBookings(response.bookings);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos cargar tus reservas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const upcoming = bookings.filter((booking) => !isPastSlot(booking.date, booking.time));
  const previous = bookings.filter((booking) => isPastSlot(booking.date, booking.time)).reverse();

  const cancel = (booking: BookingView) => {
    Alert.alert('Cancelar turno', `${booking.shopName} · ${formatAppointment(booking.date, booking.time)}`, [
      { text: 'Volver', style: 'cancel' },
      {
        text: 'Cancelar turno',
        style: 'destructive',
        onPress: () => {
          void cancelReservation(booking.id)
            .then(() => load())
            .catch((caught: unknown) => {
              setError(caught instanceof Error ? caught.message : 'No pudimos cancelar el turno.');
            });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={{ paddingBottom: 96 + insets.bottom, paddingHorizontal: 18 }}>
        <Text style={styles.lead}>Próximas reservas</Text>
        {loading ? <ActivityIndicator color="black" style={styles.loader} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && upcoming.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Todavía no tenés turnos</Text>
            <Text style={styles.emptyText}>Explorá barberías y reservá el horario que te quede bien.</Text>
            <Pressable
              style={styles.button}
              onPress={() => router.push('/explore')}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Explorar barberías</Text>
            </Pressable>
          </View>
        ) : null}
        {upcoming.map((booking) => (
          <BookingCard key={booking.id} booking={booking} onCancel={() => cancel(booking)} />
        ))}
        {previous.length > 0 ? <Text style={styles.previousTitle}>Anteriores</Text> : null}
        {previous.map((booking) => (
          <BookingCard key={booking.id} booking={booking} />
        ))}
      </ScrollView>
      <NavBar />
    </SafeAreaView>
  );
}

function BookingCard({ booking, onCancel }: { booking: BookingView; onCancel?: () => void }) {
  return (
    <View style={styles.card} testID={`booking-card-${booking.id}`}>
      <Text style={styles.cardTitle}>{booking.shopName}</Text>
      <Text style={styles.cardPlace}>
        {booking.address} · {booking.neighborhood}
      </Text>
      <Text style={styles.cardWhen}>{formatAppointment(booking.date, booking.time)}</Text>
      <Text style={styles.cardService}>
        {booking.serviceName} con {booking.barberName}
      </Text>
      <Text style={styles.cardPrice}>
        {formatARS(booking.price)} · {booking.guestName}
      </Text>
      {onCancel ? (
        <Pressable onPress={onCancel} accessibilityRole="button" style={styles.cancel}>
          <Text style={styles.cancelText}>Cancelar turno</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  lead: {
    marginTop: 8,
    marginBottom: 14,
    fontSize: 22,
    fontWeight: '700',
  },
  loader: {
    marginVertical: 16,
  },
  error: {
    marginBottom: 10,
    color: '#8A2B2B',
  },
  empty: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#F4F4F4',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
  card: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F4F4F4',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardPlace: {
    marginTop: 4,
    color: '#555',
  },
  cardWhen: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  cardService: {
    marginTop: 4,
  },
  cardPrice: {
    marginTop: 4,
    color: '#333',
  },
  cancel: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  cancelText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  previousTitle: {
    marginTop: 12,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '700',
  },
});

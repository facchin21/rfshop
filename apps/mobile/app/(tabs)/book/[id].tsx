import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createReservation, fetchAvailability, fetchShop } from '@/lib/api';
import { formatARS } from '@/lib/money';
import { formatDayChip, upcomingDates } from '@/lib/time';
import type { Shop, TimeSlot } from '@/lib/types';

export default function BookScreen() {
  const params = useLocalSearchParams<{ id: string; serviceId?: string }>();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [serviceId, setServiceId] = useState(params.serviceId ?? '');
  const [barberId, setBarberId] = useState('');
  const [date, setDate] = useState(upcomingDates(1)[0]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [closed, setClosed] = useState(false);
  const [reason, setReason] = useState<'ok' | 'closed' | 'past' | 'full'>('ok');
  const [time, setTime] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loadingShop, setLoadingShop] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const dates = upcomingDates(10);
  const requestId = useRef(0);

  const loadSlots = useCallback(async (shopId: string, nextDate: string, nextService: string, nextBarber: string) => {
    if (!nextService || !nextBarber) {
      return;
    }
    const currentRequest = ++requestId.current;
    setLoadingSlots(true);
    setError('');
    try {
      const availability = await fetchAvailability(shopId, nextDate, nextService, nextBarber);
      if (currentRequest !== requestId.current) {
        return;
      }
      setClosed(availability.closed);
      setReason(availability.reason);
      setSlots(availability.slots);
      setTime((current) => (availability.slots.some((slot) => slot.time === current) ? current : ''));
    } catch (caught) {
      if (currentRequest !== requestId.current) {
        return;
      }
      setError(caught instanceof Error ? caught.message : 'No pudimos ver los horarios.');
    } finally {
      if (currentRequest === requestId.current) {
        setLoadingSlots(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!params.id) {
      return;
    }
    let active = true;
    setLoadingShop(true);
    fetchShop(params.id)
      .then((response) => {
        if (!active) {
          return;
        }
        const nextShop = response.shop;
        setShop(nextShop);
        setServiceId((current) => {
          if (current && nextShop.services.some((service) => service.id === current)) {
            return current;
          }
          if (params.serviceId && nextShop.services.some((service) => service.id === params.serviceId)) {
            return params.serviceId;
          }
          return nextShop.services[0]?.id ?? '';
        });
        setBarberId((current) =>
          current && nextShop.barbers.some((barber) => barber.id === current) ? current : nextShop.barbers[0]?.id ?? '',
        );
      })
      .catch((caught: unknown) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : 'No pudimos abrir la reserva.');
        }
      })
      .finally(() => {
        if (active) {
          setLoadingShop(false);
        }
      });
    return () => {
      active = false;
    };
  }, [params.id, params.serviceId]);

  useEffect(() => {
    if (!shop || !serviceId || !barberId) {
      return;
    }
    void loadSlots(shop.id, date, serviceId, barberId);
  }, [shop, date, serviceId, barberId, loadSlots]);

  const service = shop?.services.find((item) => item.id === serviceId);
  const barber = shop?.barbers.find((item) => item.id === barberId);

  const chooseService = (id: string) => {
    setServiceId(id);
    setTime('');
  };

  const chooseBarber = (id: string) => {
    setBarberId(id);
    setTime('');
  };

  const chooseDate = (nextDate: string) => {
    setDate(nextDate);
    setTime('');
  };

  const confirm = async () => {
    if (!shop || !service || !barber || !time) {
      setError('Elegí servicio, barbero y horario.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await createReservation({
        shopId: shop.id,
        serviceId: service.id,
        barberId: barber.id,
        date,
        time,
        guestName,
      });
      router.replace('/index_app');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos confirmar la reserva.');
      if (shop) {
        void loadSlots(shop.id, date, service.id, barber.id);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver" hitSlop={8}>
          <AntDesign name="arrowleft" size={22} color="black" />
        </Pressable>
        <Text style={styles.topTitle}>Reservar</Text>
        <View style={styles.topSpacer} />
      </View>
      {loadingShop && !shop ? <ActivityIndicator color="black" style={styles.loader} /> : null}
      {shop ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.shop}>{shop.name}</Text>
          <Text style={styles.address}>{shop.address}</Text>
          <Text style={styles.section}>Servicio</Text>
          <View style={styles.choices}>
            {shop.services.map((item) => (
              <Choice
                key={item.id}
                label={`${item.name} · ${formatARS(item.price)}`}
                detail={`${item.durationMin} min`}
                active={item.id === serviceId}
                onPress={() => chooseService(item.id)}
              />
            ))}
          </View>
          <Text style={styles.section}>Barbero</Text>
          <View style={styles.choices}>
            {shop.barbers.map((item) => (
              <Choice
                key={item.id}
                label={item.name}
                detail={item.specialty}
                active={item.id === barberId}
                onPress={() => chooseBarber(item.id)}
              />
            ))}
          </View>
          <Text style={styles.section}>Día</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
            {dates.map((item) => {
              const chip = formatDayChip(item);
              const active = item === date;
              return (
                <Pressable
                  key={item}
                  onPress={() => chooseDate(item)}
                  style={[styles.day, active && styles.dayActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`${chip.label} ${chip.day}`}
                >
                  <Text style={[styles.dayLabel, active && styles.dayTextActive]}>{chip.label}</Text>
                  <Text style={[styles.dayNumber, active && styles.dayTextActive]}>{chip.day}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <Text style={styles.section}>Horario</Text>
          {loadingSlots ? <ActivityIndicator color="black" /> : null}
          {!loadingSlots && slots.length === 0 ? (
            <Text style={styles.note}>
              {closed || reason === 'closed'
                ? 'Este local no abre ese día.'
                : reason === 'past'
                  ? 'Hoy ya no quedan horarios. Elegí otro día.'
                  : `No quedan turnos con ${barber?.name ?? 'ese barbero'} ese día.`}
            </Text>
          ) : null}
          <View style={styles.slots}>
            {slots.map((slot) => {
              const active = slot.time === time;
              return (
                <Pressable
                  key={slot.time}
                  onPress={() => setTime(slot.time)}
                  style={[styles.slot, active && styles.slotActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                >
                  <Text style={[styles.slotText, active && styles.slotTextActive]}>{slot.time}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.section}>Tu nombre</Text>
          <TextInput
            value={guestName}
            onChangeText={setGuestName}
            placeholder="Cómo te anotamos"
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            accessibilityLabel="Nombre para la reserva"
            testID="guest-name"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable
            onPress={() => void confirm()}
            disabled={saving}
            style={[styles.button, saving && styles.buttonDisabled]}
            accessibilityRole="button"
            testID="book-confirm"
          >
            <Text style={styles.buttonText}>
              {saving ? 'Reservando…' : service && time ? `Confirmar · ${formatARS(service.price)}` : 'Elegí un horario'}
            </Text>
          </Pressable>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

function Choice({
  label,
  detail,
  active,
  onPress,
}: {
  label: string;
  detail: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choice, active && styles.choiceActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.choiceLabel, active && styles.choiceTextActive]}>{label}</Text>
      <Text style={[styles.choiceDetail, active && styles.choiceTextActive]}>{detail}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  topSpacer: {
    width: 22,
  },
  loader: {
    marginTop: 32,
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  shop: {
    fontSize: 24,
    fontWeight: '700',
  },
  address: {
    marginTop: 2,
    color: '#666',
  },
  section: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '700',
  },
  choices: {
    gap: 8,
  },
  choice: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  choiceActive: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  choiceLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  choiceDetail: {
    marginTop: 2,
    color: '#666',
    fontSize: 13,
  },
  choiceTextActive: {
    color: 'white',
  },
  days: {
    gap: 8,
    paddingRight: 8,
  },
  day: {
    width: 64,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    alignItems: 'center',
  },
  dayActive: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  dayLabel: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  dayNumber: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: '700',
  },
  dayTextActive: {
    color: 'white',
  },
  note: {
    color: '#555',
    marginBottom: 8,
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slot: {
    minWidth: 72,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    alignItems: 'center',
  },
  slotActive: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  slotText: {
    fontWeight: '600',
  },
  slotTextActive: {
    color: 'white',
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    fontSize: 16,
  },
  error: {
    marginTop: 12,
    color: '#8A2B2B',
  },
  button: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useFavorites } from '@/context/Favorites';
import { fetchShop } from '@/lib/api';
import { formatARS } from '@/lib/money';
import { priceFrom } from '@/lib/shops';
import type { Shop } from '@/lib/types';

export default function ShopScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const favorites = useFavorites();
  const [shop, setShop] = useState<Shop | null>(null);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      if (!id) {
        return;
      }
      let active = true;
      setError('');
      fetchShop(id)
        .then((response) => {
          if (active) {
            setShop(response.shop);
          }
        })
        .catch((caught: unknown) => {
          if (active) {
            setError(caught instanceof Error ? caught.message : 'No pudimos abrir la barbería.');
          }
        });
      return () => {
        active = false;
      };
    }, [id]),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver" hitSlop={8}>
          <AntDesign name="arrowleft" size={22} color="black" />
        </Pressable>
        {shop ? (
          <Pressable
            onPress={() => favorites.toggle(shop.id)}
            accessibilityRole="button"
            accessibilityLabel={favorites.has(shop.id) ? 'Quitar de guardadas' : 'Guardar barbería'}
            hitSlop={8}
          >
            <AntDesign name={favorites.has(shop.id) ? 'heart' : 'hearto'} size={22} color="black" />
          </Pressable>
        ) : (
          <View />
        )}
      </View>
      {!shop && !error ? <ActivityIndicator color="black" style={styles.loader} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {shop ? (
        <View style={styles.detail}>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
            <View style={[styles.hero, { backgroundColor: shop.accent }]}>
              <Text style={styles.monogram}>{shop.monogram}</Text>
              <Text style={styles.heroNeighborhood}>{shop.neighborhood}</Text>
            </View>
            <Text style={styles.name}>{shop.name}</Text>
            <Text style={styles.meta}>
              ★ {shop.rating.toFixed(2)} · {shop.reviewCount} reseñas
            </Text>
            <Text style={styles.address}>
              {shop.address}, {shop.neighborhood}
            </Text>
            <Text style={styles.tagline}>{shop.tagline}</Text>
            <Text style={styles.about}>{shop.about}</Text>
            <Text style={styles.section}>Servicios</Text>
            {shop.services.map((service) => (
              <Pressable
                key={service.id}
                style={styles.row}
                onPress={() =>
                  router.push({ pathname: '/book/[id]', params: { id: shop.id, serviceId: service.id } })
                }
                accessibilityRole="button"
                accessibilityLabel={`Reservar ${service.name}`}
              >
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle}>{service.name}</Text>
                  <Text style={styles.rowDetail}>{service.durationMin} min</Text>
                </View>
                <Text style={styles.rowPrice}>{formatARS(service.price)}</Text>
              </Pressable>
            ))}
            <Text style={styles.section}>Barberos</Text>
            {shop.barbers.map((barber) => (
              <View key={barber.id} style={styles.barber}>
                <Text style={styles.rowTitle}>{barber.name}</Text>
                <Text style={styles.rowDetail}>{barber.specialty}</Text>
              </View>
            ))}
            <Text style={styles.hours}>
              Abre de {shop.openHour}:00 a {shop.closeHour}:00 · desde {formatARS(priceFrom(shop))}
            </Text>
          </ScrollView>
          <Pressable
            style={styles.button}
            onPress={() => router.push({ pathname: '/book/[id]', params: { id: shop.id } })}
            accessibilityRole="button"
          >
            <Text style={styles.buttonText}>Reservar un turno</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  loader: {
    marginTop: 40,
  },
  error: {
    padding: 22,
    color: '#8A2B2B',
    fontSize: 16,
  },
  detail: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  hero: {
    height: 180,
    marginHorizontal: 18,
    borderRadius: 18,
    padding: 18,
    justifyContent: 'flex-end',
  },
  monogram: {
    position: 'absolute',
    top: 20,
    left: 18,
    color: 'white',
    fontSize: 52,
    fontWeight: '700',
  },
  heroNeighborhood: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  name: {
    marginTop: 16,
    paddingHorizontal: 18,
    fontSize: 28,
    fontWeight: '700',
  },
  meta: {
    paddingHorizontal: 18,
    marginTop: 4,
    fontSize: 15,
  },
  address: {
    paddingHorizontal: 18,
    marginTop: 4,
    color: '#555',
    fontSize: 15,
  },
  tagline: {
    paddingHorizontal: 18,
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  about: {
    paddingHorizontal: 18,
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    marginTop: 22,
    marginBottom: 8,
    paddingHorizontal: 18,
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    marginHorizontal: 18,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    paddingRight: 12,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  rowDetail: {
    marginTop: 2,
    color: '#666',
    fontSize: 13,
  },
  rowPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  barber: {
    marginHorizontal: 18,
    paddingVertical: 8,
  },
  hours: {
    paddingHorizontal: 18,
    marginTop: 16,
    color: '#555',
  },
  button: {
    marginHorizontal: 18,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'black',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
});

import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { ShopCard } from '@/components/marketplace/ShopCard';
import { useFavorites } from '@/context/Favorites';
import { fetchShops } from '@/lib/api';
import { neighborhoods } from '@/lib/shops';
import type { Shop } from '@/lib/types';

const AREAS = neighborhoods();

export default function Explore() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const favorites = useFavorites();
  const [query, setQuery] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (nextQuery: string, nextNeighborhood: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchShops(nextQuery, nextNeighborhood);
      setShops(response.shops);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos cargar las barberías.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const handle = setTimeout(() => {
        void load(query, neighborhood);
      }, 180);
      return () => clearTimeout(handle);
    }, [load, query, neighborhood]),
  );

  const visible = savedOnly ? shops.filter((shop) => favorites.has(shop.id)) : shops;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <Text style={styles.lead}>Encontrá tu barbería</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Barrio, barbería o servicio"
        placeholderTextColor="#8A8A8A"
        style={styles.search}
        accessibilityLabel="Buscar barberías"
        testID="explore-search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={styles.filters}>
        <FilterChip label="Todas" active={!neighborhood && !savedOnly} onPress={() => { setNeighborhood(''); setSavedOnly(false); }} />
        <FilterChip label="Guardadas" active={savedOnly} onPress={() => setSavedOnly((current) => !current)} />
        {AREAS.map((area) => (
          <FilterChip
            key={area}
            label={area}
            active={neighborhood === area}
            onPress={() => {
              setSavedOnly(false);
              setNeighborhood((current) => (current === area ? '' : area));
            }}
          />
        ))}
      </View>
      {loading ? <ActivityIndicator style={styles.status} color="black" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={visible}
        keyExtractor={(shop) => shop.id}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 96 + insets.bottom }}
        ListEmptyComponent={
          loading ? null : (
            <Text style={styles.empty}>
              {savedOnly ? 'Todavía no guardaste barberías.' : 'No hay barberías con esa búsqueda.'}
            </Text>
          )
        }
        renderItem={({ item }) => (
          <ShopCard
            shop={item}
            saved={favorites.has(item.id)}
            onPress={() => router.push({ pathname: '/shop/[id]', params: { id: item.id } })}
            onToggleSaved={() => favorites.toggle(item.id)}
          />
        )}
      />
      <NavBar />
    </SafeAreaView>
  );
}

function FilterChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  lead: {
    paddingHorizontal: 22,
    marginBottom: 12,
    fontSize: 22,
    fontWeight: '700',
  },
  search: {
    marginHorizontal: 18,
    marginBottom: 12,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    backgroundColor: '#F7F7F7',
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  chipActive: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: 'white',
  },
  status: {
    marginVertical: 12,
  },
  error: {
    paddingHorizontal: 22,
    marginBottom: 8,
    color: '#8A2B2B',
  },
  empty: {
    paddingTop: 24,
    fontSize: 16,
    color: '#555',
  },
});

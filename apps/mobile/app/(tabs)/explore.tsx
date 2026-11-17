import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { Header } from '@/components/Header';
import { NavBar } from '@/components/NavBar';
import { ShopCard } from '@/components/marketplace/ShopCard';
import { useFavorites } from '@/context/Favorites';
import { fetchShops } from '@/lib/api';
import type { Shop } from '@/lib/types';

export default function Explore() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const favorites = useFavorites();
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [savedOnly, setSavedOnly] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setShops(await fetchShops());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos cargar las barberías.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const cities = useMemo(() => [...new Set(shops.map((shop) => shop.city).filter(Boolean))], [shops]);
  const needle = query.trim().toLowerCase();
  const visible = shops.filter((shop) => {
    if (savedOnly && !favorites.has(String(shop.id))) {
      return false;
    }
    if (city && shop.city !== city) {
      return false;
    }
    if (!needle) {
      return true;
    }
    return [shop.name, shop.city, shop.street].join(' ').toLowerCase().includes(needle);
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header />
      <Text style={styles.lead}>Encontrá tu barbería</Text>
      <View style={styles.searchBox}>
        <AntDesign name="search1" size={18} color="#6E6E6E" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Ciudad, calle o barbería"
          placeholderTextColor="#8A8A8A"
          style={styles.search}
          accessibilityLabel="Buscar barberías"
          testID="explore-search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        <FilterChip label="Todas" active={!city && !savedOnly} onPress={() => { setCity(''); setSavedOnly(false); }} />
        <FilterChip label="Guardadas" active={savedOnly} onPress={() => setSavedOnly((current) => !current)} />
        {cities.map((area) => (
          <FilterChip
            key={area}
            label={area}
            active={city === area}
            onPress={() => {
              setSavedOnly(false);
              setCity((current) => (current === area ? '' : area));
            }}
          />
        ))}
      </ScrollView>
      {loading ? <ActivityIndicator style={styles.status} color="black" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <FlatList
        data={visible}
        keyExtractor={(shop) => String(shop.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 96 + insets.bottom, paddingTop: 4 }}
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>{savedOnly ? 'Nada guardado' : 'Sin resultados'}</Text>
              <Text style={styles.empty}>
                {savedOnly ? 'Marcá el corazón de un local para verlo acá.' : 'Probá con otra ciudad o con el nombre del local.'}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <ShopCard
            shop={item}
            saved={favorites.has(String(item.id))}
            onPress={() => router.push({ pathname: '/shop/[id]', params: { id: String(item.id) } })}
            onToggleSaved={() => favorites.toggle(String(item.id))}
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
  safe: { flex: 1, backgroundColor: 'white' },
  lead: { paddingHorizontal: 20, marginBottom: 12, fontSize: 26, fontWeight: '700' },
  searchBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F3F3F3',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  search: { flex: 1, fontSize: 16, height: 50 },
  filters: { paddingHorizontal: 20, gap: 8, paddingBottom: 12 },
  chip: { paddingHorizontal: 14, height: 36, borderRadius: 18, backgroundColor: '#F3F3F3', justifyContent: 'center' },
  chipActive: { backgroundColor: '#111' },
  chipText: { fontSize: 13, fontWeight: '700' },
  chipTextActive: { color: 'white' },
  status: { marginVertical: 12 },
  error: { paddingHorizontal: 20, marginBottom: 8, color: '#8A2B2B' },
  emptyBox: { paddingTop: 28 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  empty: { fontSize: 15, color: '#555', lineHeight: 21 },
});

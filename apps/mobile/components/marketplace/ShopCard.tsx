import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import type { Shop } from '@/lib/types';

const ACCENTS = ['#1C1C1C', '#3D2B1F', '#1E3A2F', '#243044', '#4A3728'];

function accent(id: number) {
  return ACCENTS[Math.abs(id) % ACCENTS.length];
}

function monogram(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

type Props = {
  shop: Shop;
  saved: boolean;
  onPress: () => void;
  onToggleSaved: () => void;
};

export const ShopCard = memo(function ShopCard({ shop, saved, onPress, onToggleSaved }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${shop.name}, ${shop.city}`}
        testID={`shop-card-${shop.id}`}
      >
        <View style={[styles.hero, { backgroundColor: accent(shop.id) }]}>
          <Text style={styles.monogram}>{monogram(shop.name)}</Text>
          <Text style={styles.city}>{shop.city}</Text>
        </View>
        <View style={styles.body}>
          <Text style={styles.name}>{shop.name}</Text>
          <Text style={styles.meta}>
            {shop.street} {shop.streetNumber}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.chairs}>{shop.chair} {shop.chair === 1 ? 'sillón' : 'sillones'}</Text>
            <Text style={styles.cta}>Ver turnos</Text>
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={onToggleSaved}
        hitSlop={8}
        style={styles.heart}
        accessibilityRole="button"
        accessibilityLabel={saved ? `Quitar ${shop.name} de guardadas` : `Guardar ${shop.name}`}
      >
        <AntDesign name={saved ? 'heart' : 'hearto'} size={18} color="white" />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F6F6F6',
  },
  hero: {
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogram: {
    color: 'white',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 2,
  },
  city: { color: 'rgba(255,255,255,0.82)', marginTop: 2, fontSize: 13 },
  body: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 },
  name: { fontSize: 18, fontWeight: '700' },
  meta: { marginTop: 4, color: '#444', fontSize: 14 },
  footer: { marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chairs: { color: '#666', fontSize: 13 },
  cta: { fontWeight: '700', fontSize: 13 },
  heart: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
});

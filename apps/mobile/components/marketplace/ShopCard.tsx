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
            {shop.phone ? ` · ${shop.phone}` : ''}
          </Text>
          <Text style={styles.chairs}>{shop.chair} {shop.chair === 1 ? 'sillón' : 'sillones'}</Text>
        </View>
      </Pressable>
      <Pressable
        onPress={onToggleSaved}
        hitSlop={10}
        style={styles.heart}
        accessibilityRole="button"
        accessibilityLabel={saved ? `Quitar ${shop.name} de guardadas` : `Guardar ${shop.name}`}
      >
        <AntDesign name={saved ? 'heart' : 'hearto'} size={20} color="white" />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F6F6F6',
  },
  hero: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogram: {
    color: 'white',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 2,
  },
  city: {
    color: 'white',
    marginTop: 4,
  },
  body: {
    padding: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    marginTop: 4,
    color: '#444',
  },
  chairs: {
    marginTop: 6,
    color: '#666',
  },
  heart: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
});

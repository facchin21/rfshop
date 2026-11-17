import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { formatARS } from '@/lib/money';
import { priceFrom } from '@/lib/shops';
import type { Shop } from '@/lib/types';

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
        accessibilityLabel={`${shop.name}, ${shop.neighborhood}`}
        testID={`shop-card-${shop.id}`}
      >
      <View style={[styles.hero, { backgroundColor: shop.accent }]}>
        <Text style={styles.monogram}>{shop.monogram}</Text>
        <Text style={styles.neighborhood}>{shop.neighborhood}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{shop.name}</Text>
          <Text style={styles.rating}>★ {shop.rating.toFixed(2)}</Text>
        </View>
        <Text style={styles.meta}>
          {shop.reviewCount} reseñas · {shop.address}
        </Text>
        <Text style={styles.tagline}>{shop.tagline}</Text>
        <Text style={styles.price}>desde {formatARS(priceFrom(shop))}</Text>
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
    height: 148,
    padding: 16,
    justifyContent: 'flex-end',
  },
  monogram: {
    position: 'absolute',
    top: 18,
    left: 16,
    color: 'white',
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: 1,
  },
  neighborhood: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  heart: {
    position: 'absolute',
    zIndex: 2,
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  body: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  meta: {
    marginTop: 4,
    color: '#5F5F5F',
    fontSize: 13,
  },
  tagline: {
    marginTop: 6,
    fontSize: 14,
  },
  price: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
  },
});

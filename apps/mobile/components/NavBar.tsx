import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const items = [
  { href: '/explore' as const, label: 'Explorar', icon: 'magnify' as const },
  { href: '/index_app' as const, label: 'Turnos', icon: 'calendar' as const },
  { href: '/welcome' as const, label: 'Cuenta', icon: 'user' as const },
];

export const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.menu, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {items.map((item) => {
        const active = pathname === item.href;
        const color = active ? '#111' : '#8A8A8A';
        return (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href)}
            style={styles.item}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
          >
            {item.icon === 'user' ? (
              <FontAwesome name="user" size={22} color={color} />
            ) : (
              <MaterialCommunityIcons name={item.icon} size={24} color={color} />
            )}
            <Text style={[styles.label, { color }]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E6E6E6',
  },
  item: {
    minWidth: 76,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: { fontSize: 11, fontWeight: '700' },
});

import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const items = [
  { href: '/explore' as const, label: 'Explorar', icon: 'magnify' as const },
  { href: '/index_app' as const, label: 'Reservas', icon: 'calendar' as const },
  { href: '/welcome' as const, label: 'Cuenta', icon: 'user' as const },
];

export const NavBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.menu, { paddingBottom: 14 + insets.bottom }]}>
      {items.map((item) => {
        const active = pathname === item.href;
        const color = active ? 'white' : '#8E8E8E';
        return (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href)}
            style={styles.containerIcon}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
          >
            {item.icon === 'user' ? (
              <FontAwesome name="user" size={26} color={color} />
            ) : (
              <MaterialCommunityIcons name={item.icon} size={28} color={color} />
            )}
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
    paddingTop: 14,
    backgroundColor: 'black',
  },
  containerIcon: {
    minWidth: 64,
    alignItems: 'center',
  },
});

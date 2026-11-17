import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
  variant?: 'solid' | 'ghost';
  testID?: string;
};

export function Button({ label, onPress, disabled, busy, variant = 'solid', testID }: Props) {
  const solid = variant === 'solid';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || busy}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled || busy) }}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        solid ? styles.solid : styles.ghost,
        (disabled || busy) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {busy ? (
        <ActivityIndicator color={solid ? 'white' : 'black'} />
      ) : (
        <Text style={[styles.label, solid ? styles.solidLabel : styles.ghostLabel]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  solid: { backgroundColor: '#111' },
  ghost: { backgroundColor: 'white', borderWidth: 1.5, borderColor: '#111' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.82 },
  label: { fontSize: 16, fontWeight: '700' },
  solidLabel: { color: 'white' },
  ghostLabel: { color: '#111' },
});

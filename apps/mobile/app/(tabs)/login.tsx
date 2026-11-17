import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import LoginComponent from '@/components/login/LoginComponent';

export default function Login() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.top}>
        <Pressable onPress={() => router.back()} style={styles.back} accessibilityRole="button" accessibilityLabel="Volver">
          <AntDesign name="arrowleft" size={20} color="black" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.kicker}>Barber</Text>
        <LoginComponent />
        <Pressable onPress={() => router.push('/selectrol')} style={styles.link} accessibilityRole="button">
          <Text style={styles.linkText}>Crear cuenta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'white' },
  top: { paddingHorizontal: 16, paddingVertical: 8 },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { paddingHorizontal: 24, paddingBottom: 32 },
  kicker: { fontFamily: 'Arizonia', fontSize: 42, lineHeight: 52, marginBottom: 4 },
  link: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  linkText: { fontWeight: '700' },
});

import { StyleSheet, View, Text } from 'react-native';
import { useText } from '@/hooks/useText';
import { router } from 'expo-router';


export default function HomeScreen() {
  const title: string = 'Barber'
  const { displayedText } = useText(title);

  setTimeout(() => {
    router.push("/welcome");
  }, 5000)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{displayedText}</Text>
      <Text style={styles.subtitle}>tu corte al instante</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontFamily: "Arizonia",
    textAlign: "center",
    fontSize: 80,
  },
  subtitle: {
    fontSize: 18,
    marginTop: -30,
    marginBottom: 30,
  },
});

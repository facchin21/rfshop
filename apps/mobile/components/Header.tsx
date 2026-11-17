import { StyleSheet, Text, View } from 'react-native';
import type { ReactNode } from 'react';

export const Header = ({ right }: { right?: ReactNode }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.titleHeader}>Barber</Text>
      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  titleHeader: {
    fontFamily: 'Arizonia',
    fontSize: 34,
    lineHeight: 42,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 6,
    paddingHorizontal: 20,
  },
});

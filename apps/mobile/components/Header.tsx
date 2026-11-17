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
    fontSize: 40,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 7,
    paddingHorizontal: 22,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#CACACA',
  },
});

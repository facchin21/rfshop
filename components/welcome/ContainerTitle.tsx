import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ContainerTitle() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Barber</Text>
            <Text style={styles.subtitle}>tu corte al instante</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        fontFamily: "Poppins",
        alignItems: 'center',
        justifyContent: 'center',
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

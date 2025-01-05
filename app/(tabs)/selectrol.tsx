import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Fontisto from '@expo/vector-icons/Fontisto';
import { router } from 'expo-router';

export default function selectrol() {
    const toggleSubmit = (type: String) => {
        if (type) {
            router.push({
                pathname: '/register',
                params: { rol: type }
            })

        } else {
            Alert.alert("Por favor seleccionar un Rol, para poder registrarse.")
        }
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => toggleSubmit('user')}>
                <View style={styles.card}>
                    <FontAwesome5 name="user-alt" size={50} color="black" />
                    <Text style={styles.title}>Usuario</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleSubmit('barber')}>
                <View style={styles.card}>
                    <Fontisto name="scissors" size={50} color="black" />
                    <Text style={styles.title}>Barbero</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 190,
        height: 180,
        marginBottom: 20,
        borderRadius: 12,
        backgroundColor: "#eee",
    },
    title: {
        fontSize: 22,
        fontWeight: '500',
        marginTop: 5,
    },
})
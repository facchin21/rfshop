import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useRef } from 'react'
import { Colors } from '@/constants/Colors';
import { Google } from '@/assets/SVG/Google';

export default function LoginComponent() {
    const inputRef = useRef(null);

    const cleanInput = () => {
        console.log('INPUT', inputRef);
    }

    return (
        <>
            <Text style={styles.title}>Iniciar Sesion</Text>

            {/* Input de correo */}
            <View style={styles.inputContainer}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="jaime@gmail.com"
                    placeholderTextColor="#999"
                />
                <AntDesign name="closecircleo" size={20} color="#999"
                    onPress={cleanInput} />
            </View>

            {/* Botón Continuar */}
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

            {/* Separador */}
            <View style={styles.separator}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
            </View>

            {/* Botones adicionales */}
            <TouchableOpacity style={styles.secondaryButton}>
                <MaterialCommunityIcons name="email " size={24} color='black' />
                <Text style={styles.secondaryButtonText}>Continue with Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
                <Google />
                <Text style={styles.secondaryButtonText}>Continue with Google</Text>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        fontFamily: "Poppins",
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 25,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'none',
    },
    input: {
        flex: 1,
        height: 45,
        fontSize: 16,
        color: "#000",
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 15,
        width: "100%",
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    separator: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "black",
    },
    orText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 10,
        color: "black",
    },
    secondaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eee",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: "100%",
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 10,
        color: Colors.light.detail,
    },
});
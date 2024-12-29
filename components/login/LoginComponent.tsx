import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import React, { useRef } from 'react'

export default function LoginComponent() {
    const inputRef = useRef(null);

    const cleanInput = () => {
        console.log('INPUT',inputRef);
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
                <AntDesign name="closecircle" size={20} color="#999"
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
                <Text style={styles.secondaryButtonText}>Continue with Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.secondaryButton, styles.googleButton]}>
                <AntDesign name="google" size={20} color="#000" />
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
        height: 40,
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
        backgroundColor: "#ccc",
    },
    orText: {
        marginHorizontal: 10,
        color: "#999",
        fontSize: 14,
    },
    secondaryButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
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
        color: "#000",
    },
    googleButton: {
        flexDirection: "row",
        justifyContent: "flex-start",
    },
});
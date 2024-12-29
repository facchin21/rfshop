import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity, Image } from 'react-native';
import ContainerTitle from '@/components/welcome/ContainerTitle';
import { ButtonLink } from '@/components/welcome/Link';
import Icon from '@/assets/images/Icon.png';
import { Link } from 'expo-router';
import React from 'react';

const { width } = Dimensions.get("window");

export default function Welcome() {
    return (
        <View style={styles.container}>
            {/* Header del container */}
            <ContainerTitle />
            <Image
                source={Icon}
                style={styles.icon}
            />
            {/* Button para el login */}
            <ButtonLink text="¿Ya tenes cuenta?" link={'/login'} />
            {/* Button de Login */}
            <TouchableOpacity style={styles.button}>
                <Pressable>
                    <Link href='/login'>
                        <Text style={styles.textButton}>Iniciar Sesion</Text>
                    </Link>
                </Pressable>
            </TouchableOpacity>
            {/* Button para crear cuenta */}
            <ButtonLink text="Crear cuenta" link={'/register'} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        fontFamily: "Poppins",
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '50%',
        marginTop: 12,
        paddingVertical: 12,
        borderRadius: 10,
        backgroundColor: 'black',
    },
    textButton: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    },
    icon: {
        width: 150,
        height: 150,
        marginBottom: 10,
    },
});

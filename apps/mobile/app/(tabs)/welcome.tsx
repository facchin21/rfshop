import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import ContainerTitle from '@/components/welcome/ContainerTitle';
import { ButtonLink } from '@/components/welcome/Link';
// import { Image } from '@/components/welcome/Image';
import { Link, router } from 'expo-router';

const { width } = Dimensions.get("window");

export default function Welcome() {
    return (
        <View style={styles.container}>
            {/* Header del container */}
            <ContainerTitle />
            {/* Componente Imagen rotando */}
            <Text style={{fontSize: 100}}>💈</Text>
            {/* <Image /> */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/explore')}
                accessibilityRole="button"
            >
                <Text style={styles.textButton}>Explorar barberías</Text>
            </TouchableOpacity>
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
            <ButtonLink text="Crear cuenta" link={'/selectrol'} />
            <ButtonLink text="Ver mis reservas" link={'/index_app'} />
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
        marginLeft: -30,
    },
});

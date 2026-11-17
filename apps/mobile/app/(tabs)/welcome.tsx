import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import ContainerTitle from '@/components/welcome/ContainerTitle';
import { ButtonLink } from '@/components/welcome/Link';
import { router } from 'expo-router';
import { useSession } from '@/context/Session';

const { width } = Dimensions.get("window");

export default function Welcome() {
    const session = useSession();
    return (
        <View style={styles.container}>
            <ContainerTitle />
            <Text style={{fontSize: 100}}>💈</Text>
            {session.user ? <Text style={styles.hello}>Hola, {session.user.name}</Text> : null}
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/explore')}
                accessibilityRole="button"
            >
                <Text style={styles.textButton}>Explorar barberías</Text>
            </TouchableOpacity>
            {session.user ? (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        session.logout();
                        router.replace('/welcome');
                    }}
                    accessibilityRole="button"
                >
                    <Text style={styles.textButton}>Salir</Text>
                </TouchableOpacity>
            ) : (
                <ButtonLink text="Iniciar sesión" link={'/login'} />
            )}
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
    hello: {
        marginBottom: 8,
        fontSize: 16,
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

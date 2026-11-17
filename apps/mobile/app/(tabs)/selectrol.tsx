import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ContainerTitle from "@/components/welcome/ContainerTitle";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import { router } from 'expo-router';

interface RoleCardProps {
    title: string;
    icon: string;
    IconLibrary: any;
    role: string;
}

const RoleCard = ({ title, icon, IconLibrary, role }: RoleCardProps) => {
    const navigateToRegister = (role: string) => {
        if (role) {
            router.push({
                pathname: '/register',
                params: { role }
            })
        } else {
            Alert.alert("Por favor seleccionar un Rol, para poder registrarse.")
        }
    }
    return (
        <TouchableOpacity onPress={() => navigateToRegister(role)}>
            <View style={styles.card}>
                <IconLibrary name={icon} size={50} color="black" />
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default function selectrol() {

    return (
        <View style={styles.container}>
            <ContainerTitle />
            <View style={{ marginVertical: 10 }}>
                <Text>Elegir el tipo de cuenta</Text>
            </View>

            <RoleCard title={'Usuario'} icon='user-alt' IconLibrary={FontAwesome5} role="user" />
            <RoleCard title={'Barbero'} icon='scissors' IconLibrary={Fontisto} role="barber" />

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
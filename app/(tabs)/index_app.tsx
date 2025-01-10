import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ImageBanner from '@/assets/images/banner-barber.png'
import { NavBar } from "@/components/NavBar";
import { Header } from "@/components/Header";
import { Image } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

export default function index_app() {

    return (
        <View style={styles.container}>
            {/* Componente Navbar */}
            <NavBar />
            {/* Componente Header */}
            <Header />
            {/* Componente Proximas Reservas */}
            <View style={styles.card}>
                <Text style={styles.title}>Proximas Reservas</Text>
                <View style={styles.containerImage}>
                    <Image source={ImageBanner} style={styles.image} />
                </View>
                <Text style={styles.location}>Av. Rivadavia 2322</Text>
                <Text style={styles.hour}>Jueves 28 a las 17:15hs</Text>
                <TouchableOpacity style={styles.button}>
                    <AntDesign name="message1" size={24} color="white" />
                    <Text style={styles.textButton}>Mensajes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.containerPlus}>
                    <Text style={styles.textPlus}>+ 3</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        fontFamily: "Poppins",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        position: 'relative',
        width: '90%',
        alignItems: 'center',
        justifyContent: "center",
        paddingVertical: 20,
        borderRadius: 12,
        backgroundColor: '#F0F0F0'
    },
    title: {
        fontSize: 20,
        paddingVertical: 8,
    },
    containerImage: {
        width: "100%",
        alignItems: 'center',
        justifyContent: "center"
    },
    image: {
        width: '90%',
        borderRadius: 12
    },
    location: {
        fontSize: 16,
        paddingVertical: 7,
    },
    hour: {
        fontSize: 14,
    },
    button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        width: '60%',
        paddingVertical: 12,
        marginVertical: 12,
        borderRadius: 12,
        backgroundColor: 'black',
    },
    textButton: {
        fontSize: 16,
        marginLeft: 10,
        color: "white",
    },
    containerPlus: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: '100%',
        backgroundColor: 'black'
    },
    textPlus: {
        fontSize: 16,
        color: 'white'
    },
})
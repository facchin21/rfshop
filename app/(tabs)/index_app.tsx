import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get('window');

export default function index_app() {

    return (
        <View style={styles.container}>
            <View style={styles.menu}>
                <TouchableOpacity style={styles.containerIcon}>
                    <MaterialCommunityIcons name="email" size={30} color='white' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.containerIcon}>
                    <MaterialCommunityIcons name="email" size={30} color='white' />
                </TouchableOpacity>
                <TouchableOpacity style={styles.containerIcon}>
                    <MaterialCommunityIcons name="email" size={30} color='white' />
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    menu: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width,
        paddingVertical: 20,
        paddingHorizontal: 30,
        backgroundColor: 'black'
    },
    containerIcon: {
    }
})
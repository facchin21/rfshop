import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons"
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native"

const { width } = Dimensions.get('window');

export const NavBar = () => {
    return (
        <View style={styles.menu}>
            <TouchableOpacity style={styles.containerIcon}>
                <MaterialCommunityIcons name="email" size={30} color='white' />
            </TouchableOpacity>
            <TouchableOpacity style={styles.containerIcon}>
                <MaterialCommunityIcons name="home-circle" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.containerIcon}>
                <FontAwesome name="user" size={30} color="white" />
            </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
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
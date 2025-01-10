import { AntDesign } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export const Header = () => {
    return (
        <View style={styles.header}>
            <Text style={styles.titleHeader}>Barber</Text>
            <TouchableOpacity>
                <AntDesign name="hearto" size={30} color="black" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

    titleHeader: {
        fontFamily: 'Arizonia',
        fontSize: 40,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingTop: 7,
        paddingHorizontal: 25,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#CACACA',
    }
})
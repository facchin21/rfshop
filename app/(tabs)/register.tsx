import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ContainerTitle from "@/components/welcome/ContainerTitle";
import { MaterialIcons } from "@expo/vector-icons";
import { Modal } from "@/components/Modal";
import { useState } from "react";

export default function register() {
    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => setVisible((prevState) => !prevState);
    return (
        <View style={styles.container}>
            <ContainerTitle />
            <Modal>
                <Text style={styles.title}>Bienvenido a Barber</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Ingresa tu password..."
                        secureTextEntry={!visible}
                    />
                    <TouchableOpacity onPress={toggleVisibility}>
                        <MaterialIcons
                            name={visible ? 'visibility-off' : 'visibility'}
                            size={30}
                            color='gray'
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 35,
    },
    title: {
        fontFamily: "Poppins",
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 25,
        marginTop: 15,
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
})
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ContainerTitle from "@/components/welcome/ContainerTitle";
import { MaterialIcons } from "@expo/vector-icons";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import { useGlobalSearchParams } from "expo-router";

export default function singin() {
    const params = useGlobalSearchParams();
    const [visible, setVisible] = useState(false);
    const toggleVisibility = () => setVisible((prevState) => !prevState);
    return (
        <View style={styles.container}>
            <ContainerTitle />
            <Modal>
                <Text style={styles.title}>Bienvenido a Barber</Text>
                <Text style={styles.email}>{params.email}</Text>
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
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.textButton}>Ingresar</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={styles.forgot}>Recuperar contraseña</Text>
                </TouchableOpacity>
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
        marginTop: 15,
    },
    email: {
        fontSize: 12,
        fontWeight: '300',
        marginTop: -8,
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
        height: 45,
        fontSize: 16,
        color: "#000",
    },
    button: {
        width: '100%',
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: 'black'
    },
    textButton: {
        fontSize: 18,
        fontWeight: "400",
        color: 'white'
    },
    forgot: {
        fontWeight: '300',
        marginTop : 12,
        borderBottomWidth : 1,
        borderBottomColor : 'gray',
    }
})
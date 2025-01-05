import ContainerTitle from "@/components/welcome/ContainerTitle";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Modal } from "@/components/Modal";
import { useRef, useState } from "react";

export default function recover() {
    const [email, setEmail] = useState('');
    const inputRef = useRef<TextInput>(null);

    const cleanInput = () => {
        if (inputRef.current) {
            inputRef.current.clear();
        }
    }

    return (
        <View style={styles.container}>
            <ContainerTitle />
            <Modal>
                <Text style={styles.title}>Recupera tu contraseña</Text>
                <View style={styles.containerInput}>
                    <TextInput
                        value={email}
                        ref={inputRef}
                        onChangeText={setEmail}
                        placeholder="john@gmail.com"
                        placeholderTextColor="#999"
                    />
                    <TouchableOpacity onPress={cleanInput}>
                        <AntDesign name="closecircleo" size={24} color="#999" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Enviar mensaje</Text>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom : 15,
    },
    containerInput: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingHorizontal: 12,
        borderWidth: 2,
        borderRadius: 12,
    },
    button: {
        width: '80%',
        marginTop : 25,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: "black",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: "center",
        color: 'white',
    },
})
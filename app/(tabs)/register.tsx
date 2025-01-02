import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import ContainerTitle from "@/components/welcome/ContainerTitle";
import { AntDesign } from "@expo/vector-icons";
import { Modal } from "@/components/Modal";
import { useState } from "react";

export default function register() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [password, setPassword] = useState('')
    const [secondPassword, setSeccondPassword] = useState('')


    return (
        <ScrollView style={styles.container}>
            <ContainerTitle />
            <Modal>
                <Text style={styles.title}>Crea tu cuenta</Text>
                {/* Correo */}
                <View>
                    <Text style={styles.label}>Correo</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="jhon@gmail.com"
                            style={styles.input}
                        />
                        <AntDesign name="closecircleo" size={24} color="gray" />
                    </View>
                </View>
                {/* Nombre */}
                <View>
                    <Text style={styles.label}>Nombre</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Jhon"
                            style={styles.input}
                        />
                        <AntDesign name="closecircleo" size={24} color="gray" />
                    </View>
                </View>
                {/* Apellido */}
                <View>
                    <Text style={styles.label}>Apellido</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder="Jhon"
                            style={styles.input}
                        />
                        <AntDesign name="closecircleo" size={24} color="gray" />
                    </View>
                </View>
                {/* Password */}
                <View>
                    <Text style={styles.label}>Contraseña</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="*******"
                            style={styles.input}
                            secureTextEntry={true}
                        />
                        <AntDesign name="closecircleo" size={24} color="gray" />
                    </View>
                </View>
                {/* Confirm Password */}
                <View>
                    <Text style={styles.label}>Confirmar contraseña</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={secondPassword}
                            onChangeText={setSeccondPassword}
                            placeholder="*******"
                            style={styles.input}
                            secureTextEntry={true}
                        />
                        <AntDesign name="closecircleo" size={24} color="gray" />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 35,
    },
    title: {
        fontFamily: "Poppins",
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 25,
        marginTop: 15,
    },
    label: {
        fontSize: 15,
        marginBottom: 5,
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
import ContainerTitle from "@/components/welcome/ContainerTitle";
import LoginComponent from "@/components/login/LoginComponent";
import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Modal } from "@/components/Modal";
import React from "react";

export default function login() {
    return (
        <View style={styles.container}>
            {/* Logo y título */}
            <ContainerTitle />
            {/* Modal Con el contenido de la pantalla login */}
            <Modal>
                <LoginComponent />
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop : 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.light.background,
    },
});

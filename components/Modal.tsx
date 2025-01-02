import { StyleSheet, Dimensions } from "react-native";
import { BlurView } from "expo-blur"

interface ModalProps {
    children: React.ReactNode;
}

const { width } = Dimensions.get('window');

export const Modal = ({ children }: ModalProps) => {
    return (
        <BlurView intensity={50} tint="light" style={styles.modal}>
            {children}
        </BlurView>
    )
}

const styles = StyleSheet.create({
    modal: {
        width: width,
        padding: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        alignItems: "center",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        backdropFilter: "blur(7.5px)",
        backgroundColor: "rgba(210, 199, 199, 0.6)",
    },
});
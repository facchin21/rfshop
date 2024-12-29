import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { Link } from 'expo-router';

interface Props {
    link : String;
    text : String;
};

export const ButtonLink = ({ link, text } : Props) => {
    return (
        <TouchableOpacity style={{ marginTop: 7 }}>
            <Link href={link}>
                <Text style={styles.text}>{text}</Text>
            </Link>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

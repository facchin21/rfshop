import { Animated, StyleSheet } from "react-native"
import Icon from '@/assets/images/Icon.png';
import { useEffect, useRef } from "react";

export const Image = () => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const spin = () => {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                })
            ).start();
        };
        spin();
    }, [spinValue]);

    const spinAnimation = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });
    return (
        <Animated.Image
            source={Icon}
            style={[
                styles.icon,
                {
                    transform: [
                        { perspective: 1000 },
                        { rotateY: spinAnimation },
                    ],
                },
            ]}
        />
    )
}

const styles = StyleSheet.create({

    icon: {
        width: 150,
        height: 150,
        marginBottom: 10,
        marginLeft: -30,
    },
});

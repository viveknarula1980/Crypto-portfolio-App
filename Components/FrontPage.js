import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';

const FrontPage = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/Images/new-bg.png')} // Background image
                style={StyleSheet.absoluteFillObject} // Cover the entire container
            />
            <Animated.Image
                source={require('../assets/Images/C.png')}
                style={[styles.logo, { opacity: fadeAnim }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 200,
        height: 200,
    },
});

export default FrontPage;

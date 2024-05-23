import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { AuthSession } from 'expo';

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
    const [request, response, promptAsync] = AuthSession.useIdTokenAuthRequest({
        clientId: '486898591806-ep7lgqc65h3qsice06hbpeomudr6jjdc.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            // You can now use the id_token to authenticate with your backend
        }
    }, [response]);

    const onPress = React.useCallback(async () => {
        try {
            await promptAsync();
        } catch (err) {
            console.error('Google authentication error', err);
        }
    }, [promptAsync]);

    return (
        <ImageBackground source={require('./../../assets/Images/01-screen-bg.png')} resizeMode="cover" style={styles.backgroundImage}>
            <View style={styles.main}>
                <View style={styles.image}>
                    <Image source={require('.../../../assets/Images/top-image.png')} style={styles.imageStyle} />
                </View>
                <View style={styles.content}>
                    <Text style={styles.heading}>Track your coin using the simplest method</Text>
                    <Text style={styles.paragraph}>Have you ever found that managing your cryptocurrency is rather difficult? You are now free from concern.</Text>
                    <TouchableOpacity onPress={onPress} style={styles.button}>
                        <Text style={styles.buttonText}>Get Started</Text>
                        <Image source={require('.../../../assets/Images/arrow-right.png')} style={styles.buttonImage} />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    image: {
        marginBottom: 30,
    },
    imageStyle: {
        maxWidth: '100%',
        height: 300,
    },
    content: {
        alignItems: 'center',
    },
    heading: {
        fontSize: 30,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 40,
    },
    paragraph: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#a67850',
        borderRadius: 10,
        width: 228,
        height: 56,
    },
    buttonText: {
        color: '#fff',
        fontSize: 22,
    },
    buttonImage: {
        marginLeft: 10,
    },
});

export default LoginScreen;

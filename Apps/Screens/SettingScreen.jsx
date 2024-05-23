import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, TextInput, Button, ImageBackground, Linking } from 'react-native';

const SettingScreen = () => {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('John');
    const [email, setEmail] = useState('sam@gmail.com');

    const handleLogout = () => {
        // Implement your logout logic here
    };

    const handleEditProfile = () => {
        setShowModal(true);
    };

    const handleSaveChanges = () => {
        setShowModal(false);
    };

    const handlePrivacyPolicy = () => {
        Linking.openURL('https://www.privacypolicytemplate.net/');
    };

    return (
        <ImageBackground source={require('../../assets/Images/new-bg.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/Images/pro-pic.png')}
                        style={styles.profileImage}
                    />
                    <Text style={styles.username}>{name}</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>
                <View style={styles.body}>
                    <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                        <Image source={require('../../assets/Images/profile.png')} style={styles.icon} />
                        <Text style={styles.buttonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Image source={require('../../assets/Images/password.png')} style={styles.icon} />
                        <Text style={styles.buttonText}>Change Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Image source={require('../../assets/Images/help.png')} style={styles.icon} />
                        <Text style={styles.buttonText}>Help</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handlePrivacyPolicy}
                    >
                        <Image source={require('../../assets/Images/policy.png')} style={styles.icon} />
                        <Text style={styles.buttonText}>Privacy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Image source={require('../../assets/Images/sign-out.png')} style={styles.icon} />
                        <Text style={styles.buttonTexts}>Sign out</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                value={name}
                                onChangeText={setName}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                            />
                            <Button title="Save Changes" onPress={handleSaveChanges} />
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#1c69ff'
    },
    email: {
        fontSize: 16,
        color: '#777',
    },
    body: {
        flex: 1,
    },
    button: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        marginLeft: 10,
    },
    buttonTexts: {
        color: '#dc4c64',
        fontSize: 16,
    },
    logoutButton: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
});

export default SettingScreen;

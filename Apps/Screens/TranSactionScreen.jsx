import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, ScrollView, ImageBackground } from 'react-native';

const TransactionScreen = () => {
    const [searchText, setSearchText] = useState('');
    const transactions = [
        { name: 'Received Bitcoin', coin: 'BTC', amount: '+0.005', date: '01 Jan 2024', profit: true },
        { name: 'Sold Bitcoin', coin: 'BTC', amount: '-0.002', date: '02 Jan 2024', profit: false },
        { name: 'Received Bitcoin', coin: 'BTC', amount: '+0.005', date: '01 Jan 2024', profit: true },
        { name: 'Sold Bitcoin', coin: 'BTC', amount: '-0.002', date: '02 Jan 2024', profit: false },
        { name: 'Received Bitcoin', coin: 'BTC', amount: '+0.005', date: '01 Jan 2024', profit: true },
        { name: 'Sold Bitcoin', coin: 'BTC', amount: '-0.002', date: '02 Jan 2024', profit: false },
        { name: 'Sold Bitcoin', coin: 'BTC', amount: '-0.002', date: '02 Jan 2024', profit: false },
        { name: 'Sold Bitcoin', coin: 'BTC', amount: '-0.004', date: '09 Jan 2024', profit: false },
        { name: 'Sold Bitcoin', coin: 'BTC', amount: '-0.008', date: '05 Jan 2024', profit: true },
        // Add more dummy data here
    ];

    return (
        <ImageBackground source={require('.../../../assets/Images/new-bg.png')} style={styles.background}>
            <View style={styles.container}>
                <Text style={styles.title}>Transaction</Text>
                <Text style={styles.header}>Search By Name</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />
                <ScrollView contentContainerStyle={styles.transactionContainer}>
                    {transactions.map((transaction, index) => (
                        <View style={styles.transaction} key={index}>
                            <Image source={require('.../../../assets/Images/btc.png')} style={styles.logo} />
                            <View style={styles.details}>
                                <Text style={styles.name}>{transaction.name}</Text>
                                <Text style={styles.coin}>{transaction.coin}</Text>
                            </View>
                            <View style={styles.amountDateContainer}>
                                <Text style={styles.amount}>{transaction.amount} {transaction.coin}</Text>
                                <Text style={styles.date}>Date: {transaction.date}</Text>
                            </View>
                            <View style={styles.arrow}>
                                {transaction.profit ? (
                                    <Image source={require('.../../../assets/Images/top.png')} style={styles.arrowImage} />
                                ) : (
                                    <Image source={require('.../../../assets/Images/down.png')} style={styles.arrowImage} />
                                )}
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: 20,
    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },

    // centerText: {
    //     textAlign: 'center',
    // },
    header: {
        fontSize: 23,
        // fontWeight: "bold",
        margin: 10,
        color: 'black', // Add this property to set text color to white
        marginTop: 20,
        lineHeight: 23,
        fontFamily: 'serif',
        marginBottom: 5, // Set line height equal to font size (1:1 ratio)
    },
    transactionContainer: {
        alignItems: 'center',
    },
    transaction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10,
        width: '100%',
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    details: {
        flexDirection: 'column', // Changed to column direction
        justifyContent: 'center',
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    coin: {
        fontSize: 14,
        color: '#666',
    },
    amountDateContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 16,
        color: '#009900',
        marginBottom: 5,
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    arrow: {},
    arrowImage: {
        width: 20,
        height: 20,
    },
    searchInput: {
        height: 40,
        borderWidth: 2,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderColor: '#1c69ff',
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        marginLeft: 10,
    },
});

export default TransactionScreen;

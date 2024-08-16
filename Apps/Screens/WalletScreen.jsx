import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

const WalletScreen = () => {
  return (
    <ImageBackground source={require('.../../../assets/Images/new-bg.png')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.walletText}>Wallet</Text>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  walletText: {
    marginTop: 5,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default WalletScreen;

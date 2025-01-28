import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Platform, Image, TextInput, TouchableOpacity, Modal, Button, ImageBackground } from 'react-native';
import axios from 'axios';

import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import {
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.REWARDED_INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

const BitcoinPrice = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
        rewardedInterstitial.show();
      },
    );
    const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded interstitial ad straight away
    rewardedInterstitial.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  const [cryptoData, setCryptoData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coinHistory, setCoinHistory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('usd');

  // Define conversion rates for different currencies
  const conversionRates = {
    usd: 1,
    eur: 0.93,
    gbp: 0.80,
    inr: 83.38, // Example conversion rate, replace with actual rates
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const fetchCryptoData = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: selectedCurrency,
          per_page: 1000,
          page: 1,
        },
      });
      setCryptoData(response.data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
    }
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    fetchCryptoData();
  };

  const handleCoinPress = async (coinData) => {
    setSelectedCoin(coinData);
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinData.id}/market_chart`, {
        params: {
          vs_currency: selectedCurrency,
          days: 1,
        },
      });
      setCoinHistory(response.data.prices);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching coin history:', error);
    }
  };

  const handleDataPointClick = (data, index) => {
    setSelectedDataPoint(data[index]);
  };

  const renderItem = ({ item }) => {
    const priceDifference = item.price_change_24h;
    const percentageChange = ((priceDifference / item.current_price) * 100).toFixed(2);
    const trendColor = priceDifference >= 0 ? 'green' : 'red';
    const trendIcon = priceDifference >= 0 ? '▲' : '▼';

    const currencySymbols = {
      usd: '$',
      eur: '€',
      gbp: '£',
      inr: '₹',
    };

    const currencySymbol = currencySymbols[selectedCurrency] || '$';
    // Convert the current price to the selected currency
    const convertedPrice = item.current_price * conversionRates[selectedCurrency];

    return (
      <TouchableOpacity onPress={() => handleCoinPress(item)}>
        <View style={styles.item}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.trendline} />
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: trendColor }]}>{currencySymbol}{convertedPrice.toFixed(2)} {trendIcon}</Text>
            <Text style={[styles.percentage, { color: trendColor }]}>
              {priceDifference >= 0 ? `+${percentageChange}%` : `${percentageChange}%`}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require('.../../../assets/Images/new-bg.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Text style={styles.title}>Prices</Text>
        <Text style={styles.header}>Search By Name</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <View style={styles.currencyDropdown}>
          <Text>Select Currency:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCurrency}
              style={{ height: 50, width: 150 }}
              onValueChange={(itemValue) => handleCurrencyChange(itemValue)}>
              <Picker.Item label="USD - $ (Dollar)" value="usd" />
              <Picker.Item label="EUR - € (Euro)" value="eur" />
              <Picker.Item label="GBP - £ (Pound)" value="gbp" />
              <Picker.Item label="INR - ₹ (Rupee)" value="inr" />

            </Picker>
          </View>
        </View>
        <FlatList
          data={cryptoData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCoin?.name} Price Chart</Text>
              {coinHistory && (
                <View>
                  <LineChart
                    data={{
                      labels: coinHistory.map((item) => ''),
                      datasets: [{ data: coinHistory.map((item) => item[1]) }],
                    }}
                    width={300}
                    height={200}
                    withDots={false}
                    withInnerLines={false}
                    withOuterLines={false}
                    onDataPointClick={handleDataPointClick}
                    chartConfig={{
                      backgroundGradientFrom: '#fff',
                      backgroundGradientTo: '#fff',
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      strokeWidth: 2,
                    }}
                  />
                </View>
              )}
              <Button title="Close" onPress={() => setModalVisible(false)} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Add opacity to the background color
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingTop: Platform.OS === 'ios' ? 30 : 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    color: "blue",
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: '#1c69ff',
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10, // Add this property to set text color to white
  },
  currencyDropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 10,
    marginBottom: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  pickerContainer: {
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1c69ff',
  },
  list: {
    paddingHorizontal: 20,
    border: 2,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  trendline: {
    width: 1,
    height: '50%',
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    marginRight: 10,
  },
  percentage: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  header: {
    fontSize: 24,
    // fontWeight: "bold",
    margin: 10,
    color: 'black', 
    marginTop: 20,
    lineHeight: 23,
    marginBottom: 5,
  },
});

export default BitcoinPrice;

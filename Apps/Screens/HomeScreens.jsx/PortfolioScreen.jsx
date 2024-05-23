import React, { useState, useEffect, createContext, useContext } from "react";
import { View, Text, TextInput, StyleSheet, FlatList, ImageBackground, Modal, Image, Button, TouchableOpacity } from "react-native";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const SelectedCoinsContext = createContext();

const Tab = createMaterialTopTabNavigator();

const PortfolioScreen = () => {
  const [selectedCoins, setSelectedCoins] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadFromLocalStorage = async () => {
      try {
        const storedData = await SecureStore.getItemAsync("selectedCoins");
        if (storedData !== null) {
          setSelectedCoins(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error loading data from local storage:", error);
      }
    };

    loadFromLocalStorage();
  }, []);

  useEffect(() => {
    const saveToLocalStorage = async () => {
      try {
        await SecureStore.setItemAsync("selectedCoins", JSON.stringify(selectedCoins));
      } catch (error) {
        console.error("Error saving data to local storage:", error);
      }
    };

    saveToLocalStorage();
  }, [selectedCoins]);

  useEffect(() => {
    const fetchData = async (retryDelay = 1000, retryCount = 0) => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              per_page: 110,
            },
          },
        );
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 429) {
          const nextRetryDelay = Math.min(retryDelay * 2, 60000);
          setTimeout(() => fetchData(nextRetryDelay, retryCount + 1), retryDelay);

        } else {
          console.error("Unhandled error:", error);
        }
      }
    };

    fetchData();
  }, []);

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
    setModalVisible(true);
  };

  const handleAddButtonPress = () => {
    setSelectedCoins(prevSelectedCoins => {
      const existingCoinIndex = prevSelectedCoins.findIndex(c => c.id === selectedCoin.id);
      if (existingCoinIndex !== -1) {
        const updatedSelectedCoins = [...prevSelectedCoins];
        updatedSelectedCoins[existingCoinIndex] = {
          ...updatedSelectedCoins[existingCoinIndex],
          quantity: updatedSelectedCoins[existingCoinIndex].quantity + quantity
        };
        return updatedSelectedCoins;
      } else {
        return [...prevSelectedCoins, { ...selectedCoin, quantity }];
      }
    });
    setModalVisible(false);
  };

  return (
    <SelectedCoinsContext.Provider value={{ selectedCoins, setSelectedCoins }}>
      <Tab.Navigator
        tabBarOptions={{
          style: {
            marginTop: 30,
          },
        }}
      >
        <Tab.Screen name="Portfolio" component={Portfolio} />
        <Tab.Screen name="AddedCoins">
          {() => <AddedCoins portfolio={portfolio} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SelectedCoinsContext.Provider>
  );
};

const Portfolio = () => {
  const { setSelectedCoins } = useContext(SelectedCoinsContext);
  const [portfolio, setPortfolio] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async (retryDelay = 1000, retryCount = 0) => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              per_page: 110,
            },
          },
        );
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response && error.response.status === 429) {
          const nextRetryDelay = Math.min(retryDelay * 2, 60000);
          setTimeout(() => fetchData(nextRetryDelay, retryCount + 1), retryDelay);

        } else {
          console.error("Unhandled error:", error);
        }
      }
    };

    fetchData();
  }, []);

  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
    setModalVisible(true);
  };

  const handleAddButtonPress = () => {
    setSelectedCoins(prevSelectedCoins => {
      const existingCoinIndex = prevSelectedCoins.findIndex(c => c.id === selectedCoin.id);
      if (existingCoinIndex !== -1) {
        const updatedSelectedCoins = [...prevSelectedCoins];
        updatedSelectedCoins[existingCoinIndex] = {
          ...updatedSelectedCoins[existingCoinIndex],
          quantity: updatedSelectedCoins[existingCoinIndex].quantity + quantity
        };
        return updatedSelectedCoins;
      } else {
        return [...prevSelectedCoins, { ...selectedCoin, quantity }];
      }
    });
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={require('../../../assets/Images/new-bg.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Crypto Portfolio Tracker</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Coin by Name"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
          prefix={<Icon name="search" size={24} color="black" />}
        />
        <FlatList
          data={portfolio.filter((coin) =>
            coin.name.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectCoin(item)} style={styles.coinContainer}>
              <View style={styles.coinInfo}>
                <Image
                  style={styles.coinIcon}
                  source={{ uri: item.image }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                  <Text>{item.name}</Text>
                  <Text style={styles.coinLastName}>{item.symbol.toUpperCase()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={[styles.modalContainer, styles.modalBottom]}>
            <View style={styles.modalView}>
              <View style={styles.coinInfo}>
                <Image
                  style={styles.coinIcon}
                  source={{ uri: selectedCoin?.image }}
                />
                <View style={{ flex: 1 }}>
                  <Text>{selectedCoin?.name}</Text>
                  <Text style={styles.coinLastNames}>{selectedCoin?.symbol.toUpperCase()}</Text>
                </View>
                <Text style={{ textAlign: 'right', position: 'absolute', top: 25, right: 0 }}>${(selectedCoin?.current_price * quantity).toFixed(2)}</Text>
                <Text style={{ textAlign: 'right' }}>{selectedCoin?.symbol.toUpperCase()}</Text>

              </View>
              <TextInput
                style={styles.input}
                placeholder="Quantity"
                keyboardType="numeric"
                value={String(quantity)}
                onChangeText={(text) => setQuantity(parseInt(text) || 0)}
              />
              <View style={styles.buttonContainer}>
                <Button title="Add Coin" onPress={handleAddButtonPress} />
                <View style={{ marginVertical: 10 }} />
                <Button title="Close" onPress={() => setModalVisible(false)} color="#dc4c64" />
              </View>
            </View>
          </View>
        </Modal>




      </View>
    </ImageBackground>
  );
};

const AddedCoins = ({ portfolio }) => {
  const { selectedCoins, setSelectedCoins } = useContext(SelectedCoinsContext);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);

  useEffect(() => {
    let totalValue = 0;
    selectedCoins.forEach(coin => {
      const coinData = portfolio.find(item => item.id === coin.id);
      if (coinData) {
        totalValue += coinData.current_price * coin.quantity;
      }
    });
    setTotalPortfolioValue(totalValue);
  }, [selectedCoins, portfolio]);

  const calculateProfitLoss = (currentPrice, previousPrice, quantity) => {
    const profitLoss = (currentPrice - previousPrice) * quantity;
    return profitLoss.toFixed(2);
  };

  const handleDeleteCoin = (coinId) => {
    setSelectedCoins(prevSelectedCoins => prevSelectedCoins.filter(c => c.id !== coinId));
  };

  return (
    <View style={styles.tabContentContainer}>
      <LinearGradient
        colors={['rgba(27, 105, 255, 1)', 'rgba(75, 157, 255, 1)']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.tabHeaderContainer}
      >
        <Text style={[styles.header, { color: 'white' }]}>Total Portfolio Value: ${totalPortfolioValue.toFixed(2)}</Text>
      </LinearGradient>
      <FlatList
        data={selectedCoins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const coinData = portfolio.find(coin => coin.id === item.id);
          const profitLoss = coinData ? calculateProfitLoss(coinData.current_price, coinData.price_change_24h, item.quantity) : 0;
          return (
            <View style={styles.addedCoinContainer}>
              <View style={styles.coinContainer}>
                <View style={styles.coinInfo}>
                  <Image
                    style={styles.coinIcon}
                    source={{ uri: item.image }}
                  />
                  <View>
                    <Text>{item.name}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Text>Current Price: ${(coinData?.current_price || 0).toFixed(2)}</Text>
                    <Text>24h Change: ${(coinData?.price_change_24h || 0).toFixed(2)}</Text>
                    <Text>Profit/Loss (24h): ${profitLoss}</Text>
                    <Text>Market Cap: ${(coinData?.market_cap || 0).toFixed(2)}</Text>
                  </View>
                </View>
                <Icon name="times" size={24} color="red" onPress={() => handleDeleteCoin(item.id)} style={styles.deleteIcon} />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: 'black',
  },
  coinContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    justifyContent: "center",
  },
  coinInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  coinLastName: {
    marginRight: 10,
    // marginLeft: 300,
  },
  // coinLastNames: {
  //   alignSelf: 'flex-end',
  //   marginTop: -11,
  //   position: 'absolute',
  //   marginLeft: 10,

  // },
  searchInput: {
    height: 40,
    borderColor: '#1c69ff',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: '#1c69ff',
    width: "100%"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 5,
    color: " #1c69ff"
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,

    padding: 35,
    alignItems: 'center',
    elevation: 5,
    borderColor: "#1c69ff",
    borderWidth: 1,
  },
  input: {
    height: 40,
    borderColor: '#1c69ff',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 300,
    borderRadius: 5,
    marginTop: 4,
  },


  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5, // Adjust as needed
    borderColor: "#1c69ff"
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  tabContentContainer: {
    flex: 1,
    padding: 20,
  },
  tabHeaderContainer: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 20,
  },
  addedCoinContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteIcon: {
    position: 'absolute',
    top: -7,
    right: -1,
  },
});

export default PortfolioScreen;

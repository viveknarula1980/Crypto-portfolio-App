import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PortfolioScreen from '../Screens/HomeScreens.jsx/PortfolioScreen';
import BitcoinPrice from '../Screens/BitcoinPrice';
import WalletScreen from '../Screens/WalletScreen';
import TranSactionScreen from '../Screens/TranSactionScreen';
import SettingScreen from '../Screens/SettingScreen';
import { Entypo, Octicons, AntDesign, Fontisto, Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    tabBar: {
        backgroundColor: 'blue',
        borderWidth: 2,
        borderColor: 'blue',
        borderBottomWidth: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 30,
        width: 'calc(100% - 20px)',
        marginHorizontal: 'auto',
        paddingVertical: 28,
        paddingHorizontal: 15,
    },
});

export default function TabNavigation() {
    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={{ headerShown: false }}
                tabBarOptions={{
                    style: styles.tabBar,
                }}
            >
                <Tab.Screen
                    name="Port"
                    component={PortfolioScreen}
                    options={{
                        tabBarLabel: ({ color }) => (
                            <Text style={{ color, fontSize: 12 }}>Portfolio</Text>
                        ),
                        tabBarIcon: ({ color, size }) => (
                            <Entypo name="home" size={24} color="black" />
                        ),
                    }}
                />
                <Tab.Screen
                    name='prices'
                    component={BitcoinPrice}
                    options={{
                        tabBarLabel: ({ color }) => (
                            <Text style={{ color: color, fontSize: 12 }}>Prices</Text>
                        ),
                        tabBarIcon: ({ color, size }) => (
                            <Octicons name="graph" size={24} color="black" />
                        )
                    }}
                />

                <Tab.Screen
                    name='Setting'
                    component={SettingScreen}
                    options={{
                        tabBarLabel: ({ color }) => (
                            <Text style={{ color: color, fontSize: 12 }}>Setting</Text>
                        ),
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="settings-outline" size={24} color="black" />
                        )
                    }}
                />


            </Tab.Navigator>
        </View>
    );
}

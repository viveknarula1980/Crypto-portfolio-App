import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './Apps/Navigation/TabNavigation';
import LoginScreen from './Apps/Screens/LoginScreen';
import SignUpScreen from './Apps/Screens/SignUpScreen';
import ForgotPasswordScreen from './Apps/Screens/ForgotPasswordScreen';
import SettingScreen from './Apps/Screens/SettingScreen';
import { useFonts } from 'expo-font';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import FrontPage from './Components/FrontPage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

const Stack = createStackNavigator();

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [showFrontPage, setShowFrontPage] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setIsLoggedIn(true);
      }
    };
    checkLoginStatus();

    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
      interstitial.show();
    });

    interstitial.load();

    const timer = setTimeout(() => {
      setShowFrontPage(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    'Outfit': require('./assets/Outfit/static/Outfit-Regular.ttf'),
    'Outfit-Bold': require('./assets/Outfit/static/Outfit-Bold.ttf'),
    'Outfit-Medium': require('./assets/Outfit/static/Outfit-Medium.ttf'),
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  const handleLogin = async (username, password) => {
    const storedUsername = await AsyncStorage.getItem('username');
    const storedPassword = await AsyncStorage.getItem('password');

    if (username === storedUsername && password === storedPassword) {
      setIsLoggedIn(true);
      await AsyncStorage.setItem('userToken', 'loggedIn');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  const handleSignUpSuccess = () => {
    alert('Account created successfully');
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {showFrontPage ? (
          <Stack.Screen name="FrontPage" component={FrontPage} options={{ headerShown: false }} />
        ) : (
          isLoggedIn ? (
            <>
              <Stack.Screen name="Main" component={TabNavigation} options={{ headerShown: false }} />
              <Stack.Screen name="Settings">
                {(props) => <SettingScreen {...props} onLogout={handleLogout} />}
              </Stack.Screen>
            </>
          ) : (
            <>
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {(props) => <SignUpScreen {...props} onSignUpSuccess={handleSignUpSuccess} />}
              </Stack.Screen>
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            </>
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigation from './Apps/Navigation/TabNavigation';
import LoginScreen from "./Apps/Screens/LoginScreen";
import { useFonts } from 'expo-font';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import FrontPage from './Components/FrontPage'; // Import FrontPage component

const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [showFrontPage, setShowFrontPage] = useState(true); // State to toggle between FrontPage and TabNavigation

  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoaded(true);
      interstitial.show();
    });

    // Start loading the interstitial straight away
    interstitial.load();

    // Clear the timeout and switch to TabNavigation after a delay
    const timer = setTimeout(() => {
      setShowFrontPage(false);
    }, 5000); // Change the delay time as needed (6000 milliseconds = 6 seconds)

    // Clear the timer to avoid memory leaks
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    'Outfit': require('./assets/Outfit/static/Outfit-Regular.ttf'),
    'Outfit': require('./assets/Outfit/static/Outfit-Bold.ttf'),
    'Outfit': require('./assets/Outfit/static/Outfit-Medium.ttf'),
  });

  if (!fontsLoaded || fontError) {
    // Return loading indicator or handle font loading error
    return null;
  }

  return (
    <NavigationContainer>
      {showFrontPage ? <FrontPage /> : <TabNavigation />}
    </NavigationContainer>
  );
}

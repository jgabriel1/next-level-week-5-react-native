import React from 'react';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';
import AppLoading from 'expo-app-loading';

import { Routes } from './routes';

export function App() {
  const [fontsLoaded] = useFonts({
    jost400: Jost_400Regular,
    jost600: Jost_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar />
      <View style={{ height: Constants.statusBarHeight }} />
      <Routes />
    </>
  );
}

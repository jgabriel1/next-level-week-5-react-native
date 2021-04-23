import React, { useEffect } from 'react';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';
import AppLoading from 'expo-app-loading';
import * as Notifications from 'expo-notifications';

import { Routes } from './routes';
import { PlantData } from './libs/storage';

export function App() {
  const [fontsLoaded] = useFonts({
    jost400: Jost_400Regular,
    jost600: Jost_600SemiBold,
  });

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      async notification => {
        const data = notification.request.content.data.plant as PlantData;

        console.log(data);
      },
    );

    return () => subscription.remove();
  }, []);

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

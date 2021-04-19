import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import Constants from 'expo-constants';

import { Welcome } from './pages/Welcome';

export function App() {
  return (
    <>
      <StatusBar />
      <View style={{ height: Constants.statusBarHeight }} />
      <Welcome />
    </>
  );
}

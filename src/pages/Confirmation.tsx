import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

import { Button } from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export interface ConfirmationParams {
  title: string;
  subtitle: string;
  buttonTitle: string;
  icon: 'smile' | 'hug';
  nextScreen: string;
}

const emojis = {
  hug: '🤗',
  smile: '😄',
};

export function Confirmation() {
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as ConfirmationParams;

  const handleMoveOn = () => {
    navigation.navigate(routeParams?.nextScreen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>{emojis[routeParams?.icon]}</Text>

        <Text style={styles.title}>{routeParams?.title}</Text>

        <Text style={styles.subtitle}>{routeParams?.subtitle}</Text>

        <View style={styles.footer}>
          <Button title={routeParams?.buttonTitle} onPress={handleMoveOn} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 30,
  },

  emoji: {
    fontSize: 72,
  },

  title: {
    marginTop: 16,
    fontSize: 22,
    lineHeight: 38,
    textAlign: 'center',
    fontFamily: fonts.heading,
    color: colors.heading,
  },

  subtitle: {
    fontFamily: fonts.text,
    textAlign: 'center',
    fontSize: 17,
    paddingVertical: 10,
    color: colors.heading,
  },

  footer: {
    width: '100%',
    paddingHorizontal: 50,
    marginTop: 20,
  },
});

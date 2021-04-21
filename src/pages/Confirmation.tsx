import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

import { Button } from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Confirmation() {
  const navigation = useNavigation();

  const handleMoveOn = () => {
    navigation.navigate('PlantSelect');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>😀</Text>

        <Text style={styles.title}>Prontinho!</Text>

        <Text style={styles.subtitle}>
          Agora vamos começar a cuidar das suas plantinhas com muito cuidado
        </Text>

        <View style={styles.footer}>
          <Button title="Confirmar" onPress={handleMoveOn} />
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

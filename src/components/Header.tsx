import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
  const [username, setUsername] = useState('');

  const loadUserName = async () => {
    const storedUsername = await AsyncStorage.getItem('@Plantmanager:username');

    if (storedUsername) {
      setUsername(storedUsername);
    }
  };

  useEffect(() => {
    loadUserName();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{username}</Text>
      </View>

      <Image
        style={styles.image}
        source={{ uri: 'https://www.github.com/jgabriel1.png' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },

  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },

  userName: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 40,
  },

  image: {
    width: 72,
    height: 72,
    borderRadius: 40,
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { Header } from '../components/Header';
import { EnvironmentButton } from '../components/EnvironmentButton';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { api } from '../services/axios';
import { PlantCardPrimary } from '../components/PlantCardPrimary';

interface Environment {
  key: string;
  title: string;
}

interface Plant {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: string[];
  frequency: {
    times: number;
    repeat_every: string;
  };
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);

  const fetchEnvironments = async () => {
    const { data } = await api.get('plants_environments', {
      params: {
        _sort: 'title',
        _order: 'asc',
      },
    });

    setEnvironments([{ key: 'all', title: 'Todos' }, ...data]);
  };

  const fetchPlants = async () => {
    const { data } = await api.get('plants', {
      params: {
        _sort: 'name',
        _order: 'asc',
      },
    });

    setPlants(data);
  };

  useEffect(() => {
    fetchEnvironments();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>você quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          data={environments}
          renderItem={({ item }) => (
            <EnvironmentButton key={item.key} title={item.title} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={plants}
          renderItem={({ item }) => (
            <PlantCardPrimary
              key={String(item.id)}
              data={{ name: item.name, photo: item.photo }}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingHorizontal: 20,
  },

  title: {
    marginTop: 16,
    fontSize: 18,
    lineHeight: 20,
    color: colors.heading,
    fontFamily: fonts.heading,
  },

  subtitle: {
    fontSize: 18,
    lineHeight: 20,
    color: colors.heading,
    fontFamily: fonts.text,
  },

  environmentList: {
    height: 40,
    paddingBottom: 4,
    marginVertical: 32,
    marginHorizontal: 20,
  },

  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
});

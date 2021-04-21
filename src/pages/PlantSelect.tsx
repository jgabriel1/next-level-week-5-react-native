import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { Header } from '../components/Header';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { Load } from '../components/Load';
import { PlantCardPrimary } from '../components/PlantCardPrimary';

import { api } from '../services/axios';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

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
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSelectEnvironment = (environment: string) => {
    setSelectedEnvironment(environment);
  };

  const filteredPlants = useMemo(() => {
    if (selectedEnvironment === 'all') return plants;

    return plants.filter(plant =>
      plant.environments.includes(selectedEnvironment),
    );
  }, [plants, selectedEnvironment]);

  useEffect(() => {
    fetchEnvironments();
  }, []);

  useEffect(() => {
    fetchPlants().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <Load />;
  }

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
            <EnvironmentButton
              key={item.key}
              title={item.title}
              active={item.key === selectedEnvironment}
              onPress={() => handleSelectEnvironment(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
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

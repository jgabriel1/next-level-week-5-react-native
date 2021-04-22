import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { PlantData } from '../libs/storage';

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

export function PlantSelect() {
  const navigation = useNavigation();

  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [plants, setPlants] = useState<PlantData[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchEnvironments = async () => {
    const { data } = await api.get('plants_environments', {
      params: {
        _sort: 'title',
        _order: 'asc',
      },
    });

    setEnvironments([{ key: 'all', title: 'Todos' }, ...data]);
  };

  const fetchPlants = useCallback(async () => {
    const { data } = await api.get('plants', {
      params: {
        _sort: 'name',
        _order: 'asc',
        _page: currentPage,
        _limit: 8,
      },
    });

    if (!data) {
      setLoadingMore(true);

      return;
    }

    if (currentPage > 1) {
      setPlants(current => [...current, ...data]);
    } else {
      setPlants(data);
    }

    setIsLoading(false);
    setLoadingMore(false);
  }, [currentPage]);

  const handleSelectEnvironment = (environment: string) => {
    setSelectedEnvironment(environment);
  };

  const handleSelectPlant = (plant: PlantData) => {
    navigation.navigate('PlantSave', { plant });
  };

  const handleFetchMore = async (distance: number) => {
    if (distance < 1) return;

    setLoadingMore(true);
    setCurrentPage(current => current + 1);

    await fetchPlants();
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
  }, [fetchPlants]);

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
              onPress={() => handleSelectPlant(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : null
          }
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

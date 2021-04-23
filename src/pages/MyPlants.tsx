import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, FlatList, Alert } from 'react-native';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { loadAllPlants, PlantData, removePlant } from '../libs/storage';

import { Header } from '../components/Header';
import { PlantCardSecondary } from '../components/PlantCardSecondary';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import waterdrop from '../assets/waterdrop.png';
import { Load } from '../components/Load';

export function MyPlants() {
  const [plants, setPlants] = useState<PlantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState('');

  const loadStoredData = async () => {
    const storedPlants = await loadAllPlants();

    const nextPlant = storedPlants[0];

    const nextTime = formatDistance(
      nextPlant.dateTimeNotification.getTime(),
      new Date().getTime(),
      { locale: ptBR },
    );

    setNextWatered(`Não esqueça de regar a ${nextPlant.name} em ${nextTime}!`);

    setPlants(storedPlants);
    setIsLoading(false);
  };

  const handleRemovePlant = async (plant: PlantData) => {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            await removePlant(plant);

            setPlants(current => current.filter(p => p.id !== plant.id));
          } catch {
            Alert.alert('Não foi possível remover.');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    loadStoredData();
  }, []);

  if (isLoading) {
    return <Load />;
  }

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={waterdrop} style={styles.spotlightImage} />

        <Text style={styles.spotlightText}>{nextWatered}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={plants}
          keyExtractor={plant => String(plant.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              data={item}
              onRemove={() => handleRemovePlant(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },

  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  spotlightImage: {
    width: 60,
    height: 60,
  },

  spotlightText: {
    flex: 1,
    color: colors.blue,
    textAlign: 'justify',
    fontFamily: fonts.text,
    marginHorizontal: 20,
    fontSize: 18,
  },

  plants: {
    flex: 1,
    width: '100%',
  },

  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isAfter } from 'date-fns';

export type PlantData = {
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
  dateTimeNotification: Date;
};

type StoragePlantData = {
  [id: string]: {
    data: PlantData;
  };
};

const PLANTS_STORAGE_KEY = '@Plantmanager:plants';

export const savePlant = async (plant: PlantData) => {
  try {
    const data = await AsyncStorage.getItem(PLANTS_STORAGE_KEY);
    const storedPlants = data ? (JSON.parse(data) as StoragePlantData) : {};

    Object.assign(storedPlants, {
      [plant.id]: { data: plant },
    });

    await AsyncStorage.setItem(
      PLANTS_STORAGE_KEY,
      JSON.stringify(storedPlants),
    );
  } catch (err) {
    throw new Error(err);
  }
};

export const loadAllPlants = async (): Promise<PlantData[]> => {
  try {
    const data = await AsyncStorage.getItem(PLANTS_STORAGE_KEY);
    const plants = data ? (JSON.parse(data) as StoragePlantData) : {};

    const sortedPlants = Object.keys(plants)
      .map(plantId => {
        const { data: plant } = plants[plantId];

        return {
          ...plant,
          dateTimeNotification: new Date(plant.dateTimeNotification),
          hour: format(new Date(plant.dateTimeNotification), 'HH:mm'),
        };
      })
      .sort((a, b) =>
        isAfter(a.dateTimeNotification, b.dateTimeNotification) ? 1 : -1,
      );

    return sortedPlants;
  } catch (err) {
    throw new Error(err);
  }
};

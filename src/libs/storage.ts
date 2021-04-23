import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
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
  hour: string;
};

export type StoragePlantData = {
  [id: string]: {
    data: PlantData;
    notificationId: string;
  };
};

const PLANTS_STORAGE_KEY = '@Plantmanager:plants';

export const savePlant = async (plant: PlantData) => {
  try {
    const nextTime = new Date(plant.dateTimeNotification);
    const now = new Date();

    const { times, repeat_every } = plant.frequency;
    if (repeat_every === 'week') {
      const interval = Math.trunc(7 / times);

      nextTime.setDate(now.getDate() + interval);
    } else {
      nextTime.setDate(nextTime.getDate() + 1);
    }

    const seconds = Math.abs(
      Math.ceil((now.getTime() - nextTime.getTime()) / 1000),
    );

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Heeey, 🌱',
        body: `Está na hora de cuidar da sua ${plant.name}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          plant,
        },
      },
      trigger: {
        seconds: seconds < 60 ? 60 : seconds,
        repeats: true,
      },
    });

    const data = await AsyncStorage.getItem(PLANTS_STORAGE_KEY);
    const storedPlants = data ? (JSON.parse(data) as StoragePlantData) : {};

    Object.assign(storedPlants, {
      [plant.id]: {
        data: plant,
        notificationId,
      },
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

export const removePlant = async (plant: PlantData) => {
  try {
    const data = await AsyncStorage.getItem(PLANTS_STORAGE_KEY);
    const storedPlants = data ? (JSON.parse(data) as StoragePlantData) : {};

    await Notifications.cancelScheduledNotificationAsync(
      storedPlants[plant.id].notificationId,
    );

    delete storedPlants[plant.id];

    await AsyncStorage.setItem(
      PLANTS_STORAGE_KEY,
      JSON.stringify(storedPlants),
    );
  } catch (err) {
    throw new Error(err);
  }
};

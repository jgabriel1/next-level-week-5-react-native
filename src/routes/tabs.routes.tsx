import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import { Platform } from 'react-native';
import { PlantSelect } from '../pages/PlantSelect';
import { MyPlants } from '../pages/MyPlants';

import colors from '../styles/colors';

const { Navigator, Screen } = createBottomTabNavigator();

export function AuthRoutes() {
  return (
    <Navigator
      tabBarOptions={{
        activeTintColor: colors.green,
        inactiveTintColor: colors.heading,
        labelPosition: 'beside-icon',
        style: {
          height: Platform.OS === 'ios' ? 88 : 64,
          alignItems: 'center',
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
        },
      }}
    >
      <Screen
        name="Nova Planta"
        component={PlantSelect}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="add-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Screen
        name="Minhas Plantas"
        component={MyPlants}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons
              name="format-list-bulleted"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Navigator>
  );
}

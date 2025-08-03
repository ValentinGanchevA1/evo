import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import MapScreen from './../screens/main/MapScreen';
import ProfileScreen from './../screens/main/ProfileScreen';
import  MainTabParamList  from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * The main tab navigator for the application after a user is authenticated.
 * It provides navigation to the primary features of the app.
 */
const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          } else {
            iconName = 'alert-circle'; // Fallback icon
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Hiding headers as screens can manage their own
      })}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Map' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

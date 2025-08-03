// src/utils/permissions.ts
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { LocationPermission } from "@/types";

export const requestLocationPermission = async (): Promise<LocationPermission> => {
  if (Platform.OS === 'android') {
    return requestAndroidLocationPermission();
  } else {
    return requestIOSLocationPermission();
  }
};

const requestAndroidLocationPermission = async (): Promise<LocationPermission> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to show nearby users.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return { granted: true, type: 'whenInUse' };
    } else {
      return { granted: false, type: 'denied' };
    }
  } catch (err) {
    console.error('Location permission error:', err);
    return { granted: false, type: 'denied' };
  }
};

const requestIOSLocationPermission = async (): Promise<LocationPermission> => {
  try {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

    switch (result) {
      case RESULTS.GRANTED:
        return { granted: true, type: 'whenInUse' };
      case RESULTS.DENIED:
        return { granted: false, type: 'denied' };
      case RESULTS.BLOCKED:
        Alert.alert(
          'Location Permission Required',
          'Please enable location access in Settings',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return { granted: false, type: 'denied' };
      default:
        return { granted: false, type: 'denied' };
    }
  } catch (err) {
    console.error('iOS location permission error:', err);
    return { granted: false, type: 'denied' };
  }
};

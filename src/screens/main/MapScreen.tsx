import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
// FIX: Use the established '@/' path alias for consistency and correctness.
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLocationManager } from '@/store/hooks/useLocationManager';
import { fetchNearbyData, setMapRegion } from '@/store/slices/mapSlice';

/**
 * The main map screen of the application.
 * It displays the user's location, fetches and shows nearby users and products,
 * and allows the user to explore the map.
 */
const MapScreen: React.FC = () => {
  // --- Redux State and Dispatch ---
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { nearbyUsers, nearbyProducts, isLoading: isFetchingData } = useAppSelector(
    (state) => state.map,
  );

  // --- Location and Region Management ---
  const { region, setRegion, isInitializing, locationError } = useLocationManager(user, dispatch);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Cleanup the debounce timer on component unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // --- Event Handlers ---

  /**
   * Handles the event when the user stops moving the map.
   * It dispatches actions to update the Redux store and fetch new data
   * for the visible area, using a debounce to prevent excessive API calls.
   */
  const handleRegionChangeComplete = useCallback(
    (newRegion: Region) => {
      setRegion(newRegion);
      dispatch(setMapRegion(newRegion));

      // Clear any existing timer
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Set a new timer to fetch data after a short delay
      debounceTimeout.current = setTimeout(() => {
        // A simple radius calculation, can be made more sophisticated
        const radius = Math.max(newRegion.latitudeDelta, newRegion.longitudeDelta) * 69; // Rough conversion to miles
        dispatch(
          fetchNearbyData({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
            radius: radius,
          }),
        );
      }, 750); // 750ms debounce delay
    },
    [dispatch, setRegion],
  );

  // --- Render Logic ---

  // Render loading state while getting initial location
  if (isInitializing || !region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.infoText}>Finding your location...</Text>
      </View>
    );
  }

  // Render error state if location permissions were denied or failed
  if (locationError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Could not get location:</Text>
        <Text style={styles.errorTextDetail}>{locationError.message}</Text>
      </View>
    );
  }

  // Render the map
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Render markers for nearby users */}
        {nearbyUsers.map((u) => (
          <Marker
            key={`user-${u.id}`}
            coordinate={{ latitude: u.latitude, longitude: u.longitude }}
            title={u.username}
            pinColor="blue"
          />
        ))}

        {/* Render markers for nearby products */}
        {nearbyProducts.map((p) => (
          <Marker
            key={`product-${p.id}`}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name}
            description={`$${p.price}`}
            pinColor="green"
          />
        ))}
      </MapView>

      {/* Show a loading indicator when fetching new map data */}
      {isFetchingData && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  infoText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6c757d',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d9534f',
    textAlign: 'center',
  },
  errorTextDetail: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 60, // Position below status bar
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default MapScreen;

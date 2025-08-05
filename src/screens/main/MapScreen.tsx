// src/screens/main/MapScreen.tsx - FIXED VERSION
import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useLocationManager } from '@/hooks/useLocationManager';
import { fetchNearbyData, setMapRegion } from '@/store/slices/mapSlice';
import { COLORS, SPACING } from '@/config/app';

const MapScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { nearbyUsers, nearbyProducts, isLoading: isFetchingData } = useAppSelector(
    (state) => state.map,
  );

  const { region, setRegion, isInitializing, locationError } = useLocationManager(user, dispatch);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // FIXED: Enhanced region change handler with better debouncing
  const handleRegionChangeComplete = useCallback(
    (newRegion: Region) => {
      setRegion(newRegion);
      dispatch(setMapRegion(newRegion));

      // Clear existing timer
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Debounced API call to prevent excessive requests
      debounceTimeout.current = setTimeout(() => {
        // Calculate radius based on region size (more accurate)
        const latDelta = newRegion.latitudeDelta;
        const lonDelta = newRegion.longitudeDelta;
        const radius = Math.max(latDelta, lonDelta) * 111000; // Convert to meters

        dispatch(
          fetchNearbyData({
            latitude: newRegion.latitude,
            longitude: newRegion.longitude,
            radius: Math.min(radius, 5000), // Cap at 5km
          }),
        );
      }, 1000); // Increased debounce delay
    },
    [dispatch, setRegion],
  );

  // Loading state
  if (isInitializing || !region) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.infoText}>Finding your location...</Text>
      </View>
    );
  }

  // Error state
  if (locationError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Location Error</Text>
        <Text style={styles.errorTextDetail}>{locationError.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        rotateEnabled
        pitchEnabled
      >
        {/* FIXED: Use displayName instead of username */}
        {nearbyUsers.map((u) => (
          <Marker
            key={`user-${u.id}`}
            coordinate={{ latitude: u.latitude, longitude: u.longitude }}
            title={u.displayName}
            description={`${Math.round(u.distance)}m away`}
            pinColor={COLORS.PRIMARY}
          />
        ))}

        {/* Product markers */}
        {nearbyProducts.map((p) => (
          <Marker
            key={`product-${p.id}`}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            title={p.name}
            description={`$${p.price} • ${Math.round(p.distance)}m away`}
            pinColor="green"
          />
        ))}
      </MapView>

      {/* Loading overlay */}
      {isFetchingData && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={COLORS.WHITE} />
        </View>
      )}
    </View>
  );
};

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
    padding: SPACING.LG,
    backgroundColor: COLORS.LIGHT,
  },
  infoText: {
    marginTop: SPACING.MD,
    fontSize: 16,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DANGER,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  errorTextDetail: {
    fontSize: 14,
    color: COLORS.GRAY,
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 60,
    right: SPACING.LG,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: SPACING.SM,
    borderRadius: 25,
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default MapScreen;

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';

const LocationScreen = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearestUsers, setNearestUsers] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      // Fetch nearest users' locations
      fetchNearestUsers(currentLocation.coords.latitude, currentLocation.coords.longitude);
    })();
  }, []);

  const fetchNearestUsers = async (latitude, longitude) => {
    try {
      const response = await fetch('http://24.199.96.243:8000/users_location');
      const data = await response.json();
      setNearestUsers(data);
    } catch (error) {
      console.error('Error fetching nearest users:', error);
    }
  };

  const handleRecenter = () => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Your location marker */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
          {/* Nearest users' markers */}
          {nearestUsers.map(user => (
            <Marker
              key={user.username}
              coordinate={{
                latitude: user.lat,
                longitude: user.lon,
              }}
              title={user.username}
              pinColor="red"
            />
          ))}
        </MapView>
      ) : (
        <Text>{errorMsg || 'Fetching location...'}</Text>
      )}
      <TouchableOpacity style={styles.recenterButton} onPress={handleRecenter}>
        <FontAwesome name="crosshairs" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('HomeScreen', { temp: route.params.temp })}
      >
        <FontAwesome name="home" size={30} color="darkmagenta" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  recenterButton: {
    position: 'absolute',
    top: 400,
    right: 10,
    backgroundColor: 'darkmagenta',
    borderRadius: 20,
    padding: 10,
    elevation: 5,
  },
  homeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default LocationScreen;

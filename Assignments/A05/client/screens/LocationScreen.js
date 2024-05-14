import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Alert, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';

const LocationScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [nearestUsers, setNearestUsers] = useState([]);
  const [searchParam, setSearchParam] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);

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
  
    return () => {
    };
  }, []);
  

  const fetchNearestUsers = async (latitude, longitude) => {
    try {
      const response = await fetch('http://24.199.96.243:8000/users_location');
      const data = await response.json();
      // Sort by distance and limit to top 10 nearest users
      const sortedNearestUsers = data.sort((a, b) => {
        const distanceA = calculateDistance(latitude, longitude, a.lat, a.lon);
        const distanceB = calculateDistance(latitude, longitude, b.lat, b.lon);
        return distanceA - distanceB;
      }).slice(0, 10);
      setNearestUsers(sortedNearestUsers);
    } catch (error) {
      console.error('Error fetching nearest users:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
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

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://24.199.96.243:8000/location?search_param=${searchParam}`);
      const userData = await response.json();
      if (userData.lon && userData.lat) {
        // Found user, log and display marker on map
        console.log('User found:', userData);
        // Update nearest users with the found user plus existing nearest users
        setNearestUsers([...nearestUsers, userData]);
        // Close the drawer
        setDrawerOpen(false);
        // Focus on the marker of the searched user
        mapRef.current.animateToRegion({
          latitude: userData.lat,
          longitude: userData.lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } else {
        // User not found, display error message
        setErrorMsg('User not found');
        Alert.alert('User not found', 'Please try searching again.');
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      setErrorMsg('Error searching for user');
      Alert.alert('Error', 'An error occurred while searching for the user. Please try again later.');
    }
  };

  const handleSearchFocus = () => {
    setDrawerOpen(true);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Icon */}
      <TouchableOpacity style={styles.searchIcon} onPress={handleSearchFocus}>
        <FontAwesome name="search" size={24} color="green" />
      </TouchableOpacity>
      {/* Search Drawer */}
      {drawerOpen && (
        <View style={styles.drawer}>
          <TextInput
            ref={searchInputRef}
            style={styles.input}
            placeholder="Enter username"
            value={searchParam}
            onChangeText={text => setSearchParam(text)}
            autoCapitalize="none" // Disable auto-capitalization
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
      )}
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
          {nearestUsers.map((user, index) => (
            <Marker
              key={`${user.username}_${index}`}
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
  searchIcon: {
    position: 'absolute',
    top: 500, // Adjusted top value
    right: 20,
    zIndex: 1, // Ensure search icon is on top
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    elevation: 10,
    zIndex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default LocationScreen;

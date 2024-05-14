import React, { useState, useEffect } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const SearchScreen = ({ navigation ,route}) => {
  const { username } = route.params;

  const [candies, setCandies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    searchCandies();
  };

  const renderCandyItem = ({ item }) => (
    <View style={styles.candyContainer}>
      <Image source={{ uri: item.img_url }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Price: ${item.price}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
    </View>
  );

  const searchCandies = async (minPrice, maxPrice, category, name) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (minPrice !== '') queryParams.append('min_price', minPrice);
      if (maxPrice !== '') queryParams.append('max_price', maxPrice);
      if (category !== '') queryParams.append('category', category);
      if (name !== '') queryParams.append('name', name);

      const url = `http://24.199.96.243:8000/candies?${queryParams}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCandies(data);
      setShowResults(true); // Show results after search
    } catch (error) {
      console.error('Error fetching candies:', error);
      Alert.alert('Error', 'Failed to fetch candies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer.Navigator drawerContent={() => <SideBar searchCandies={searchCandies} setShowResults={setShowResults} setLoading={setLoading} />}>
      <Drawer.Screen name="SearchContent">
        {(props) => (
          <View style={styles.container}>
            {showResults ? (
              <FlatList
                data={candies}
                renderItem={renderCandyItem}
                keyExtractor={(item) => item.id}
                style={styles.list}
                contentContainerStyle={{ paddingRight: 12 }} // Add paddingRight to move scrollbar to the far right

              />
            ) : (
              <Text style={styles.noResultsText}>No results yet. Perform a search to see results.</Text>
            )}

            {/* Navigation to HomeScreen */}
            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('HomeScreen',{username:username})}>
              <Ionicons name="home" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const SideBar = ({ searchCandies, setShowResults, setLoading }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.sideBar}>
        <TextInput
          style={styles.input}
          placeholder="Minimum Price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Maximum Price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Button title="Search" onPress={() => {
          searchCandies(minPrice, maxPrice, category, name);
          setShowResults(false); // Hide results until search
          setLoading(true); // Show loading indicator while searching
        }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Center items horizontally
    justifyContent: 'center', // Center items vertically
  },
  sideBar: {
    width: '80%',
    backgroundColor: 'lightgray',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'darkmagenta',
    borderBottomWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  list: {
    marginTop: 20,
    flexGrow: 1, // Allow the FlatList to grow within its container
  },
  candyContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    marginBottom: 5,
  },
  price: {
    color: 'green',
    marginBottom: 5,
  },
  category: {
    color: 'gray',
    marginBottom: 5,
  },
  homeButton: {
    backgroundColor: 'darkmagenta',
    padding: 15,
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: 'gray',
  },
});

export default SearchScreen;

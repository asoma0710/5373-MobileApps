import React, { useState, useEffect } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, Image, ActivityIndicator, Alert } from "react-native";
import SearchCriteriaDrawer from './SearchCriteriaDrawer'; // Import the search criteria drawer component

const SearchScreen = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [candies, setCandies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false); // State to control the visibility of the drawer

  const searchCandies = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        min_price: minPrice,
        max_price: maxPrice,
        category: category,
        name: name,
        description: description
      });

      const url = `http://24.199.96.243:8000/candies?${queryParams}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCandies(data);
    } catch (error) {
      console.error('Error fetching candies:', error);
      Alert.alert('Error', 'Failed to fetch candies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchCandies();
  };

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  const renderCandyItem = ({ item }) => (
    <View style={styles.candyContainer}>
      <Image source={{ uri: item.img_url }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Price: ${item.price}</Text>
      <Text style={styles.description}>{item.desc}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button title="Open Search Criteria" onPress={toggleDrawer} />
      <SearchCriteriaDrawer visible={showDrawer} onClose={toggleDrawer} /> {/* Render the search criteria drawer */}
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
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Search" onPress={handleSearch} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={candies}
          renderItem={renderCandyItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  list: {
    marginTop: 20,
  },
  candyContainer: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  price: {
    color: 'green',
  },
  description: {
    color: 'gray',
  },
});

export default SearchScreen;

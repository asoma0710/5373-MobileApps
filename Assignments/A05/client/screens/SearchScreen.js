import React, { useState, useEffect } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, ImageBackground, Alert, TouchableOpacity, Image } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const SearchScreen = ({ navigation }) => {
  const [candies, setCandies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://24.199.96.243:8000/categories');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to fetch categories. Please try again later.');
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (category !== '' && category !== 'None') queryParams.append('category', category);

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

  const renderCandyItem = ({ item }) => (
    <View style={styles.candyContainer}>
      <Image source={{ uri: item.img_url }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Price: ${item.price}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
    </View>
  );

  return (
    <Drawer.Navigator drawerContent={() => <SideBar categories={categories} setCategory={setCategory} handleSearch={handleSearch} setShowResults={setShowResults} setLoading={setLoading} />}>
      <Drawer.Screen name="SearchContent">
        {(props) => (
          <View style={styles.container}>
            <ImageBackground source={require('../assets/Search_page_background.jpg')} style={styles.backgroundImage}>
              {showResults ? (
                <FlatList
                  data={candies}
                  renderItem={renderCandyItem}
                  keyExtractor={(item) => item.id.toString()} // Ensure each item has a unique key
                  style={styles.list}
                  contentContainerStyle={{ paddingRight: 12 }} // Add paddingRight to move scrollbar to the far right
                />
              ) : (
                <Text style={styles.noResultsText}>No results yet. Perform a search to see results.</Text>
              )}
            </ImageBackground>
          </View>
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const Dropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onSelect(option === 'None' ? '' : option); // If "None" is selected, pass an empty string to indicate no category
    setIsOpen(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity onPress={toggleDropdown} style={styles.dropdownHeader}>
        <Text style={styles.dropdownHeaderText}>{selectedOption || 'Select a category'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownOptionsContainer}>
          <FlatList
            data={['None', ...options]} // Add 'None' as the first option
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleOptionSelect(item)} style={styles.dropdownOption}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
};

const SideBar = ({ categories, setCategory, handleSearch, setShowResults, setLoading }) => {
  return (
    <View style={styles.sideBar}>
      <Dropdown
        options={categories}
        onSelect={(category) => setCategory(category)}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Minimum Price"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Maximum Price"
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
        />
        <Button title="Search" onPress={() => {
          handleSearch();
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sideBar: {
    width: '80%',
    backgroundColor: 'lightgray',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
    marginBottom: 10,
  },
  dropdownHeader: {
    padding: 10,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dropdownHeaderText: {
    fontSize: 16,
  },
  dropdownOptionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    maxHeight: 150,
    zIndex: 2,
  },
  dropdownOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputContainer: {
    marginBottom: 10,
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
    flexGrow: 1,
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
  noResultsText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: 'magenta',
  },
});

export default SearchScreen;

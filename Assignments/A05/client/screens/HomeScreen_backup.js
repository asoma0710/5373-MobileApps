import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import UserProfile from './UserProfile';
import SearchScreen from './SearchScreen'; // Import SearchScreen component

const Drawer = createDrawerNavigator();

const HomeScreen = ({ navigation, route }) => {
  const { username } = route.params;

  const handleLogout = () => {
    // Handle logout logic here
    navigation.replace('SignIn');
  };

  const handleSearch = () => {
    navigation.navigate('SearchScreen',{ username: username });
  };

  const CustomDrawerContent = ({ navigation }) => (
    <DrawerContentScrollView>
      <DrawerItem
        label="UserProfile"
        onPress={() => navigation.navigate('UserProfile', { username: username })}
        
      />
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );

  return (
    <Drawer.Navigator drawerContent={() => <CustomDrawerContent navigation={navigation} />}>
      <Drawer.Screen name=" " >
        {() => (
          <View style={styles.container}>
            {/* Add your wallpaper */}
            <Image source={require('../assets/Background_wallpaper.avif')} style={styles.wallpaper} />
            
            {/* Button to navigate to SearchScreen */}
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="search" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </Drawer.Screen>
      <Drawer.Screen name="UserProfile" component={UserProfile} />
      <Drawer.Screen name="SearchScreen" component={SearchScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wallpaper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  searchButton: {
    backgroundColor: 'darkmagenta',
    padding: 15,
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

export default HomeScreen;

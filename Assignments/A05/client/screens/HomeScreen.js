import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

const HomeScreen = ({ setIsLoggedIn, isLoggedIn, user_name }) => {
  const [userData, setUserData] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://24.199.96.243:8000/Users/${user_name}`);

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [user_name]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowDrawer(false); // Close the drawer after logging out
  };

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
  };

  const handlePlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.didJustFinish) {
      videoRef.current.replayAsync(); // Start the video again when it stops
    }
  };

  return (
    <TouchableWithoutFeedback onPress={closeDrawer}>
      <View style={styles.container}>
        {isLoggedIn && (
          <TouchableOpacity onPress={toggleDrawer} style={styles.toggleButton}>
            <Ionicons name="menu-outline" size={24} color="black" />
          </TouchableOpacity>
          
        )}

        {showDrawer && (
          <DrawerContentScrollView style={styles.drawer} contentContainerStyle={styles.drawerContent}>
            <View style={styles.profileContainer}>
              <Ionicons name="person-circle-outline" size={50} color="blue" />
              <Image source={{ uri: userData?.profileImageUrl }} style={styles.profileImage} />
              <Text style={styles.username}>{userData?.username}</Text>
              <Text style={styles.email}>{userData?.email}</Text>
            </View>
            <DrawerItem
              label="Logout"
              onPress={handleLogout}
              icon={({ color, size }) => <Ionicons name="log-out" size={size} color={color} />}
              labelStyle={{ fontWeight: 'bold', color: 'red' }}
            />
          </DrawerContentScrollView>
        )}

        <Video
          ref={videoRef}
          source={require('../assets/candy_next-vmake.mp4')}
          style={styles.backgroundVideo}
          muted={true}
          repeat={true}
          rate={1.0}
          resizeMode="cover"
          shouldPlay={true}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
        <View style={styles.overlay}>
          <Text style={styles.welcomeText}>Welcome to Candy Land</Text>
        </View>

        {!isLoggedIn && (
          <View style={styles.signInTextContainer}>
            <Text style={styles.signInText}>Ready for a Sweet Adventure? Sign in!</Text>
          </View>
        )}

{isLoggedIn && (
          <View style={styles.signInTextContainer}>
            <Text style={styles.signedInText}>Go to the Search page and discover some candy delights!</Text>
          </View>
        )}
      </View>
      
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 36,
    color: 'pink',
    fontWeight: 'bold',
    position: 'absolute',
    top: '15%',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 200, // Adjust as needed
    backgroundColor: 'white',
    zIndex: 2,
    elevation: 10,
  },
  drawerContent: {
    paddingTop: 50,
    paddingLeft: 20,
  },
  profileContainer: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
  },
  signInTextContainer: {
    position: 'absolute',
    bottom: '25%', // Adjust as needed
    alignSelf: 'center',
  },
  signInText: {
    fontSize: 18,
    color: 'white', // Change the color to white
    fontStyle: 'italic',
    textShadowColor: 'rgba(1, 0, 0, 0.5)', // Add a subtle shadow effect
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  signedInText: {
    fontSize: 18,
    color: 'silver',
    fontWeight: 'bold',
    textShadowColor: 'rgba(1, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },

});

export default HomeScreen;

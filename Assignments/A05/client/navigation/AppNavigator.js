import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';


// Screens
import HomeScreen from '../screens/HomeScreen';
import LocationScreen from '../screens/LocationScreen';
import SearchScreen from '../screens/SearchScreen';
import SignIn from '../screens/SignIn'; // Import SignIn screen

// Screen names
const homeName = "Home";
const LocationScreenname = "Location";
const SearchScreenName = "Search";

const Tab = createBottomTabNavigator();

function AppNavigator() {


  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // State to track login status

  // Function to handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          initialRouteName={homeName}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              const rn = route.name;

              if (rn === homeName) {
                iconName = focused ? 'home' : 'home-outline';
              } else if (rn === LocationScreenname) {
                iconName = focused ? 'location' : 'location-outline';
              } else if (rn === SearchScreenName) {
                iconName = focused ? 'search' : 'search-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: 'magenta',
            inactiveTintColor: 'grey',
            labelStyle: { paddingBottom: 10, fontSize: 10 },
            style: { padding: 10, height: 70 }
          }}
        >
          <Tab.Screen name={homeName} component={HomeScreen} />
          <Tab.Screen name={LocationScreenname} component={LocationScreen} />
          <Tab.Screen name={SearchScreenName} component={SearchScreen} />
        </Tab.Navigator>
      ) : (
        <SignIn onLogin={handleLogin} /> // Pass onLogin function as prop to SignIn screen
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;

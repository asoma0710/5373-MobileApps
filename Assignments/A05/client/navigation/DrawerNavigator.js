// navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CustomDrawerContent from '../components/CustomDrawerContent';
import StackNavigator from './StackNavigator';
import HomeScreen from '../screens/HomeScreen';
import Location from '../screens/Location';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="StackNav"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="StackNav" component={StackNavigator} />
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Location" component={Location} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigator;

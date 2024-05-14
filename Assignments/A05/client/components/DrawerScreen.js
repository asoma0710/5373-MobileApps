import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DrawerScreen = ({ children, handleLogout }) => {
  return (
    <View style={{ flex: 1 }}>
      {/* Top Drawer */}
      <View style={styles.topDrawer}>
        <TouchableOpacity onPress={handleLogout} style={styles.signOutButton}>
          <MaterialCommunityIcons name="logout" size={24} color="red" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  topDrawer: {
    backgroundColor: 'lightgray',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signOutText: {
    color: 'red',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default DrawerScreen;

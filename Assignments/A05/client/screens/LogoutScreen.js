import React from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LogoutScreen = () => {
  const navigation = useNavigation();

  return (
    <Button
      title="Logout"
      onPress={() => navigation.navigate('SignIn')} // Navigate to the Sign In screen
    />
  );
};

export default LogoutScreen;

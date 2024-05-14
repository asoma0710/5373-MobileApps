import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity, Image } from 'react-native';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";



const SignIn = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (username === '' || password === '') {
      Alert.alert("All fields are required");
      return;
    }

    // Assuming the URL for login is correct
    const url = 'http://24.199.96.243:8000/login';
    const requestData = {
      first_name: '',
      last_name: '',
      username: username,
      email: '',
      password: password,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          Alert.alert('Success', 'Login successful!');
          navigation.navigate('HomeScreen', { username: username });
        } else {
          Alert.alert('Error', 'Invalid username or password.');
        }
      } else {
        Alert.alert('Error', 'Login failed. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred. Please try again later.');
    }
  };


  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      {/* Top Drawer */}
      <View style={styles.topDrawer}>
        <Text style={styles.logoText}>Creepy Candy</Text>
      </View>
      
      <View style={{ marginVertical: 100 }}>
        <View style={styles.imageContainer}>
          <Image source={require("../assets/Creepy_Candy.jpg")} style={styles.imageStyles} />
        </View>
        <View style={{ marginHorizontal: 24 }}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.signupInput}
            value={username}
            onChangeText={text => setUsername(text)}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={{ marginHorizontal: 24 }}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.signupInput}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity onPress={handleLogin} style={styles.buttonStyle}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <Text style={styles.signupText}>Not yet registered?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.linkText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  topDrawer: {
    backgroundColor: 'lightgray',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  signupText: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    color: '#8e93a1',
    marginBottom: 10
  },
  signupInput: {
    borderBottomWidth: 0.5,
    height: 48,
    borderBottomColor: "#8e93a1",
    marginBottom: 30
  },
  buttonStyle: {
    backgroundColor: "darkmagenta",
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    marginHorizontal: 15,
    borderRadius: 15
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  imageStyles: {
    width: 100,
    height: 100,
    marginVertical: 20
  },
  linkText: {
    fontSize: 16,
    color: 'darkred',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  forgotPasswordText: {
    fontSize: 12,
    textAlign: 'center'
  }
});

export default SignIn;

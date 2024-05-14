import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

const CameraScreen = ({ navigation }) => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [capturedImageUri, setCapturedImageUri] = useState(null);
  const cameraRef = useRef(null);
  const [imageUris, setImageUris] = useState([]);

  useEffect(() => {
    handleCameraPermission();
    listFilesInDirectory();
  }, []);

  const handleCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const fileUri = FileSystem.documentDirectory + 'capturedImage_' + Date.now() + '.jpg';
      await FileSystem.moveAsync({
        from: photo.uri,
        to: fileUri,
      });
      setCapturedImageUri(fileUri); // Store the captured image URI
      listFilesInDirectory();
    }
  };

  const switchCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const listFilesInDirectory = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
      setImageUris(files.map(file => FileSystem.documentDirectory + file));
    } catch (error) {
      console.error('Error reading directory:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        {cameraPermission ? (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
            ratio="16:9"
            autoFocus="on"
          />
        ) : (
          <Text style={styles.permissionText}>No access to camera</Text>
        )}
      </View>
      <View style={styles.cameraControls}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rotateCameraButton} onPress={switchCameraType}>
          <Ionicons name="camera-reverse" size={24} color="#fff" />
        </TouchableOpacity>
        {!cameraPermission && (
          <TouchableOpacity style={styles.cameraButton} onPress={handleCameraPermission}>
            <Ionicons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        {imageUris.length > 0 && (
          <TouchableOpacity
            style={styles.viewGalleryButton}
            onPress={() => navigation.navigate('ImageGalleryScreen', { imageUris: imageUris })}
          >
            <Text style={styles.buttonText}>View Images</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
  },
  cameraControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  captureButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  rotateCameraButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 10,
    marginLeft: 20,
  },
  cameraButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 10,
    marginRight: 20,
  },
  viewGalleryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraScreen;

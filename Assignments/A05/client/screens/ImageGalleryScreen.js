import React from 'react';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';

const ImageGalleryScreen = () => {
  const imageUris = [];
  const setImageUris = undefined;

  const handleDeleteImage = (index) => {
  };

  return (
    <View>
      <FlatList 
        horizontal
        data={imageUris}
        renderItem={({ item, index }) => (
          <View>
            <Image source={{ uri: item }} />
            <TouchableOpacity onPress={() => handleDeleteImage(index)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ImageGalleryScreen;
// src/components/common/ImagePicker.tsx
import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

interface ImagePickerProps {
  value: string | null;
  onSelect: (uri: string | null) => void;
  style?: ViewStyle;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ value, onSelect, style }) => {
  const handleSelectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Could not select image.');
      } else if (response.assets && response.assets[0].uri) {
        onSelect(response.assets[0].uri);
      }
    });
  };

  return (
    <TouchableOpacity onPress={handleSelectImage} style={[styles.container, style]}>
      {value ? (
        <Image source={{ uri: value }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Icon name="camera" size={40} color="#999" />
        </View>
      )}
      <View style={styles.editIconContainer}>
        <Icon name="pencil" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ced4da',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Alert,
  ViewStyle,
} from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

interface ImagePickerProps {
  value: string | null;
  onSelect: (imageUri: string | null) => void;
  style?: ViewStyle;
  size?: number;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
                                                          value,
                                                          onSelect,
                                                          style,
                                                          size = 120,
                                                        }) => {
  const [loading, setLoading] = useState(false);

  const handleImagePicker = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to select a photo',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Photo Library', onPress: openImageLibrary },
        { text: 'Remove Photo', onPress: () => onSelect(null), style: 'destructive' },
      ]
    );
  };

  const openImageLibrary = () => {
    setLoading(true);
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 800,
        maxHeight: 800,
      },
      (response: ImagePickerResponse) => {
        setLoading(false);

        if (response.didCancel || response.errorMessage) {
          return;
        }

        if (response.assets && response.assets[0]) {
          onSelect(response.assets[0].uri || null);
        }
      }
    );
  };

  const containerSize = { width: size, height: size };

  return (
    <TouchableOpacity
      style={[styles.container, containerSize, style]}
      onPress={handleImagePicker}
      disabled={loading}
    >
      {value ? (
        <Image source={{ uri: value }} style={[styles.image, containerSize]} />
      ) : (
        <View style={[styles.placeholder, containerSize]}>
          <Text style={styles.placeholderText}>+</Text>
          <Text style={styles.addText}>Add Photo</Text>
        </View>
      )}
      {loading && (
        <View style={[styles.loading, containerSize]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  image: {
    borderRadius: 60,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  placeholderText: {
    fontSize: 32,
    color: '#999',
    fontWeight: '300',
  },
  addText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  loading: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
  },
});

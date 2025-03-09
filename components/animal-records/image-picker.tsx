import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";

export default function ImagePickerComponent({ onImageSelected }) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library to select an image.",
      );
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    // If user has selected an image, proceed
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      onImageSelected(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your camera to take a photo.",
      );
      return;
    }

    // Launch camera
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.imagePickerContainer}>
      {image ? (
        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <TouchableOpacity
            style={styles.changeImageButton}
            onPress={pickImage}
          >
            <Feather name="edit-2" size={16} color="#121212" />
            <Text style={styles.changeImageText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imagePickerPlaceholder}>
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImage}
          >
            <Feather name="image" size={24} color="#AAAAAA" />
            <Text style={styles.imagePickerText}>Select from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={takePhoto}
          >
            <Feather name="camera" size={24} color="#AAAAAA" />
            <Text style={styles.imagePickerText}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

import React from "react";
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";

export default function ImagePickerComponent({ image, setImage }) {
  const removeImage = (imageURL: string) => {
    setImage((prev: string[]) =>
      prev.filter((img: string) => img !== imageURL),
    );
  };

  const updateImage = async (index: number) => {
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
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    // If user has selected an image, proceed
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage((prev: string[]) => {
        const copy = [...prev];
        copy[index] = result.assets![0].uri;
        return copy;
      });
    }
  };

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
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    // If user has selected an image, proceed
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage((prev: string[]) => [
        ...prev,
        ...result.assets!.map((img) => img.uri),
      ]);
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
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage((prev: string[]) => [
        ...prev,
        ...result.assets!.map((img) => img.uri),
      ]);
    }
  };

  return (
    <View>
      {image && image.length > 0 && (
        <View style={styles.imagePreviewContainer}>
          <FlatList
            data={image}
            horizontal
            showsHorizontalScrollIndicator={true}
            pagingEnabled
            decelerationRate="normal"
            snapToAlignment="center"
            keyExtractor={(_item, index) => index.toString()}
            renderItem={({ item, index }) => {
              return (
                <>
                  <Image source={{ uri: item }} style={styles.imagePreview} />

                  {/* REMOVE BUTTON */}
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(item)}
                  >
                    <Feather name="trash-2" size={16} color="white" />
                    <Text style={{ ...styles.changeImageText, color: "white" }}>
                      Remove
                    </Text>
                  </TouchableOpacity>

                  {/* CHANGE BUTTON */}
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={() => updateImage(index)}
                  >
                    <Feather name="edit-2" size={16} color="#121212" />
                    <Text style={styles.changeImageText}>Change</Text>
                  </TouchableOpacity>
                </>
              );
            }}
          />
        </View>
      )}

      {/* IMAGE PICK OPTIONS */}
      <View style={styles.imagePickerPlaceholder}>
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Feather name="image" size={20} color="#AAAAAA" />
          <Text style={styles.imagePickerText}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imagePickerButton} onPress={takePhoto}>
          <Feather name="camera" size={20} color="#AAAAAA" />
          <Text style={styles.imagePickerText}>Camera</Text>
        </TouchableOpacity>
      </View>

      {/* DISPLAY TOTAL IMAGES COUNT */}
      <View style={{ ...styles.sectionHeader, marginBottom: 0 }}>
        <Text style={{ color: "white" }}>Images</Text>
        <Text style={{ color: "white" }}>({image.length} / 10)</Text>
      </View>
    </View>
  );
}

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ImagePickerComponent from "./image-picker";
import styles from "./styles";
import { useServices } from "@/context/services.context";
import { ZodError } from "zod";

export default function AddRecordForm() {
  const [name, setName] = useState("");
  const [boughtPrice, setBoughtPrice] = useState("");
  const [soldPrice, setSoldPrice] = useState("");
  const [imageUri, setImageUri] = useState<string>("");
  const { recordsService } = useServices();
  const [errors, setErrors] = useState({
    name: "",
    image: "",
    sold_price: "",
    bought_price: "",
  });

  const handleImageSelected = (uri: string) => {
    setImageUri(uri);
  };

  const saveRecord = async () => {
    try {
      const data = {
        name,
        sold_price: Number(soldPrice),
        bought_price: Number(boughtPrice),
        image: imageUri,
      };
      await recordsService.createRecord(data);
    } catch (err) {
      if (err instanceof ZodError) {
        err.errors.forEach((e) => {
          setErrors((prev) => ({ ...prev, [e.path[0]]: e.message }));
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* IMAGE PICKER */}
        <View style={styles.formSection}>
          <ImagePickerComponent setImage={setImageUri} image={imageUri} />
        </View>
        {errors.image && (
          <Text style={styles.errorMessage}>{errors.image}</Text>
        )}

        {/* INPUTS */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Animal Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter animal name"
            placeholderTextColor="#777777"
          />
          {errors.name && (
            <Text style={styles.errorMessage}>{errors.name}</Text>
          )}
        </View>
        <View style={styles.formSection}>
          <Text style={styles.label}>Bought Price</Text>
          <TextInput
            style={styles.input}
            value={boughtPrice}
            onChangeText={setBoughtPrice}
            placeholder="Rs.2000"
            placeholderTextColor="#777777"
            keyboardType="numeric"
          />
          {errors.bought_price && (
            <Text style={styles.errorMessage}>{errors.bought_price}</Text>
          )}
        </View>
        <View style={styles.formSection}>
          <Text style={styles.label}>Sold Price</Text>
          <TextInput
            style={styles.input}
            value={soldPrice}
            onChangeText={setSoldPrice}
            placeholder="Rs.2000"
            placeholderTextColor="#777777"
            keyboardType="numeric"
          />
          {errors.sold_price && (
            <Text style={styles.errorMessage}>{errors.sold_price}</Text>
          )}
        </View>

        {/* SAVE RECORD BUTTON */}
        <TouchableOpacity style={styles.saveButton} onPress={saveRecord}>
          <Feather name="save" size={18} color="#121212" />
          <Text style={styles.saveButtonText}>Save Record</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

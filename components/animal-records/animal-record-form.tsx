import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native";
import ImagePickerComponent from "./image-picker";
import styles from "./styles";
import { useServices } from "@/context/services.context";
import { ZodError } from "zod";
import { useRouter } from "expo-router";
import Input from "../ui/input";
import SubmitButton from "../ui/submit-button";

export default function AddRecordForm() {
  const [name, setName] = useState("");
  const [boughtPrice, setBoughtPrice] = useState("");
  const [soldPrice, setSoldPrice] = useState("");
  const [imageUri, setImageUri] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { recordsService } = useServices();
  const [errors, setErrors] = useState({
    name: "",
    image: "",
    sold_price: "",
    bought_price: "",
  });
  const router = useRouter();

  const saveRecord = async () => {
    try {
      setLoading(true);
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
    } finally {
      setName("");
      setSoldPrice("");
      setBoughtPrice("");
      setImageUri("");
      setLoading(false);
      router.navigate("/");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* IMAGE PICKER */}
        <View style={styles.formSection}>
          <ImagePickerComponent setImage={setImageUri} image={imageUri} />
        </View>
        {errors.image && (
          <Text style={styles.errorMessage}>{errors.image}</Text>
        )}

        {/* INPUTS */}
        <Input
          label="Animal Name"
          value={name}
          placeholder="Enter animal name"
          error={errors.name}
          inputMode="text"
          handleChange={setName}
        />
        <Input
          label="Bought Price"
          value={boughtPrice}
          placeholder="2000"
          error={errors.bought_price}
          handleChange={setBoughtPrice}
        />
        <Input
          label="Sold Price"
          value={soldPrice}
          placeholder="2000"
          error={errors.sold_price}
          handleChange={setSoldPrice}
        />

        {/* SAVE RECORD BUTTON */}
        <SubmitButton
          loading={loading}
          text="Create Record"
          loadingText="Creating..."
          handlePress={saveRecord}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

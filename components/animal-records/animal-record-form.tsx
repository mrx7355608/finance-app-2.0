import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInputChangeEventData,
  NativeSyntheticEvent,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ImagePickerComponent from "./image-picker";
import ExpenseModal from "../expenses/expenses-modal";
import ExpensesList from "../expenses/expenses-list";
import styles from "./styles";
import { createRecord } from "@/utils/records-data";

export default function AddRecordForm() {
  const [name, setName] = useState("");
  const [boughtPrice, setBoughtPrice] = useState("");
  const [soldPrice, setSoldPrice] = useState("");
  const [imageUri, setImageUri] = useState<string>("");
  const [expenses, setExpenses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleImageSelected = (uri: string) => {
    setImageUri(uri);
  };

  const saveRecord = async () => {
    const data = {
      name,
      sold_price: Number(soldPrice),
      bought_price: Number(boughtPrice),
      image: imageUri,
      createdAt: new Date().toISOString(),
    };
    await createRecord(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* IMAGE PICKER */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formSection}>
          <ImagePickerComponent onImageSelected={handleImageSelected} />
        </View>

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
        </View>

        {/* ##### EXPENSES SECTION ##### */}
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.formTitle2}>Expenses</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Feather name="plus" size={16} color="#121212" />
              <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>

          {/* EXPENSES LIST */}
          {expenses.length > 0 ? (
            <ExpensesList expenses={expenses} />
          ) : (
            <Text style={styles.noExpensesText}>No expenses added yet</Text>
          )}

          {/* SAVE RECORD BUTTON */}
          <TouchableOpacity style={styles.saveButton} onPress={saveRecord}>
            <Feather name="save" size={18} color="#121212" />
            <Text style={styles.saveButtonText}>Save Record</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* EXPENSES MODAL */}
      <ExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

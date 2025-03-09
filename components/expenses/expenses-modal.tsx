import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../animal-records/styles";

export default function ExpenseModal({ visible, onClose }) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");

  const handleSave = () => {
    if (item.trim() === "" || amount.trim() === "") {
      return; // Don't save empty values
    }

    // Reset form
    setItem("");
    setAmount("");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Expense</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.formSection}>
                <Text style={styles.label}>Item</Text>
                <TextInput
                  style={styles.input}
                  value={item}
                  onChangeText={setItem}
                  placeholder="Enter expense item"
                  placeholderTextColor="#777777"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Amount</Text>
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor="#777777"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={onClose}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSave}
              >
                <Text style={styles.modalSaveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

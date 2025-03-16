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
import { IExpenseInput } from "@/utils/types";

interface Props {
  visible: boolean;
  recordId: number;
  onClose: () => void;
  onCreate: (expense: IExpenseInput) => void;
}

export default function ExpenseModal({
  visible,
  recordId,
  onClose,
  onCreate,
}: Props) {
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (item.trim() === "" || amount.trim() === "") {
      setError("Please fill in all the fields");
      setTimeout(() => setError(""), 5000);
      return;
    }

    // Reset form
    setItem("");
    setAmount("");
    setError("");
    onCreate({ name: item, amount: Number(amount), recordId });
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
                {error && <Text style={styles.errorMessage}>{error}</Text>}
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

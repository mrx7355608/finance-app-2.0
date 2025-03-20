import React, { useState } from "react";
import {
  Modal,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../animal-records/styles";
import { IExpense, IExpenseInput } from "@/utils/types";
import Input from "../ui/input";

interface Props {
  visible: boolean;
  expenseToEdit: IExpense;
  onClose: () => void;
  onEdit: (id: number, newName: string, newAmount: number) => Promise<void>;
}

export default function EditExpenseModal({
  visible,
  expenseToEdit,
  onClose,
  onEdit,
}: Props) {
  const [item, setItem] = useState(expenseToEdit.name);
  const [amount, setAmount] = useState(String(expenseToEdit.amount));
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (item.trim() === "" || amount.trim() === "") {
      setError("Please fill in all the fields");
      setTimeout(() => setError(""), 5000);
      return;
    }

    await onEdit(expenseToEdit.id, item, Number(amount));
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ScrollView
        contentContainerStyle={styles.modalOverlay}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Expense</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            {error && <Text style={styles.errorMessage}>{error}</Text>}
            <Input
              label="Item"
              value={item}
              placeholder="Enter expense item"
              handleChange={setItem}
              inputMode="text"
            />
            <Input
              label="Amount"
              value={amount}
              placeholder="100"
              handleChange={setAmount}
            />
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
              <Text style={styles.modalSaveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

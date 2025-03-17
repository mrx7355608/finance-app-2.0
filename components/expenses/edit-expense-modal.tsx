import React, { Dispatch, SetStateAction, useState } from "react";
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
import { IExpense, IExpenseInput } from "@/utils/types";
import { useServices } from "@/context/services.context";

interface Props {
  visible: boolean;
  onClose: () => void;
  expenseToEdit: IExpense;
  setExpenses: Dispatch<SetStateAction<IExpense[]>>;
}

export default function EditExpenseModal({
  visible,
  onClose,
  expenseToEdit,
  setExpenses,
}: Props) {
  const [item, setItem] = useState(expenseToEdit.name);
  const [amount, setAmount] = useState(String(expenseToEdit.amount));
  const [error, setError] = useState("");
  const { expenseService } = useServices();

  const handleSave = async () => {
    if (item.trim() === "" || amount.trim() === "") {
      setError("Please fill in all the fields");
      setTimeout(() => setError(""), 5000);
      return;
    }

    // Reset form
    const result = await expenseService.updateExpense(
      expenseToEdit.id,
      item,
      Number(amount),
    );
    setExpenses((prev) => {
      const copy = prev.filter((p) => p.id !== expenseToEdit.id);
      return [result, ...copy];
    });
    setItem("");
    setAmount("");
    setError("");
    onClose();
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
              <Text style={styles.modalTitle}>Edit Expense</Text>
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
                  placeholder="Rs. 200"
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
                <Text style={styles.modalSaveButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

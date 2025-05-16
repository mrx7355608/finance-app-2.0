import React, { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import baseStyles from "../animal-records/styles";
import { Feather } from "@expo/vector-icons";
import { IExpense } from "@/utils/types";
import { useServices } from "@/context/services.context";
import EditExpenseModal from "./edit-expense-modal";

const styles = StyleSheet.create({
  ...baseStyles,
  loadingButton: {
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center" as const,
  },
});

export default function ExpensesList({
  expenses,
  setExpenses,
}: {
  expenses: IExpense[];
  setExpenses: Dispatch<SetStateAction<IExpense[]>>;
}) {
  const [expenseToEdit, setExpenseToEdit] = useState<IExpense | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { expenseService } = useServices();

  const deleteExpense = async (id: number) => {
    try {
      setDeletingId(id);
      await expenseService.deleteExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Failed to delete expense:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const showEditExpenseModal = (id: number) => {
    const exp = expenses.filter((e) => e.id === id)[0];
    setExpenseToEdit(exp);
    setEditModalVisible(true);
  };

  const onEdit = async (id: number, newName: string, newAmount: number) => {
    const result = await expenseService.updateExpense(id, newName, newAmount);
    setExpenses((prev) => {
      prev.forEach((exp) => {
        if (exp.id === result.id) {
          exp.name = result.name;
          exp.amount = result.amount;
        }
      });
      return prev;
    });
  };

  return (
    <>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.name}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.expenseItem}>
            <View>
              <Text style={styles.expenseItemText}>{item.name}</Text>
              <Text style={styles.expenseAmount}>
                Rs. {String(item.amount)}
              </Text>
            </View>

            {/* EDIT & DELETE BUTTONS */}
            <View style={styles.expenseItemButtons}>
              <TouchableOpacity
                style={styles.expenseButton}
                onPress={() => showEditExpenseModal(item.id)}
                disabled={deletingId === item.id}
              >
                <Feather
                  name="edit-2"
                  size={18}
                  color={deletingId === item.id ? "#666666" : "#64ffda"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.expenseButton}
                onPress={() => deleteExpense(item.id)}
                disabled={deletingId === item.id}
              >
                {deletingId === item.id ? (
                  <View style={styles.loadingButton}>
                    <ActivityIndicator size="small" color="#FF5252" />
                  </View>
                ) : (
                  <Feather name="trash-2" size={18} color="#FF5252" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      {editModalVisible && (
        <EditExpenseModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          expenseToEdit={expenseToEdit!}
          onEdit={onEdit}
        />
      )}
    </>
  );
}

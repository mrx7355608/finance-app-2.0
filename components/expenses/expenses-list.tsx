import React, { Dispatch, SetStateAction, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import styles from "../animal-records/styles";
import { Feather } from "@expo/vector-icons";
import { IExpense } from "@/utils/types";
import { useServices } from "@/context/services.context";
import EditExpenseModal from "./edit-expense-modal";

export default function ExpensesList({
  expenses,
  setExpenses,
}: {
  expenses: IExpense[];
  setExpenses: Dispatch<SetStateAction<IExpense[]>>;
}) {
  const [expenseToEdit, setExpenseToEdit] = useState<IExpense | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { expenseService } = useServices();

  const deleteExpense = async (id: number) => {
    await expenseService.deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const showEditExpenseModal = (id: number) => {
    setExpenseToEdit(expenses.filter((e) => e.id === id)[0]);
    setEditModalVisible(true);
  };

  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.name}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.expenseItem}>
          <View>
            <Text style={styles.expenseItemText}>{item.name}</Text>
            <Text style={styles.expenseAmount}>Rs. {String(item.amount)}</Text>
          </View>
          <View style={styles.expenseItemButtons}>
            <TouchableOpacity onPress={() => showEditExpenseModal(item.id)}>
              <Feather name="edit-2" size={18} color="#64ffda" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteExpense(item.id)}>
              <Feather name="trash-2" size={18} color="#FF5252" />
            </TouchableOpacity>
          </View>
          {expenseToEdit && (
            <EditExpenseModal
              visible={editModalVisible}
              onClose={() => setEditModalVisible(false)}
              expenseToEdit={expenseToEdit!}
              setExpenses={setExpenses}
            />
          )}
        </View>
      )}
    />
  );
}

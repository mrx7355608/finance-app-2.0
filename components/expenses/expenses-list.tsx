import React, { Dispatch, SetStateAction } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import styles from "../animal-records/styles";
import { Feather } from "@expo/vector-icons";
import { IExpense } from "@/utils/types";
import { useServices } from "@/context/services.context";

export default function ExpensesList({
  expenses,
  setExpenses,
}: {
  expenses: IExpense[];
  setExpenses: Dispatch<SetStateAction<IExpense[]>>;
}) {
  const { expenseService } = useServices();

  const deleteExpense = async (id: number) => {
    await expenseService.deleteExpense(id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
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
          <TouchableOpacity onPress={() => deleteExpense(item.id)}>
            <Feather name="trash-2" size={18} color="#FF5252" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

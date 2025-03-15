import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import styles from "../animal-records/styles";
import { Feather } from "@expo/vector-icons";
import { IExpenseInput } from "@/utils/types";

export default function ExpensesInputList({
  expenses,
}: {
  expenses: IExpenseInput[];
}) {
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
          <TouchableOpacity>
            <Feather name="trash-2" size={18} color="#FF5252" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

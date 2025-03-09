import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import styles from "../animal-records/styles";
import { Feather } from "@expo/vector-icons";

export default function ExpensesList({ expenses }) {
  return (
    <FlatList
      data={expenses}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <View style={styles.expenseItem}>
          <View>
            <Text style={styles.expenseItemText}>{item.item}</Text>
            <Text style={styles.expenseAmount}>
              ${parseFloat(item.amount).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity>
            <Feather name="trash-2" size={18} color="#FF5252" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

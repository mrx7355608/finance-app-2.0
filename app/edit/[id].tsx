import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import ExpensesList from "@/components/expenses/expenses-list";
import CreateExpenseModal from "@/components/expenses/create-expenses-modal";
import styles from "@/components/animal-records/styles";
import { IExpense, IExpenseInput, IRecordModel } from "@/utils/types";
import { Feather } from "@expo/vector-icons";
import ImagePickerComponent from "@/components/animal-records/image-picker";
import { Stack, useLocalSearchParams } from "expo-router";
import { useServices } from "@/context/services.context";
import { ZodError } from "zod";

export default function EditRecord() {
  const { id } = useLocalSearchParams();
  const { recordsService, expenseService } = useServices();
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [record, setRecord] = useState<IRecordModel | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    image: "",
    sold_price: "",
    bought_price: "",
  });

  // Fetch the record and expenses from id
  useEffect(() => {
    recordsService
      .getRecordById(Number(id))
      .then(async ({ data }) => {
        if (!data) return;
        const expensesList = await expenseService.getExpensesByRecordId(
          data.id,
        );
        setExpenses(expensesList);
        setRecord(data);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [id]);

  // Show loading state
  if (loading) {
    return <Text>Loading...</Text>;
  }

  // Show a not found message
  if (!record) {
    return <Text>Record not found</Text>;
  }

  const handleAddExpense = async (newExpense: IExpenseInput) => {
    try {
      await expenseService.createExpense(newExpense);
      setExpenses((prev) => [...prev, newExpense]);
    } catch (err) {
      if (err instanceof ZodError) {
        console.log(err.errors);
      }
    }
  };

  const handlers = {
    name: (name: string) => {
      setRecord((prev) => {
        if (!prev) return prev;
        return { ...prev, name };
      });
    },
    image: (newImage: string) => {
      setRecord((prev) => {
        if (!prev) return prev;
        return { ...prev, image: newImage };
      });
    },
    soldPrice: (newSoldPrice: string) => {
      setRecord((prev) => {
        if (!prev) return prev;
        return { ...prev, sold_price: Number(newSoldPrice) };
      });
    },
    boughtPrice: (newBoughtPrice: string) => {
      setRecord((prev) => {
        if (!prev) return prev;
        return { ...prev, bought_price: Number(newBoughtPrice) };
      });
    },
  };

  const saveRecord = () => {
    console.log(record);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Edit Record" }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* IMAGE PICKER */}
          <View style={styles.formSection}>
            <ImagePickerComponent
              image={record.image}
              setImage={handlers.image}
            />
          </View>
          {errors.image && (
            <Text style={styles.errorMessage}>{errors.image}</Text>
          )}

          {/* INPUTS */}
          <View style={styles.formSection}>
            <Text style={styles.label}>Animal Name</Text>
            <TextInput
              style={styles.input}
              value={record.name}
              onChangeText={handlers.name}
              placeholder="Enter animal name"
              placeholderTextColor="#777777"
            />
            {errors.name && (
              <Text style={styles.errorMessage}>{errors.name}</Text>
            )}
          </View>
          <View style={styles.formSection}>
            <Text style={styles.label}>Bought Price</Text>
            <TextInput
              style={styles.input}
              value={String(record.bought_price)}
              onChangeText={handlers.boughtPrice}
              placeholder="Rs.2000"
              placeholderTextColor="#777777"
              keyboardType="numeric"
            />
            {errors.bought_price && (
              <Text style={styles.errorMessage}>{errors.bought_price}</Text>
            )}
          </View>
          <View style={styles.formSection}>
            <Text style={styles.label}>Sold Price</Text>
            <TextInput
              style={styles.input}
              value={record.sold_price ? String(record.sold_price) : ""}
              onChangeText={handlers.soldPrice}
              placeholder="Rs.2000"
              placeholderTextColor="#777777"
              keyboardType="numeric"
            />
            {errors.sold_price && (
              <Text style={styles.errorMessage}>{errors.sold_price}</Text>
            )}
          </View>

          {/* ##### EXPENSES SECTION ##### */}
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
            <ExpensesList expenses={expenses} setExpenses={setExpenses} />
          ) : (
            <Text style={styles.noExpensesText}>No expenses added yet</Text>
          )}
          {/* SAVE RECORD BUTTON */}
          <TouchableOpacity style={styles.saveButton} onPress={saveRecord}>
            <Feather name="save" size={18} color="#121212" />
            <Text style={styles.saveButtonText}>Save Record</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* EXPENSES MODAL */}
        <CreateExpenseModal
          visible={modalVisible}
          recordId={record.id}
          onClose={() => setModalVisible(false)}
          onCreate={handleAddExpense}
        />
      </SafeAreaView>
    </>
  );
}

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
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useServices } from "@/context/services.context";

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
  const router = useRouter();

  // Fetch the record and expenses from id
  useEffect(() => {
    const fetchRecordAndExpenses = async () => {
      try {
        const { data } = await recordsService.getRecordById(Number(id));
        const expensesList = await expenseService.getExpensesByRecordId(
          data.id,
        );
        setExpenses(expensesList);
        setRecord({
          ...data,
          bought_price: String(data.bought_price) as any,
          sold_price: data.sold_price
            ? data.sold_price.toString()
            : ("" as any),
        });
      } catch (err) {
        console.log((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordAndExpenses();
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
    const expense = await expenseService.createExpense(newExpense);
    setExpenses((prev) => [...prev, expense]);
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
        return { ...prev, sold_price: String(newSoldPrice) };
      });
    },
    boughtPrice: (newBoughtPrice: string) => {
      setRecord((prev) => {
        if (!prev) return prev;
        return { ...prev, bought_price: String(newBoughtPrice) };
      });
    },
  };

  const updateRecord = async () => {
    await recordsService.updateRecord(record.id, {
      name: record.name,
      sold_price: Number(record.sold_price),
      bought_price: Number(record.bought_price),
      image: record.image,
    });
    router.navigate("/");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Edit Record" }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
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
              value={record.bought_price as any}
              onChangeText={handlers.boughtPrice}
              placeholder="2000"
              placeholderTextColor="#777777"
              inputMode="numeric"
            />
            {errors.bought_price && (
              <Text style={styles.errorMessage}>{errors.bought_price}</Text>
            )}
          </View>
          <View style={styles.formSection}>
            <Text style={styles.label}>Sold Price</Text>
            <TextInput
              style={styles.input}
              value={record.sold_price as any}
              onChangeText={handlers.soldPrice}
              placeholder="2000"
              placeholderTextColor="#777777"
              inputMode="numeric"
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
          <TouchableOpacity style={styles.saveButton} onPress={updateRecord}>
            <Feather name="save" size={18} color="#121212" />
            <Text style={styles.saveButtonText}>Save Record</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* EXPENSES MODAL */}
        {modalVisible && (
          <CreateExpenseModal
            visible={modalVisible}
            recordId={record.id}
            onClose={() => setModalVisible(false)}
            onCreate={handleAddExpense}
          />
        )}
      </SafeAreaView>
    </>
  );
}

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import ExpensesList from "@/components/expenses/expenses-list";
import CreateExpenseModal from "@/components/expenses/create-expenses-modal";
import baseStyles from "@/components/animal-records/styles";
import { IExpense, IExpenseInput, IRecordModel } from "@/utils/types";
import { Feather } from "@expo/vector-icons";
import ImagePickerComponent from "@/components/animal-records/image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useServices } from "@/context/services.context";
import SubmitButton from "@/components/ui/submit-button";
import Input from "@/components/ui/input";
import { ZodError } from "zod";

const styles = {
  ...baseStyles,
  loadingContainer: StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#121212",
    },
    text: {
      color: "#FFFFFF",
      marginTop: 12,
      fontSize: 16,
    },
  }).container,
  loadingText: StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#121212",
    },
    text: {
      color: "#FFFFFF",
      marginTop: 12,
      fontSize: 16,
    },
  }).text,
};

export default function EditRecord() {
  const { id } = useLocalSearchParams();
  const { recordsService, expenseService } = useServices();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [record, setRecord] = useState<IRecordModel | null>(null);
  const [images, setImages] = useState<string[]>();
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
          data.id
        );
        setExpenses(expensesList || []);
        setRecord(data);
        setImages(data.images as string[]);
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
    return (
      <>
        <Stack.Screen options={{ title: "Edit" }} />
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#121212" />
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Loading record details...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  // Show a not found message
  if (!record) {
    return (
      <>
        <Stack.Screen options={{ title: "Edit" }} />
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#121212" />
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Record not found</Text>
          </View>
        </SafeAreaView>
      </>
    );
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
    soldPrice: (newSoldPrice: string) => {
      setRecord((prev) => {
        if (!prev) return prev;
        return { ...prev, sold_price: newSoldPrice };
      });
    },
    boughtPrice: (newBoughtPrice: string) => {
      setRecord((prev) => {
        if (!prev) return prev;
        return { ...prev, bought_price: newBoughtPrice };
      });
    },
  };

  const updateRecord = async () => {
    try {
      await recordsService.updateRecord(record.id, {
        name: record.name,
        sold_price: Number(record.sold_price),
        bought_price: Number(record.bought_price),
        images: images as string[],
      });
      router.navigate("/");
    } catch (err) {
      console.log((err as Error).message);
      alert("Unable to update record");
      if (err instanceof ZodError) {
        err.errors.forEach((e) => {
          setErrors((prev) => ({ ...prev, [e.path[0]]: e.message }));
        });
      }
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Edit" }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* IMAGE PICKER */}
          <View style={styles.formSection}>
            <ImagePickerComponent image={images} setImage={setImages} />
          </View>
          {errors.image && (
            <Text style={styles.errorMessage}>{errors.image}</Text>
          )}

          {/* INPUTS */}
          <Input
            label="Animal Name"
            value={record.name}
            placeholder="Enter animal name"
            error={errors.name}
            inputMode="text"
            handleChange={handlers.name}
          />
          <Input
            label="Bought Price"
            value={record.bought_price.toString()}
            placeholder="2000"
            error={errors.bought_price}
            handleChange={handlers.boughtPrice}
          />
          <Input
            label="Sold Price"
            value={record.sold_price?.toString() || ""}
            placeholder="2000"
            error={errors.sold_price}
            handleChange={handlers.soldPrice}
          />

          {/* ##### EXPENSES SECTION ##### */}
          <View style={styles.sectionHeader}>
            {/* HEADING */}
            <Text style={styles.formTitle2}>Expenses</Text>

            {/* ADD EXPENSE BUTTON */}
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
          <SubmitButton
            text="Save Record"
            loading={loading}
            loadingText="Saving..."
            handlePress={updateRecord}
          />
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

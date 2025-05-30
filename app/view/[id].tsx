import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { IExpense, IRecordModel } from "@/utils/types";
import { useServices } from "@/context/services.context";
import { currencyFormatter } from "@/utils/currency-formatter";
import styles2 from "@/components/animal-records/styles";

const ViewRecordScreen = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [record, setRecord] = useState<IRecordModel | null>(null);
  const { recordsService, expenseService } = useServices();

  // Fetch the record and expenses from id
  useEffect(() => {
    const fetchRecordAndExpenses = async () => {
      try {
        const { data } = await recordsService.getRecordById(Number(id));
        const expensesList = await expenseService.getExpensesByRecordId(
          data.id
        );
        setExpenses(expensesList || []);
        setRecord(data as IRecordModel);
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
        <Stack.Screen options={{ title: "View" }} />
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
        <Stack.Screen options={{ title: "View" }} />
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#121212" />
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Record not found</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Calculate profit/loss
  const sprice = record.sold_price || 0;
  const profitLoss = sprice - record.bought_price - totalExpenses;
  const isProfitable = profitLoss > 0;

  return (
    <>
      <Stack.Screen options={{ title: "View" }} />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />

        <ScrollView>
          {/* Animal Image */}
          <View style={styles2.imagePreviewContainer}>
            <FlatList
              data={record.images}
              horizontal
              showsHorizontalScrollIndicator={true}
              pagingEnabled
              decelerationRate="normal"
              snapToAlignment="center"
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <>
                    <Image
                      source={{ uri: item.replace("https", "http") }}
                      style={styles2.imagePreview}
                    />
                  </>
                );
              }}
            />
          </View>

          {/* Header with back button and title */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{record.name}</Text>
            <Text style={styles.infoLabel}>
              {new Date(record.created_at).toDateString()}
            </Text>
          </View>

          {/* Price Information */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Bought Price:</Text>
              <Text style={styles.infoValue}>
                {currencyFormatter(record.bought_price)}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sold Price:</Text>
              <Text style={styles.infoValue}>
                {currencyFormatter(record.sold_price || 0)}
              </Text>
            </View>
          </View>

          {/* Expenses Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Expenses</Text>

            {expenses.map((item) => (
              <View key={item.id} style={styles.expenseCard}>
                <View>
                  <Text style={styles.expenseName}>{item.name}</Text>
                  <Text style={styles.expenseDate}>
                    {new Date(item.created_at).toDateString()}
                  </Text>
                </View>
                <Text style={styles.expenseAmount}>
                  -{currencyFormatter(item.amount)}
                </Text>
              </View>
            ))}

            <View style={styles.totalExpensesRow}>
              <Text style={styles.totalExpensesLabel}>Total Expenses:</Text>
              <Text style={styles.totalExpensesValue}>
                -{currencyFormatter(totalExpenses)}
              </Text>
            </View>
          </View>

          {/* Profit/Loss Calculation */}
          <View
            style={[
              styles.profitLossCard,
              isProfitable ? styles.profitCard : styles.lossCard,
            ]}
          >
            <View style={styles.profitLossRow}>
              <Text style={styles.profitLossLabel}>Sold Price:</Text>
              <Text style={styles.profitLossValue}>
                +{currencyFormatter(record.sold_price || 0)}
              </Text>
            </View>
            <View style={styles.profitLossRow}>
              <Text style={styles.profitLossLabel}>Bought Price:</Text>
              <Text style={styles.profitLossValue}>
                -{currencyFormatter(record.bought_price)}
              </Text>
            </View>
            <View style={styles.profitLossRow}>
              <Text style={styles.profitLossLabel}>Total Expenses:</Text>
              <Text style={styles.profitLossValue}>
                -{currencyFormatter(totalExpenses)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.profitLossRow}>
              <Text
                style={[
                  styles.profitLossTotal,
                  isProfitable ? styles.profitText : styles.lossText,
                ]}
              >
                {isProfitable ? "PROFIT:" : "LOSS:"}
              </Text>
              <Text
                style={[
                  styles.profitLossTotal,
                  isProfitable ? styles.profitText : styles.lossText,
                ]}
              >
                {isProfitable ? "+" : "-"}
                {currencyFormatter(Math.abs(profitLoss))}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 46,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  animalImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  infoCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  infoLabel: {
    color: "#AAAAAA",
    fontSize: 16,
  },
  infoValue: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  expenseCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expenseName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  expenseDate: {
    color: "#999999",
    fontSize: 12,
    marginTop: 4,
  },
  expenseAmount: {
    color: "#FF5252",
    fontSize: 16,
    fontWeight: "bold",
  },
  totalExpensesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    marginTop: 8,
  },
  totalExpensesLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  totalExpensesValue: {
    color: "#FF5252",
    fontSize: 16,
    fontWeight: "bold",
  },
  profitLossCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  profitCard: {
    backgroundColor: "rgba(0, 200, 83, 0.15)",
    borderLeftWidth: 4,
    borderLeftColor: "#00C853",
  },
  lossCard: {
    backgroundColor: "rgba(255, 82, 82, 0.15)",
    borderLeftWidth: 4,
    borderLeftColor: "#FF5252",
  },
  profitLossRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  profitLossLabel: {
    color: "#DDDDDD",
    fontSize: 16,
  },
  profitLossValue: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginVertical: 12,
  },
  profitLossTotal: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profitText: {
    color: "#00C853",
  },
  lossText: {
    color: "#FF5252",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 12,
    fontSize: 16,
  },
});

export default ViewRecordScreen;

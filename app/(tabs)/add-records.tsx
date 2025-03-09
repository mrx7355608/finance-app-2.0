import { StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import AddRecordForm from "@/components/animal-records/animal-record-form";

export default function AddRecordsPage() {
  return (
    <View style={styles.container}>
      <AddRecordForm />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

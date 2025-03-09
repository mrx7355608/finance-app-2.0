import React, { useState } from "react";
import { StyleSheet, FlatList, SafeAreaView, StatusBar } from "react-native";
import AnimalRecordsItem from "@/components/animal-records/animal-records-item";

// Mock data for demonstration
const initialRecords = [
  {
    id: "1",
    name: "Max",
    image: "https://picsum.photos/id/237/300/200",
    date: "2023-05-15",
  },
  {
    id: "2",
    name: "Bella",
    image: "https://picsum.photos/id/1025/300/200",
    date: "2023-06-22",
  },
  {
    id: "3",
    name: "Charlie",
    image: "https://picsum.photos/id/1074/300/200",
    date: "2023-07-10",
  },
  {
    id: "4",
    name: "Luna",
    image: "https://picsum.photos/id/169/300/200",
    date: "2023-08-05",
  },
];

export default function AnimalRecordsHome() {
  const [records, setRecords] = useState(initialRecords);

  const handleView = (item) => {
    console.log("Viewing record:", item.id);
    // Navigate to view screen
  };

  const handleEdit = (item) => {
    console.log("Editing record:", item.id);
    // Navigate to edit screen
  };

  const handleDelete = (item) => {
    console.log("Deleting record:", item.id);
    // Show confirmation dialog and delete if confirmed
    setRecords(records.filter((record) => record.id !== item.id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AnimalRecordsItem
            item={item}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  list: {
    padding: 12,
  },
});

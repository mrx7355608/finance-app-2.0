import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, SafeAreaView, StatusBar } from "react-native";
import AnimalRecordsItem from "@/components/animal-records/animal-records-item";
import DeleteConfirmationModal from "@/components/animal-records/delete-confirmation-modal";
import { getAllRecords } from "@/utils/records-data";
import { IRecordModel } from "@/utils/types";

export default function AnimalRecordsHome() {
  const [records, setRecords] = useState<IRecordModel[]>([]);
  const [recordToDelete, setRecordToDelete] = useState<IRecordModel | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchRecordsFromDB = async () => {
      const dbRecords = await getAllRecords();
      setRecords(dbRecords);
    };

    fetchRecordsFromDB();
  }, []);

  const handleView = () => {
    console.log("Viewing record");
  };

  const handleEdit = () => {
    console.log("Editing record");
  };

  const handleDelete = (item: IRecordModel) => {
    setIsModalVisible(true);
    setRecordToDelete(item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
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
      <DeleteConfirmationModal
        visible={isModalVisible}
        record={records[0]}
        onClose={() => setIsModalVisible(false)}
        onConfirm={() => {
          setRecords(
            records.filter((record) => record.id !== recordToDelete?.id),
          );
        }}
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

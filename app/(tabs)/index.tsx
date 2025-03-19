import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  View,
} from "react-native";
import AnimalRecordsItem from "@/components/animal-records/animal-records-item";
import DeleteConfirmationModal from "@/components/animal-records/delete-confirmation-modal";
import { IRecordModel } from "@/utils/types";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/utils/db";
import { recordsTable } from "@/utils/models";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { desc } from "drizzle-orm";

export default function AnimalRecordsHome() {
  const [recordToDelete, setRecordToDelete] = useState<IRecordModel | null>(
    null,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data } = useLiveQuery(
    db.select().from(recordsTable).orderBy(desc(recordsTable.createdAt)),
  );
  const router = useRouter();

  const handleView = (id: number) => {
    router.navigate(`/view/${id}`);
  };

  const handleEdit = (id: number) => {
    router.navigate(`/edit/${id}`);
  };

  const handleDelete = (item: IRecordModel) => {
    setIsModalVisible(true);
    setRecordToDelete(item);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <AnimalRecordsItem
              item={item}
              onView={() => handleView(item.id)}
              onEdit={() => handleEdit(item.id)}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.list}
        />
      ) : (
        <View style={styles.infoContainer}>
          <Feather name="info" size={20} color="gray" />
          <Text style={styles.infoText}>You have no records</Text>
        </View>
      )}
      <DeleteConfirmationModal
        visible={isModalVisible}
        record={recordToDelete}
        onClose={() => setIsModalVisible(false)}
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
  infoContainer: {
    flexDirection: "row",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  infoText: {
    color: "gray",
    fontSize: 18,
  },
});

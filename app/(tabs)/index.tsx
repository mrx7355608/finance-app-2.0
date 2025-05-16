import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import AnimalRecordsItem from "@/components/animal-records/animal-records-item";
import DeleteConfirmationModal from "@/components/animal-records/delete-confirmation-modal";
import { IRecordModel } from "@/utils/types";
import db from "@/utils/db";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { debounce } from "lodash";
import useRealtimePosts from "@/hooks/useRealtimeData";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export default function AnimalRecordsHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [recordToDelete, setRecordToDelete] = useState<IRecordModel | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<IRecordModel[]>([]);
  const [data, setData] = useState<IRecordModel[]>([]);
  const router = useRouter();

  // Callback for realtime data hook
  const callback = (
    payload: RealtimePostgresChangesPayload<{
      [key: string]: any;
    }>
  ) => {
    if (payload.eventType === "INSERT") {
      setRecords((prev) =>
        [...prev, payload.new as IRecordModel].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
      setData((prev) =>
        [...prev, payload.new as IRecordModel].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    }
    if (payload.eventType === "DELETE") {
      setRecords((prev) => prev.filter((rec) => rec.id !== payload.old.id));
      setData((prev) => prev.filter((rec) => rec.id !== payload.old.id));
    }
    if (payload.eventType === "UPDATE") {
      const newData = payload.new as IRecordModel;
      setRecords((prev) =>
        prev.map((rec) => (rec.id === newData.id ? newData : rec))
      );
      setData((prev) =>
        prev.map((rec) => (rec.id === newData.id ? newData : rec))
      );
    }
  };

  useRealtimePosts(callback);

  useEffect(() => {
    db.from("records")
      .select()
      .order("created_at", { ascending: false })
      .then((res) => {
        setData(res.data!);
        setRecords(res.data!);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setData(
      records
        .filter((rec) => rec.name.toLowerCase().includes(search.toLowerCase()))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    );
  }, [search]);

  const debouncedSearch = debounce((query) => {
    setSearch(query);
  }, 300);

  const handleSearch = (val: string) => {
    debouncedSearch(val);
  };

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View>
        <TextInput
          style={styles.input}
          onChangeText={handleSearch}
          placeholder="Type here to search"
          placeholderTextColor="#777777"
        />
      </View>

      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <AnimalRecordsItem
              item={item as IRecordModel}
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
  input: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 4,
    color: "#FFFFFF",
    padding: 12,
    fontSize: 16,
    marginTop: 4,
    marginBottom: 4,
    marginLeft: 12,
    marginRight: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

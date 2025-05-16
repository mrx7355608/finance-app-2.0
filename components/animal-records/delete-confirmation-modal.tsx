import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { IRecordModel } from "@/utils/types";
import { useServices } from "@/context/services.context";

type Props = {
  visible: boolean;
  record: IRecordModel | null;
  onClose: () => void;
};

export default function DeleteConfirmationModal({
  visible,
  record,
  onClose,
}: Props) {
  const { recordsService } = useServices();
  const [isLoading, setIsLoading] = useState(false);
  if (!record) return null;

  const deleteRecordWithExpenses = async () => {
    setIsLoading(true);
    try {
      await recordsService.deleteRecord(record.id);
      onClose();
    } catch (err) {
      console.log(err);
      alert("Unable to delete record");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Feather name="alert-triangle" size={24} color="#FF5252" />
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalText}>
              Are you sure you want to delete the record for{" "}
              <Text style={styles.animalName}>{record.name}</Text>?
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={deleteRecordWithExpenses}
            >
              <Feather name="trash-2" size={16} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>
                {isLoading ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#1E1E1E",
    borderRadius: 6,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#333333",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalBody: {
    padding: 16,
  },
  modalText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  animalName: {
    fontWeight: "bold",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#AAAAAA",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF5252",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 6,
  },
});

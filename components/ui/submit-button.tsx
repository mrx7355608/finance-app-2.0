import React from "react";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  loading: boolean;
  text: string;
  loadingText: string;
  handlePress: () => Promise<void>;
};

export default function SubmitButton({
  text,
  loading,
  loadingText,
  handlePress,
}: Props) {
  return (
    <TouchableOpacity
      style={styles.saveButton}
      onPress={handlePress}
      disabled={loading}
    >
      <Feather name="save" size={18} color="#121212" />
      <Text style={styles.saveButtonText}>{loading ? loadingText : text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#64FFDA",
    padding: 14,
    borderRadius: 4,
    marginTop: 20,
  },
  saveButtonText: {
    color: "#121212",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 16,
  },
});

import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

type Props = {
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  inputMode?: string;
  handleChange: Dispatch<SetStateAction<string>> | ((val: string) => void);
};

export default function Input({
  label,
  value,
  placeholder,
  error,
  handleChange,
  inputMode = "numeric",
}: Props) {
  return (
    <View style={styles.formSection}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        placeholderTextColor="#777777"
        inputMode={inputMode}
      />
      {error && <Text style={styles.errorMessage}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 4,
    color: "#FFFFFF",
    padding: 12,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  errorMessage: {
    marginBottom: 10,
    marginTop: 8,
    color: "#ffbbaa",
  },
  formSection: {
    marginBottom: 20,
  },
});

import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: "#121212",
    width: "100%",
  },
  scrollContent: {
    padding: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 24,
  },
  formTitle2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  formSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 20,
  },

  // Text and input styles
  label: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 4,
    color: "#FFFFFF",
    padding: 12,
    fontSize: 16,
  },

  // Button styles
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#64FFDA",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: "#121212",
    fontWeight: "500",
    marginLeft: 4,
    fontSize: 14,
  },
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

  // Expense item styles
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#333333",
  },
  expenseItemText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  expenseAmount: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 4,
  },
  noExpensesText: {
    color: "#777777",
    fontStyle: "italic",
    textAlign: "center",
    padding: 12,
  },
  totalExpenses: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  totalExpensesText: {
    color: "#AAAAAA",
    fontSize: 14,
    fontWeight: "500",
  },

  // Profit section styles
  profitSection: {
    marginTop: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  profitText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profitPositive: {
    color: "#64FFDA",
  },
  profitNegative: {
    color: "#FF5252",
  },

  // Image picker styles
  imagePickerContainer: {
    marginBottom: 20,
  },
  imagePickerPlaceholder: {
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 4,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 16,
  },
  imagePickerButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    flex: 1,
  },
  imagePickerText: {
    color: "#AAAAAA",
    marginTop: 8,
    textAlign: "center",
  },
  imagePreviewContainer: {
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 4,
  },
  changeImageButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#64FFDA",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  changeImageText: {
    color: "#121212",
    fontWeight: "500",
    marginLeft: 4,
    fontSize: 14,
  },

  // Modal styles
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333333",
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  modalCancelButtonText: {
    color: "#AAAAAA",
    fontSize: 16,
  },
  modalSaveButton: {
    backgroundColor: "#64FFDA",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  modalSaveButtonText: {
    color: "#121212",
    fontSize: 16,
    fontWeight: "500",
  },
});

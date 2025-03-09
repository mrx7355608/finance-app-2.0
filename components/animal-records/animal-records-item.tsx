import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

// TODO: add types for the animal records
export default function AnimalRecordsItem({ item, onView, onEdit, onDelete }) {
  // Format the date to be more readable
  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>Created on {formattedDate}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.viewButton]}
            onPress={() => onView(item)}
          >
            <Feather name="eye" size={16} color="#121212" />
            <Text style={styles.buttonText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => onEdit(item)}
          >
            <Feather name="edit-2" size={16} color="#121212" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => onDelete(item)}
          >
            <Feather name="trash-2" size={16} color="#121212" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E1E1E", // Dark card background
    borderRadius: 6, // Reduced border radius
    marginBottom: 12,
    overflow: "hidden",
    borderColor: "#333333",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF", // Light text for dark background
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#AAAAAA", // Subtle gray text
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4, // Reduced border radius for buttons
    flex: 1,
    marginHorizontal: 3,
  },
  viewButton: {
    backgroundColor: "#64FFDA", // Teal accent
  },
  editButton: {
    backgroundColor: "#FFAB40", // Amber accent
  },
  deleteButton: {
    backgroundColor: "#FF5252", // Red accent
  },
  buttonText: {
    color: "#121212", // Dark text on light buttons for contrast
    fontWeight: "500",
    marginLeft: 4,
    fontSize: 12,
  },
});

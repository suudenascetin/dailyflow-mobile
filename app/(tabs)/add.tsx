import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useHabits } from "@/context/HabitContext";

const categories = [
  { name: "Health", icon: "💧", color: "#4FC3F7" },
  { name: "Study", icon: "📚", color: "#FFB74D" },
  { name: "Work", icon: "💻", color: "#9575CD" },
  { name: "Sport", icon: "🏃", color: "#81C784" },
  { name: "Mind", icon: "🧘", color: "#F06292" },
  { name: "Personal", icon: "⭐", color: "#5B4DFF" },
];

export default function AddScreen() {
  const { addHabit, isDarkMode } = useHabits();

  const colors = {
    background: isDarkMode ? "#11131A" : "#F6F7FB",
    card: isDarkMode ? "#1B1E29" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#1E1E2F",
    subText: isDarkMode ? "#A9ADBD" : "#7A7A89",
    input: isDarkMode ? "#2A2E3D" : "#F6F7FB",
    border: isDarkMode ? "#2A2E3D" : "#ECECF2",
    primary: "#5B4DFF",
    softPrimary: isDarkMode ? "#27233F" : "#EDEBFF",
  };

  const [habitName, setHabitName] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Health");

  const saveHabit = () => {
    if (habitName.trim() === "" || target.trim() === "" || unit.trim() === "") {
      Alert.alert("Missing Information", "Please fill all fields.");
      return;
    }

    if (Number(target) <= 0 || Number.isNaN(Number(target))) {
      Alert.alert("Invalid Target", "Target must be a positive number.");
      return;
    }

    addHabit(habitName.trim(), Number(target), unit.trim(), selectedCategory);

    Alert.alert("Habit Created", `${habitName} hedefi başarıyla oluşturuldu.`);

    setHabitName("");
    setTarget("");
    setUnit("");
    setSelectedCategory("Health");
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Add Habit</Text>

        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Create a new daily goal
        </Text>

        <View style={[styles.formCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.text }]}>Habit Name</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.input, color: colors.text },
            ]}
            placeholder="Example: Read Book"
            placeholderTextColor={colors.subText}
            value={habitName}
            onChangeText={setHabitName}
          />

          <Text style={[styles.label, { color: colors.text }]}>Target</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.input, color: colors.text },
            ]}
            placeholder="Example: 30"
            placeholderTextColor={colors.subText}
            value={target}
            onChangeText={setTarget}
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: colors.text }]}>Unit</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.input, color: colors.text },
            ]}
            placeholder="Example: minutes, glasses, hours"
            placeholderTextColor={colors.subText}
            value={unit}
            onChangeText={setUnit}
          />

          <Text style={[styles.label, { color: colors.text }]}>Category</Text>

          <View style={styles.categoryGrid}>
            {categories.map((category) => {
              const isSelected = selectedCategory === category.name;

              return (
                <TouchableOpacity
                  key={category.name}
                  style={[
                    styles.categoryButton,
                    {
                      backgroundColor: isSelected
                        ? category.color
                        : colors.input,
                      borderColor: isSelected ? category.color : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      { color: isSelected ? "#FFFFFF" : colors.text },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={saveHabit}>
            <Text style={styles.saveButtonText}>Create Habit</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.tipCard, { backgroundColor: colors.softPrimary }]}>
          <Text style={styles.tipTitle}>Tip</Text>
          <Text
            style={[
              styles.tipText,
              { color: isDarkMode ? "#D7D4FF" : "#4D4D5A" },
            ]}
          >
            Choose a clear category. It makes your habit list easier to scan and
            understand.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 22,
    paddingTop: 38,
    paddingBottom: 110,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 6,
    marginBottom: 24,
  },
  formCard: {
    borderRadius: 28,
    padding: 22,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  categoryButton: {
    width: "47%",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#5B4DFF",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 24,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  tipCard: {
    borderRadius: 22,
    padding: 18,
  },
  tipTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#5B4DFF",
    marginBottom: 6,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
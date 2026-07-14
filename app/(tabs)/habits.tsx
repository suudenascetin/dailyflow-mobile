import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Platform,
} from "react-native";
import { Habit, useHabits } from "@/context/HabitContext";

const categories = [
  "All",
  "Health",
  "Study",
  "Work",
  "Sport",
  "Mind",
  "Personal",
];

export default function HabitsScreen() {
  const {
    habits,
    increaseHabit,
    resetHabit,
    deleteHabit,
    updateHabit,
    isDarkMode,
  } = useHabits();

  const colors = {
    background: isDarkMode ? "#11131A" : "#F6F7FB",
    card: isDarkMode ? "#1B1E29" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#1E1E2F",
    subText: isDarkMode ? "#A9ADBD" : "#7A7A89",
    input: isDarkMode ? "#222635" : "#FFFFFF",
    softInput: isDarkMode ? "#2A2E3D" : "#F6F7FB",
    border: isDarkMode ? "#2A2E3D" : "#ECECF2",
    primary: "#5B4DFF",
    softPrimary: isDarkMode ? "#27233F" : "#EDEBFF",
    dangerBackground: isDarkMode ? "#3A1E24" : "#FFEBEE",
    dangerText: "#C62828",
  };

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [editUnit, setEditUnit] = useState("");

  const filteredHabits = habits.filter((habit) => {
    const matchesSearch = habit.title
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || habit.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDeleteHabit = (id: number, title: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        `"${title}" alışkanlığını silmek istediğine emin misin?`
      );

      if (confirmed) {
        deleteHabit(id);
      }

      return;
    }

    Alert.alert(
      "Delete Habit",
      `"${title}" alışkanlığını silmek istediğine emin misin?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteHabit(id),
        },
      ]
    );
  };

  const openEditModal = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditTitle(habit.title);
    setEditTarget(String(habit.target));
    setEditUnit(habit.unit);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedHabit(null);
    setEditTitle("");
    setEditTarget("");
    setEditUnit("");
  };

  const saveEdit = () => {
    if (!selectedHabit) {
      return;
    }

    if (
      editTitle.trim() === "" ||
      editTarget.trim() === "" ||
      editUnit.trim() === ""
    ) {
      Alert.alert("Missing Information", "Please fill all fields.");
      return;
    }

    if (Number(editTarget) <= 0 || Number.isNaN(Number(editTarget))) {
      Alert.alert("Invalid Target", "Target must be a positive number.");
      return;
    }

    updateHabit(
      selectedHabit.id,
      editTitle.trim(),
      Number(editTarget),
      editUnit.trim()
    );

    closeEditModal();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Habits</Text>

        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Track and filter your daily routines
        </Text>

        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.input,
              color: colors.text,
              borderColor: colors.border,
            },
          ]}
          placeholder="Search habits..."
          placeholderTextColor={colors.subText}
          value={searchText}
          onChangeText={setSearchText}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                  isSelected && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    { color: colors.subText },
                    isSelected && styles.selectedCategoryButtonText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.resultRow}>
          <Text style={[styles.resultText, { color: colors.subText }]}>
            Showing {filteredHabits.length} of {habits.length} habits
          </Text>
        </View>

        {filteredHabits.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No habits found
            </Text>
            <Text style={[styles.emptyText, { color: colors.subText }]}>
              Try another search keyword or category.
            </Text>
          </View>
        ) : (
          filteredHabits.map((habit) => {
            const percent = Math.min(
              Math.round((habit.current / habit.target) * 100),
              100
            );

            return (
              <View
                style={[styles.card, { backgroundColor: colors.card }]}
                key={habit.id}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[styles.iconBox, { backgroundColor: habit.color }]}
                  >
                    <Text style={styles.iconText}>{habit.icon}</Text>
                  </View>

                  <View style={styles.titleBox}>
                    <Text style={[styles.habitTitle, { color: colors.text }]}>
                      {habit.title}
                    </Text>
                    <Text style={[styles.habitSub, { color: colors.subText }]}>
                      {habit.current} / {habit.target} {habit.unit} •{" "}
                      {habit.category}
                    </Text>
                  </View>

                  <Text style={styles.percentText}>{percent}%</Text>
                </View>

                <View
                  style={[
                    styles.progressBackground,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${percent}%`,
                        backgroundColor: habit.color,
                      },
                    ]}
                  />
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: habit.color },
                    ]}
                    onPress={() => increaseHabit(habit.id)}
                  >
                    <Text style={styles.actionButtonText}>+ Progress</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.editButton,
                      { backgroundColor: colors.softPrimary },
                    ]}
                    onPress={() => openEditModal(habit)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.resetButton,
                      { backgroundColor: colors.softInput },
                    ]}
                    onPress={() => resetHabit(habit.id)}
                  >
                    <Text
                      style={[
                        styles.resetButtonText,
                        { color: colors.subText },
                      ]}
                    >
                      Reset
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.deleteButton,
                      { backgroundColor: colors.dangerBackground },
                    ]}
                    onPress={() => handleDeleteHabit(habit.id, habit.title)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Edit Habit
            </Text>

            <Text style={[styles.modalSubtitle, { color: colors.subText }]}>
              Update your habit information
            </Text>

            <Text style={[styles.label, { color: colors.text }]}>
              Habit Name
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.softInput, color: colors.text },
              ]}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="Habit name"
              placeholderTextColor={colors.subText}
            />

            <Text style={[styles.label, { color: colors.text }]}>Target</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.softInput, color: colors.text },
              ]}
              value={editTarget}
              onChangeText={setEditTarget}
              placeholder="Target"
              placeholderTextColor={colors.subText}
              keyboardType="numeric"
            />

            <Text style={[styles.label, { color: colors.text }]}>Unit</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.softInput, color: colors.text },
              ]}
              value={editUnit}
              onChangeText={setEditUnit}
              placeholder="Unit"
              placeholderTextColor={colors.subText}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: colors.softInput },
                ]}
                onPress={closeEditModal}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    { color: colors.subText },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  searchInput: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  categoryScroll: {
    marginBottom: 14,
  },
  categoryButton: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 22,
    marginRight: 10,
    borderWidth: 1,
  },
  selectedCategoryButton: {
    backgroundColor: "#5B4DFF",
    borderColor: "#5B4DFF",
  },
  categoryButtonText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  selectedCategoryButtonText: {
    color: "#FFFFFF",
  },
  resultRow: {
    marginBottom: 14,
  },
  resultText: {
    fontSize: 14,
    fontWeight: "600",
  },
  card: {
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  iconText: {
    fontSize: 24,
  },
  titleBox: {
    flex: 1,
  },
  habitTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  habitSub: {
    fontSize: 14,
    marginTop: 4,
  },
  percentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B4DFF",
  },
  progressBackground: {
    height: 10,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBar: {
    height: "100%",
    borderRadius: 20,
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  actionButton: {
    flexGrow: 1,
    paddingVertical: 13,
    borderRadius: 16,
    alignItems: "center",
    minWidth: "45%",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  editButton: {
    flexGrow: 1,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: "center",
    minWidth: "45%",
  },
  editButtonText: {
    color: "#5B4DFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  resetButton: {
    flexGrow: 1,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: "center",
    minWidth: "45%",
  },
  resetButtonText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  deleteButton: {
    flexGrow: 1,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: "center",
    minWidth: "45%",
  },
  deleteButtonText: {
    color: "#C62828",
    fontWeight: "bold",
    fontSize: 13,
  },
  emptyCard: {
    borderRadius: 24,
    padding: 26,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 38,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  modalSubtitle: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: 18,
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
  modalActionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#5B4DFF",
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
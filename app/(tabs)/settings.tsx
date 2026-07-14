import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { useHabits } from "@/context/HabitContext";

export default function SettingsScreen() {
  const { habits, resetAllHabits, isDarkMode, toggleDarkMode } = useHabits();

  const completedHabits = habits.filter(
    (habit) => habit.current >= habit.target
  ).length;

  const colors = {
    background: isDarkMode ? "#11131A" : "#F6F7FB",
    card: isDarkMode ? "#1B1E29" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#1E1E2F",
    subText: isDarkMode ? "#A9ADBD" : "#7A7A89",
    divider: isDarkMode ? "#2A2E3D" : "#ECECF2",
    primary: "#5B4DFF",
    softPrimary: isDarkMode ? "#27233F" : "#EDEBFF",
    dangerBackground: isDarkMode ? "#3A1E24" : "#FFEBEE",
    dangerText: "#C62828",
  };

  const completedPercent =
    habits.length === 0
      ? 0
      : Math.round((completedHabits / habits.length) * 100);

  const handleResetAll = () => {
    Alert.alert(
      "Reset All Data",
      "Tüm habit verilerini sıfırlamak istediğine emin misin?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset",
          style: "destructive",
          onPress: resetAllHabits,
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Manage your DailyFlow app
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>D</Text>
          </View>

          <View>
            <Text style={styles.appName}>DailyFlow</Text>
            <Text style={styles.appSub}>Habit Tracker App</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          App Summary
        </Text>

        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>
              Total Habits
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {habits.length}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>
              Completed Today
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {completedHabits}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>
              Completion Rate
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {completedPercent}%
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.divider }]} />

          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>
              Version
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              1.0.0
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Appearance
        </Text>

        <View style={[styles.settingRow, { backgroundColor: colors.card }]}>
          <View style={styles.settingTextBox}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Text style={[styles.settingSub, { color: colors.subText }]}>
              Use a darker interface theme
            </Text>
          </View>

          <Switch
            value={isDarkMode}
            onValueChange={toggleDarkMode}
            trackColor={{
              false: "#D1D5DB",
              true: "#A59BFF",
            }}
            thumbColor={isDarkMode ? "#5B4DFF" : "#FFFFFF"}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data</Text>

        <TouchableOpacity
          style={[
            styles.resetButton,
            { backgroundColor: colors.dangerBackground },
          ]}
          onPress={handleResetAll}
        >
          <Text style={styles.resetButtonText}>Reset All Data</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.softPrimary },
          ]}
        >
          <Text style={styles.infoTitle}>About DailyFlow</Text>
          <Text
            style={[
              styles.infoText,
              { color: isDarkMode ? "#D7D4FF" : "#4D4D5A" },
            ]}
          >
            DailyFlow helps you track small daily goals and build better
            routines with simple progress cards, streaks, history, and
            statistics.
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
  profileCard: {
    backgroundColor: "#5B4DFF",
    borderRadius: 30,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  logoText: {
    color: "#5B4DFF",
    fontSize: 28,
    fontWeight: "bold",
  },
  appName: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
  },
  appSub: {
    color: "#EDEBFF",
    fontSize: 15,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 14,
  },
  summaryCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
  },
  settingRow: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  settingTextBox: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  settingSub: {
    fontSize: 14,
    marginTop: 4,
  },
  resetButton: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginBottom: 24,
  },
  resetButtonText: {
    color: "#C62828",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoCard: {
    borderRadius: 24,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B4DFF",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
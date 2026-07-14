import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useHabits } from "@/context/HabitContext";

export default function StatsScreen() {
  const { habits, isDarkMode } = useHabits();

  const colors = {
    background: isDarkMode ? "#11131A" : "#F6F7FB",
    card: isDarkMode ? "#1B1E29" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#1E1E2F",
    subText: isDarkMode ? "#A9ADBD" : "#7A7A89",
    progressBackground: isDarkMode ? "#2A2E3D" : "#ECECF2",
    primary: "#5B4DFF",
    softPrimary: isDarkMode ? "#27233F" : "#EDEBFF",
  };

  const totalHabits = habits.length;

  const completedHabits = habits.filter(
    (habit) => habit.current >= habit.target
  ).length;

  const activeHabits = totalHabits - completedHabits;

  const totalActions = habits.reduce((sum, habit) => {
    return sum + habit.current;
  }, 0);

  const averageProgress =
    totalHabits === 0
      ? 0
      : Math.round(
          habits.reduce((sum, habit) => {
            const percent = Math.min((habit.current / habit.target) * 100, 100);
            return sum + percent;
          }, 0) / totalHabits
        );

  const bestHabit =
    habits.length === 0
      ? null
      : habits.reduce((best, habit) => {
          const bestPercent = best.current / best.target;
          const habitPercent = habit.current / habit.target;

          return habitPercent > bestPercent ? habit : best;
        });

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Stats</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Your daily progress summary
        </Text>

        <View style={styles.bigCard}>
          <Text style={styles.bigLabel}>Overall Progress</Text>
          <Text style={styles.bigNumber}>{averageProgress}%</Text>
          <Text style={styles.bigText}>
            {completedHabits} of {totalHabits} habits completed today.
          </Text>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${averageProgress}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.smallCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.smallNumber, { color: colors.text }]}>
              {totalHabits}
            </Text>
            <Text style={[styles.smallText, { color: colors.subText }]}>
              Total Habits
            </Text>
          </View>

          <View style={[styles.smallCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.smallNumber, { color: colors.text }]}>
              {completedHabits}
            </Text>
            <Text style={[styles.smallText, { color: colors.subText }]}>
              Completed
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.smallCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.smallNumber, { color: colors.text }]}>
              {activeHabits}
            </Text>
            <Text style={[styles.smallText, { color: colors.subText }]}>
              Active
            </Text>
          </View>

          <View style={[styles.smallCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.smallNumber, { color: colors.text }]}>
              {totalActions}
            </Text>
            <Text style={[styles.smallText, { color: colors.subText }]}>
              Total Actions
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Habit Progress
        </Text>

        {habits.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No data yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.subText }]}>
              Add habits and track progress to see your statistics.
            </Text>
          </View>
        ) : (
          habits.map((habit) => {
            const percent = Math.min(
              Math.round((habit.current / habit.target) * 100),
              100
            );

            return (
              <View
                style={[styles.progressCard, { backgroundColor: colors.card }]}
                key={habit.id}
              >
                <View style={styles.progressTop}>
                  <View style={styles.progressTitleRow}>
                    <Text style={styles.habitIcon}>{habit.icon}</Text>
                    <Text style={[styles.habitTitle, { color: colors.text }]}>
                      {habit.title}
                    </Text>
                  </View>

                  <Text style={styles.percentText}>{percent}%</Text>
                </View>

                <Text style={[styles.progressSub, { color: colors.subText }]}>
                  {habit.current} / {habit.target} {habit.unit}
                </Text>

                <View
                  style={[
                    styles.habitProgressBackground,
                    { backgroundColor: colors.progressBackground },
                  ]}
                >
                  <View
                    style={[
                      styles.habitProgressBar,
                      {
                        width: `${percent}%`,
                        backgroundColor: habit.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Best Habit
        </Text>

        {bestHabit ? (
          <View style={[styles.bestCard, { backgroundColor: colors.card }]}>
            <Text style={styles.bestIcon}>{bestHabit.icon}</Text>

            <View>
              <Text style={[styles.bestTitle, { color: colors.text }]}>
                {bestHabit.title}
              </Text>
              <Text style={[styles.bestSub, { color: colors.subText }]}>
                {Math.min(
                  Math.round((bestHabit.current / bestHabit.target) * 100),
                  100
                )}
                % completed
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No best habit yet
            </Text>
          </View>
        )}
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
  bigCard: {
    backgroundColor: "#5B4DFF",
    borderRadius: 30,
    padding: 26,
    marginBottom: 18,
  },
  bigLabel: {
    color: "#EDEBFF",
    fontSize: 16,
    fontWeight: "700",
  },
  bigNumber: {
    color: "#FFFFFF",
    fontSize: 62,
    fontWeight: "bold",
    marginTop: 10,
  },
  bigText: {
    color: "#EDEBFF",
    fontSize: 15,
    marginTop: 4,
    marginBottom: 18,
  },
  progressBackground: {
    height: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  smallCard: {
    flex: 1,
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  smallNumber: {
    fontSize: 34,
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 14,
    marginBottom: 14,
  },
  progressCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  habitTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  percentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5B4DFF",
  },
  progressSub: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  habitProgressBackground: {
    height: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  habitProgressBar: {
    height: "100%",
    borderRadius: 20,
  },
  bestCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  bestIcon: {
    fontSize: 36,
    marginRight: 14,
  },
  bestTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  bestSub: {
    fontSize: 14,
    marginTop: 4,
  },
  emptyCard: {
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
});
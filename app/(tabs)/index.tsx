import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useHabits } from "@/context/HabitContext";
import CircularProgress from "@/components/CircularProgress";

export default function HomeScreen() {
  const { habits, streak, isDarkMode } = useHabits();

  const colors = {
    background: isDarkMode ? "#11131A" : "#F6F7FB",
    card: isDarkMode ? "#1B1E29" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#1E1E2F",
    subText: isDarkMode ? "#A9ADBD" : "#7A7A89",
    progressBackground: isDarkMode ? "#2A2E3D" : "#ECECF2",
    primary: "#5B4DFF",
    softOrange: isDarkMode ? "#3A2A16" : "#FFF3E0",
    orangeBox: "#FFB74D",
    orangeText: isDarkMode ? "#FFCC80" : "#E65100",
    orangeSubText: isDarkMode ? "#FFDCA8" : "#8A5A20",
  };

  const totalHabits = habits.length;

  const completedHabits = habits.filter(
    (habit) => habit.current >= habit.target
  ).length;

  const totalProgress =
    habits.length === 0
      ? 0
      : Math.round(
          habits.reduce((sum, habit) => {
            const percent = Math.min((habit.current / habit.target) * 100, 100);
            return sum + percent;
          }, 0) / habits.length
        );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>
              Good Morning
            </Text>
            <Text style={[styles.dateText, { color: colors.subText }]}>
              Today’s DailyFlow
            </Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>D</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTextBox}>
            <Text style={styles.heroLabel}>Today’s Progress</Text>
            <Text style={styles.heroDescription}>
              {completedHabits} of {totalHabits} daily goals completed.
            </Text>
          </View>

          <CircularProgress
            size={138}
            strokeWidth={13}
            progress={totalProgress}
            color="#FFFFFF"
            backgroundColor="rgba(255,255,255,0.25)"
            textColor="#FFFFFF"
          />
        </View>

        <View
          style={[
            styles.streakCard,
            { backgroundColor: colors.softOrange },
          ]}
        >
          <View style={styles.streakIconBox}>
            <Text style={styles.streakIcon}>🔥</Text>
          </View>

          <View style={styles.streakTextBox}>
            <Text style={[styles.streakTitle, { color: colors.orangeText }]}>
              {streak} Day Streak
            </Text>
            <Text style={[styles.streakSub, { color: colors.orangeSubText }]}>
              {streak > 0
                ? "You stayed consistent. Keep your routine alive."
                : "Complete one habit today to start your streak."}
            </Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryNumber, { color: colors.text }]}>
              {totalHabits}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>
              Goals
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryNumber, { color: colors.text }]}>
              {totalHabits - completedHabits}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>
              Active
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryNumber, { color: colors.text }]}>
              {completedHabits}
            </Text>
            <Text style={[styles.summaryLabel, { color: colors.subText }]}>
              Done
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Today’s Habits
        </Text>

        {habits.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No habits yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.subText }]}>
              Add your first daily goal from the Add tab.
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
                style={[styles.habitCard, { backgroundColor: colors.card }]}
                key={habit.id}
              >
                <View style={[styles.iconBox, { backgroundColor: habit.color }]}>
                  <Text style={styles.iconText}>{habit.icon}</Text>
                </View>

                <View style={styles.habitContent}>
                  <View style={styles.habitTopRow}>
                    <Text style={[styles.habitTitle, { color: colors.text }]}>
                      {habit.title}
                    </Text>
                    <Text style={styles.habitPercent}>{percent}%</Text>
                  </View>

                  <Text style={[styles.habitProgress, { color: colors.subText }]}>
                    {habit.current} / {habit.target} {habit.unit}
                  </Text>

                  <View
                    style={[
                      styles.progressBackground,
                      { backgroundColor: colors.progressBackground },
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
                </View>
              </View>
            );
          })
        )}

        <Text style={[styles.quote, { color: colors.subText }]}>
          Small actions every day create strong routines.
        </Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 15,
    marginTop: 4,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#5B4DFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  heroCard: {
    backgroundColor: "#5B4DFF",
    borderRadius: 30,
    padding: 24,
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroTextBox: {
    flex: 1,
    paddingRight: 14,
  },
  heroLabel: {
    color: "#EDEBFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },
  heroDescription: {
    color: "#EDEBFF",
    fontSize: 15,
    lineHeight: 22,
  },
  streakCard: {
    borderRadius: 26,
    padding: 18,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  streakIconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#FFB74D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  streakIcon: {
    fontSize: 30,
  },
  streakTextBox: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  streakSub: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "bold",
  },
  summaryLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 14,
  },
  habitCard: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  iconText: {
    fontSize: 24,
  },
  habitContent: {
    flex: 1,
  },
  habitTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  habitTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  habitPercent: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#5B4DFF",
  },
  habitProgress: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 10,
  },
  progressBackground: {
    height: 9,
    borderRadius: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 20,
  },
  emptyCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  quote: {
    textAlign: "center",
    marginTop: 24,
    fontSize: 15,
    lineHeight: 22,
  },
});
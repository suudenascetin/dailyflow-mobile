import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useHabits } from "@/context/HabitContext";

export default function HistoryScreen() {
  const { history, isDarkMode } = useHabits();

  const colors = {
    background: isDarkMode ? "#11131A" : "#F6F7FB",
    card: isDarkMode ? "#1B1E29" : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#1E1E2F",
    subText: isDarkMode ? "#A9ADBD" : "#7A7A89",
    primary: "#5B4DFF",
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>History</Text>
        <Text style={[styles.subtitle, { color: colors.subText }]}>
          Your previous daily summaries
        </Text>

        {history.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No history yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.subText }]}>
              Daily history will appear here after a new day starts.
            </Text>
          </View>
        ) : (
          history.map((item) => (
            <View
              style={[styles.historyCard, { backgroundColor: colors.card }]}
              key={item.date}
            >
              <View style={styles.historyTop}>
                <Text style={[styles.dateText, { color: colors.text }]}>
                  {item.date}
                </Text>
                <Text style={styles.percentText}>{item.averageProgress}%</Text>
              </View>

              <Text style={[styles.summaryText, { color: colors.subText }]}>
                {item.completedHabits} of {item.totalHabits} habits completed
              </Text>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${item.averageProgress}%` },
                  ]}
                />
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                  <Text style={styles.infoValue}>{item.totalActions}</Text>
                  <Text style={styles.infoLabel}>Actions</Text>
                </View>

                <View style={styles.infoBox}>
                  <Text style={styles.infoValue}>{item.completedHabits}</Text>
                  <Text style={styles.infoLabel}>Done</Text>
                </View>
              </View>
            </View>
          ))
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
    lineHeight: 22,
  },
  historyCard: {
    borderRadius: 26,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  historyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  percentText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5B4DFF",
  },
  summaryText: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 14,
  },
  progressBackground: {
    height: 10,
    backgroundColor: "#ECECF2",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#5B4DFF",
    borderRadius: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#EDEBFF",
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },
  infoValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5B4DFF",
  },
  infoLabel: {
    fontSize: 13,
    color: "#5B4DFF",
    marginTop: 3,
  },
});
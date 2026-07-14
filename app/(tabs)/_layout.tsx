import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { HabitProvider, useHabits } from "@/context/HabitContext";

function TabsContent() {
  const { isDarkMode } = useHabits();

  const colors = {
    tabBackground: isDarkMode ? "#1B1E29" : "#FFFFFF",
    active: "#5B4DFF",
    inactive: isDarkMode ? "#A9ADBD" : "#9A9AA5",
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          height: 74,
          paddingBottom: 12,
          paddingTop: 8,
          backgroundColor: colors.tabBackground,
          borderTopWidth: 0,
          elevation: 14,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>⌂</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="habits"
        options={{
          title: "Habits",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>✓</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>▣</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>＋</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>↺</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 22, color }}>⚙</Text>
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  return (
    <HabitProvider>
      <TabsContent />
    </HabitProvider>
  );
}
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

type CircularProgressProps = {
  size: number;
  strokeWidth: number;
  progress: number;
  color: string;
  backgroundColor: string;
  textColor: string;
};

export default function CircularProgress({
  size,
  strokeWidth,
  progress,
  color,
  backgroundColor,
  textColor,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const strokeDashoffset =
    circumference - (circumference * safeProgress) / 100;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />

        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.textContainer}>
        <Text style={[styles.percentText, { color: textColor }]}>
          {safeProgress}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  percentText: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
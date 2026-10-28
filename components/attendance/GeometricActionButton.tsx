import { Ionicons } from "@expo/vector-icons";
import Svg, { Polygon } from "react-native-svg";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";

type GeometricActionButtonProps = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  trailing?: ReactNode;
};

export default function GeometricActionButton({
  label,
  icon,
  onPress,
  trailing,
}: GeometricActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Svg
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <Polygon
          points="6,1 94,1 99,14 99,84 92,99 7,99 1,86 1,15"
          fill="#08245E"
          stroke="#2D8BFF"
          strokeWidth="1.4"
        />
        <Polygon
          points="8,4 92,4 96,16 96,82 90,95 10,95 4,84 4,17"
          fill="none"
          stroke="#72C5FF"
          strokeWidth="0.7"
        />
        <Polygon
          points="83,100 96,83 99,86 89,100"
          fill="#FF9200"
          stroke="#FF9200"
          strokeWidth="0.8"
        />
      </Svg>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={29} color="#FFFFFF" />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.arrowCircle}>
        {trailing ?? (
          <Ionicons name="chevron-forward" size={30} color="#FFFFFF" />
        )}
      </View>
      <View pointerEvents="none" style={styles.orangeSlash} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: 78,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    overflow: "hidden",
    borderWidth: 0,
    elevation: 5,
    shadowColor: "#1266FF",
    shadowOpacity: 0.28,
    shadowRadius: 9,
    shadowOffset: { width: 0, height: 4 },
    alignSelf: "center",
  },

  pressed: {
    opacity: 0.82,
  },
  iconBox: {
    width: 48,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#6682B2",
    marginRight: 16,
  },
  label: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  arrowCircle: {
    width: 49,
    height: 49,
    borderRadius: 25,
    backgroundColor: "#0878F9",
    borderWidth: 1,
    borderColor: "#62B7FF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  orangeSlash: {
    position: "absolute",
    right: 72,
    bottom: -14,
    width: 5,
    height: 43,
    backgroundColor: "#FF9200",
    transform: [{ rotate: "42deg" }],
  },
});

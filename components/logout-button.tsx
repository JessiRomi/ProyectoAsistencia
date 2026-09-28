import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

import { useSession } from "../features/auth/useSession";

export default function LogoutButton() {
  const { logout } = useSession();

  async function handleLogout() {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
      onPress={handleLogout}
    >
      <Text style={styles.text}>Cerrar sesión</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#4070B2",
    marginTop: 16,
  },

  pressed: {
    opacity: 0.7,
  },

  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
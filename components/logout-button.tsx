import { router } from "expo-router";

import { AppButton } from "@/components/ui/AppButton";
import { useSession } from "@/features/auth/useSession";

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
    <AppButton
      label="Cerrar sesión"
      onPress={handleLogout}
      variant="danger"
      size="medium"
      fullWidth
    />
  );
}

import { router } from "expo-router";
import { AppButton } from "@/components/ui/AppButton";
import { useSession } from "@/features/auth/useSession";

// Botón reutilizable para cerrar la sesión del usuario
export default function LogoutButton() {
  const { logout } = useSession();

  // Cierra la sesión y redirige al usuario al inicio de sesión
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

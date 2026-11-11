import { AppButton, type AppButtonProps } from "@/components/ui/AppButton";

// Define las propiedades del botón reutilizable a partir de AppButtonProps
type GeometricActionButtonProps = {
  label: string;
  icon: AppButtonProps["icon"];
  onPress: () => void;
  variant?: AppButtonProps["variant"];
  disabled?: boolean;
  loading?: boolean;
};

// Encapsula AppButton con una configuración visual y funcional estandarizada
export default function GeometricActionButton({
  label,
  icon,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
}: GeometricActionButtonProps) {
  return (
    <AppButton
      label={label}
      icon={icon}
      onPress={onPress}
      variant={variant}
      size="large"
      fullWidth
      disabled={disabled}
      loading={loading}
    />
  );
}

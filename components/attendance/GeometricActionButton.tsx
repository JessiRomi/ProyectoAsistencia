import { AppButton } from "@/components/ui/AppButton";

type GeometricActionButtonProps = {
  label: string;
  icon: Parameters<typeof AppButton>[0]["icon"];
  onPress: () => void;
};

export default function GeometricActionButton({
  label,
  icon,
  onPress,
}: GeometricActionButtonProps) {
  return (
    <AppButton
      label={label}
      icon={icon}
      onPress={onPress}
      variant="primary"
      size="large"
      fullWidth
    />
  );
}

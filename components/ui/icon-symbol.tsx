import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleProp, TextStyle } from "react-native";

// Relaciona los nombres simbólicos con los iconos equivalentes de MaterialIcons
const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
} as const;

type IconSymbolName = keyof typeof MAPPING;

// Define las propiedades necesarias para configurar el icono
type IconSymbolProps = {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
};

// Renderiza un icono de MaterialIcons a partir de un nombre simbólico
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: IconSymbolProps) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}

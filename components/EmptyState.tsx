import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "inbox",
  title,
  message,
}) => {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 justify-center items-center p-5"
      style={{ backgroundColor: colors.background }}
    >
      <Feather name={icon} size={64} color={colors.textSecondary} />
      <Text
        className="mt-4 mb-2 text-lg font-bold text-center"
        style={{ color: colors.text }}
      >
        {title}
      </Text>
      <Text
        className="text-sm text-center leading-5"
        style={{ color: colors.textSecondary }}
      >
        {message}
      </Text>
    </View>
  );
};

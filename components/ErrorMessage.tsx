import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-center m-4 p-4 rounded-lg border"
      style={{ backgroundColor: colors.card, borderColor: colors.error }}
    >
      <Feather name="alert-circle" size={24} color={colors.error} />
      <Text
        className="ml-3 flex-1 text-sm"
        style={{ color: colors.error }}
      >
        {message}
      </Text>
    </View>
  );
};

import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  fullScreen = false,
}) => {
  const { colors } = useTheme();

  if (fullScreen) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size={size} color={colors.primary} />
      </View>
    );
  }

  return (
    <View className="p-5 justify-center items-center">
      <ActivityIndicator size={size} color={colors.primary} />
    </View>
  );
};

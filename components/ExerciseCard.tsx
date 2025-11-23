import { Feather } from "@expo/vector-icons";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Exercise } from "../types";

interface ExerciseCardProps {
  exercise: Exercise;
  onPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onPress,
  onFavoritePress,
  isFavorite = false,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="rounded-xl p-4 mb-4 shadow"
      style={{ backgroundColor: colors.card }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Favorite Button */}
      {onFavoritePress && (
        <TouchableOpacity
          className="absolute top-3 right-3 p-1 z-10"
          onPress={onFavoritePress}
        >
          <Feather
            name="heart"
            size={20}
            color={isFavorite ? colors.error : colors.textSecondary}
          />
        </TouchableOpacity>
      )}

      {/* Exercise Info */}
      <Text className="text-lg font-bold mb-1" style={{ color: colors.text }}>
        {exercise.name}
      </Text>
      <Text
        className="text-sm mb-1"
        style={{ color: colors.textSecondary }}
      >
        Muscle: {exercise.muscle} | Equipment: {exercise.equipment} | Difficulty:{" "}
        {exercise.difficulty}
      </Text>
      <Text
        className="text-sm mb-2"
        style={{ color: colors.textSecondary }}
        numberOfLines={3}
      >
        Instructions: {exercise.instructions}
      </Text>

     
      <TouchableOpacity
        className="mt-2 px-4 py-2 rounded-full items-center"
        style={{ backgroundColor: colors.primary }} 
        onPress={onPress}
      >
        <Text className="text-white font-bold">View Details</Text>
      </TouchableOpacity>

    
    </TouchableOpacity>
  );
};


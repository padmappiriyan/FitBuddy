import { EmptyState } from "@/components/EmptyState";
import { ExerciseCard } from "@/components/ExerciseCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  loadFavorites,
  removeFavoriteExercise,
} from "@/redux/slices/favoriteSlice";
import { Exercise } from "@/types/index";
import { useEffect, useMemo } from "react";
import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { favoriteExercises, isLoading } = useAppSelector(
    (state) => state.favorites
  );

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  const exercisesByMuscle = useMemo(() => {
    const grouped: { [key: string]: Exercise[] } = {};
    favoriteExercises.forEach((exercise) => {
      const muscle = exercise.muscle || "Other";
      if (!grouped[muscle]) grouped[muscle] = [];
      grouped[muscle].push(exercise);
    });
    return grouped;
  }, [favoriteExercises]);

  const muscleGroups = Object.keys(exercisesByMuscle).sort();

  const handleRemoveFavorite = (exercise: Exercise) => {
    dispatch(removeFavoriteExercise(exercise.name));
  };

  const handleExercisePress = (exercise: Exercise) => {
    router.push({
      pathname: "/match/[id]",
      params: { id: exercise.name, exercise: JSON.stringify(exercise) },
    });
  };

  const renderExercise = ({ item }: { item: Exercise }) => (
    <ExerciseCard
      exercise={item}
      onPress={() => handleExercisePress(item)}
      onFavoritePress={() => handleRemoveFavorite(item)}
      isFavorite={true}
    />
  );

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Updated Header → GREEN THEME */}
      <LinearGradient
        colors={["#84cc16", "#65a30d"]} // GREEN COLORS
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-14 pb-8 rounded-b-3xl"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Text className="text-4xl mr-3">💚</Text>
            <View>
              <Text className="text-white text-3xl font-black tracking-tight">
                Favorites
              </Text>
              <Text className="text-white/80 text-sm font-medium mt-1">
                Your workout collection
              </Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="flex-row justify-between">
          <View className="bg-white/20 backdrop-blur-lg rounded-2xl px-4 py-3 flex-1 mr-2">
            <Text className="text-white/70 text-xs font-semibold tracking-wide">
              TOTAL SAVED
            </Text>
            <Text className="text-white text-2xl font-black mt-1">
              {favoriteExercises.length}
            </Text>
          </View>
          <View className="bg-white/20 backdrop-blur-lg rounded-2xl px-4 py-3 flex-1 ml-2">
            <Text className="text-white/70 text-xs font-semibold tracking-wide">
              CATEGORIES
            </Text>
            <Text className="text-white text-2xl font-black mt-1">
              {muscleGroups.length}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {favoriteExercises.length > 0 && (
        <View className="px-6 py-4">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-sm font-semibold"
              style={{ color: colors.textSecondary }}
            >
              {favoriteExercises.length} exercise
              {favoriteExercises.length !== 1 ? "s" : ""} saved
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              className="bg-lime-500 px-4 py-2 rounded-full"
            >
              <Text className="text-black text-xs font-bold tracking-wide">
                CREATE WORKOUT
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Muscle Group Tags */}
      {favoriteExercises.length > 0 && muscleGroups.length > 1 && (
        <View className="px-6 pb-3">
          <Text
            className="text-xs font-bold tracking-wider mb-2"
            style={{ color: colors.textSecondary }}
          >
            BY MUSCLE GROUP
          </Text>

          <View className="flex-row flex-wrap">
            {muscleGroups.map((muscle) => (
              <View
                key={muscle}
                className="bg-gray-200 dark:bg-gray-800 px-3 py-1.5 rounded-full mr-2 mb-2"
              >
                <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {muscle} ({exercisesByMuscle[muscle].length})
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Exercise List */}
      <FlatList
        data={favoriteExercises}
        renderItem={renderExercise}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
          flexGrow: 1,
        }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <View className="relative mb-6">
              <View className="w-32 h-32 bg-lime-500/20 rounded-full items-center justify-center">
                <Text className="text-6xl">💚</Text>
              </View>
              <View className="absolute -bottom-2 -right-2 w-12 h-12 bg-lime-500 rounded-full items-center justify-center">
                <Text className="text-2xl">+</Text>
              </View>
            </View>

            <EmptyState
              title="No favorites yet"
              message="Start adding your favorite exercises from the home screen"
            />

            <TouchableOpacity
              onPress={() => router.push("/(tabs)")}
              activeOpacity={0.7}
              className="mt-8"
            >
              <LinearGradient
                colors={["#84cc16", "#65a30d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="px-8 py-4 rounded-2xl flex-row items-center"
              >
                <Text className="text-black text-base font-bold tracking-wide mr-2">
                  EXPLORE EXERCISES
                </Text>
                <Text className="text-black text-xl font-bold">→</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

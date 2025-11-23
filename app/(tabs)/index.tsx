import { ExerciseCard } from "@/components/ExerciseCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addFavoriteExercise,
  loadFavorites,
} from "@/redux/slices/favoriteSlice";
import { fetchExercises } from "@/redux/slices/exercisesSlice";
import { Exercise } from "@/types";
import { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { exercises, isLoading, error } = useAppSelector(
    (state) => state.exercises
  );
  const { favoriteExercises } = useAppSelector((state) => state.favorites);
  const { user } = useAppSelector((state) => state.auth);

  const categories = ["All", "Chest", "Back", "Legs", "Arms", "Core"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    dispatch(fetchExercises());
    dispatch(loadFavorites());
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    loadData();
  }, [loadData]);

  // ⭐ Only ADD to favorites — never remove
  const handleFavoritePress = useCallback(
    (exercise: Exercise) => {
      const alreadyFav = favoriteExercises.some(
        (fav) => fav.name === exercise.name
      );
      if (!alreadyFav) {
        dispatch(addFavoriteExercise(exercise));
      }
    },
    [favoriteExercises, dispatch]
  );

  const isFavorite = useCallback(
    (exerciseName: string) =>
      favoriteExercises.some((fav) => fav.name === exerciseName),
    [favoriteExercises]
  );

  const handleExercisePress = useCallback((exercise: Exercise) => {
    router.push({
      pathname: "/match/[id]",
      params: { id: exercise.name, exercise: JSON.stringify(exercise) },
    });
  }, []);

  const filteredExercises =
    selectedCategory === "All"
      ? exercises
      : exercises.filter((ex) =>
          ex.muscle?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  const renderExercise = useCallback(
    ({ item }: { item: Exercise }) => (
      <ExerciseCard
        exercise={item}
        onPress={() => handleExercisePress(item)}
        onFavoritePress={() => handleFavoritePress(item)}
        isFavorite={isFavorite(item.name)}
      />
    ),
    [handleExercisePress, handleFavoritePress, isFavorite]
  );

  if (isLoading && exercises.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <LinearGradient
        colors={["#84cc16", "#65a30d"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="px-6 pt-14 pb-8 rounded-b-3xl"
      >
        <View className="mb-6">
          <Text className="text-white/80 text-sm font-medium tracking-wide">
            WELCOME BACK
          </Text>
          <Text className="text-white text-3xl font-black mt-1 tracking-tight">
            {user?.username || "User"}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <View className="bg-white/20 backdrop-blur-lg rounded-2xl px-4 py-3 flex-1 mr-2">
            <Text className="text-white/70 text-xs font-semibold tracking-wide">
              EXERCISES
            </Text>
            <Text className="text-white text-2xl font-black mt-1">
              {exercises.length}
            </Text>
          </View>
          <View className="bg-white/20 backdrop-blur-lg rounded-2xl px-4 py-3 flex-1 ml-2">
            <Text className="text-white/70 text-xs font-semibold tracking-wide">
              FAVORITES
            </Text>
            <Text className="text-white text-2xl font-black mt-1">
              {favoriteExercises.length}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View className="py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
              className="mr-3"
            >
              <View
                className={`px-5 py-2.5 rounded-full ${
                  selectedCategory === category
                    ? "bg-lime-500"
                    : "bg-gray-200 dark:bg-gray-800"
                }`}
              >
                <Text
                  className={`font-bold text-sm tracking-wide ${
                    selectedCategory === category
                      ? "text-black"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {category}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="px-6 py-2">
        <Text
          className="text-sm font-semibold"
          style={{ color: colors.textSecondary }}
        >
          {filteredExercises.length} exercise
          {filteredExercises.length !== 1 ? "s" : ""} found
        </Text>
      </View>

      {error && (
        <View className="px-6 py-2">
          <ErrorMessage
            message={
              typeof error === "string"
                ? error
                : "Failed to load exercises"
            }
          />
        </View>
      )}

      <FlatList
        data={filteredExercises}
        renderItem={renderExercise}
        keyExtractor={(item) => `${item.name}-${item.muscle}`}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#84cc16"
            colors={["#84cc16"]}
          />
        }
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}

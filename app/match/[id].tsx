import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View, Image } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Exercise } from "../../types";
import {
  formatMuscle,
  formatDifficulty,
  truncateText,
} from "../../utils/helpers";
import { LinearGradient } from "expo-linear-gradient";

export default function ExerciseDetailsScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams();

  const exercise: Exercise = params.exercise
    ? JSON.parse(params.exercise as string)
    : null;

  if (!exercise) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-black">
        <Text className="text-lg text-black dark:text-white">
          Exercise not found
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* HEADER IMAGE / GRADIENT */}
        <View className="h-64 w-full relative">
          <LinearGradient
            colors={["#84cc16", "#65a30d"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-full w-full rounded-b-3xl"
          />

          {/* Floating Back Button */}
          <TouchableOpacity
            className="absolute top-12 left-5 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md 
                      justify-center items-center shadow-md"
            onPress={() => router.back()}
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 4,
            }}
          >
            <Feather name="arrow-left" size={26} color="white" />
          </TouchableOpacity>

          {/* TITLE */}
          <View className="absolute bottom-6 left-5">
            <Text className="text-3xl font-black text-white tracking-tight">
              {exercise.name}
            </Text>
            <Text className="text-white/90 font-medium mt-1">
              {formatMuscle(exercise.muscle)}
            </Text>
          </View>
        </View>

        {/* CONTENT SECTIONS */}
        <View className="mt-4 px-5">
          {/* Info Card */}
          <View
            className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-5 mb-5"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            {/* Type */}
            <View className="mb-4">
              <Text className="text-gray-900 dark:text-white font-semibold text-base">
                Exercise Type
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 mt-1">
                {exercise.type}
              </Text>
            </View>

            {/* Equipment */}
            <View className="mb-4">
              <Text className="text-gray-900 dark:text-white font-semibold text-base">
                Equipment
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 mt-1">
                {exercise.equipment ? exercise.equipment : "Bodyweight"}
              </Text>
            </View>

            {/* Difficulty */}
            <View>
              <Text className="text-gray-900 dark:text-white font-semibold text-base">
                Difficulty
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 mt-1">
                {formatDifficulty(exercise.difficulty)}
              </Text>
            </View>
          </View>

          {/* Instructions Card */}
          <View
            className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-5 mb-5"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            <Text className="text-gray-900 dark:text-white font-semibold text-lg mb-2">
              Instructions
            </Text>
            <Text className="text-gray-700 dark:text-gray-300 leading-6">
              {truncateText(exercise.instructions, 500)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import { clearFavorites } from "@/redux/slices/favoriteSlice";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { favoriteExercises, isLoading } = useAppSelector(
  (state) => state.favorites
);


  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await dispatch(logout());
          dispatch(clearFavorites());
          router.replace("/auth/sign-in");
        },
      },
    ]);
  };

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">

      {/* Header */}
      <View
        style={{ backgroundColor: colors.card, borderBottomColor: colors.border }}
        className="px-5 py-6 pt-12 border-b"
      >
        <Text style={{ color: colors.text }} className="text-2xl font-bold">
          Profile
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">

        {/* USER CARD */}
        <View
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="rounded-2xl p-5 mb-4 border"
        >
          <View
            style={{ backgroundColor: colors.primary }}
            className="w-20 h-20 rounded-full justify-center items-center self-center mb-4"
          >
            <Text className="text-3xl font-bold text-white">
              {user?.username
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </Text>
          </View>

        

          <Text style={{ color: colors.textSecondary }} className="text-center text-sm">
            @{user?.username}
          </Text>

          <Text style={{ color: colors.textSecondary }} className="text-center text-sm">
            {user?.email}
          </Text>
        </View>

        {/* STATS CARD */}
        <View
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="rounded-2xl p-5 mb-4 border"
        >
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-4">
            Statistics
          </Text>

          <View className="flex-row justify-around">
            <View className="items-center">
              <Feather name="heart" size={24} color={colors.primary} />
              <Text style={{ color: colors.text }} className="text-xl font-bold mt-2">
                {favoriteExercises.length}
              </Text>
              <Text style={{ color: colors.textSecondary }} className="text-xs mt-1">
                Favorites
              </Text>
            </View>
          </View>
        </View>

        {/* SETTINGS CARD */}
        <View
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="rounded-2xl p-5 mb-4 border"
        >
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-4">
            Settings
          </Text>

          {/* Dark Mode */}
          <TouchableOpacity
            onPress={toggleTheme}
            className="flex-row justify-between items-center py-3"
          >
            <View className="flex-row items-center">
              <Feather
                name={isDark ? "moon" : "sun"}
                size={20}
                color={colors.textSecondary}
                style={{ marginRight: 12 }}
              />
              <Text style={{ color: colors.text }} className="text-base">
                Dark Mode
              </Text>
            </View>

            {/* Switch */}
            <View
              style={{
                backgroundColor: isDark ? colors.primary : colors.border,
              }}
              className="w-12 h-7 rounded-full p-1 justify-center"
            >
              <View
                style={{ backgroundColor: colors.card }}
                className={`w-6 h-6 rounded-full ${isDark ? "self-end" : ""}`}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* ABOUT CARD */}
        <View
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
          className="rounded-2xl p-5 mb-4 border"
        >
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-4">
            About
          </Text>

          <View className="flex-row justify-between py-3">
            <Text style={{ color: colors.textSecondary }}>Version</Text>
            <Text style={{ color: colors.text }} className="font-semibold">1.0.0</Text>
          </View>

          <View className="flex-row justify-between py-3">
            <Text style={{ color: colors.textSecondary }}>Developer</Text>
            <Text style={{ color: colors.text }} className="font-semibold">
              FitBuddy 
            </Text>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{ backgroundColor: colors.error }}
          className="flex-row justify-center items-center py-4 rounded-xl mb-4"
        >
          <Feather name="log-out" size={20} color="white" />
          <Text className="text-white text-base font-semibold ml-2">
            Logout
          </Text>
        </TouchableOpacity>

        <View className="py-5 items-center">
          <Text style={{ color: colors.textSecondary }} className="text-xs">
            Made with  for IN3210
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

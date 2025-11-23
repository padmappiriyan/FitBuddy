import { Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";

import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearError, login } from "../../redux/slices/authSlice";
import { loginSchema } from "../../utils/validation";

export default function SignIn() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (error) dispatch(clearError());
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err: any) {
      const validationErrors: Record<string, string> = {};
      err.inner.forEach((error: any) => {
        if (error.path) validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
      return false;
    }
  };

  const handleLogin = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    dispatch(clearError());
    const result = await dispatch(login(formData));

    if (login.fulfilled.match(result)) {
      router.replace("/(tabs)");
    }
  };

  // BEAUTIFUL POPUP FOR DEMO CREDENTIALS
  const DemoCredentialsModal = () => (
    <Modal
      visible={showDemoModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowDemoModal(false)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            width: "95%",
            backgroundColor: "#1f1f1f",
            borderRadius: 20,
            padding: 25,
            borderColor: colors.primary + "40",
            borderWidth: 1,
          }}
        >
          <View
            style={{
              backgroundColor: colors.primary + "25",
              width: 60,
              height: 60,
              borderRadius: 30,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              marginBottom: 15,
            }}
          >
            <Feather name="info" size={32} color={colors.primary} />
          </View>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            Demo Login Details
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "#ccc",
              textAlign: "center",
              marginBottom: 20,
              lineHeight: 22,
            }}
          >
            Use the following login details to test the app.
          </Text>

          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: "#aaa", marginBottom: 6 }}>Username</Text>
            <Text
              style={{
                backgroundColor: "#2a2a2a",
                padding: 10,
                borderRadius: 10,
                color: "white",
              }}
            >
              emilys
            </Text>

            <Text style={{ color: "#aaa", marginBottom: 6, marginTop: 12 }}>
              Password
            </Text>
            <Text
              style={{
                backgroundColor: "#2a2a2a",
                padding: 10,
                borderRadius: 10,
                color: "white",
              }}
            >
              emilyspass
            </Text>
          </View>

          <Pressable
            onPress={() => setShowDemoModal(false)}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Got it!
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 60 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* POPUP */}
          <DemoCredentialsModal />

          {/* HEADER */}
          <View className="items-center mb-10">
            <View
              className="w-24 h-24 rounded-full items-center justify-center mb-6"
              style={{
                backgroundColor: colors.primary + "20",
                borderWidth: 2,
                borderColor: colors.primary + "40",
              }}
            >
              <Feather name="activity" size={48} color={colors.primary} />
            </View>

            <Text className="text-4xl font-bold text-white mb-3">
              Welcome Back
            </Text>
            <Text className="text-base text-center text-gray-400 px-8">
              Sign in to continue tracking FitBuddy
            </Text>
          </View>

          {/* DEMO BUTTON */}
          <TouchableOpacity
            className="flex-row items-center justify-center px-5 py-3.5 rounded-2xl mb-6"
            style={{
              backgroundColor: colors.primary + "15",
              borderWidth: 1,
              borderColor: colors.primary + "30",
            }}
            onPress={() => setShowDemoModal(true)}
            activeOpacity={0.7}
          >
            <View
              className="w-8 h-8 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.primary + "25" }}
            >
              <Feather name="info" size={16} color={colors.primary} />
            </View>
            <Text className="text-white text-sm font-semibold flex-1">
              Tap for demo credentials
            </Text>
            <Feather name="chevron-right" size={18} color={colors.primary} />
          </TouchableOpacity>

          {/* BACKEND ERROR */}
          {error && (
            <View className="mb-5">
              <ErrorMessage message={error} />
            </View>
          )}

          {/* USERNAME */}
          <View className="mb-5">
            <Text className="text-white font-semibold mb-2.5 text-base">
              Username
            </Text>

            <View
              className={`flex-row items-center px-4 h-14 rounded-2xl ${
                errors.username
                  ? "border-2 border-red-500"
                  : "border border-gray-700"
              }`}
              style={{ backgroundColor: "#1a1a1a" }}
            >
              <Feather name="user" size={18} color={colors.primary} />

              <TextInput
                className="flex-1 text-white text-base ml-3"
                placeholder="Enter your username"
                placeholderTextColor="#666"
                autoCapitalize="none"
                autoCorrect={false}
                value={formData.username}
                onChangeText={(v) => handleChange("username", v)}
              />
            </View>

            {errors.username && (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.username}
              </Text>
            )}
          </View>

          {/* PASSWORD */}
          <View className="mb-6">
            <Text className="text-white font-semibold mb-2.5 text-base">
              Password
            </Text>

            <View
              className={`flex-row items-center px-4 h-14 rounded-2xl ${
                errors.password
                  ? "border-2 border-red-500"
                  : "border border-gray-700"
              }`}
              style={{ backgroundColor: "#1a1a1a" }}
            >
              <Feather name="lock" size={18} color={colors.primary} />

              <TextInput
                className="flex-1 text-white text-base ml-3"
                placeholder="Enter your password"
                placeholderTextColor="#666"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={formData.password}
                onChangeText={(v) => handleChange("password", v)}
              />

              {/* Show/Hide Password */}
              <TouchableOpacity
                className="w-9 h-9 items-center justify-center"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            {errors.password && (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.password}
              </Text>
            )}
          </View>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            className="h-14 rounded-2xl justify-center items-center mt-2"
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
            style={{ backgroundColor: colors.primary }}
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <LoadingSpinner size="small" />
                <Text className="text-white text-base font-bold ml-2">
                  Signing in...
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Text className="text-white text-lg font-bold mr-2">
                  Sign In
                </Text>
                <Feather name="arrow-right" size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-8">
            <View className="flex-1 h-px bg-gray-700" />
            <Text className="mx-4 text-gray-500 text-sm">New to Sportify?</Text>
            <View className="flex-1 h-px bg-gray-700" />
          </View>

          {/* SIGN UP BUTTON */}
          <Link href="/auth/sign-up" asChild>
            <TouchableOpacity
              className="h-14 rounded-2xl justify-center items-center border-2"
              style={{
                borderColor: colors.primary + "60",
                backgroundColor: colors.primary + "10",
              }}
            >
              <View className="flex-row items-center">
                <Feather name="user-plus" size={20} color={colors.primary} />
                <Text
                  className="text-base font-bold ml-2"
                  style={{ color: colors.primary }}
                >
                  Create New Account
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          {/* FOOTER */}
          <View className="mt-10">
            <Text className="text-center text-gray-600 text-xs">
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTheme } from "../../contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearError, register } from "../../redux/slices/authSlice";
import { registerSchema } from "../../utils/validation";

export default function RegisterScreen() {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      await registerSchema.validate(formData, { abortEarly: false });
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

  const handleRegister = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    dispatch(clearError());
    const result = await dispatch(register(formData));

    if (register.fulfilled.match(result)) {
      router.replace("/auth/sign-in");
    }
  };

  const renderInput = ({
    label,
    field,
    icon,
    placeholder,
    keyboardType,
    autoCapitalize,
    secureTextEntry,
    showToggle,
    toggleState,
    onToggle,
  }: {
    label: string;
    field: keyof typeof formData;
    icon: string;
    placeholder: string;
    keyboardType?: "default" | "email-address";
    autoCapitalize?: "none" | "words";
    secureTextEntry?: boolean;
    showToggle?: boolean;
    toggleState?: boolean;
    onToggle?: () => void;
  }) => (
    <View className="mb-4">
      <Text className="mb-2 font-semibold text-gray-300">{label}</Text>
      <View
        className={`flex-row items-center px-4 h-14 rounded-xl border ${
          errors[field] ? "border-red-500" : "border-gray-600"
        } bg-gray-800`}
      >
        <Feather
          name={icon as any}
          size={20}
          color={colors.textSecondary}
          style={{ marginRight: 12 }}
        />
        <TextInput
          className="flex-1 text-white text-base"
          placeholder={placeholder}
          placeholderTextColor="gray"
          value={formData[field]}
          onChangeText={(value) => handleChange(field, value)}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize || "none"}
          autoCorrect={false}
          secureTextEntry={secureTextEntry}
          editable={!isLoading}
        />
        {showToggle && onToggle && (
          <TouchableOpacity onPress={onToggle} disabled={isLoading}>
            <Feather
              name={toggleState ? "eye-off" : "eye"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {errors[field] && (
        <Text className="text-red-500 text-sm mt-1.5">{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingTop: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-full items-center justify-center mb-4 bg-gray-900">
              <Feather name="user-plus" size={40} color={colors.primary} />
            </View>
            <Text className="text-3xl font-bold text-white">
              Create Account
            </Text>
            <Text className="mt-2 text-center text-gray-400 text-base">
              Join FitBuddy to track your favorite exercises and workouts!
            </Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="mb-4">
              <ErrorMessage message={error} />
            </View>
          )}

          {/* Form */}
          <View className="w-full">
          

            {renderInput({
              label: "Email",
              field: "email",
              icon: "mail",
              placeholder: "Enter your email",
              keyboardType: "email-address",
            })}

            {renderInput({
              label: "Username",
              field: "username",
              icon: "at-sign",
              placeholder: "Choose a username",
            })}

            {renderInput({
              label: "Password",
              field: "password",
              icon: "lock",
              placeholder: "Create a password (min 8 characters)",
              secureTextEntry: !showPassword,
              showToggle: true,
              toggleState: showPassword,
              onToggle: () => setShowPassword(!showPassword),
            })}

            {renderInput({
              label: "Confirm Password",
              field: "confirmPassword",
              icon: "lock",
              placeholder: "Confirm your password",
              secureTextEntry: !showConfirmPassword,
              showToggle: true,
              toggleState: showConfirmPassword,
              onToggle: () => setShowConfirmPassword(!showConfirmPassword),
            })}

            {/* Register Button */}
            <TouchableOpacity
              className="h-14 rounded-xl justify-center items-center mt-2"
              style={{ backgroundColor: colors.primary }}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <LoadingSpinner size="small" />
              ) : (
                <Text className="text-white font-bold text-lg">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-400">Already have an account? </Text>
              <Link href="/auth/sign-in" asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Text
                    className="font-semibold"
                    style={{ color: colors.primary }}
                  >
                    Login here
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

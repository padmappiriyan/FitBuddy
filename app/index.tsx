import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  Animated,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";


export default function LandingPage() {
  const router = useRouter();
  const [loadingImage, setLoadingImage] = useState(true); // State for image loading
  const [buttonLoading, setButtonLoading] = useState(false); // State for button spinner

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  // Start animations
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Handle image load with a small delay for spinner visibility
  const handleImageLoad = () => {
    setTimeout(() => {
      setLoadingImage(false);
    }, 1000); // 1-second delay
  };

  // Handle Get Started button click
  const handleGetStarted = () => {
    setButtonLoading(true);
    setTimeout(() => {
      setButtonLoading(false);
      router.push("/auth/sign-in");
    }, 1000); // Show spinner for 1 second before navigating
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ImageBackground
        source={require("../assets/Health.png")}
        className="flex-1"
        resizeMode="cover"
        onLoadEnd={handleImageLoad}
      >
        {loadingImage && (
          <View className="absolute inset-0 justify-center items-center bg-black/50">
            <ActivityIndicator size="large" color="lime" />
          </View>
        )}

        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.95)"]}
          locations={[0, 0.5, 1]}
          className="flex-1 justify-end px-6 pb-20"
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View className="w-16 h-1 bg-lime-500 mb-6 rounded-full" />

            <Text className="text-white text-5xl font-black mb-3 leading-tight">
              Protect{"\n"}
              <Text className="text-lime-500">Your Health</Text>
              {"\n"}Companion
            </Text>

            <Text className="text-white/80 text-base mb-10 leading-relaxed font-light">
              Elevate your fitness journey with a cutting-edge app designed to
              fuel your motivation and crush your goals
            </Text>
            <Pressable
              onPress={handleGetStarted}
              disabled={buttonLoading}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              className="rounded-xl"
            >
              <LinearGradient
                colors={["#84cc16", "#65a30d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-5 px-8 rounded-2xl flex-row justify-center items-center"
              >
                {buttonLoading ? (
                  <ActivityIndicator color="black" />
                ) : (
                  <Text className="text-black text-center text-lg font-bold tracking-wide">
                    Get Started →
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            <Text className="text-white/50 text-center text-sm mt-6">
              Join thousands transforming their lives
            </Text>
          </Animated.View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

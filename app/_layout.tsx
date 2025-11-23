import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Stack>
          {/* Landing / Welcome Screen */}
          <Stack.Screen
            name="index" // corresponds to index.tsx (Landing Page)
            options={{
              headerShown: false,
            }}
          />

          {/* Auth Screens */}
          <Stack.Screen
            name="auth/sign-in"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="auth/sign-up"
            options={{ headerShown: false }}
          />

          {/* Tabs Screens */}
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />

          {/* Details Screen */}
          <Stack.Screen
            name="match/[id]"
            options={{
              headerShown: false,
              presentation: "card",
            }}
          />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}

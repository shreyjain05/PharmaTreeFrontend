import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppState, LogBox, StatusBar } from "react-native";
import AppProvider from "./context/AppProvider";
import store from "../redux/store"; // Import Redux store
import { Provider } from "react-redux"; // ✅ Import Provider

LogBox.ignoreAllLogs();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Mukta_Light: require("../assets/fonts/mukta/Mukta-Light.ttf"),
    Mukta_Medium: require("../assets/fonts/mukta/Mukta-Medium.ttf"),
    Mukta_Regular: require("../assets/fonts/mukta/Mukta-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    const subscription = AppState.addEventListener("change", (_) => {
      StatusBar.setBarStyle("light-content");
    });
    return () => {
      subscription.remove();
    };
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      {" "}
      {/* ✅ Wrap the entire app with Redux Provider */}
      <AppProvider>
        <Stack
          screenOptions={{ headerShown: false, animation: "ios_from_right" }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/verificationScreen" />
          <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        </Stack>
      </AppProvider>
    </Provider>
  );
}

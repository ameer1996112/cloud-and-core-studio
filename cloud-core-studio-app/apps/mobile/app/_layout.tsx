import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LocaleProvider } from "@/i18n/LocaleProvider";
import { colors } from "@/theme/colors";

export default function RootLayout() {
  return (
    <LocaleProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.ivory },
          headerTintColor: colors.navy,
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: colors.ivory },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="class/[id]/index" options={{ title: "Class" }} />
      </Stack>
    </LocaleProvider>
  );
}

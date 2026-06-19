import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LocaleProvider, useCopy } from "@/i18n/LocaleProvider";
import { fitness } from "@/theme/colors";

export default function RootLayout() {
  return (
    <LocaleProvider>
      <AppNavigator />
    </LocaleProvider>
  );
}

function AppNavigator() {
  const { t } = useCopy();

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: fitness.appBg },
          headerTintColor: fitness.textPrimary,
          headerTitleStyle: { fontWeight: "900" },
          contentStyle: { backgroundColor: fitness.appBg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="class/[id]/index" options={{ title: t.classTitle }} />
      </Stack>
    </>
  );
}

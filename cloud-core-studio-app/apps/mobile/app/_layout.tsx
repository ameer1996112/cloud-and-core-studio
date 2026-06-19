import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LocaleProvider, useCopy } from "@/i18n/LocaleProvider";
import { colors } from "@/theme/colors";

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
        <Stack.Screen name="class/[id]/index" options={{ title: t.classTitle }} />
      </Stack>
    </>
  );
}

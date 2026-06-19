import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors, fitness } from "@/theme/colors";

export default function TabsLayout() {
  const { t } = useCopy();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: fitness.textMuted,
        tabBarStyle: {
          backgroundColor: fitness.surface,
          borderTopColor: fitness.border,
          height: 88,
          paddingBottom: 24,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
        },
        headerStyle: { backgroundColor: fitness.appBg },
        headerTintColor: fitness.textPrimary,
        headerTitleStyle: { fontWeight: "900" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.home,
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: t.schedule,
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t.bookings,
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.profile,
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useCopy } from "@/i18n/LocaleProvider";
import { colors } from "@/theme/colors";

export default function TabsLayout() {
  const { t } = useCopy();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.navy,
        tabBarInactiveTintColor: colors.slate,
        tabBarStyle: {
          backgroundColor: colors.ivory,
          borderTopColor: colors.sand,
          height: 86,
          paddingBottom: 24,
          paddingTop: 8,
        },
        headerStyle: { backgroundColor: colors.ivory },
        headerTintColor: colors.navy,
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

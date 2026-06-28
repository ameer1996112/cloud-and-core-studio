import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const token = {
  ivory: "#F6F0E7",
  goldLight: "#F5E7C9",
  sage: "#4F6F61",
  sand: "#D9CBB8",
  textMain: "#24201C",
  textMuted: "#6F665E",
  white: "#FFFAF3",
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: token.sage,
        tabBarInactiveTintColor: token.textMuted,
        tabBarStyle: {
          height: 74,
          paddingTop: 8,
          paddingBottom: 14,
          backgroundColor: token.white,
          borderTopColor: token.sand,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: "#3D2D1E",
          shadowOpacity: 0.08,
          shadowRadius: 18,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
        },
        sceneStyle: {
          backgroundColor: token.ivory,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "home" : "home-outline"} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "time" : "time-outline"} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "calendar" : "calendar-outline"} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: "Plans",
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "diamond" : "diamond-outline"} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <TabIcon name={focused ? "person" : "person-outline"} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  name,
  color,
  focused,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  focused: boolean;
}) {
  return (
    <Ionicons
      name={name}
      color={color}
      size={20}
      style={{
        width: 38,
        height: 38,
        borderRadius: 8,
        paddingTop: 9,
        textAlign: "center",
        overflow: "hidden",
        backgroundColor: focused ? token.goldLight : "transparent",
      }}
    />
  );
}

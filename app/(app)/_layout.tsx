import { Tabs } from "expo-router";
import CustomTabBar from "@/components/CustomTabBar";

// Auth guard + first-login routing is handled by app/index.tsx (splash).
// onboarding and chat are registered here so expo-router creates their routes,
// but they don't appear in the custom tab bar.
export default function AppLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="opportunities" />
      <Tabs.Screen name="introductions" />
      <Tabs.Screen name="events" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="onboarding" />
    </Tabs>
  );
}

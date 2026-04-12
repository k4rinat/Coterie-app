import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useTheme } from "@/contexts/ThemeContext";

// Entry point: triggers the global OnboardingOverlay tour, then navigates to the app.
export default function OnboardingEntryScreen() {
  const { startTour } = useOnboarding();
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    startTour();
    const t = setTimeout(() => router.replace("/(app)"), 60);
    return () => clearTimeout(t);
  }, []);

  // Blank screen shown briefly during transition
  return <View style={{ flex: 1, backgroundColor: theme.bg }} />;
}

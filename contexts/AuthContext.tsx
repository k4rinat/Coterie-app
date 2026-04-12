import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
  isFirstLogin: boolean;
  login: () => Promise<boolean>;   // returns true if first-time user
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  isLoading: true,
  isFirstLogin: false,
  login: async () => false,
  logout: async () => {},
  completeOnboarding: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [isLoading, setIsLoading]     = useState(true);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  useEffect(() => {
    // Session does not persist — always start at sign-in page
    setIsLoggedIn(false);
    setIsFirstLogin(false);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (): Promise<boolean> => {
    const onboardingDone = await AsyncStorage.getItem("coterie-onboarding-done");
    const isFirst = onboardingDone !== "true";
    await AsyncStorage.setItem("coterie-logged-in", "true");
    setIsLoggedIn(true);
    setIsFirstLogin(isFirst);
    return isFirst;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem("coterie-logged-in");
    setIsLoggedIn(false);
    setIsFirstLogin(false);
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem("coterie-onboarding-done", "true");
    setIsFirstLogin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, isFirstLogin, login, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

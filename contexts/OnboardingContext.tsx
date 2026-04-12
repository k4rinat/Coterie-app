import React, { createContext, useContext, useState, useCallback } from "react";

interface OnboardingContextValue {
  isActive: boolean;
  step: number;
  totalSteps: number;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  endTour: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue>({
  isActive: false,
  step: 0,
  totalSteps: 6,
  startTour: () => {},
  nextStep: () => {},
  prevStep: () => {},
  endTour: () => {},
});

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState(0);
  const TOTAL = 6;

  const startTour = useCallback(() => {
    setStep(0);
    setIsActive(true);
  }, []);

  const nextStep = useCallback(() => {
    setStep(prev => {
      if (prev >= TOTAL - 1) {
        setIsActive(false);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const prevStep = useCallback(() => {
    setStep(prev => Math.max(0, prev - 1));
  }, []);

  const endTour = useCallback(() => {
    setIsActive(false);
    setStep(0);
  }, []);

  return (
    <OnboardingContext.Provider value={{ isActive, step, totalSteps: TOTAL, startTour, nextStep, prevStep, endTour }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);

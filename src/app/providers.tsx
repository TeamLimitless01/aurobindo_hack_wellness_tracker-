"use client";

import { WellnessProvider } from "@/context/WellnessContext";
import { RoutineProvider } from "@/context/RoutineContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WellnessProvider>
      <RoutineProvider>{children}</RoutineProvider>
    </WellnessProvider>
  );
}

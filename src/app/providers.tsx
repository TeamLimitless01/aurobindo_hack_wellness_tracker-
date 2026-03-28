"use client";

import { WellnessProvider } from "@/context/WellnessContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <WellnessProvider>{children}</WellnessProvider>;
}

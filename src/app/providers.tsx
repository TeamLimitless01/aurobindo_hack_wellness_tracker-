"use client";

import { WellnessProvider } from "@/context/WellnessContext";
import { RoutineProvider } from "@/context/RoutineContext";
import NotificationManager from "@/components/NotificationManager";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WellnessProvider>
      <RoutineProvider>
        <NotificationManager>
          {children}
        </NotificationManager>
      </RoutineProvider>
    </WellnessProvider>
  );
}

"use client";

import { useCreditRealtime } from "@/features/credit-request/hooks/use-credit-realtime";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useCreditRealtime();

  return <>{children}</>;
}

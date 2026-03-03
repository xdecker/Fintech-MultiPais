"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/providers/auth.provider";
import { CustomDialogProvider } from "@/providers/custom-dialog.provider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <CustomDialogProvider>{children}</CustomDialogProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

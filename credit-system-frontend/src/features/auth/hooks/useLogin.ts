"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginRequest } from "../api/auth.api";
import { useAuth } from "@/providers/auth.provider";

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await loginRequest(email, password);

      login(res.access_token, { email: res.email, role: res.role });

      router.replace("/dashboard");
    } catch (err: any) {
      setError(
        Array.isArray(err.message) ? err.message.join(", ") : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
}

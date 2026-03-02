import { apiClient } from "@/lib/api";

export interface LoginResponse {
  access_token: string;
  role: string;
  email: string;
}


export const loginRequest = (email: string, password: string) =>
  apiClient<LoginResponse>("/auth/login", "POST", {
    data: { email, password },
  });

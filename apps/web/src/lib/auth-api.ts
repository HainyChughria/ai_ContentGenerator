import { api } from "./api";
import {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload
} from "@/types/auth";

type AuthResponse = {
  message: string;
  user: AuthUser;
  accessToken: string;
};

type RegisterResponse = {
  message: string;
  user: AuthUser;
};

export const authApi = {
  register: async (payload: RegisterPayload) => {
    const { data } = await api.post<RegisterResponse>("/auth/register", payload);
    return data;
  },
  login: async (payload: LoginPayload) => {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  verifyEmail: async (payload: VerifyEmailPayload) => {
    const { data } = await api.post<RegisterResponse>(
      "/auth/verify-email",
      payload
    );
    return data;
  },
  resendOtp: async (email: string) => {
    const { data } = await api.post<{ message: string }>("/auth/resend-otp", {
      email
    });
    return data;
  },
  me: async () => {
    const { data } = await api.get<{ user: AuthUser }>("/auth/me");
    return data.user;
  }
};

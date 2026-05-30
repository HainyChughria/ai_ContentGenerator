"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/lib/auth-api";
import { clearAccessToken, saveAccessToken } from "@/lib/auth-token";
import {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload
} from "@/types/auth";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser) => void;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  login: (payload: LoginPayload) => Promise<void>;
  verifyEmail: (payload: VerifyEmailPayload) => Promise<AuthUser>;
  resendOtp: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<string>;
  resetPassword: (payload: {
    email: string;
    token: string;
    password: string;
  }) => Promise<string>;
  fetchMe: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ user }),
      register: async (payload) => {
        set({ isLoading: true });
        try {
          const response = await authApi.register(payload);
          return response.user;
        } finally {
          set({ isLoading: false });
        }
      },
      login: async (payload) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(payload);
          saveAccessToken(response.accessToken);
          set({
            user: response.user,
            isAuthenticated: true
          });
        } finally {
          set({ isLoading: false });
        }
      },
      verifyEmail: async (payload) => {
        set({ isLoading: true });
        try {
          const response = await authApi.verifyEmail(payload);
          return response.user;
        } finally {
          set({ isLoading: false });
        }
      },
      resendOtp: async (email) => {
        set({ isLoading: true });
        try {
          await authApi.resendOtp(email);
        } finally {
          set({ isLoading: false });
        }
      },
      forgotPassword: async (email) => {
        set({ isLoading: true });
        try {
          const response = await authApi.forgotPassword(email);
          return response.message;
        } finally {
          set({ isLoading: false });
        }
      },
      resetPassword: async (payload) => {
        set({ isLoading: true });
        try {
          const response = await authApi.resetPassword(payload);
          return response.message;
        } finally {
          set({ isLoading: false });
        }
      },
      fetchMe: async () => {
        set({ isLoading: true });
        try {
          const user = await authApi.me();
          set({ user, isAuthenticated: true });
        } catch {
          clearAccessToken();
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },
      logout: () => {
        clearAccessToken();
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: "ai-saas-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

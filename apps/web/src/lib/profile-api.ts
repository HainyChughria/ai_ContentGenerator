import { AuthUser } from "@/types/auth";
import { api } from "./api";

export const profileApi = {
  updateProfile: async (name: string) => {
    const { data } = await api.put<{ message: string; user: AuthUser }>(
      "/user/profile",
      { name }
    );
    return data.user;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const { data } = await api.put<{ message: string }>("/user/password", {
      currentPassword,
      newPassword
    });
    return data;
  }
};

"use client";

import axios from "axios";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileApi } from "@/lib/profile-api";
import { useAuthStore } from "@/store/auth-store";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80)
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters")
});

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [profileError, setProfileError] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const updateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");

    const formData = new FormData(event.currentTarget);
    const parsed = profileSchema.safeParse({
      name: String(formData.get("name") ?? "")
    });

    if (!parsed.success) {
      setProfileError(parsed.error.issues[0]?.message ?? "Invalid profile");
      return;
    }

    setIsProfileSaving(true);
    try {
      const updatedUser = await profileApi.updateProfile(parsed.data.name);
      setUser(updatedUser);
      setProfileMessage("Profile updated");
    } catch (error) {
      setProfileError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Could not update"
          : "Could not update"
      );
    } finally {
      setIsProfileSaving(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const parsed = passwordSchema.safeParse({
      currentPassword: String(formData.get("currentPassword") ?? ""),
      newPassword: String(formData.get("newPassword") ?? "")
    });

    if (!parsed.success) {
      setPasswordError(parsed.error.issues[0]?.message ?? "Invalid password");
      return;
    }

    setIsPasswordSaving(true);
    try {
      await profileApi.changePassword(
        parsed.data.currentPassword,
        parsed.data.newPassword
      );
      form.reset();
      setPasswordMessage("Password changed");
    } catch (error) {
      setPasswordError(
        axios.isAxiosError(error)
          ? error.response?.data?.message ?? "Could not change password"
          : "Could not change password"
      );
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-70px)] px-5 py-8 xl:px-[42px]">
      <div className="mb-8">
        <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d7a6ff]">
          Settings
        </p>
        <h1 className="mt-3 text-[34px] font-black tracking-[-0.055em] text-[#f4f1f6]">
          Account controls
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#9b95a0]">
          Manage your profile, password, and business workspace identity.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] p-5">
          <form className="space-y-5" onSubmit={updateProfile}>
            <div>
              <h2 className="text-[20px] font-black text-[#f0edf2]">Profile</h2>
              <p className="mt-2 text-sm text-[#8e8793]">
                This name appears across your workspace.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={user?.name ?? ""} />
            </div>
            <FormError message={profileError} />
            {profileMessage ? (
              <p className="text-sm text-emerald-300">{profileMessage}</p>
            ) : null}
            <Button type="submit" disabled={isProfileSaving}>
              {isProfileSaving ? "Saving..." : "Save profile"}
            </Button>
          </form>
        </section>

        <section className="rounded-[5px] border border-[#2b2a31] bg-[#1c1b1f] p-5">
          <form className="space-y-5" onSubmit={changePassword}>
            <div>
              <h2 className="text-[20px] font-black text-[#f0edf2]">Password</h2>
              <p className="mt-2 text-sm text-[#8e8793]">
                Use a strong password with at least 8 characters.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
              />
            </div>
            <FormError message={passwordError} />
            {passwordMessage ? (
              <p className="text-sm text-emerald-300">{passwordMessage}</p>
            ) : null}
            <Button type="submit" disabled={isPasswordSaving}>
              {isPasswordSaving ? "Changing..." : "Change password"}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
}

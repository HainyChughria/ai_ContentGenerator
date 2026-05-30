"use client";

import axios from "axios";
import { FormEvent, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      if (axios.isAxiosError(error)) {
        setProfileError(error.response?.data?.message ?? "Could not update");
        return;
      }

      setProfileError("Could not update");
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
      if (axios.isAxiosError(error)) {
        setPasswordError(
          error.response?.data?.message ?? "Could not change password"
        );
        return;
      }

      setPasswordError("Could not change password");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account profile and password.
        </p>
      </div>

      <Card>
        <form className="space-y-4" onSubmit={updateProfile}>
          <div>
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="text-sm text-muted-foreground">
              This name appears across your workspace.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={user?.name ?? ""} />
          </div>
          <FormError message={profileError} />
          {profileMessage ? (
            <p className="text-sm text-emerald-700">{profileMessage}</p>
          ) : null}
          <Button type="submit" disabled={isProfileSaving}>
            {isProfileSaving ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </Card>

      <Card>
        <form className="space-y-4" onSubmit={changePassword}>
          <div>
            <h2 className="text-lg font-semibold">Password</h2>
            <p className="text-sm text-muted-foreground">
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
            <p className="text-sm text-emerald-700">{passwordMessage}</p>
          ) : null}
          <Button type="submit" disabled={isPasswordSaving}>
            {isPasswordSaving ? "Changing..." : "Change password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

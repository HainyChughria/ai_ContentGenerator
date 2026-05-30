import { Resend } from "resend";
import { env } from "../config/env.js";
import { buildEmailShell } from "./email-template.service.js";

const resend = new Resend(env.resendApiKey);

export const sendVerificationOtp = async (email: string, otp: string) => {
  await resend.emails.send({
    from: env.resendFromEmail,
    to: email,
    subject: "Verify your AI SaaS account",
    html: buildEmailShell({
      title: "Verify your email",
      preview: "Your AI SaaS verification code",
      body: `
        <p>Use this OTP to verify your account:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:5px;color:#111827;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      `
    })
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetUrl: string
) => {
  await resend.emails.send({
    from: env.resendFromEmail,
    to: email,
    subject: "Reset your AI SaaS password",
    html: buildEmailShell({
      title: "Reset your password",
      preview: "Your secure password reset link",
      body: `
        <p>We received a request to reset your password.</p>
        <p>This secure link expires in 15 minutes.</p>
      `,
      actionLabel: "Reset password",
      actionUrl: resetUrl
    })
  });
};

import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(env.resendApiKey);

export const sendVerificationOtp = async (email: string, otp: string) => {
  await resend.emails.send({
    from: env.resendFromEmail,
    to: email,
    subject: "Verify your AI SaaS account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Your verification code</h2>
        <p>Use this OTP to verify your account:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
        <p>This code expires in 10 minutes.</p>
      </div>
    `
  });
};

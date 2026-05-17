export type AuthUser = {
  id: string;
  name: string;
  email: string;
  credits: number;
  isVerified: boolean;
  createdAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

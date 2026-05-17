export type AuthUser = {
  id: string;
  name: string;
  email: string;
  credits: number;
  isVerified: boolean;
  createdAt: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type VerifyEmailRequest = {
  email: string;
  otp: string;
};

export type AuthResponse = {
  message: string;
  user: AuthUser;
  accessToken: string;
};

export type SanitizableUser = {
  _id: {
    toString: () => string;
  };
  name: string;
  email: string;
  credits: number;
  isVerified: boolean;
  createdAt: Date;
};

export const sanitizeUser = (user: SanitizableUser) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  credits: user.credits,
  isVerified: user.isVerified,
  createdAt: user.createdAt
});

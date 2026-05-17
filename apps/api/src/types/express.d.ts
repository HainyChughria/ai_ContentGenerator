import { SanitizableUser } from "../utils/sanitize-user.js";

declare global {
  namespace Express {
    interface Request {
      user: SanitizableUser;
    }
  }
}

export {};

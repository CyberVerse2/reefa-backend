import { User } from "src/modules/user/user.model";

declare global {
  namespace Express {
    interface Request {
      user: {
        id?: string;
      };
    }
  }
}

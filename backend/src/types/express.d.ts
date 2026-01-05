import { IUser } from "../models/User"; // or your User type

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

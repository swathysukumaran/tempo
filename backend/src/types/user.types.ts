// server/src/types/user.types.ts
import { Document } from 'mongoose';

export enum UserRole {
  PARENT = 'parent',
  STUDENT = 'student',
  ADMIN = 'admin'
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  profileImg?: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface UserRequest extends Request {
  user?: IUser;
}

export interface JwtPayload {
  user: {
    id: string;
    role: UserRole;
  };
}


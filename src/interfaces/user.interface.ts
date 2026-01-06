import { UserRole } from '../models/users';

/**
 * Interface TypeScript para tipar el documento de usuario
 */
export interface IUser extends Document {
  id: string;
  name: string;
  age?: number;
  email: string;
  password: string;
  img?: string;
  role: UserRole;
  google: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

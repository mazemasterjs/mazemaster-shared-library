import { USER_ROLES } from '../Enums';

export interface IUser {
  firstName: string;
  lastName: string;
  userName: string;
  role: USER_ROLES;
  lastLogin: number;
  pwHash: string;
}

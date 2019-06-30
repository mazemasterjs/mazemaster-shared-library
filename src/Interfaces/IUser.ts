import { USER_ROLES } from '../Enums';

export interface IUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  role: USER_ROLES;
  pwHash: string;
  teamId: string;
  botId: string;
  lastLogin: number;
}

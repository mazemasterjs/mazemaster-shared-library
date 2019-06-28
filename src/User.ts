import { MD5 as hash } from 'object-hash';
import { USER_ROLES } from './Enums';
import { IUser } from './Interfaces/IUser';

export class User {
  private firstName: string;
  private lastName: string;
  private userName: string;
  private role: USER_ROLES;
  private pwHash: string;
  private lastLogin: number;

  constructor(data?: IUser) {
    if (data !== undefined) {
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.userName = data.userName;
      this.role = data.role;
      this.pwHash = data.pwHash;
      this.lastLogin = data.lastLogin;
    } else {
      this.firstName = '';
      this.lastName = '';
      this.userName = '';
      this.role = USER_ROLES.NONE;
      this.pwHash = '';
      this.lastLogin = 0;
    }
  }

  public get FirstName() {
    return this.firstName;
  }
  public set FirstName(firstName: string) {
    this.firstName = firstName;
  }

  public get LastName() {
    return this.lastName;
  }
  public set LastName(lastName: string) {
    this.lastName = lastName;
  }

  public get UserName() {
    return this.userName;
  }
  public set UserName(userName: string) {
    this.userName = userName;
  }

  public get LastLogin() {
    return this.lastLogin;
  }

  public set LastLogin(lastLogin: number) {
    this.lastLogin = lastLogin;
  }

  public setPassword(newPassword: string) {
    this.pwHash = hash(newPassword);
  }

  public validatePwHash(pwHash: string) {
    return this.pwHash === pwHash;
  }

  public get Role(): number {
    return this.role;
  }

  public set Role(roles: number) {
    this.role = roles;
  }
}

export default User;

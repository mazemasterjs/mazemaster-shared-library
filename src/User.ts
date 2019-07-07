import { USER_ROLES } from './Enums';
import { IUser } from './Interfaces/IUser';
import { ObjectBase } from './ObjectBase';
import { Logger } from '@mazemasterjs/logger';

const log = Logger.getInstance();

export class User extends ObjectBase {
  /**
   * Attempts to load the given JSON Object into a new user object
   *
   * @param jsonData
   */
  public static fromJson(jsonData: IUser): User {
    const user: User = new User();
    user.logDebug(__filename, `fromJson(${jsonData})`, 'Attempting to populate User from jsonData...');

    if (jsonData !== undefined) {
      user.id = user.validateDataField('id', jsonData.id, 'string');
      user.userName = user.validateDataField('userName', jsonData.userName, 'string');
      user.firstName = user.validateDataField('firstName', jsonData.firstName, 'string');
      user.lastName = user.validateDataField('lastName', jsonData.lastName, 'string');
      user.role = user.validateDataField('role', jsonData.role, 'number');
      user.pwHash = user.validateDataField('pwHash', jsonData.pwHash, 'string');
      user.teamId = user.validateDataField('teamId', jsonData.teamId, 'string');
      user.botId = user.validateDataField('botId', jsonData.botId, 'string');
      user.lastLogin = user.validateDataField('lastLogin', jsonData.lastLogin, 'number');
    } else {
      log.warn(__filename, `loadData(${jsonData})`, 'Unable to load JSON data into User object: ' + JSON.stringify(jsonData));
    }
    return user;
  }

  private id: string;
  private teamId: string;
  private botId: string;
  private userName: string;
  private firstName: string;
  private lastName: string;
  private role: USER_ROLES;
  private pwHash: string;
  private lastLogin: number;

  constructor() {
    super();
    this.id = super.generateId();
    this.userName = '';
    this.firstName = '';
    this.lastName = '';
    this.teamId = '';
    this.botId = '';
    this.role = USER_ROLES.NONE;
    this.pwHash = '';
    this.lastLogin = 0;
  }

  public get Id() {
    return this.id;
  }

  public get TeamId() {
    return this.teamId;
  }

  public set TeamId(teamId: string) {
    this.teamId = teamId;
  }

  public get UserName() {
    return this.userName;
  }
  public set UserName(userName: string) {
    this.userName = userName;
  }

  public get BotId() {
    return this.botId;
  }
  public set BotId(botId: string) {
    this.botId = botId;
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

  public get Role(): number {
    return this.role;
  }

  public set Role(roles: number) {
    this.role = roles;
  }

  public setPassword(newPassword: string) {
    this.pwHash = super.generateHash(newPassword);
  }

  public validatePwHash(pwHash: string) {
    return this.pwHash === pwHash;
  }

  public get LastLogin() {
    return this.lastLogin;
  }

  public set LastLogin(lastLogin: number) {
    this.lastLogin = lastLogin;
  }
}

export default User;

import { expect } from 'chai';
import { IUser } from '../src/Interfaces/IUser';
import { MD5 as hash } from 'object-hash';
import { User } from '../src/User';
import { USER_ROLES } from '../src/Enums';

// test cases
describe(__filename + ' - User Tests', () => {
  const userData: IUser = {
    id: 'A-Fake-User-ID',
    userName: 'SirTestsAlot',
    firstName: 'Testsy',
    lastName: 'Tester',
    teamId: 'Team-Tester',
    botId: 'Supa-Test-Bot',
    role: USER_ROLES.ASSISTANT,
    pwHash: hash('12345'),
    lastLogin: 111111111,
  };
  const userLoad = User.fromJson(userData);

  const user = new User();
  user.UserName = 'SirBreaksAlot';
  user.FirstName = 'Breaksy';
  user.LastName = 'Breaker';
  user.TeamId = 'Team-Breaker';
  user.BotId = 'Supa-Break-Bot';
  user.Role = USER_ROLES.USER;
  user.setPassword('54321');
  user.LastLogin = 222222222;

  it(`user.Id === <generated>`, () => {
    return expect(user.Id).not.to.be.empty;
  });

  it(`user.TeamId === 'Team-Breaker'`, () => {
    return expect(user.TeamId).to.equal('Team-Breaker');
  });

  it(`user.BotId === 'Supa-Break-Bot'`, () => {
    return expect(user.BotId).to.equal('Supa-Break-Bot');
  });

  it(`user.FirstName === Breaksy`, () => {
    return expect(user.FirstName).to.equal('Breaksy');
  });

  it(`user.LastName === Breaker`, () => {
    return expect(user.LastName).to.equal('Breaker');
  });

  it(`user.UserName === SirBreaksAlot`, () => {
    return expect(user.UserName).to.equal('SirBreaksAlot');
  });

  it(`user.LastLogin === 222222222`, () => {
    return expect(user.LastLogin).to.equal(222222222);
  });

  it(`user.Role === USER_ROLES.USER`, () => {
    return expect(user.Role).to.equal(USER_ROLES.USER);
  });

  it(`user.Role === USER_ROLES.USER`, () => {
    return expect(user.Role).to.equal(USER_ROLES.USER);
  });

  it(`user.validatePwHash('54321') === true`, () => {
    const pwHash = hash('54321');
    return expect(user.validatePwHash(pwHash)).to.be.true;
  });

  // ** LOADED FROM JSON TESTS ** //

  it(`userLoad.Id === 'A-Fake-User-ID'`, () => {
    return expect(userLoad.Id).to.equal('A-Fake-User-ID');
  });

  it(`userLoad.TeamId === 'Team-Tester'`, () => {
    return expect(userLoad.TeamId).to.equal('Team-Tester');
  });

  it(`userLoad.BotId === 'Supa-Test-Bot'`, () => {
    return expect(userLoad.BotId).to.equal('Supa-Test-Bot');
  });

  it(`userLoad.FirstName === Testsy`, () => {
    return expect(userLoad.FirstName).to.equal('Testsy');
  });

  it(`userLoad.LastName === Tester`, () => {
    return expect(userLoad.LastName).to.equal('Tester');
  });

  it(`userLoad.UserName === SirTestsAlot`, () => {
    return expect(userLoad.UserName).to.equal('SirTestsAlot');
  });

  it(`userLoad.LastLogin === 111111111`, () => {
    return expect(userLoad.LastLogin).to.equal(111111111);
  });

  it(`userLoad.Role === USER_ROLES.ASSISTANT`, () => {
    return expect(userLoad.Role).to.equal(USER_ROLES.ASSISTANT);
  });

  it(`userLoad.validatePwHash('12345') === true`, () => {
    const pwHash = hash('12345');
    return expect(userLoad.validatePwHash(pwHash)).to.be.true;
  });
});

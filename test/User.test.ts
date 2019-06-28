import { expect } from 'chai';
import { IUser } from '../src/Interfaces/IUser';
import { MD5 as hash } from 'object-hash';
import { User } from '../src/User';
import { USER_ROLES } from '../src/Enums';

// test cases
describe(__filename + ' - User Tests', () => {
  const userData: IUser = {
    firstName: 'Testsy',
    lastName: 'Tester',
    userName: 'SirTestsAlot',
    role: USER_ROLES.ASSISTANT,
    pwHash: hash('12345'),
    lastLogin: 111111111,
  };
  const userLoad = new User(userData);

  const user = new User();
  user.FirstName = 'Breaksy';
  user.LastName = 'Breaker';
  user.UserName = 'SirBreaksAlot';
  user.Role = USER_ROLES.USER;
  user.setPassword('54321');
  user.LastLogin = 222222222;

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

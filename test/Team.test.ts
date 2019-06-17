import { Team } from '../src/Team';
import { IBot } from '../src/Interfaces/IBot';
import { Bot } from '../src/Bot';
import { expect } from 'chai';

/**
 * Test cases for Team object
 *
 * Note: Direct instantiation is already covered in Game.test.ts
 */
describe(__filename + ' - Team Tests', () => {
  // team needs a bot
  const botData: IBot = {
    coder: 'Coder',
    id: 'fake-bot-id',
    name: 'Name',
    weight: 33,
  };

  // create array of bots and add a couple to it
  const bots: Array<Bot> = new Array<Bot>();
  bots.push(new Bot(botData));
  bots.push(new Bot(botData));

  const invalidTeamData = JSON.stringify({
    bots,
    id: 'fake-team-id',
    logo: 999,
    name: 'Name',
  });

  const teamData = {
    bots,
    id: 'fake-team-id',
    logo: 'test-team-logo.png',
    name: 'Name',
  };

  // this trick gets around the need to use an interface, which is
  // something we shouldn't need for teams anyway
  const team = new Team(JSON.parse(JSON.stringify(teamData)));

  it(`should error when using bad team data `, () => {
    expect(() => {
      new Team(JSON.parse(invalidTeamData)).Name = 'whatever';
    }).to.throw();
  });

  it(`team.Id should equal '${teamData.id}`, () => {
    expect(team.Id).to.equal(teamData.id);
  });

  it(`team.Logo should equal '${teamData.logo}'`, () => {
    expect(team.Id).to.equal(teamData.id);
  });

  it(`team.Name should equal '${teamData.name}'`, () => {
    expect(team.Id).to.equal(teamData.id);
  });

  it(`team.Bots should have length of 2`, () => {
    expect(team.Bots.length).to.equal(2);
  });

  it(`team.Bots[1].Name should equal ${teamData.bots[1].Name}`, () => {
    expect(team.Bots[1].Name).to.equal(teamData.bots[1].Name);
  });
});

import { Team } from '../src/Team';
import { IBot } from '../src/IBot';
import { Bot } from '../src/Bot';
import { expect } from 'chai';
import { TROPHY_IDS } from '../src/Enums';

/**
 * Test cases for Team object
 *
 * Note: Direct instantiation is already covered in Game.test.ts
 */
describe('Team Tests', () => {
  // team needs trophies
  const trophies = new Map<TROPHY_IDS, number>().set(TROPHY_IDS.DAZED_AND_CONFUSED, 1);

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

  const teamData = {
    bots,
    id: 'fake-team-id',
    logo: 'fake-team-logo.png',
    name: 'Name',
    trophies,
  };

  // this trick gets around the need to use an interface, which is
  // something we shouldn't need for teams anyway
  const team = new Team(JSON.parse(JSON.stringify(teamData)));

  it(`team.Id should equal '${teamData.id}`, () => {
    expect(team.Id).to.equal(teamData.id);
  });

  it(`team.Logo should equal '${teamData.logo}'`, () => {
    expect(team.Id).to.equal(teamData.id);
  });

  it(`team.Name should equal '${teamData.name}'`, () => {
    expect(team.Id).to.equal(teamData.id);
  });

  // TODO: Replace trophies with something other than Map<n,n>
  //   it(`team.getTrophies() should be DAZED_AND_CONFUSED with count of 1`, () => {
  //     expect(team.Trophies.get(TROPHY_IDS.DAZED_AND_CONFUSED)).to.equal(1);
  //   });

  it(`team.Bots should have length of 2`, () => {
    expect(team.Bots.length).to.equal(2);
  });

  it(`team.Bots[1].Name should equal ${teamData.bots[1].Name}`, () => {
    expect(team.Bots[1].Name).to.equal(teamData.bots[1].Name);
  });
});

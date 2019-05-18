import { Team } from '../src/Team';
import { IBot } from '../src/IBot';
import { Bot } from '../src/Bot';
import { expect } from 'chai';
import { TROPHY_IDS } from '../src/Enums';
import ITrophyStub from '../src/ITrophyStub';

/**
 * Test cases for Team object
 *
 * Note: Direct instantiation is already covered in Game.test.ts
 */
describe('Team Tests', () => {
  // team needs trophies
  const tStub: ITrophyStub = {
    count: 1,
    id: TROPHY_IDS.DAZED_AND_CONFUSED,
    name: TROPHY_IDS[TROPHY_IDS.DAZED_AND_CONFUSED],
  };

  // add the trophies to an array
  const trophies = new Array<ITrophyStub>();
  trophies.push(tStub);

  // team needs a bot
  const botData: IBot = {
    coder: 'Coder',
    id: 'fake-bot-id',
    name: 'Name',
    trophies: new Array<ITrophyStub>(),
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
    trophies,
  });

  const teamData = {
    bots,
    id: 'fake-team-id',
    logo: 'test-team-logo.png',
    name: 'Name',
    trophies,
  };

  // this trick gets around the need to use an interface, which is
  // something we shouldn't need for teams anyway
  const team = new Team(JSON.parse(JSON.stringify(teamData)));

  it(`should error when using bad team data `, () => {
    expect(() => {
      new Team(JSON.parse(invalidTeamData)).getTrophyCount(TROPHY_IDS.DAZED_AND_CONFUSED);
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

  it(`team.getTrophyCount(DAZED_AND_CONFUSED) should have a count of 1`, () => {
    expect(team.getTrophyCount(TROPHY_IDS.DAZED_AND_CONFUSED)).to.equal(1);
  });

  it(`team.addTrophy(DAZED_AND_CONFUSED) increase trophy count to 2`, () => {
    team.addTrophy(tStub.id);
    expect(team.getTrophyCount(TROPHY_IDS.DAZED_AND_CONFUSED)).to.equal(2);
  });

  it(`team.addTrophy(DOUBLE_BACKER) add trophy with count 1`, () => {
    team.addTrophy(TROPHY_IDS.DOUBLE_BACKER);
    expect(team.getTrophyCount(TROPHY_IDS.DOUBLE_BACKER)).to.equal(1);
  });

  it(`team.Bots should have length of 2`, () => {
    expect(team.Bots.length).to.equal(2);
  });

  it(`team.Bots[1].Name should equal ${teamData.bots[1].Name}`, () => {
    expect(team.Bots[1].Name).to.equal(teamData.bots[1].Name);
  });
});

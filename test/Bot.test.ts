import { Bot } from '../src/Bot';
import { IBot } from '../src/IBot';
import { expect } from 'chai';
import ITrophyStub from '../src/ITrophyStub';
import { TROPHY_IDS } from '../src/Enums';

// test cases
describe('Bot Tests', () => {
  const bot = new Bot();
  bot.Coder = 'Coder';
  bot.Name = 'Name';
  bot.Weight = 50;

  const invalidBotData = JSON.stringify({
    coder: 'Coder',
    id: 'fake-bot-id',
    name: 'Name',
    trophies: 'I can haz trophy?',
    weight: 33,
  });

  const botData: IBot = {
    coder: 'Coder',
    id: 'fake-bot-id',
    name: 'Name',
    trophies: new Array<ITrophyStub>(),
    weight: 33,
  };

  const botLoad = new Bot(botData);

  it(`should error when using bad bot data `, () => {
    expect(() => {
      new Bot(JSON.parse(invalidBotData)).getTrophyCount(TROPHY_IDS.DAZED_AND_CONFUSED);
    }).to.throw();
  });

  it(`bot.Id should not be empty`, () => {
    return expect(bot.Id).to.not.be.empty;
  });

  it(`bot.Coder should should equal 'Coder'`, () => {
    expect(bot.Coder).to.equal('Coder');
  });

  it(`bot.Name should should equal 'Name'`, () => {
    expect(bot.Name).to.equal('Name');
  });

  it(`bot.Weight should should equal 50`, () => {
    expect(bot.Weight).to.equal(50);
  });

  it(`bot.addTrophy(DOUBLE_BACKER) should add a trophy with count 1`, () => {
    bot.addTrophy(TROPHY_IDS.DOUBLE_BACKER);
    expect(bot.getTrophyCount(TROPHY_IDS.DOUBLE_BACKER)).to.equal(1);
  });

  it(`bot.Trophies().length should should equal 1`, () => {
    expect(bot.Trophies.length).to.equal(1);
  });

  // Now test bot loaded from interface data

  it(`botLoad.Id should equal 'fake-bot-id'`, () => {
    expect(botLoad.Id).to.equal('fake-bot-id');
  });

  it(`botLoad.Coder should should equal 'Coder'`, () => {
    expect(botLoad.Coder).to.equal('Coder');
  });

  it(`botLoad.Name should should equal 'Name'`, () => {
    expect(botLoad.Name).to.equal('Name');
  });

  it(`botLoad.Weight should should equal 33`, () => {
    expect(botLoad.Weight).to.equal(33);
  });

  it(`botLoad.addTrophy(DOUBLE_BACKER) add trophy with count 1`, () => {
    botLoad.addTrophy(TROPHY_IDS.DOUBLE_BACKER);
    expect(botLoad.getTrophyCount(TROPHY_IDS.DOUBLE_BACKER)).to.equal(1);
  });

  it(`botLoad.Trophies().length should should equal 1`, () => {
    expect(botLoad.Trophies.length).to.equal(1);
  });
});

import { Bot } from '../src/Bot';
// import { IBot } from '../src/Interfaces/IBot';
import { expect } from 'chai';
import Logger from '@mazemasterjs/logger';

// test cases
describe(`${__filename} - Bot Tests`, () => {
  const bot = new Bot();
  bot.Coder = 'Coder';
  bot.Name = 'Name';
  bot.Weight = 50;

  const invalidBotData = JSON.stringify({
    id: 'fake-bot-id',
    name: 'Name',
    coder: 'Coder',
  });

  const botData: any = {
    id: 'fake-bot-id',
    name: 'Name',
    coder: 'Coder',
    weight: 33,
  };

  let botLoad: Bot = new Bot();
  Logger.getInstance().LogLevel = 4;

  before(`botLoad should load with id ${botData.id}`, () => {
    botLoad = new Bot(botData);
    expect(botLoad.Id).to.eq(botData.id);
  });

  it(`should error when using bad bot data `, () => {
    expect(() => {
      new Bot(JSON.parse(invalidBotData)).Name = '';
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
});

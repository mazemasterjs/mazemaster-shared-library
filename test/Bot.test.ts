import { Bot } from '../src/Bot';
import { IBot } from '../src/IBot';
import { expect } from 'chai';

// test cases
describe('Bot Tests', () => {
  const bot = new Bot();
  bot.Coder = 'Coder';
  bot.Name = 'Name';
  bot.Weight = 50;

  const botData: IBot = {
    coder: 'Coder',
    id: 'fake-bot-id',
    name: 'Name',
    weight: 33,
  };

  const botLoad = new Bot(botData);

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

import { Engram } from '../src/Engram';
import { IEngram } from '../src/IEngram';
import { expect } from 'chai';

// test cases
describe(__filename + ' - Engram Tests', () => {
  const engram = new Engram();
  engram.Sight = 'You see';
  engram.Sound = 'You hear';
  engram.Smell = 'You smell';
  engram.Taste = 'You taste';
  engram.Touch = 'You feel';

  const engramData: IEngram = {
    sight: 'You see',
    smell: 'You smell',
    sound: 'You hear',
    taste: 'You taste',
    touch: 'You feel',
  };

  const engramLoad = new Engram(engramData);

  it(`engram.Sight should return 'You see'`, () => {
    expect(engram.Sight).to.equal('You see');
  });

  it(`engram.Sound should return 'You hear'`, () => {
    expect(engram.Sound).to.equal('You hear');
  });

  it(`engram.Smell should return 'You smell'`, () => {
    expect(engram.Smell).to.equal('You smell');
  });

  it(`engram.Touch should return 'You feel'`, () => {
    expect(engram.Touch).to.equal('You feel');
  });

  it(`engram.Taste should return 'You taste'`, () => {
    expect(engram.Taste).to.equal('You taste');
  });

  // now test with data constructor
  it(`engramLoad.Sight should return 'You see'`, () => {
    expect(engramLoad.Sight).to.equal('You see');
  });

  it(`engramLoad.Sound should return 'You hear'`, () => {
    expect(engramLoad.Sound).to.equal('You hear');
  });

  it(`engramLoad.Smell should return 'You smell'`, () => {
    expect(engramLoad.Smell).to.equal('You smell');
  });

  it(`engramLoad.Touch should return 'You feel'`, () => {
    expect(engramLoad.Touch).to.equal('You feel');
  });

  it(`engramLoad.Taste should return 'You taste'`, () => {
    expect(engramLoad.Taste).to.equal('You taste');
  });
});

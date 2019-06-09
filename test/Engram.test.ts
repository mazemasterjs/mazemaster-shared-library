import { Engram } from '../src/Engram';
import { expect } from 'chai';

// test cases
describe(__filename + ' - Engram Tests', () => {
  const engram = new Engram();
  engram.sight = 'You see';
  engram.sound = 'You hear';
  engram.smell = 'You smell';
  engram.taste = 'You taste';
  engram.touch = 'You feel';

  const engramData = {
    sight: 'You see',
    smell: 'You smell',
    sound: 'You hear',
    taste: 'You taste',
    touch: 'You feel',
  };

  const engramLoad = new Engram(engramData);

  it(`engram.sight should return 'You see'`, () => {
    expect(engram.sight).to.equal('You see');
  });

  it(`engram.sound should return 'You hear'`, () => {
    expect(engram.sound).to.equal('You hear');
  });

  it(`engram.smell should return 'You smell'`, () => {
    expect(engram.smell).to.equal('You smell');
  });

  it(`engram.touch should return 'You feel'`, () => {
    expect(engram.touch).to.equal('You feel');
  });

  it(`engram.taste should return 'You taste'`, () => {
    expect(engram.taste).to.equal('You taste');
  });

  // now test with data constructor
  it(`engramLoad.sight should return 'You see'`, () => {
    expect(engramLoad.sight).to.equal('You see');
  });

  it(`engramLoad.sound should return 'You hear'`, () => {
    expect(engramLoad.sound).to.equal('You hear');
  });

  it(`engramLoad.smell should return 'You smell'`, () => {
    expect(engramLoad.smell).to.equal('You smell');
  });

  it(`engramLoad.touch should return 'You feel'`, () => {
    expect(engramLoad.touch).to.equal('You feel');
  });

  it(`engramLoad.taste should return 'You taste'`, () => {
    expect(engramLoad.taste).to.equal('You taste');
  });
});

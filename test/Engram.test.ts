import { Engram } from '../src/Engram';
import { expect } from 'chai';

// test cases
describe(__filename + ' - Engram Tests', () => {
  const engram = new Engram();
  engram.sight.push('You see');
  engram.sound.push('You hear');
  engram.smell.push('You smell');
  engram.taste.push('You taste');
  engram.touch.push('You feel');

  const engramData = {
    sight: ['You see'],
    smell: ['You smell'],
    sound: ['You hear'],
    taste: ['You taste'],
    touch: ['You feel'],
  };

  const engramLoad = new Engram(engramData);

  it(`engram.sight should return 'You see'`, () => {
    expect(engram.sight[0]).to.equal('You see');
  });

  it(`engram.sound should return 'You hear'`, () => {
    expect(engram.sound[0]).to.equal('You hear');
  });

  it(`engram.smell should return 'You smell'`, () => {
    expect(engram.smell[0]).to.equal('You smell');
  });

  it(`engram.touch should return 'You feel'`, () => {
    expect(engram.touch[0]).to.equal('You feel');
  });

  it(`engram.taste should return 'You taste'`, () => {
    expect(engram.taste[0]).to.equal('You taste');
  });

  // now test with data constructor
  it(`engramLoad.sight should return 'You see'`, () => {
    expect(engramLoad.sight[0]).to.equal('You see');
  });

  it(`engramLoad.sound should return 'You hear'`, () => {
    expect(engramLoad.sound[0]).to.equal('You hear');
  });

  it(`engramLoad.smell should return 'You smell'`, () => {
    expect(engramLoad.smell[0]).to.equal('You smell');
  });

  it(`engramLoad.touch should return 'You feel'`, () => {
    expect(engramLoad.touch[0]).to.equal('You feel');
  });

  it(`engramLoad.taste should return 'You taste'`, () => {
    expect(engramLoad.taste[0]).to.equal('You taste');
  });
});

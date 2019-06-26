import { Engram } from '../src/Engram';
import { expect } from 'chai';
import { IFeeling, ISenses, ISight, ISmell, ISound, ITaste } from '../src/Interfaces/ISenses';

// test cases
describe(__filename + ' - Engram Tests', () => {
  const engram = new Engram();
  const sights: ISight = { sight: 'darkness', distance: -1 };
  const sounds: ISound = { sound: 'silence', volume: -1 };
  const smells: ISmell = { scent: 'nothing', strength: -1 };
  const tastes: ITaste = { taste: 'nothing', strength: -1 };
  const feelings: IFeeling = { feeling: 'nothing', intensity: -1 };
  const senses: ISenses = { see: [sights], hear: [sounds], smell: [smells], taste: [tastes], feel: [feelings] };

  engram.north = senses;
  engram.south = senses;
  engram.east = senses;
  engram.west = senses;
  engram.here = senses;

  const engramLoad = new Engram(engram);

  it(`engram.north.see[0] should return 'darkness:-1'`, () => {
    expect(`${engram.north.see[0].sight}:${engram.north.see[0].distance}`).to.equal('darkness:-1');
  });

  it(`engram.north.sound[0] should return 'silence:-1'`, () => {
    expect(`${engram.north.hear[0].sound}:${engram.north.hear[0].volume}`).to.equal('silence:-1');
  });

  it(`engram.east.sound[0] should return 'nothing:-1'`, () => {
    expect(`${engram.east.smell[0].scent}:${engram.east.smell[0].strength}`).to.equal('nothing:-1');
  });

  it(`engram.west.taste[0] should return 'nothing:-1'`, () => {
    expect(`${engram.west.taste[0].taste}:${engram.west.taste[0].strength}`).to.equal('nothing:-1');
  });

  it(`engram.north.sound[0] should return 'nothing:-1'`, () => {
    expect(`${engram.north.feel[0].feeling}:${engram.north.feel[0].intensity}`).to.equal('nothing:-1');
  });

  // now test with data constructor
  it(`engramLoad.north.see[0] should return 'darkness:-1'`, () => {
    expect(`${engramLoad.north.see[0].sight}:${engramLoad.north.see[0].distance}`).to.equal('darkness:-1');
  });

  it(`engramLoad.north.sound[0] should return 'silence:-1'`, () => {
    expect(`${engramLoad.north.hear[0].sound}:${engramLoad.north.hear[0].volume}`).to.equal('silence:-1');
  });

  it(`engramLoad.east.sound[0] should return 'nothing:-1'`, () => {
    expect(`${engramLoad.east.smell[0].scent}:${engramLoad.east.smell[0].strength}`).to.equal('nothing:-1');
  });

  it(`engramLoad.west.taste[0] should return 'nothing:-1'`, () => {
    expect(`${engramLoad.west.taste[0].taste}:${engramLoad.west.taste[0].strength}`).to.equal('nothing:-1');
  });

  it(`engramLoad.north.sound[0] should return 'nothing:-1'`, () => {
    expect(`${engramLoad.north.feel[0].feeling}:${engramLoad.north.feel[0].intensity}`).to.equal('nothing:-1');
  });
});

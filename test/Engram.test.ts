import { cloneDeep } from 'lodash';
import { Engram } from '../src/Engram';
import { expect } from 'chai';
import { IFeeling, IIntuition, ISenses, ISight, ISmell, ISound, ITaste } from '../src/Interfaces/ISenses';
import { DIRS } from '../src/Enums';

// test cases
describe(__filename + ' - Engram Tests', () => {
  const engram = new Engram();
  const sights: ISight = { sight: 'darkness', distance: 0 };
  const sounds: ISound = { sound: 'silence', volume: 1 };
  const smells: ISmell = { scent: 'nothing', strength: 2 };
  const tastes: ITaste = { taste: 'nothing', strength: 3 };
  const feelings: IFeeling = { feeling: 'nothing', intensity: 4 };
  const senses: ISenses = {
    see: [cloneDeep(sights)],
    hear: [cloneDeep(sounds)],
    smell: [cloneDeep(smells)],
    taste: [cloneDeep(tastes)],
    feel: [cloneDeep(feelings)],
  };

  const intuition: IIntuition = { message: 'I sense danger.', confidence: 0.5, direction: DIRS.NORTH };
  const here = { exitNorth: true, exitSouth: false, exitEast: true, exitWest: false, items: ['a potion'], messages: ['dead-end'], intuition };

  engram.north = senses;
  engram.south = senses;
  engram.east = senses;
  engram.west = senses;
  engram.here = here;

  const engramLoad = new Engram(engram);

  it(`engram.north.see[0] should return 'darkness:0'`, () => {
    expect(`${engram.north.see[0].sight}:${engram.north.see[0].distance}`).to.equal('darkness:0');
  });

  it(`engram.north.sound[0] should return 'silence:1'`, () => {
    expect(`${engram.north.hear[0].sound}:${engram.north.hear[0].volume}`).to.equal('silence:1');
  });

  it(`engram.east.sound[0] should return 'nothing:2'`, () => {
    expect(`${engram.east.smell[0].scent}:${engram.east.smell[0].strength}`).to.equal('nothing:2');
  });

  it(`engram.west.taste[0] should return 'nothing:3'`, () => {
    expect(`${engram.west.taste[0].taste}:${engram.west.taste[0].strength}`).to.equal('nothing:3');
  });

  it(`engram.north.sound[0] should return 'nothing:4'`, () => {
    expect(`${engram.north.feel[0].feeling}:${engram.north.feel[0].intensity}`).to.equal('nothing:4');
  });

  it(`engram.here.exitSouth should be false`, () => {
    return expect(engram.here.exitSouth).to.be.false;
  });

  it(`engram.here.exitEast should be true`, () => {
    return expect(engram.here.exitEast).to.be.true;
  });

  it(`engram.here.items[0] should be 'a potion'`, () => {
    return expect(engram.here.items[0]).to.equal('a potion');
  });

  it(`engram.here.messages[0] should be 'dead-end'`, () => {
    return expect(engram.here.messages[0]).to.equal('dead-end');
  });

  it(`engram.here.intuition.message should be true`, () => {
    return expect(engram.here.intuition.message).to.equal('I sense danger.');
  });

  it(`engram.here.intuition.confidence should be 0.5`, () => {
    return expect(engram.here.intuition.confidence).to.equal(0.5);
  });

  // now test with data constructor
  it(`engramLoad.north.see[0] should return 'darkness:0'`, () => {
    expect(`${engramLoad.north.see[0].sight}:${engramLoad.north.see[0].distance}`).to.equal('darkness:0');
  });

  it(`engramLoad.north.sound[0] should return 'silence:1'`, () => {
    expect(`${engramLoad.north.hear[0].sound}:${engramLoad.north.hear[0].volume}`).to.equal('silence:1');
  });

  it(`engramLoad.east.sound[0] should return 'nothing:2'`, () => {
    expect(`${engramLoad.east.smell[0].scent}:${engramLoad.east.smell[0].strength}`).to.equal('nothing:2');
  });

  it(`engramLoad.west.taste[0] should return 'nothing:3'`, () => {
    expect(`${engramLoad.west.taste[0].taste}:${engramLoad.west.taste[0].strength}`).to.equal('nothing:3');
  });

  it(`engramLoad.north.sound[0] should return 'nothing:4'`, () => {
    expect(`${engramLoad.north.feel[0].feeling}:${engramLoad.north.feel[0].intensity}`).to.equal('nothing:4');
  });

  it(`engramLoad.here.exitSouth should be false`, () => {
    return expect(engramLoad.here.exitSouth).to.be.false;
  });

  it(`engramLoad.here.exitEast should be true`, () => {
    return expect(engramLoad.here.exitEast).to.be.true;
  });

  it(`engramLoad.here.items[0] should be 'a potion'`, () => {
    return expect(engramLoad.here.items[0]).to.equal('a potion');
  });

  it(`engramLoad.here.messages[0] should be 'dead-end'`, () => {
    return expect(engramLoad.here.messages[0]).to.equal('dead-end');
  });

  it(`engramLoad.here.intuition.message should be true`, () => {
    return expect(engramLoad.here.intuition.message).to.equal('I sense danger.');
  });

  it(`engramLoad.here.intuition.confidence should be 0.5`, () => {
    return expect(engramLoad.here.intuition.confidence).to.equal(0.5);
  });
});

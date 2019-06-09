import { Action } from '../src/Action';
import { expect } from 'chai';
import { COMMANDS, DIRS } from '../src/Enums';
import { Engram } from '../src/Engram';

// test cases
describe(__filename + ' - Action Tests', () => {
  const act: Action = new Action(COMMANDS.LOOK, DIRS.SOUTH, 'Test');
  let act2: Action;
  const jsonAct = {
    command: COMMANDS.LOOK,
    direction: DIRS.SOUTH,
    message: 'Test',
    engram: new Engram(),
    outcomes: ['outcome 1', 'outcome 2'],
    score: 11,
    moveCount: 33,
    trophies: [],
    botCohesion: [1, 1, 1, 1, 1],
  };

  it(`act2 should populate from static .fromJson function`, () => {
    act2 = Action.fromJson(jsonAct);
    expect(act2.outcomes[1]).to.equal('outcome 2');
  });

  it(`act2 getStub.score should be 11`, () => {
    const stub: any = act2.getStub();
    expect(stub.score).to.equal(11);
  });

  it(`act2 BotCohesion should be array of five 1s`, () => {
    let tot = 0;
    for (const val of act2.botCohesion) {
      tot += val;
    }
    expect(tot).to.equal(5);
  });

  it(`action.Command is COMMANDS.LOOK`, () => {
    expect(act.command).to.equal(COMMANDS.LOOK);
  });
  it(`action.Direction is DIRS.SOUTH`, () => {
    expect(act.direction).to.equal(DIRS.SOUTH);
  });
  it(`action.Message is 'Test'`, () => {
    expect(act.message).to.equal('Test');
  });
  it(`action.Engram to have default values`, () => {
    const pass =
      act.engram.sight.length > 0 && act.engram.smell.length > 0 && act.engram.sound.length > 0 && act.engram.taste.length > 0 && act.engram.touch.length > 0;
    expect(pass).to.equal(true);
  });
  it(`action.Command is COMMANDS.LOOK`, () => {
    expect(act.command).to.equal(COMMANDS.LOOK);
  });
});

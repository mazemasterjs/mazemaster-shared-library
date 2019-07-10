import { Action } from '../src/Action';
import { Logger } from '@mazemasterjs/logger';
import { Maze } from '../src/Maze';
import { MazeBase } from '../src/MazeBase';
import { Team } from '../src/Team';
import { Bot } from '../src/Bot';
import { Game } from '../src/Game';
import { expect } from 'chai';
import { COMMANDS, DIRS, GAME_MODES, GAME_RESULTS, GAME_STATES, PLAYER_STATES, TROPHY_IDS } from '../src/Enums';
import { Engram } from '../src/Engram';
import ITrophyStub from '../src/Interfaces/ITrophyStub';
import { IGameStub } from '../src/Interfaces/IGameStub';
import Monster from '../src/Monster';
import MazeLoc from '../src/MazeLoc';

Logger.getInstance().LogLevel = 4;

describe(__filename + ' - Game Tests', () => {
  const maze: MazeBase = new MazeBase(new Maze().generate(5, 5, 10, 'test-name', 'test-seed'));
  const spGameId = 'forced-sp-01';
  const team: Team = createTeam();
  const spGame: Game = new Game(maze, team.Id, team.Bots[0].Id);

  /**
   * Game Tests - Part One
   */
  it(`spGame.State should be NEW`, () => {
    expect(spGame.State).to.equal(GAME_STATES.NEW);
  });

  it(`game.Id should not be empty`, () => {
    return expect(spGame.Id).to.not.be.empty;
  });

  it(`game.Id = '${spGameId}' should set game.Id to '${spGameId}'`, () => {
    spGame.forceSetId(spGameId);
    return expect(spGame.Id).to.equal(spGameId);
  });

  it(`spGame.Mode should be MULTI_PLAYER`, () => {
    return expect(spGame.Mode).to.equal(GAME_MODES.MULTI_PLAYER);
  });

  it(`spGame.GetRound should be 1`, () => {
    return expect(spGame.Round).to.equal(1);
  });

  it(`spGame.TeamId should equal team.Id`, () => {
    return expect(spGame.TeamId).to.equal(team.Id);
  });

  it(`spGame.BotId should equal team.Bots[0].Id`, () => {
    return expect(spGame.BotId).to.equal(team.Bots[0].Id);
  });

  it(`spGame.GetRound should be 1`, () => {
    return expect(spGame.Round).to.equal(1);
  });

  it(`game.getLastAction should throw an error if no actions exist`, () => {
    return expect(() => {
      spGame.getLastAction();
    }).to.throw();
  });

  /**
   * Player Tests
   *
   */
  it(`Player should start a new game in the maze's start cell`, () => {
    expect(spGame.Player.Location.equals(spGame.Maze.StartCell)).to.equal(true);
  });

  it(`Player should start a new game in state PLAYER_STATES.SITTING`, () => {
    expect(spGame.Player.State).to.equal(PLAYER_STATES.SITTING);
  });

  it(`spGame.Player.addState(PLAYER_STATES.STANDING) should set player state to STANDING`, () => {
    spGame.Player.addState(PLAYER_STATES.STANDING);
    expect(spGame.Player.State).to.equal(PLAYER_STATES.STANDING);
  });

  it(`spGame.Player.addState(PLAYER_STATES.STUNNED) should set player state to STANDING & STUNNED`, () => {
    spGame.Player.addState(PLAYER_STATES.STUNNED);
    expect(spGame.Player.State).to.equal(PLAYER_STATES.STANDING + PLAYER_STATES.STUNNED);
  });

  it(`spGame.Player.addState(PLAYER_STATES.SITTING) should set player state to SITTING and remove STANDING`, () => {
    spGame.Player.addState(PLAYER_STATES.SITTING);
    expect(spGame.Player.State).to.equal(PLAYER_STATES.SITTING + PLAYER_STATES.STUNNED);
  });

  it(`spGame.Player.addState(PLAYER_STATES.STANDING) should set player state to STUNNED and STANDING, and remove SITTING`, () => {
    spGame.Player.addState(PLAYER_STATES.STANDING);
    expect(spGame.Player.State).to.equal(PLAYER_STATES.STANDING + PLAYER_STATES.STUNNED);
  });

  it(`spGame.Player.addState(PLAYER_STATES.LYING) should set player state to STUNNED and LYING, and remove STANDING`, () => {
    spGame.Player.addState(PLAYER_STATES.LYING);
    expect(spGame.Player.State).to.equal(PLAYER_STATES.LYING + PLAYER_STATES.STUNNED);
  });

  it(`spGame.Player.removeState(PLAYER_STATES.LYING) should set player state to STUNNED`, () => {
    spGame.Player.removeState(PLAYER_STATES.LYING);
    expect(spGame.Player.State).to.equal(PLAYER_STATES.STUNNED);
  });

  it(`spGame.Player.clearStates() should set player state to NONE, but NONE should automatically be switched back to STANDING`, () => {
    spGame.Player.clearStates();
    expect(spGame.Player.State).to.equal(PLAYER_STATES.STANDING);
  });

  /* New tests for Player.Facing */
  it(`Player should be facing south initially`, () => {
    expect(spGame.Player.Facing).to.equal(DIRS.SOUTH);
  });

  it(`Player's facing changed to east`, () => {
    spGame.Player.Facing = DIRS.EAST;
    expect(spGame.Player.Facing).to.equal(DIRS.EAST);
  });

  it(`Players changed facing direction should be east`, () => {
    expect(spGame.Player.Facing).to.equal(DIRS.EAST);
  });

  /**
   * Score Tests
   */
  it(`spGame.Score.Id should be not be empty`, () => {
    return expect(spGame.Score.Id).to.not.be.empty;
  });

  it(`spGame.Score.BotId should equal spGame.BotId`, () => {
    expect(spGame.Score.BotId).to.equal(spGame.BotId);
  });

  it(`spGame.Score.TeamId should equal spGame.TeamId`, () => {
    expect(spGame.Score.TeamId).to.equal(spGame.TeamId);
  });

  it(`spGame.Score.GameId should equal spGame.Id`, () => {
    return expect(spGame.Score.GameId).to.equal(spGame.Id);
  });

  it(`spGame.Score.MazeId should be not be empty`, () => {
    return expect(spGame.Score.MazeId).to.not.be.empty;
  });

  it(`spGame.Score.GameRound should be 1`, () => {
    return expect(spGame.Score.GameRound).to.equal(1);
  });

  it(`spGame.Score.GameResult should be NONE`, () => {
    return expect(spGame.Score.GameResult).to.equal(GAME_RESULTS.NONE);
  });

  it(`spGame.Score.MoveCount should be 0`, () => {
    return expect(spGame.Score.MoveCount).to.equal(0);
  });

  /**
   * Game Tests - Part two
   */
  it(`spGame.addAction(STAND) should increase spGame.Actions.length to 1.`, () => {
    const curScore = spGame.Score.getTotalScore();
    const curMoves = spGame.Score.MoveCount;
    const action = createAction(COMMANDS.STAND, DIRS.NONE, '');
    spGame.Score.addMove();
    spGame.Score.addTrophy(TROPHY_IDS.WISHFUL_THINKING);
    spGame.Score.addBonusPoints(-10);
    action.score = curScore - spGame.Score.getTotalScore();
    action.moveCount = curMoves - spGame.Score.MoveCount;

    spGame.addAction(action);

    return expect(spGame.Actions.length).to.equal(1);
  });

  it(`spGame.getLastAction() should return the last action added`, () => {
    const lastAct = spGame.getLastAction();
    return expect(lastAct.command).to.equal(COMMANDS.STAND);
  });

  it(`Current score after one move should be 989`, () => {
    return expect(spGame.Score.getTotalScore()).to.equal(989);
  });

  it(`spGame.addAction(JUMP) should increase MoveCount to 3`, () => {
    const curScore = spGame.Score.getTotalScore();
    const curMoves = spGame.Score.MoveCount;
    const action = createAction(COMMANDS.JUMP, DIRS.NONE, '');
    spGame.Score.addMoves(2);
    spGame.Score.addTrophy(TROPHY_IDS.MIGHTY_MOUSE);
    spGame.Score.addBonusPoints(50);
    action.score = curScore - spGame.Score.getTotalScore();
    action.moveCount = curMoves - spGame.Score.MoveCount;

    spGame.addAction(action);

    return expect(spGame.Score.MoveCount).to.equal(3);
  });

  it(`Current score after three moves should be 1037`, () => {
    return expect(spGame.Score.getTotalScore()).to.equal(1037);
  });

  it(`spGame.State should should now be IN_PROGRESS.`, () => {
    return expect(spGame.State).to.equal(GAME_STATES.IN_PROGRESS);
  });

  it(`set spGame.State should be reflected in Score`, () => {
    spGame.State = GAME_STATES.ABORTED;
    return expect(spGame.Score.GameResult).to.equal(GAME_RESULTS.ABANDONED);
  });

  it(`set spGame.State should be reflected in Score 2`, () => {
    spGame.State = GAME_STATES.IN_PROGRESS;
    return expect(spGame.Score.GameResult).to.equal(GAME_RESULTS.IN_PROGRESS);
  });

  it(`4x look actions should increase move count to 6`, () => {
    spGame.addAction(createAction(COMMANDS.LOOK, DIRS.SOUTH, ''));
    spGame.addAction(createAction(COMMANDS.LOOK, DIRS.NORTH, ''));
    spGame.addAction(createAction(COMMANDS.JUMP, DIRS.EAST, ''));
    spGame.addAction(createAction(COMMANDS.JUMP, DIRS.WEST, ''));
    spGame.Score.addMoves(4);
    return expect(spGame.Actions.length).to.equal(6);
  });

  it(`Score should now be 1033`, () => {
    return expect(spGame.Score.getTotalScore()).to.equal(1033);
  });

  it(`1 move (-1 point) + 1 backtrack (-2 points) should decrease score to 1031`, () => {
    spGame.addAction(createAction(COMMANDS.MOVE, DIRS.SOUTH, ''));
    spGame.addAction(createAction(COMMANDS.MOVE, DIRS.NORTH, ''));
    spGame.Score.addMove();
    spGame.Score.addBacktrack();
    return expect(spGame.Score.getTotalScore()).to.equal(1031);
  });

  it(`spGame.getActionsRange(1, 3).length should equal 3`, () => {
    expect(spGame.getActionsRange(1, 3).length).to.equal(3);
  });

  it(`spGame.getActionsSince(1).length should equal 8`, () => {
    expect(spGame.getActionsSince(1).length).to.equal(8);
  });

  it(`spGame.getStub() should return a valid api URL`, () => {
    const gameUrl = 'http://mazemasterjs.com/game/get/';
    const stub: IGameStub = spGame.getStub(gameUrl);
    expect(stub.url).to.equal(gameUrl + spGame.Id);
  });

  after('Generate text render with player position', () => {
    const fullMaze: Maze = new Maze(spGame.Maze);
    Logger.getInstance().debug(__filename, 'after()', '\n\r\n\r' + fullMaze.generateTextRender(true, spGame.Player.Location));
  });
});

function createTeam(): Team {
  const t = new Team();
  t.Name = 'Mocha Madness';
  t.Logo = 'http://mazemasterjs/images/logos/fake-logo-150.png';
  t.Bots.push(createBot('MochaName-1', 'MochaCoder-1'));
  t.Bots.push(createBot('MochaName-2', 'MochaCoder-2'));
  t.Bots.push(createBot('MochaName-3', 'MochaCoder-3'));
  t.Bots.push(createBot('MochaName-4', 'MochaCoder-4'));
  t.Bots.push(createBot('MochaName-5', 'MochaCoder-5'));
  return t;
}

function createBot(name: string, coder: string): Bot {
  const b = new Bot();
  b.Name = name;
  b.Coder = coder;
  return b;
}

function createAction(cmd: COMMANDS, dir: DIRS, msg: string): Action {
  const a = new Action(cmd, dir, msg);
  a.command = cmd;
  a.direction = dir ? dir : DIRS.NONE;
  a.engram = new Engram();
  a.outcomes = [`Command: ${COMMANDS[a.command]} Direction: ${DIRS[a.direction]}`];
  a.trophies = new Array<ITrophyStub>();
  a.botCohesion = new Array<number>(5).fill(1);

  return a;
}

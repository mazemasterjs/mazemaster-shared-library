// import { IMazeStub } from '../src/IMazeStub';
import { IGameStub } from '../src/IGameStub';
import Logger from '@mazemasterjs/logger';
import { Game } from '../src/Game';
import { Maze } from '../src/Maze';
import { Team } from '../src/Team';
import { Score } from '../src/Score';
import { Player } from '../src/Player';
import { Bot } from '../src/Bot';
import { expect } from 'chai';
import { GAME_MODES, GAME_RESULTS, GAME_STATES, PLAYER_STATES, TROPHY_IDS } from '../src/Enums';
import { IAction } from '../src/IAction';
import { Engram } from '../src/Engram';

// test cases
describe('Game, Team, Player, Score Tests', () => {
  const log = Logger.getInstance();
  let game: Game;
  let maze: Maze;
  let team: Team;
  let player: Player;
  let score: Score;
  let action: IAction;
  const forcedGameId = 'FORCED_GAME_ID_001';
  const height = 3;
  const width = 4;
  const challenge = 5;
  const name = 'GameTestName';
  const seed = 'GameTestSeed';
  const botName = 'GameTestBotName';
  const botCoder = 'GameTestBotCoder';
  const botWeight = 100;
  const teamName = 'GameTestTeamName';
  const teamLogo = 'GameTestTeamLogo.png';

  const engram = new Engram();
  engram.Sight = 'You see';
  engram.Sound = 'You hear';
  engram.Smell = 'You smell';
  engram.Taste = 'You taste';
  engram.Touch = 'You feel';

  const outcome = ['You fell down.', 'You stood up.'];
  const cohesion = [1, 1, 1, 1, 1];
  const trophies = new Map<number, number>();
  trophies.set(TROPHY_IDS.LOOPER, 1);
  trophies.set(TROPHY_IDS.SCRIBBLER, 1);

  before(`Game-related objects created without error.`, () => {
    maze = new Maze().generate(height, width, challenge, name, seed);

    // create a bot for the team
    const bot = new Bot();
    bot.Coder = botCoder;
    bot.Name = botName;
    bot.Weight = botWeight;

    // create a team for the game
    team = new Team();
    team.Name = teamName;
    team.Logo = teamLogo;
    team.Bots.push(bot);
    team.addTrophy(TROPHY_IDS.DAZED_AND_CONFUSED);

    // create a score for the game
    score = new Score();
    score.MazeId = maze.Id;
    score.GameRound = 1;
    score.TeamId = team.Id;
    score.BotId = team.Bots[0].Id;

    // create a  player for the game
    player = new Player(maze.StartCell, PLAYER_STATES.NONE);

    // create the game
    game = new Game(maze, player, score, 1, bot.Id, team.Id);

    // create a game action
    action = {
      action: 'move',
      botCohesion: cohesion,
      direction: 'south',
      engram,
      location: game.Player.Location,
      mazeId: game.Maze.Id,
      outcome,
      playerState: game.Player.State,
      score: game.Score,
      trophies,
    };

    return expect(game).to.not.equal(undefined);
  });

  /**
   * Game Tests - Part One
   */
  it(`game.State should equal GAME_STATES.NEW`, () => {
    expect(game.State).to.equal(GAME_STATES.NEW);
  });

  it(`game.Id should not be empty`, () => {
    return expect(game.Id).to.not.be.empty;
  });

  it(`game.Mode should not be MULTI_PLAYER`, () => {
    return expect(game.Mode).to.equal(GAME_MODES.MULTI_PLAYER);
  });

  it(`game.forceSetId(${forcedGameId}) should set game.Id`, () => {
    game.forceSetId(forcedGameId);
    return expect(game.Id).to.equal(forcedGameId);
  });

  it(`Forced game.Id should be applied to game.Score.GameId`, () => {
    return expect(game.Id).to.equal(game.Score.GameId);
  });

  it(`game.GetRound should be 1`, () => {
    return expect(game.Round).to.equal(1);
  });

  it(`game.TeamId should equal team.Id`, () => {
    return expect(game.TeamId).to.equal(team.Id);
  });

  it(`game.BotId should equal team.Bots[0].Id`, () => {
    return expect(game.BotId).to.equal(team.Bots[0].Id);
  });

  it(`game.GetRound should be 1`, () => {
    return expect(game.Round).to.equal(1);
  });

  /**
   * Player Tests
   *
   */
  it(`Player.Location should equal maze.StartCell`, () => {
    expect(game.Player.Location.equals(game.Maze.StartCell)).to.equal(true);
  });

  it(`game.Player.State should be PLAYER_STATES.NONE`, () => {
    expect(game.Player.State).to.equal(PLAYER_STATES.NONE);
  });

  it(`game.Player.addState(PLAYER_STATES.STANDING) should set player state to STANDING`, () => {
    game.Player.addState(PLAYER_STATES.STANDING);
    expect(game.Player.State).to.equal(PLAYER_STATES.STANDING);
  });

  it(`game.Player.addState(PLAYER_STATES.STUNNED) should set player state to STANDING & STUNNED`, () => {
    game.Player.addState(PLAYER_STATES.STUNNED);
    expect(game.Player.State).to.equal(PLAYER_STATES.STANDING + PLAYER_STATES.STUNNED);
  });

  it(`game.Player.addState(PLAYER_STATES.SITTING) should set player state to SITTING and remove STANDING`, () => {
    game.Player.addState(PLAYER_STATES.SITTING);
    expect(game.Player.State).to.equal(PLAYER_STATES.SITTING + PLAYER_STATES.STUNNED);
  });

  it(`game.Player.addState(PLAYER_STATES.STANDING) should set player state to STUNNED and STANDING, and remove SITTING`, () => {
    game.Player.addState(PLAYER_STATES.STANDING);
    expect(game.Player.State).to.equal(PLAYER_STATES.STANDING + PLAYER_STATES.STUNNED);
  });

  it(`game.Player.addState(PLAYER_STATES.LYING) should set player state to STUNNED and LYING, and remove STANDING`, () => {
    game.Player.addState(PLAYER_STATES.LYING);
    expect(game.Player.State).to.equal(PLAYER_STATES.LYING + PLAYER_STATES.STUNNED);
  });

  it(`game.Player.removeState(PLAYER_STATES.LYING) should set player state to STUNNED`, () => {
    game.Player.removeState(PLAYER_STATES.LYING);
    expect(game.Player.State).to.equal(PLAYER_STATES.STUNNED);
  });

  it(`game.Player.clearStates() should set player state to NONE`, () => {
    game.Player.clearStates();
    expect(game.Player.State).to.equal(PLAYER_STATES.NONE);
  });

  it(`game.State should be NEW`, () => {
    expect(game.State).to.equal(GAME_STATES.NEW);
  });

  /**
   * Score Tests
   */
  it(`game.Score.Id should be not be empty`, () => {
    return expect(game.Score.Id).to.not.be.empty;
  });

  it(`game.Score.BotId should equal game.BotId`, () => {
    expect(game.Score.BotId).to.equal(game.BotId);
  });

  it(`game.Score.TeamId should equal game.TeamId`, () => {
    expect(game.Score.TeamId).to.equal(game.TeamId);
  });

  it(`game.Score.GameId should equal game.Id`, () => {
    return expect(game.Score.GameId).to.equal(game.Id);
  });

  it(`game.Score.MazeId should be not be empty`, () => {
    return expect(game.Score.MazeId).to.not.be.empty;
  });

  it(`game.Score.GameRound should be 1`, () => {
    return expect(game.Score.GameRound).to.equal(1);
  });

  it(`game.Score.GameResult should be IN_PROGRESS`, () => {
    return expect(game.Score.GameResult).to.equal(GAME_RESULTS.IN_PROGRESS);
  });

  it(`game.Score.GAME_RESULTS should be IN_PROGRESS`, () => {
    expect(game.Score.GameResult).to.equal(GAME_RESULTS.IN_PROGRESS);
  });

  it(`game.Score.MoveCount should be 0`, () => {
    return expect(game.Score.MoveCount).to.equal(0);
  });

  it(`game.Score.addMove() should increment Score.Moves to 1`, () => {
    game.Score.addMove();
    return expect(game.Score.MoveCount).to.equal(1);
  });

  it(`game.Score.addMoves(2) should increment Score.Moves to 3`, () => {
    game.Score.addMoves(2);
    return expect(game.Score.MoveCount).to.equal(3);
  });

  it(`game.Score.BacktrackCount should be 0`, () => {
    return expect(game.Score.BacktrackCount).to.equal(0);
  });

  it(`game.Score.addBacktrack() should increment Score.BacktrackCount to 1`, () => {
    game.Score.addBacktrack();
    return expect(game.Score.BacktrackCount).to.equal(1);
  });

  /**
   * Game Tests - Part two
   */
  it(`game.addAction() should increase game.Actions.length to 1.`, () => {
    game.addAction(action);
    return expect(game.Actions.length).to.equal(1);
  });

  it(`game.State should should now be IN_PROGRESS.`, () => {
    return expect(game.State).to.equal(GAME_STATES.IN_PROGRESS);
  });

  it(`game.Score.MoveCount() should still be 3`, () => {
    return expect(game.Score.MoveCount).to.equal(3);
  });

  /** Note: These actions are all pointers - properties are not independent  */
  it(`game.addAction() x5 should increase game.Actions.length to 6.`, () => {
    game.addAction(action);
    game.addAction(action);
    game.addAction(action);
    game.addAction(action);
    game.addAction(action);
    return expect(game.Actions.length).to.equal(6);
  });

  it(`game.getAction(2).score.MoveCount should equal 3`, () => {
    expect(game.getAction(2).score.MoveCount).to.equal(3);
  });

  it(`game.getActionsRange(1, 3).length should equal 3`, () => {
    expect(game.getActionsRange(1, 3).length).to.equal(3);
  });

  it(`game.getActionsSince(1).length should equal 6`, () => {
    expect(game.getActionsSince(1).length).to.equal(6);
  });

  it(`game.getStub() should return a valid api URL`, () => {
    const gameUrl = 'http://mazemasterjs.com/api/game/get/';
    const stub: IGameStub = game.getStub(gameUrl);
    expect(stub.url).to.equal(gameUrl + game.Id);
  });

  it(`game.nextRound() should update game round`, () => {
    game.nextRound();
    expect(game.Round).to.equal(2);
  });

  it(`game.nextRound() should reposition player to start cell`, () => {
    expect(game.Player.Location).to.equal(game.Maze.StartCell);
  });

  it(`game.nextRound() should reset game state to NEW`, () => {
    expect(game.State).to.equal(GAME_STATES.NEW);
  });

  it(`game.nextRound() should reset player state to STANDING`, () => {
    expect(game.Player.State).to.equal(PLAYER_STATES.STANDING);
  });

  after('Generate text render with player position', () => {
    log.debug(__filename, 'after()', '\n\r\n\r' + game.Maze.generateTextRender(true, game.Player.Location));
  });
});

import { GAME_MODES, GAME_STATES, PLAYER_STATES } from './Enums';
import { Score } from './Score';
import { Logger } from '@mazemasterjs/logger';
import { IGameStub } from './IGameStub';
import { Player } from './Player';
import { IAction } from './IAction';
import uuid from 'uuid/v4';
import MazeBase from './MazeBase';

const log = Logger.getInstance();

export class Game {
  private id: string;
  private state: GAME_STATES;
  private maze: MazeBase;
  private mode: GAME_MODES;
  private score: Score;
  private player: Player;
  private actions: Array<IAction>;
  private round: number;
  private teamId: string;
  private botId: string;
  private lastAccessed: number;

  constructor(maze: MazeBase, player: Player, score: Score, round: number, botId: string, teamId: string) {
    this.id = uuid();
    this.state = GAME_STATES.NEW;
    this.maze = maze;
    this.player = player;
    this.score = score;
    this.score.GameId = this.id;
    this.actions = new Array<IAction>();
    this.lastAccessed = Date.now();
    this.round = round;
    this.mode = GAME_MODES.SINGLE_PLAYER;
    this.teamId = teamId.trim();
    this.botId = botId.trim();

    if (teamId + botId === '') {
      const err = new Error('Either a botId (single-player) or a teamId must be provided.');
      log.error(__filename, 'constructor()', 'Missing parameter ->', err);
      throw err;
    }

    if (this.teamId !== '') {
      this.mode = GAME_MODES.MULTI_PLAYER;
      log.debug(__filename, 'constructor()', `Team [ ${this.teamId} ] provided. Game mode set to MULTI_PLAYER.`);
      if (this.botId !== '') {
        log.warn(__filename, 'constructor()', `Bot [ ${this.botId} ] AND Team [ ${this.teamId} ] provided - individual bot will be ignored.`);
      }
    } else {
      this.mode = GAME_MODES.SINGLE_PLAYER;
      log.debug(__filename, 'constructor()', `Bot [ ${this.botId} ] provided. Game mode set to SINGLE_PLAYER.`);
    }
  }

  public get Round() {
    this.lastAccessed = Date.now();
    return this.round;
  }

  /**
   * New game round - resets actions, score, player state, and player location
   */
  // TODO: This is not fully implemented.  Game Rounds are intended to give players
  //       the chance to run a maze repeatedly, learning from each run and, hopefully, getting
  //       better as they go.  Round-specific scores will not persist... should they?
  public nextRound(): number {
    this.lastAccessed = Date.now();
    this.round++;
    this.state = GAME_STATES.NEW;
    this.actions = new Array<IAction>();
    this.score = new Score();

    // reset player to standing
    this.player.clearStates();
    this.player.addState(PLAYER_STATES.STANDING);

    // player moves back to start cell
    this.player.Location = this.maze.StartCell;

    // set score round to match game round
    this.score.GameRound = this.round;

    return this.round;
  }

  public get LastAccessTime() {
    this.lastAccessed = Date.now();
    return this.lastAccessed;
  }

  public get Id() {
    this.lastAccessed = Date.now();
    return this.id;
  }

  public get BotId(): string {
    this.lastAccessed = Date.now();
    if (this.botId === '') {
      log.warn(__filename, 'get BotId()', 'Warning: BotId is empty. Game mode is MULTI_PLAYER.');
    }

    return this.botId;
  }

  public addAction(action: IAction) {
    if (this.state === GAME_STATES.NEW) {
      this.state = GAME_STATES.IN_PROGRESS;
    }
    this.lastAccessed = Date.now();
    this.actions.push(action);
  }

  public getAction(moveNumber: number): IAction {
    this.lastAccessed = Date.now();
    return this.actions[moveNumber];
  }

  public get Actions(): Array<IAction> {
    this.lastAccessed = Date.now();
    return this.actions;
  }

  /**
   * Returns a list of actions starting with the given move number
   *
   * @param moveNumber - First move in the returned list of actions
   *
   */
  public getActionsSince(moveNumber: number): Array<IAction> {
    this.lastAccessed = Date.now();
    const ret: Array<IAction> = new Array<IAction>();
    moveNumber--;
    if (moveNumber < 0) {
      moveNumber = 0;
    }

    if (moveNumber >= this.actions.length) {
      moveNumber = this.actions.length - 1;
    }
    for (let x = moveNumber; x < this.actions.length; x++) {
      ret.push(this.actions[x]);
    }

    return ret;
  }

  /**
   * Returns an array of game actions within the given range
   *
   * @param start starting action
   * @param count total number of actions to return
   */
  public getActionsRange(start: number, count: number): Array<IAction> {
    this.lastAccessed = Date.now();
    const actions: Array<IAction> = new Array<IAction>();

    if (start < 1) {
      start = 1;
    }
    if (count < 1) {
      count = 1;
    }

    start = start - 1;
    for (start; start < count; start++) {
      if (start <= this.actions.length) {
        actions.push(this.actions[start]);
      }
    }

    return actions;
  }

  // no last access check here because this method is used by cache manager
  public getStub(gameServerExtUrl: string): IGameStub {
    return {
      botId: this.BotId,
      gameId: this.Id,
      gameMode: this.Mode,
      gameState: this.State,
      mazeStub: this.Maze.getMazeStub(),
      score: this.Score,
      teamId: this.TeamId,
      url: `${gameServerExtUrl}${this.Id}`,
    };
  }

  // useful for testing - forces the Game ID to the given value
  public forceSetId(forcedId: string) {
    this.lastAccessed = Date.now();
    this.id = forcedId;
    this.score.GameId = this.id;
  }

  // returns game mode: single or multiplayer
  public get Mode(): GAME_MODES {
    return this.mode;
  }

  public get State() {
    // no last access update here because this function is used by cache manager
    return this.state;
  }

  public set State(gameState: GAME_STATES) {
    this.lastAccessed = Date.now();
    this.state = gameState;
  }

  public get Maze(): MazeBase {
    this.lastAccessed = Date.now();
    return this.maze;
  }

  public get TeamId(): string {
    this.lastAccessed = Date.now();
    if (this.teamId === '') {
      log.warn(__filename, 'get TeamId()', 'Warning: TeamId is empty. Game mode is SINGLE_PLAYER');
    }
    return this.teamId;
  }

  public get Score(): Score {
    this.lastAccessed = Date.now();
    return this.score;
  }

  public get Player(): Player {
    this.lastAccessed = Date.now();
    return this.player;
  }
}

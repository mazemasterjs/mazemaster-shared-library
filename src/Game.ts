import { GAME_STATES, PLAYER_STATES } from './Enums';
import { Maze } from './Maze';
import { Team } from './Team';
import { Score } from './Score';
import { Logger } from '@mazemasterjs/logger';
import { IGameStub } from './IGameStub';
import { Player } from './Player';
import { IAction } from './IAction';
import uuid from 'uuid/v4';

const log = Logger.getInstance();

export class Game {
  private id: string;
  private state: GAME_STATES;
  private maze: Maze;
  private team: Team;
  private score: Score;
  private player: Player;
  private actions: Array<IAction>;
  private botId: string;
  private round: number;
  private lastAccessed: number;

  constructor(maze: Maze, team: Team, player: Player, score: Score, round: number, botId?: string) {
    this.id = uuid();
    this.state = GAME_STATES.NEW;
    this.maze = maze;
    this.player = player;
    this.team = team;
    this.score = new Score();
    this.actions = new Array<IAction>();
    this.lastAccessed = Date.now();
    this.round = round;
    this.botId = botId === undefined ? '' : botId;

    if (this.botId !== '') {
      log.debug(__filename, 'constructor()', 'New TEAM GAME instance created.  Id: ' + this.id);
    } else {
      log.debug(__filename, 'constructor()', 'New TEAM-BOT GAME instance created.  Id: ' + this.id);
    }
  }

  public getRound() {
    this.lastAccessed = Date.now();
    return this.round;
  }

  /**
   * New game round - resets actions, score, player state, and player location
   */
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

  public get BotId() {
    this.lastAccessed = Date.now();
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
      gameId: this.Id,
      gameState: this.State,
      mazeStub: this.Maze.getMazeStub(),
      score: this.Score,
      team: this.Team,
      url: `${gameServerExtUrl}/game/${this.Id}`,
    };
  }

  // useful for testing - forces the Game ID to the given value
  public forceSetId(forcedId: string) {
    this.id = forcedId;
    this.lastAccessed = Date.now();
  }

  public get State() {
    // no last access update here because this function is used by cache manager
    return this.state;
  }

  public set State(gameState: GAME_STATES) {
    this.lastAccessed = Date.now();
    this.state = gameState;
  }

  public get Maze(): Maze {
    this.lastAccessed = Date.now();
    return this.maze;
  }

  public get Team(): Team {
    this.lastAccessed = Date.now();
    return this.team;
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

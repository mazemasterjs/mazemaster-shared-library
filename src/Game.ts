import { DIRS, GAME_MODES, GAME_RESULTS, GAME_STATES, PLAYER_STATES, MONSTER_STATES, MONSTER_TAGS } from './Enums';
import { Score } from './Score';
import { Logger } from '@mazemasterjs/logger';
import { IGameStub } from './Interfaces/IGameStub';
import { Player } from './Player';
import { IAction } from './Interfaces/IAction';
import MazeBase from './MazeBase';
import { ObjectBase } from './ObjectBase';
import MazeLoc from './MazeLoc';
import Monster from './Monster';

const log = Logger.getInstance();

export class Game extends ObjectBase {
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
  private monsters: Array<Monster>;

  constructor(maze: MazeBase, teamId: string, botId?: string) {
    super();

    this.id = this.generateId();
    this.state = GAME_STATES.NEW;
    this.maze = maze;
    this.player = new Player(new MazeLoc(maze.StartCell.row, maze.StartCell.col), PLAYER_STATES.SITTING, DIRS.SOUTH);
    this.actions = new Array<IAction>();
    this.lastAccessed = Date.now();
    this.round = 1;
    this.mode = GAME_MODES.SINGLE_PLAYER;
    this.teamId = teamId.trim();
    this.botId = botId ? botId : '';
    this.score = new Score(this.id, maze.Id, this.teamId, this.mode, this.botId);
    this.monsters = [];

    // teamId is always required
    if (teamId === '') {
      const err = new Error('Invalid teamId recieved: ' + teamId);
      log.error(__filename, 'constructor()', 'Invalid Parameter ->', err);
      throw err;
    }

    // validate bot if singleplayer game
    this.botId = this.botId.trim();
    if (botId !== '') {
      log.debug(__filename, 'constructor()', 'botId provided - game is singleplayer.');
      this.mode = GAME_MODES.MULTI_PLAYER;
    } else {
      log.debug(__filename, 'constructor()', 'No botId was provided - game is multiplayer.');
    }
  }

  public get Round() {
    this.lastAccessed = Date.now();
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
    return this.botId;
  }

  public addAction(action: IAction) {
    if (this.state === GAME_STATES.NEW) {
      this.State = GAME_STATES.IN_PROGRESS;
    }
    this.lastAccessed = Date.now();
    this.actions.push(action);
  }

  public getLastAction(): IAction {
    this.lastAccessed = Date.now();
    if (this.actions.length === 0) {
      const actError = new Error('The game has no actions to return.');
      log.error(__filename, 'getLastAction()', 'Cannot return lastAction ->', actError);
      throw actError;
    }
    return this.actions[this.actions.length - 1];
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
    this.lastAccessed = Date.now();
    return this.mode;
  }

  public get State() {
    this.lastAccessed = Date.now();
    // no last access update here because this function is used by cache manager
    return this.state;
  }

  public set State(gameState: GAME_STATES) {
    this.lastAccessed = Date.now();
    this.state = gameState;

    // update the score GAME_RESULT value as well
    switch (gameState) {
      case GAME_STATES.IN_PROGRESS: {
        this.score.GameResult = GAME_RESULTS.IN_PROGRESS;
        return;
      }
      case GAME_STATES.ABORTED:
      case GAME_STATES.ERROR: {
        this.score.GameResult = GAME_RESULTS.ABANDONED;
        return;
      }
    }
  }

  public get Maze(): MazeBase {
    this.lastAccessed = Date.now();
    return this.maze;
  }

  public set Maze(maze: MazeBase) {
    this.lastAccessed = Date.now();
    this.maze = maze;
  }

  public get TeamId(): string {
    this.lastAccessed = Date.now();
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

  public set Player(player: Player) {
    this.player = player;
  }

  public get Monsters() {
    return this.monsters;
  }

  public addMonster(monster: Monster) {
    this.monsters.push(monster);
  }

  public removeMonster(monster: Monster) {
    let ind = -1;
    this.monsters.find(item => {
      if (monster.equals(item)) {
        ind = this.monsters.indexOf(item);
      }
    });
    if (ind >= 0) {
      this.monsters.splice(ind, 1);
    }
  }
}

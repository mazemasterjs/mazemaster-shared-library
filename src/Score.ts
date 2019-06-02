import uuid from 'uuid/v4';
import { GAME_MODES, GAME_RESULTS } from './Enums';
import { IScore } from './IScore';
import Logger from '@mazemasterjs/logger';
import { ObjectBase } from './ObjectBase';

const log = Logger.getInstance();

export class Score extends ObjectBase {
  private mazeId: string;
  private teamId: string;
  private gameId: string; // multiple scores can be saved under the same gameId - one for each game round
  private botId: string;
  private gameRound: number;
  private id: string;
  private lastUpdated: number;
  private gameResult: GAME_RESULTS;
  private moveCount: number;
  private backtrackCount: number;
  private bonusPoints: number;
  private gameMode: GAME_MODES;

  constructor(jsonData?: IScore) {
    super();

    this.id = uuid();
    this.mazeId = '';
    this.teamId = '';
    this.gameId = '';
    this.gameRound = 1;
    this.lastUpdated = -1;
    this.botId = '';
    this.gameResult = GAME_RESULTS.IN_PROGRESS;
    this.moveCount = 0;
    this.bonusPoints = 0;
    this.backtrackCount = 0;
    this.gameMode = GAME_MODES.SINGLE_PLAYER;

    if (jsonData !== undefined) {
      this.loadData(jsonData);
    }
  }

  /**
   * Attempts to load the given JSON Object into the current Score instance
   * @param jsonData
   */
  public loadData(jsonData: any) {
    log.debug(__filename, `loadData(${jsonData})`, 'Attempting to populate ScoreBase from jsonData...');
    if (jsonData !== undefined) {
      this.id = this.validateField('id', jsonData.id, 'string');
      this.mazeId = this.validateField('mazeId', jsonData.mazeId, 'string');
      this.teamId = this.validateField('teamId', jsonData.teamId, 'string');
      this.gameId = this.validateField('teamId', jsonData.gameId, 'string');
      this.gameRound = this.validateField('teamId', jsonData.gameRound, 'number');
      this.lastUpdated = this.validateField('lastUpdated', jsonData.lastUpdated, 'number');
      this.botId = this.validateField('botId', jsonData.botId, 'string');
      this.gameResult = this.validateField('gameResult', jsonData.gameResult, 'number');
      this.moveCount = this.validateField('moveCount', jsonData.moveCount, 'number');
      this.bonusPoints = this.validateField('bonusPoints', jsonData.bonusPoints, 'number');
      this.backtrackCount = this.validateField('backtrackCount', jsonData.backtrackCount, 'number');
      this.gameMode = this.validateField('gameMode', jsonData.gameMode, 'number');
      this.validateEnums();
    } else {
      log.warn(__filename, `loadData(${jsonData})`, 'Unable to load JSON data into MazeBase object: ' + JSON.stringify(jsonData));
    }
  }

  /**
   * Increments the players move count by one.
   */
  public addMove() {
    this.lastUpdated = Date.now();
    this.moveCount++;
  }

  /**
   * Increments the player move count by the given number.
   * In some situations, the game server may need to increment by more than one.
   * @param number - the number of moves to add to player's move count
   *
   */
  // TODO: This is probably deprecated...
  public addMoves(moves: number) {
    this.lastUpdated = Date.now();
    this.moveCount = this.moveCount + moves;
  }

  /**
   * Increment the Backtrack Counter by 1
   */
  public addBacktrack() {
    this.backtrackCount++;
    this.lastUpdated = Date.now();
  }

  /**
   * Calculate and return the total game score.  All games start with 1000
   * points.  Then:
   *
   * Add bonusPoints (awarded when trophies are added)
   * Subtract moveCount
   * Subtract backtrackCount * 2
   *
   * gameResults generally reflected via trophies, but special cases:
   * - ABANDONED: Score reset to zero
   * - OUT_OF_TIME: Score reset to zero
   *
   *
   * @returns number - the total score for the game
   */
  public getTotalScore(): number {
    if (this.gameResult === GAME_RESULTS.ABANDONED || this.gameResult === GAME_RESULTS.OUT_OF_TIME) {
      return 0;
    } else {
      // all game start with 1000 points
      let total = 1000;

      total += this.bonusPoints;
      total -= this.moveCount;
      total -= this.backtrackCount * 2;

      return total;
    }
  }

  /**
   * Validate that enumeration values passed from json data match
   * values stored in the actual enumerations
   *
   * @returns boolean - true on successful validation
   * @throws Validation Error
   */
  private validateEnums(): boolean {
    const messages = new Array<string>();

    if (!GAME_RESULTS[this.gameResult]) {
      messages.push(`gameResult value (${this.gameResult}) not found within Enums.GAME_RESULTS`);
    }

    if (!GAME_MODES[this.gameMode]) {
      messages.push(`gameMode value (${this.gameMode}) not found within Enums.GAME_MODES`);
    }

    if (messages.length > 0) {
      const error = new Error(messages.join(' :: '));
      log.error(__filename, `validateEnums()`, 'Validation Error ->', error);
      throw error;
    } else {
      log.trace(__filename, 'validateEnums()', 'Enumeration values validated.');
    }

    return true;
  }

  /**
   * Return the current value of gameMode
   */
  public get GameMode(): GAME_MODES {
    return this.gameMode;
  }

  /**
   * Set gameMode value to the given value
   */
  public set GameMode(mode: GAME_MODES) {
    this.gameMode = mode;
  }

  /**
   * Returns the last time (Date.now()) the score object was updated
   * @returns number
   */
  public get LastUpdated(): number {
    return this.lastUpdated;
  }

  /**
   * Sets BotId to associate with this score
   */
  public set BotId(botId: string) {
    this.botId = botId;
  }

  /**
   * @returns BotId for the bot associated with this score
   */
  public get BotId(): string {
    return this.botId;
  }

  /**
   * BacktrackCount represents the number of times a bot has
   * re-entered a maze cell.  Used for trophies and bonus scoring
   */
  public get BacktrackCount(): number {
    return this.backtrackCount;
  }

  /**
   * @return string - the MazeId associated with this score
   */
  public get MazeId(): string {
    return this.mazeId;
  }

  /**
   * Set the MazeId for this score
   * @param mazeId, string - a generated MazeId in the format of "height:width:challenge:name"
   *
   */
  public set MazeId(value: string) {
    this.mazeId = value;
  }

  /**
   * @returns string - The TeamId associated with this score
   */
  public get TeamId(): string {
    return this.teamId;
  }

  /**
   * Sets the TeamId associated with this store to the given string
   * @param string - The GUID of a specific team
   */
  public set TeamId(value: string) {
    this.teamId = value;
  }

  /**
   * @returns string - a GameId GUID generated by the game server
   */
  public get GameId(): string {
    return this.gameId;
  }

  /**
   * Set the GameId GUID (generally done by the game server)
   * @param string - a GUID GameId
   */
  public set GameId(value: string) {
    this.gameId = value;
  }

  /**
   * @param number - returns the game round (Note: Not currently used)
   */
  public get GameRound(): number {
    return this.gameRound;
  }

  /**
   * Set's the GameRound to the given value
   * @param number - the Game Round (Note: Not currently used)
   */
  public set GameRound(round: number) {
    this.gameRound = round;
  }

  /**
   * @return number - the total number of moves made by the player.
   */
  public get MoveCount(): number {
    return this.moveCount;
  }

  /**
   * @returns - the current number of bonus points accumulated
   */
  public get BonusPoints(): number {
    return this.bonusPoints;
  }

  /**
   * Sets the total number of bonus points to the given value.
   * @param number - bonus point value to apply
   */
  public set BonusPoints(value: number) {
    this.lastUpdated = Date.now();
    this.bonusPoints = value;
  }

  /**
   * Sets the total number of bonus points to the given value.
   * @param number - bonus point value to apply
   */
  public set addBonusPoints(value: number) {
    this.lastUpdated = Date.now();
    this.bonusPoints += value;
  }

  /**
   * @returns an enumerated value from Enums.GAME_RESULTS representing the game result
   */
  public get GameResult(): GAME_RESULTS {
    return this.gameResult;
  }

  /**
   * Set the GameResult to one of the values in Enums.GAME_RESULTS
   */
  public set GameResult(value: GAME_RESULTS) {
    this.lastUpdated = Date.now();
    this.gameResult = value;
  }

  public get Id(): string {
    return this.id;
  }
}

export default Score;

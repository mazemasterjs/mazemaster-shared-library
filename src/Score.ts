import { GAME_MODES, GAME_RESULTS, TROPHY_IDS } from './Enums';
import Logger from '@mazemasterjs/logger';
import { ObjectBase } from './ObjectBase';
import ITrophyStub from './Interfaces/ITrophyStub';

const log = Logger.getInstance();

export class Score extends ObjectBase {
  /**
   * Attempts to load the given JSON Object into a new score object
   *
   * @param jsonData
   */
  public static fromJson(jsonData: any): Score {
    const score: Score = new Score('', '', '', GAME_MODES.NONE);
    score.logDebug(__filename, `fromJson(${jsonData})`, 'Attempting to populate ScoreBase from jsonData...');

    if (jsonData !== undefined) {
      score.id = score.validateDataField('id', jsonData.id, 'string');
      score.mazeId = score.validateDataField('mazeId', jsonData.mazeId, 'string');
      score.teamId = score.validateDataField('teamId', jsonData.teamId, 'string');
      score.gameId = score.validateDataField('teamId', jsonData.gameId, 'string');
      score.botId = score.validateDataField('botId', jsonData.botId, 'string');
      score.gameMode = score.validateEnumField('gameMode', 'GAME_MODES', GAME_MODES, jsonData.gameMode);
      score.gameRound = score.validateDataField('teamId', jsonData.gameRound, 'number');
      score.gameResult = score.validateEnumField('gameResult', 'GAME_RESULTS', GAME_RESULTS, jsonData.gameResult);
      score.moveCount = score.validateDataField('moveCount', jsonData.moveCount, 'number');
      score.backtrackCount = score.validateDataField('backtrackCount', jsonData.backtrackCount, 'number');
      score.trophyStubs = score.validateDataField('trophyStubs', jsonData.trophyStubs, 'array');
      score.bonusPoints = score.validateDataField('bonusPoints', jsonData.bonusPoints, 'number');
      score.lastUpdated = score.validateDataField('lastUpdated', jsonData.lastUpdated, 'number');
    } else {
      log.warn(__filename, `loadData(${jsonData})`, 'Unable to load JSON data into MazeBase object: ' + JSON.stringify(jsonData));
    }
    return score;
  }

  protected id: string;
  protected gameId: string;
  protected mazeId: string;
  protected teamId: string;
  protected botId: string;
  protected gameMode: GAME_MODES;
  protected gameRound: number;
  protected gameResult: GAME_RESULTS;
  protected moveCount: number;
  protected backtrackCount: number;
  protected trophyStubs: Array<ITrophyStub>;
  protected bonusPoints: number;
  protected lastUpdated: number;

  constructor(gameId: string, mazeId: string, teamId: string, gameMode: GAME_MODES, botId?: string) {
    super();
    this.id = this.generateId();
    this.gameId = gameId;
    this.mazeId = mazeId;
    this.teamId = teamId;
    this.gameMode = gameMode;
    this.botId = botId ? botId : '';
    this.gameRound = 1;
    this.gameResult = GAME_RESULTS.NONE;
    this.moveCount = 0;
    this.backtrackCount = 0;
    this.trophyStubs = new Array<ITrophyStub>();
    this.bonusPoints = 0;
    this.lastUpdated = Date.now();
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
  }

  /**
   * Calculate and return the total game score.  All games start with 1000
   * points.  Then:
   *
   * Add bonusPoints (awarded during gameplay, usually via trophies)
   * Subtract (moveCount - backtrackCount)
   * Subtract (backtrackCount * 2)
   *
   * gameResults generally reflected via trophies, but special cases:
   * - ABANDONED: Score reset to zero
   * - OUT_OF_TIME: Score reset to zero
   *
   *
   * @returns number - the total score for the game
   */
  public getTotalScore(): number {
    // read the base-score modifier from environment config
    let BASE_SCORE = 1000;
    if (process.env.BASE_SCORE !== undefined) {
      BASE_SCORE = parseInt(process.env.BASE_SCORE, 10);
    } else {
      log.warn(__dirname, 'getTotalScore()', 'WARNING: BASE_SCORE ENV-VAR IS NOT DEFINED. Defaulting to 1000.');
    }

    if (this.gameResult === GAME_RESULTS.ABANDONED || this.gameResult === GAME_RESULTS.OUT_OF_TIME) {
      return 0;
    } else {
      // all games start with 1000 points
      const btMod = this.backtrackCount * 2;
      const mcMod = this.moveCount - this.backtrackCount;

      return BASE_SCORE + this.bonusPoints - mcMod - btMod;
    }
  }

  /**
   * Grants a trophy by increasing the count or adding a stub to the given array
   *
   * @param trophyEnum number - An enumeration value from Enums.TROPHY_IDS
   * @param trophyStubs Array<ITrophyStub> - Array of stubs to to add the trophy to.
   * @returns number - current count of the trophy added
   */
  public addTrophy(trophyEnum: TROPHY_IDS): number {
    const trophyName = TROPHY_IDS[this.validateEnumField('trophyId', 'TROPHY_IDS', TROPHY_IDS, trophyEnum)];
    log.trace(__filename, `addTrophy(${trophyEnum})`, `Adding ${trophyName} to trophyStubs array.`);

    // find the trophy in the array
    let tStub = this.trophyStubs.find((ts: ITrophyStub) => {
      return ts.id === trophyName;
    });

    // increment count if found
    if (tStub !== undefined) {
      tStub.count++;
    } else {
      // otherwise add a new one to the array
      tStub = { id: trophyName, count: 1 };
      this.trophyStubs.push(tStub);
    }

    // return the array
    return tStub.count;
  }

  /**
   * Returns the count (number of times awarded) of the
   * trophy with the given TrophyId from Enums.TROPHY_IDS
   *
   * @param trophyId (Enums.TROPHY_IDS) - The Id of the trophy to get a count of
   */
  public getTrophyCount(trophyId: TROPHY_IDS): number {
    log.trace(__filename, 'getTrophyCount(trophyId: number)', `Getting count of trophyId ${TROPHY_IDS[trophyId]}.`);

    // find the trophy in the array
    const tStub = this.trophyStubs.find((ts: ITrophyStub) => {
      return ts.id === TROPHY_IDS[trophyId];
    });

    // return count or 0 if the trophy isn't in the array
    return tStub === undefined ? 0 : tStub.count;
  }

  /**
   * Return the trophy stubs associated with this score
   */
  public get Trophies(): Array<ITrophyStub> {
    return this.trophyStubs;
  }

  /**
   * Sets the total number of bonus points to the given value.
   * @param number - bonus point value to apply
   */
  public addBonusPoints(value: number) {
    this.bonusPoints += value;
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
   * @returns an enumerated value from Enums.GAME_RESULTS representing the game result
   */
  public get GameResult(): GAME_RESULTS {
    return this.gameResult;
  }

  /**
   * Set the GameResult to one of the values in Enums.GAME_RESULTS
   */
  public set GameResult(value: GAME_RESULTS) {
    this.gameResult = value;
  }

  public get LastUpdated(): number {
    return this.lastUpdated;
  }
  public set LastUpdated(updateTime: number) {
    this.lastUpdated = updateTime;
  }

  public get Id(): string {
    return this.id;
  }
}

export default Score;

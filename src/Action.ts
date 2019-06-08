import { COMMANDS, DIRS } from './Enums';
import { Engram } from './Engram';
import { ObjectBase } from './ObjectBase';
import { IAction } from './Interfaces/IAction';
import ITrophyStub from './Interfaces/ITrophyStub';

export class Action extends ObjectBase {
  /**
   * Static function to contstruct action directly from JSON
   *
   * @param jsonData
   */
  public static fromJson(jsonData: IAction): Action {
    const action = new Action();
    action.command = action.validateEnumField('command', 'COMMANDS', COMMANDS, jsonData.command);
    action.direction = action.validateEnumField('direction', 'DIRS', DIRS, jsonData.direction);
    action.engram = action.validateDataField('engram', jsonData.engram, 'object');
    action.outcomes = action.validateDataField('outcomes', jsonData.outcomes, 'array');
    action.score = action.validateDataField('score', jsonData.score, 'number');
    action.moveCount = action.validateDataField('moveCount', jsonData.score, 'number');
    action.botCohesion = action.validateDataField('botCohesion', jsonData.botCohesion, 'array');
    return action;
  }

  public command: COMMANDS;
  public direction: DIRS;
  public engram: Engram;
  public outcomes: Array<string>;
  public score: number;
  public moveCount: number;
  public trophies: Array<ITrophyStub>;
  public botCohesion: Array<number>;

  constructor() {
    super();
    this.command = COMMANDS.NONE;
    this.direction = DIRS.NONE;
    this.engram = new Engram();
    this.outcomes = new Array<string>();
    this.score = 0;
    this.moveCount = 0;
    this.trophies = new Array<ITrophyStub>();
    this.botCohesion = new Array<number>();
  }

  /**
   * Returns a simple JSON stub of Action data
   */
  public getStub(): object {
    const stub: IAction = {
      command: this.command,
      direction: this.direction,
      engram: this.engram,
      outcomes: this.outcomes,
      score: this.score,
      moveCount: this.moveCount,
      trophies: this.trophies,
      botCohesion: this.botCohesion,
    };

    return stub;
  }
}

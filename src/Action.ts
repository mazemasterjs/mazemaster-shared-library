import { COMMANDS, DIRS } from './Enums';
import { Engram } from './Engram';
import { ObjectBase } from './ObjectBase';
import { IAction } from './Interfaces/IAction';
import ITrophyStub from './Interfaces/ITrophyStub';
import Cell from './Cell';

export class Action extends ObjectBase {
  /**
   * Static function to contstruct action directly from JSON
   *
   * @param jsonData
   */
  public static fromJson(jsonData: IAction): Action {
    const action = new Action(0, 0, '');
    action.command = action.validateEnumField('command', 'COMMANDS', COMMANDS, jsonData.command);
    action.direction = action.validateEnumField('direction', 'DIRS', DIRS, jsonData.direction);
    action.engram = action.validateDataField('engram', jsonData.engram, 'object');
    action.outcomes = action.validateDataField('outcomes', jsonData.outcomes, 'array');
    action.score = action.validateDataField('score', jsonData.score, 'number');
    action.moveCount = action.validateDataField('moveCount', jsonData.score, 'number');
    action.botCohesion = action.validateDataField('botCohesion', jsonData.botCohesion, 'array');
    action.changedCells = action.validateDataField('changedCells', jsonData.changedCells, 'array');
    return action;
  }

  public command: COMMANDS;
  public direction: DIRS;
  public message: string;
  public engram: Engram;
  public outcomes: Array<string>;
  public score: number;
  public moveCount: number;
  public trophies: Array<ITrophyStub>;
  public botCohesion: Array<number>;
  public changedCells: Array<Cell>;

  constructor(command: COMMANDS, direction: DIRS, message: string) {
    super();
    this.command = command;
    this.direction = direction;
    this.message = message;
    this.engram = new Engram();
    this.outcomes = new Array<string>();
    this.score = 0;
    this.moveCount = 0;
    this.trophies = new Array<ITrophyStub>();
    this.botCohesion = new Array<number>();
    this.changedCells = new Array<Cell>();
  }

  /**
   * Returns a simple JSON stub of Action data
   */
  public getStub(): object {
    const stub: IAction = {
      command: this.command,
      direction: this.direction,
      message: this.message,
      engram: this.engram,
      outcomes: this.outcomes,
      score: this.score,
      moveCount: this.moveCount,
      trophies: this.trophies,
      botCohesion: this.botCohesion,
      changedCells: this.changedCells,
    };

    return stub;
  }
}

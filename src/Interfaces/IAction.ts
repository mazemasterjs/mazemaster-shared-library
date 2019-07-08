import { COMMANDS, DIRS } from '../Enums';
import { Engram } from '../Engram';
import ITrophyStub from './ITrophyStub';
import Cell from '../Cell';

export interface IAction {
  command: COMMANDS;
  direction: DIRS;
  message: string;
  engram: Engram;
  outcomes: Array<string>;
  score: number;
  moveCount: number;
  trophies: Array<ITrophyStub>;
  botCohesion: Array<number>;
  changedCells: Array<Cell>;
}

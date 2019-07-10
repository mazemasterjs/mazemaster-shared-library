import { COMMANDS, DIRS } from '../Enums';
import { Engram } from '../Engram';
import ITrophyStub from './ITrophyStub';
import CellBase from '../CellBase';

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
  changedCells: Array<CellBase>;
  playerLife: number;
}

import { COMMANDS, DIRS } from '../Enums';
import { Engram } from '../Engram';
import ITrophyStub from './ITrophyStub';

export interface IAction {
  command: COMMANDS;
  direction: DIRS;
  engram: Engram;
  outcomes: Array<string>;
  score: number;
  moveCount: number;
  trophies: Array<ITrophyStub>;
  botCohesion: Array<number>;
}

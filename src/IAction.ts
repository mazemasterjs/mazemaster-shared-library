import { PLAYER_STATES } from './Enums';
import { Engram } from './Engram';
import { Score } from './Score';
import { Location } from './Location';
import { Trophy } from './Trophy';

export interface IAction {
  action: string;
  direction: string;
  engram: Engram;
  location: Location;
  mazeId: string;
  score: Score;
  playerState: PLAYER_STATES;
  outcome: Array<string>;
  trophies: Array<Trophy>;
  botCohesion: Array<number>;
}

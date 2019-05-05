import { PLAYER_STATES, TROPHY_IDS } from './Enums';
import { Engram } from './Engram';
import { Score } from './Score';
import { Location } from './Location';

export interface IAction {
  action: string;
  direction: string;
  engram: Engram;
  location: Location;
  mazeId: string;
  score: Score;
  playerState: PLAYER_STATES;
  outcome: Array<string>;
  trophies: Map<TROPHY_IDS, number>;
  botCohesion: Array<number>;
}

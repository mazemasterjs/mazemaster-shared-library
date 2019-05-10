import { PLAYER_STATES } from './Enums';
import { Engram } from './Engram';
import { Score } from './Score';
import { Location } from './Location';
import ITrophyStub from './ITrophyStub';

export interface IAction {
  action: string;
  direction: string;
  engram: Engram;
  location: Location;
  mazeId: string;
  score: Score;
  playerState: PLAYER_STATES;
  outcome: Array<string>;
  trophies: Array<ITrophyStub>;
  botCohesion: Array<number>;
}

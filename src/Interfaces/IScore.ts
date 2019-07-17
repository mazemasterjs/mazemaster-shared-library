import { GAME_MODES, GAME_RESULTS } from '../Enums';
import ITrophyStub from './ITrophyStub';

export interface IScore {
  id: string;
  gameId: string;
  mazeId: string;
  teamId: string;
  botId: string;
  gameMode: GAME_MODES;
  gameRound: number;
  gameResult: GAME_RESULTS;
  moveCount: number;
  backtrackCount: number;
  trophyStubs: Array<ITrophyStub>;
  bonusPoints: number;
  totalScore: number;
  lastUpdated: number;
}

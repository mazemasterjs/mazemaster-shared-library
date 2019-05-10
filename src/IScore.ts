import { GAME_RESULTS } from './Enums';

export interface IScore {
  mazeId: string;
  teamId: string;
  gameId: string;
  botId: string;
  gameRound: number;
  lastUpdated: number;
  id: string;
  gameResult: GAME_RESULTS;
  moveCount: number;
  backtrackCount: number;
  bonusPoints: number;
}

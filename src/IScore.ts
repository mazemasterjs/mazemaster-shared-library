import { GAME_MODES, GAME_RESULTS } from './Enums';

export interface IScore {
  mazeId: string;
  teamId: string;
  gameId: string; // multiple scores can be saved under the same gameId - one for each game round
  botId: string;
  gameRound: number;
  lastUpdated: number;
  id: string;
  gameResult: GAME_RESULTS;
  moveCount: number;
  backtrackCount: number;
  bonusPoints: number;
  gameMode: GAME_MODES;
}

import { GAME_MODES, GAME_STATES } from './Enums';
import { IMazeStub } from './IMazeStub';
import { Score } from './Score';

// games require at least a team (multi-player) or bot (single-player) assigned, but can have both
export interface IGameStub {
  botId: string;
  gameId: string;
  gameMode: GAME_MODES;
  gameState: GAME_STATES;
  mazeStub: IMazeStub;
  score: Score;
  teamId: string;
  url: string;
}

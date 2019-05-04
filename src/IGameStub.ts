import { GAME_STATES } from './Enums';
import { IMazeStub } from './IMazeStub';
import { Team } from './Team';
import { Score } from './Score';

export interface IGameStub {
  gameId: string;
  gameState: GAME_STATES;
  mazeStub: IMazeStub;
  score: Score;
  team: Team;
  url: string;
}

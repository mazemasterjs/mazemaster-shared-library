/**
 * Interface for Maze Stub Data - Used when working with lists of mazes.
 */
export interface IMazeStub {
  id: string;
  height: number;
  width: number;
  challenge: number;
  name: string;
  seed: string;
  note: string;
  lastUpdated: number;
}

export default IMazeStub;

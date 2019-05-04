/**
 * Interface for Maze Stub Data - Used when working with lists of mazes.
 */
export interface IMazeStub {
  challenge: number;
  height: number;
  id: string;
  name: string;
  seed: string;
  url: string;
  width: number;
}

export default IMazeStub;

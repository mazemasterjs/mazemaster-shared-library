import { expect } from 'chai';
import Maze from '../src/Maze';
import Logger from '@mazemasterjs/logger';

Logger.getInstance().LogLevel = 4;

// test cases
describe(__filename + ' - MazeBase Tests', () => {
  let maze: Maze;

  it(`Maze.generate() should create a new maze with ID: '3:3:3:temp'`, () => {
    maze = new Maze().generate(3, 3, 3, 'temp', 'temp');
    expect(maze.Id).to.equal('3:3:3:temp');
  });

  it(`Maze.generate() should create a new maze with ID: '3:3:3:temp'`, () => {
    const mazeData = JSON.stringify(maze);
    const loadedMaze = new Maze(JSON.parse(mazeData));
    expect(loadedMaze.Id).to.equal('3:3:3:temp');
  });

  it(`Maze.generate() should create a new maze with ID: '3:3:3:temp'`, () => {
    const mazeData = JSON.stringify(maze);
    const loadedMaze = new Maze();
    loadedMaze.loadData(JSON.parse(mazeData));
    expect(loadedMaze.Id).to.equal('3:3:3:temp');
  });
});

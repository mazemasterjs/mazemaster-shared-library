import { expect } from 'chai';
import Maze from '../src/Maze';
import Logger from '@mazemasterjs/logger';
import MazeBase from '../src/MazeBase';

Logger.getInstance().LogLevel = 4;

// test cases
describe(__filename + ' - MazeBase Tests', () => {
  let maze: Maze;

  it(`Maze.generate() should create a new maze with ID: '3:3:3:temp'`, () => {
    maze = new Maze().generate(3, 3, 3, 'temp', 'temp');
    expect(maze.Id).to.equal('3:3:3:temp');
  });

  it(`mazeBase.loadData(maze:Maze) should instantiate with the same properties as maze:Maze`, () => {
    const mazeBase = new MazeBase();
    mazeBase.loadData(maze);
    expect(mazeBase.Id).to.equal(maze.Id);
  });

  it(`mazeBase.loadData(jsonData:any) should instantiate with the same properties as maze:Maze`, () => {
    const mazeBase = new MazeBase();
    mazeBase.loadData(maze);
    mazeBase.loadData(JSON.parse(JSON.stringify(maze)));
    expect(mazeBase.Id).to.equal(maze.Id);
  });

  it(`new MazeBase(maze:Maze) should instantiate with the same properties as maze:Maze`, () => {
    const mazeBase = new MazeBase(maze);
    expect(mazeBase.Id).to.equal(maze.Id);
  });

  it(`new MazeBase(jsonData:any) should instantiate with the same properties as maze:Maze`, () => {
    const mazeBase = new MazeBase(maze);
    expect(mazeBase.Id).to.equal(maze.Id);
  });

  it(`new Maze(mazeBase:MazeBase) should instantiate with the same properties as mazeBase:MazeBase`, () => {
    const mazeBase = new MazeBase(maze);
    const newMaze = new Maze(mazeBase);
    expect(newMaze.Id).to.equal(mazeBase.Id);
  });

  it(`new Maze(jsonData:any) should instantiate with the same properties as mazeBase:MazeBase`, () => {
    const mazeBase = new MazeBase(maze);
    const newMaze = new Maze(JSON.parse(JSON.stringify(mazeBase)));
    expect(newMaze.Id).to.equal(mazeBase.Id);
  });
});

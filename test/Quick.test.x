import { expect } from 'chai';
import { LOG_LEVELS, Logger } from '@mazemasterjs/logger';
import { Maze } from '../src/Maze';
import MazeLoc from '../src/MazeLoc';

// test cases
describe(__filename + ' - Quick Tests', () => {
  Logger.getInstance().LogLevel = LOG_LEVELS.DEBUG;

  const maze: Maze = new Maze().generate(15, 60, 10, 'NewTrapTest', 'asdfasdfsad');

  it(`should pass`, () => {
    console.log(maze.generateTextRender(true, new MazeLoc(5, 3)));
    return expect(true).to.be.true;
  });
});

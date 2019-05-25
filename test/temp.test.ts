import { expect } from 'chai';
import Maze from '../src/Maze';

// test cases
describe(__filename + ' - Maze Tests', () => {
  it(`Maze.generate() should create a new maze with ID: '3:3:3:temp'`, () => {
    const maze = new Maze().generate(3, 3, 3, 'temp', 'temp');
    expect(maze.Id).to.equal('3:3:3:temp');
  });
});

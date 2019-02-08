import { Maze } from '../src/Maze';
import { expect } from 'chai';
import Logger from '../src/Logger';
import { LOG_LEVELS } from '../src/Logger';

require('dotenv').config();
let log = Logger.getInstance().setLogLevel(LOG_LEVELS.DEBUG);

// test cases
describe('Maze Tests', () => {
    let height = 25;
    let width = 25;
    let challenge = 10;
    let seed = 'Unit-Test-Maze-1';
    let maze: Maze;

    it(`Maze.generate() should create a new maze. '${seed}'`, () => {
        maze = new Maze().generate(height, width, `${seed}`, challenge);
        expect(maze.Seed).to.equal(seed);
    });
});

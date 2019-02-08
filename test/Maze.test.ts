import { Maze } from '../src/Maze';
import { expect } from 'chai';
import Logger from '../src/Logger';
import { LOG_LEVELS } from '../src/Logger';

let log = Logger.getInstance().setLogLevel(LOG_LEVELS.TRACE);

// test cases
describe('Maze Tests', () => {
    let height = 5;
    let width = 6;
    let challenge = 1;
    let seed = 'Unit-Test-Maze';
    let maze: Maze;

    it(`Maze.generate() should create a new maze. '${seed}'`, () => {
        maze = new Maze().generate(height, width, `${seed}`, challenge);
        console.log(maze.TextRender);
        expect(maze.Seed).to.equal(seed);
    });
});

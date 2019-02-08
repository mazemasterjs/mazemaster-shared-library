import { Maze } from '../src/Maze';
import { expect } from 'chai';
import Logger, { LOG_LEVELS } from '../src/Logger';

const log = Logger.getInstance();
log.setLogLevel(LOG_LEVELS.TRACE);

describe('Position Tests', () => {
    let height = 3;
    let width = 3;
    let challenge = 1;
    let seed = 'Unit-Test-Maze';
    let maze: Maze;

    it(`Maze.generate() should create a new maze. '${seed}'`, () => {
        maze = new Maze().generate(height, width, `${seed}`, challenge);
        console.log(maze.TextRender);
        expect(maze.Seed).to.equal(seed);
    });
});

import { Maze } from '../src/Maze';
import { expect } from 'chai';
import Logger from '../src/Logger';
import { LOG_LEVELS } from '../src/Logger';
import { MD5 as hash } from 'object-hash';
import Cell from '../src/Cell';
import Position from '../src/Position';

require('dotenv').config();
Logger.getInstance().setLogLevel(LOG_LEVELS.TRACE);

// test cases
describe('Maze Tests', () => {
    let height = 25;
    let width = 25;
    let challenge = 10;
    let seed = 'Unit-Test-Maze-1';
    let cell: Cell;
    let note1: string = 'This is a unit test.';
    let note2: string = 'This is another unit test.';
    let maze: Maze;
    let mazeId: string = '25:25:10:Unit-Test-Maze-1';
    let mazeHash: string = 'a90407b34a552744ad24f50379656bf8';

    it(`Maze.generate() should create a small, simple maze.`, () => {
        let littleMaze: Maze = new Maze().generate(3, 3, seed, 1);
        expect(littleMaze.Id).to.equal('3:3:1:' + seed);
    });

    it(`Maze.generate() should create a new maze with ID: '${mazeId}'`, () => {
        maze = new Maze().generate(height, width, seed, challenge);
        expect(maze.Id).to.equal(mazeId);
    });

    it(`Maze ID should match pattern 'HEIGHT:WIDTH:CHALLENGE:SEED' (${mazeId})`, () => {
        expect(maze.Id).to.equal(maze.Height + ':' + maze.Width + ':' + maze.ChallengeLevel + ':' + maze.Seed);
    });

    it(`Maze [${mazeId}] MD5 Hash should match: '${mazeHash}'`, () => {
        let jsonMaze = JSON.stringify(maze);
        expect(hash(jsonMaze)).to.equal(mazeHash);
    });

    it(`Maze.getCell(-1, -1) should return error`, () => {
        let cPos = new Position(-1, -1);
        expect(function() {
            maze.getCell(cPos);
        }).to.throw('Invalid cell coordinates given: [-1, -1].');
    });

    it(`Maze.getCell(0,0) should return cell`, () => {
        cell = maze.getCell(new Position(0, 0));
        expect(cell.getPosition().toString()).to.equal('0, 0');
    });

    it(`Cell.addNote(note) should add notes to the cell's notes array.`, () => {
        cell.addNote(note1);
        cell.addNote(note2);
        let notes: Array<string> = cell.getNotes();
        expect(notes[0] + notes[1]).to.equal(note1 + note2);
    });

    it(`Cell.addVisit() should record a move through the cell.`, () => {
        cell.addVisit(1);
        cell.addVisit(2);
        cell.addVisit(3);
        expect(cell.getLastVisitMoveNum()).to.equal(3);
    });

    it(`Cell.getVisitCount() should return the number of cell visits.`, () => {
        cell.addVisit(11);
        cell.addVisit(12);
        cell.addVisit(13);
        expect(cell.getVisitCount()).to.equal(6);
    });

    it(`New maze from JSON data should match maze [${mazeId}]`, () => {
        let oldJson: string = JSON.stringify(maze);
        let newMaze: Maze = new Maze(JSON.parse(oldJson));
        let newJson = JSON.stringify(newMaze);
        expect(newJson).to.equal(oldJson);
    });
});

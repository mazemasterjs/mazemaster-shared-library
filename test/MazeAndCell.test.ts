import {Maze} from '../src/Maze';
import {expect} from 'chai';
import {Logger, LOG_LEVELS} from '@mazemasterjs/logger';
import {MD5 as hash} from 'object-hash';
import Cell from '../src/Cell';
import Location from '../src/Location';
import {CELL_TAGS, CELL_TRAPS, DIRS} from '../src/Enums';

require('dotenv').config();

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
    let mazeHash: string = '40ceb6b23b66e520d75fe59d1b32ea11';

    it(`Maze.generate() should create a small, simple maze.`, () => {
        let littleMaze: Maze = new Maze().generate(3, 3, 1, seed);
        expect(littleMaze.Id).to.equal('3:3:1:' + seed);
    });

    it(`Maze.generate() should create a new maze with ID: '${mazeId}'`, () => {
        let lastLevel: LOG_LEVELS = Logger.getInstance().LogLevel;
        Logger.getInstance().LogLevel = LOG_LEVELS.DEBUG;
        maze = new Maze().generate(height, width, challenge, seed);
        expect(maze.Id).to.equal(mazeId);
        Logger.getInstance().LogLevel = lastLevel;
    });

    it(`Maze ID should match pattern 'HEIGHT:WIDTH:CHALLENGE:SEED' (${mazeId})`, () => {
        expect(maze.Id).to.equal(maze.Height + ':' + maze.Width + ':' + maze.ChallengeLevel + ':' + maze.Seed);
    });

    it(`Maze [${mazeId}] MD5 Hash should match: '${mazeHash}'`, () => {
        let jsonMaze = JSON.stringify(maze);
        expect(hash(jsonMaze)).to.equal(mazeHash);
    });

    it(`Maze.Note should set the maze's note.`, () => {
        maze.Note = note1;
        expect(maze.Note).to.equal(note1);
    });

    it(`Maze.getCell(-1, -1) should return error`, () => {
        let cPos = new Location(-1, -1);
        expect(function() {
            maze.getCell(cPos);
        }).to.throw('Invalid cell coordinates given: [-1, -1].');
    });

    it(`Maze.getCell(0,0) should return cell`, () => {
        cell = maze.getCell(new Location(0, 0));
        expect(cell.Location.toString()).to.equal('0, 0');
    });

    it(`cell.Exits for Cell(0, 0) should not include WEST.`, () => {
        expect(!!(cell.Exits & DIRS.WEST)).to.equal(false);
    });

    it(`cell.addExit(DIRS.EAST) should add an exit to the EAST.`, () => {
        cell.addExit(DIRS.EAST, maze.Cells);
        expect(!!(cell.Exits & DIRS.EAST)).to.equal(true);
    });

    it(`cell.removeExit(DIRS.EAST) should remove the exit to the EAST.`, () => {
        cell.removeExit(DIRS.EAST, maze.Cells);
        expect(!!(cell.Exits & DIRS.EAST)).to.equal(false);
    });

    it(`Cell.Tags(0) should reset cell tags.`, () => {
        cell.Tags = 0;
        expect(cell.Tags).to.equal(0);
    });

    it(`Cell.Tags(CARVED + START) should set cell.Tags to 9.`, () => {
        cell.Tags = CELL_TAGS.CARVED + CELL_TAGS.START;
        expect(cell.Tags).to.equal(9);
    });

    it(`Cell.removeTag(START) should set cell.Tags to 8.`, () => {
        cell.removeTag(CELL_TAGS.START);
        expect(cell.Tags).to.equal(8);
    });

    it(`Cell.Traps(0) should set cell.Traps to 0.`, () => {
        cell.Trap = 0;
        expect(cell.Trap).to.equal(0);
    });

    it(`Cell.Traps(CELL_TRAPS.BEARTRAP) should set cell.Traps to 2.`, () => {
        cell.Trap = CELL_TRAPS.BEARTRAP;
        expect(cell.Trap).to.equal(2);
    });

    it(`Cell.addNote(note) should add notes to the cell's notes array.`, () => {
        cell.addNote(note1);
        cell.addNote(note2);
        let notes: Array<string> = cell.Notes();
        expect(notes[0] + notes[1]).to.equal(note1 + note2);
    });

    it(`Cell.addVisit() should record a move through the cell.`, () => {
        cell.addVisit(1);
        cell.addVisit(2);
        cell.addVisit(3);
        expect(cell.LastVisitMoveNum()).to.equal(3);
    });

    it(`Cell.getVisitCount() should return the number of cell visits.`, () => {
        cell.addVisit(11);
        cell.addVisit(12);
        cell.addVisit(13);
        expect(cell.VisitCount()).to.equal(6);
    });

    it(`New maze from JSON data should match maze [${mazeId}]`, () => {
        let oldJson: string = JSON.stringify(maze);
        let newMaze: Maze = new Maze(JSON.parse(oldJson));
        let newJson = JSON.stringify(newMaze);
        expect(newJson).to.equal(oldJson);
    });
});

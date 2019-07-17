import { IMazeStub } from '../src/Interfaces/IMazeStub';
import { Maze } from '../src/Maze';
import { expect } from 'chai';
import { LOG_LEVELS, Logger } from '@mazemasterjs/logger';
import { MD5 as hash } from 'object-hash';
import { Cell } from '../src/Cell';
import { MazeLoc } from '../src/MazeLoc';
import { CELL_TAGS, CELL_TRAPS, DIRS } from '../src/Enums';

// test cases
describe(__filename + ' - Maze Tests', () => {
  const height = 25;
  const width = 25;
  const challenge = 10;
  const seed = 'UTMaze1';
  const name = 'Unit-Test-Maze-1';
  const timestamp = Date.now();
  let cell: Cell;
  const note1: string = 'This is a unit test.';
  const note2: string = 'This is another unit test.';
  let maze: Maze;
  const mazeId: string = `${height}:${width}:${challenge}:${seed}`;
  const mazeHash: string = 'dde2dddcfb88003ebf7db4b920c52232';
  const expectedMazeStub: IMazeStub = {
    id: mazeId,
    height,
    width,
    challenge,
    name,
    seed,
    note: '',
    lastUpdated: timestamp,
  };

  const tinyMaze = new Maze().generate(3, 3, 1, 'Tiny', 'Maze');

  it(`Maze.generate(0, 3, 3, 'unit', 'test') should return error`, () => {
    expect(() => {
      new Maze().generate(0, 3, 3, 'unit', 'test');
    }).to.throw();
  });

  it(`Maze.generate(3, 0, 3, 'unit', 'test') should return error`, () => {
    expect(() => {
      new Maze().generate(3, 0, 3, 'unit', 'test');
    }).to.throw();
  });

  it(`Maze.generate(3, 3, 0, 'unit', 'test') should return error`, () => {
    expect(() => {
      new Maze().generate(3, 3, 0, 'unit', 'test');
    }).to.throw();
  });

  it(`Maze.generate(3, 3, 3, 'u', 'test') should return error`, () => {
    expect(() => {
      new Maze().generate(3, 3, 3, 'u', 'test');
    }).to.throw();
  });

  it(`Maze.generate(3, 3, 3, 'unit', 't') should return error`, () => {
    expect(() => {
      new Maze().generate(3, 3, 3, 'unit', 't');
    }).to.throw();
  });

  it(`Maze.generate() - maze should have numeric height of 3`, () => {
    const mazeTypeTest: Maze = new Maze().generate(3, 3, 3, 'Test', 'Test');
    expect(typeof mazeTypeTest.Height === 'string');
  });

  it(`Maze.generate() - should coerce string height to number`, () => {
    const ttHt: any = '3';
    const mazeTypeTest: Maze = new Maze().generate(ttHt, 3, 3, 'Test', 'Test');
    expect(typeof mazeTypeTest.Height === 'number');
  });

  it(`Maze.generate() - should coerce string width to number`, () => {
    const ttWd: any = '3';
    const mazeTypeTest: Maze = new Maze().generate(3, ttWd, 3, 'Test', 'Test');
    expect(typeof mazeTypeTest.Height === 'number');
  });

  it(`Maze.generate() - should coerce string challenge to number`, () => {
    const ttCl: any = '3';
    const mazeTypeTest: Maze = new Maze().generate(3, 3, ttCl, 'Test', 'Test');
    expect(typeof mazeTypeTest.ChallengeLevel === 'number');
  });

  it(`Maze.generate() should create a small, simple maze.`, () => {
    const littleMaze: Maze = new Maze().generate(3, 3, 1, name, seed);
    expect(littleMaze.Id).to.equal('3:3:1:' + seed);
  });

  it(`Maze.generate() should create a new maze with ID: '${mazeId}'`, () => {
    const lastLevel: LOG_LEVELS = Logger.getInstance().LogLevel;
    Logger.getInstance().LogLevel = LOG_LEVELS.DEBUG;
    maze = new Maze().generate(height, width, challenge, name, seed);
    expect(maze.Id).to.equal(mazeId);
    Logger.getInstance().LogLevel = lastLevel;
  });

  it(`Maze.getMazeStub() should match expectedMazeStub`, () => {
    const stub = maze.getMazeStub();
    stub.lastUpdated = timestamp; // force timestamp (set on Maze instantiation) to match
    expect(hash(JSON.stringify(stub))).to.equal(hash(JSON.stringify(expectedMazeStub)));
  });

  it(`Maze ID should match pattern 'HEIGHT:WIDTH:CHALLENGE:SEED' (${mazeId})`, () => {
    expect(maze.Id).to.equal(maze.Height + ':' + maze.Width + ':' + maze.ChallengeLevel + ':' + maze.Seed);
  });

  it(`Maze name should match provided name (${name})`, () => {
    expect(maze.Name).to.equal(name);
  });

  it(`Maze [${mazeId}] MD5 Hash should match: '${mazeHash}'`, () => {
    const mazeObj = JSON.parse(JSON.stringify(maze));
    delete mazeObj.lastUpdated;
    const jsonMaze = JSON.stringify(mazeObj);

    expect(hash(jsonMaze)).to.equal(mazeHash);
  });

  it(`Maze.Note should set the maze's note.`, () => {
    maze.Note = note1;
    expect(maze.Note).to.equal(note1);
  });

  it(`Maze.LastUpdated = timestamp should set maze.lastUpdated to timestamp `, () => {
    maze.LastUpdated = timestamp;
    expect(maze.LastUpdated).to.equal(timestamp);
  });

  it(`New maze from invalid JSON data should return error`, () => {
    expect(() => {
      const oldJson: string = JSON.stringify(maze);
      const oldMazeData = JSON.parse(oldJson);
      delete oldMazeData.width;
      new Maze(oldMazeData).Note = 'Should not get here.';
    }).to.throw();
  });

  it(`New maze from JSON data should match maze [${mazeId}]`, () => {
    const oldJson: string = JSON.stringify(tinyMaze);
    const newMaze: Maze = new Maze(JSON.parse(oldJson));
    const newJson = JSON.stringify(newMaze);
    expect(hash(newJson)).to.equal(hash(oldJson));
  });

  it(`Maze.getCell(-1, -1) should return error`, () => {
    const cPos = new MazeLoc(-1, -1);
    expect(() => {
      maze.getCell(cPos);
    }).to.throw('Invalid cell coordinates given: [-1, -1].');
  });

  it(`Maze.getCell(0,0) should return cell`, () => {
    cell = maze.getCell(new MazeLoc(0, 0));
    expect(cell.Location.toString()).to.equal('0, 0');
  });

  it(`cell.Exits for Cell(0, 0) should not include WEST.`, () => {
    expect(!!(cell.Exits & DIRS.WEST)).to.equal(false);
  });

  it(`Cell.clearTags() should reset cell.Tags to CELL_TAGS.NONE.`, () => {
    cell.clearTags();
    expect(cell.Tags).to.equal(CELL_TAGS.NONE);
  });

  it(`Cell.Tags(CARVED + START) should set cell.Tags to ${CELL_TAGS.CARVED + CELL_TAGS.START}.`, () => {
    cell.addTag(CELL_TAGS.CARVED);
    cell.addTag(CELL_TAGS.START);
    expect(cell.Tags).to.equal(CELL_TAGS.CARVED + CELL_TAGS.START);
  });

  it(`Cell.removeTag(START) should set cell.Tags to 8.`, () => {
    cell.removeTag(CELL_TAGS.START);
    expect(cell.Tags).to.equal(8);
  });

  it(`Cell.clearTraps should set cell.Traps to ${CELL_TRAPS.NONE}.`, () => {
    cell.clearTraps();
    expect(cell.Traps).to.equal(CELL_TRAPS.NONE);
  });

  it(`Cell.addTrap(CELL_TRAPS.MOUSETRAP) should set cell.Traps to equal ${CELL_TRAPS.MOUSETRAP}.`, () => {
    cell.addTrap(CELL_TRAPS.MOUSETRAP);
    expect(cell.Traps).to.equal(CELL_TRAPS.MOUSETRAP);
  });

  it(`Cell.addTrap(CELL_TRAPS.PIT) should set cell.Traps to equal ${CELL_TRAPS.MOUSETRAP + CELL_TRAPS.PIT}.`, () => {
    cell.addTrap(CELL_TRAPS.PIT);
    expect(cell.Traps).to.equal(CELL_TRAPS.MOUSETRAP + CELL_TRAPS.PIT);
  });

  it(`Cell.removeTrap(CELL_TRAPS.MOUSETRAP) should set cell.Traps to equal ${CELL_TRAPS.PIT}.`, () => {
    cell.removeTrap(CELL_TRAPS.MOUSETRAP);
    expect(cell.Traps).to.equal(1);
  });

  it(`Cell.addNote(note) should add notes to the cell's notes array.`, () => {
    cell.addNote(note1);
    cell.addNote(note2);
    const notes: Array<string> = cell.Notes;
    expect(notes[0] + notes[1]).to.equal(note1 + note2);
  });

  it(`Cell.addVisit() should record a move through the cell.`, () => {
    cell.addVisit(1);
    cell.addVisit(2);
    cell.addVisit(3);
    expect(cell.LastVisited).to.equal(3);
  });

  it(`Cell.getVisitCount() should return the number of cell visits.`, () => {
    cell.addVisit(11);
    cell.addVisit(12);
    cell.addVisit(13);
    expect(cell.VisitCount).to.equal(6);
  });
});

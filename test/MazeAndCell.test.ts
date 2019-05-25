import { IMazeStub } from '../src/IMazeStub';
import { Maze } from '../src/Maze';
import { expect } from 'chai';
import { LOG_LEVELS, Logger } from '@mazemasterjs/logger';
import { MD5 as hash } from 'object-hash';
import Cell from '../src/Cell';
import Location from '../src/Location';
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
  const mazeHash: string = '20e19650272e7d943f6491fed1786a63';
  const expectedMazeStub: IMazeStub = {
    challenge,
    height,
    id: mazeId,
    lastUpdated: timestamp,
    name,
    seed,
    url: '',
    width,
  };

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
    expect(JSON.stringify(stub)).to.equal(JSON.stringify(expectedMazeStub));
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
    const oldJson: string = JSON.stringify(maze);
    const newMaze: Maze = new Maze(JSON.parse(oldJson));
    const newJson = JSON.stringify(newMaze);
    expect(newJson).to.equal(oldJson);
  });

  it(`Maze.getCell(-1, -1) should return error`, () => {
    const cPos = new Location(-1, -1);
    expect(() => {
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
    const notes: Array<string> = cell.Notes();
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
});

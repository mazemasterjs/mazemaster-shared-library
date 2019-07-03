import Cell from './Cell';
import { ObjectBase } from './ObjectBase';
import { MazeLoc } from './MazeLoc';
import { Logger } from '@mazemasterjs/logger';
import IMazeStub from './Interfaces/IMazeStub';
import { CELL_TAGS, CELL_TRAPS, DIRS, SET_EXIT_MODES } from './Enums';
import { reverseDir } from './Helpers';

const log = Logger.getInstance();

export class MazeBase extends ObjectBase {
  protected id: string;
  protected height: number;
  protected width: number;
  protected challenge: number;
  protected name: string;
  protected seed: string;
  protected cells: Cell[][];
  protected textRender: string;
  protected startCell: MazeLoc;
  protected finishCell: MazeLoc;
  protected shortestPathLength: number;
  protected trapCount: number;
  protected note: string;
  protected lastUpdated: number;

  /**
   * Instantiates or new or pre-loaded Maze object
   * @param data - JSON Object containing stubbed maze data
   */
  constructor(jsonData?: any) {
    super();

    this.id = '';
    this.height = 0;
    this.width = 0;
    this.challenge = 0;
    this.name = '';
    this.seed = '';
    this.cells = new Array<Array<Cell>>();
    this.textRender = '';
    this.startCell = new MazeLoc(0, 0);
    this.finishCell = new MazeLoc(0, 0);
    this.shortestPathLength = 0;
    this.trapCount = 0;
    this.note = '';
    this.lastUpdated = Date.now();

    if (jsonData !== undefined) {
      this.loadData(jsonData);
    }
  }

  /**
   * Calculates and returns neighboring cell in the given direction
   * TODO: Consider checking neighbor validity here?
   *
   * @param cell
   * @param dir
   */
  public getNeighbor(cell: Cell, dir: DIRS): Cell {
    const method = `getNeighbor(${cell.Location.toString()}, ${DIRS[dir]})`;
    // move location of next cell according to random direction
    let row = cell.Location.row;
    let col = cell.Location.col;

    this.logTrace(__filename, `getNeighbor(${cell.Location.toString()}, ${DIRS[dir]}`, 'Getting neighboring cell.');

    // find coordinates of the cell in the given direction
    if (dir < DIRS.EAST) {
      row = dir === DIRS.NORTH ? row - 1 : row + 1;
    }
    if (dir > DIRS.SOUTH) {
      col = dir === DIRS.EAST ? col + 1 : col - 1;
    }

    // let's throw a warning if an invalid neighbor is returned since we might want to change this some day
    if (row < 0 || row >= this.cells.length || col < 0 || col >= this.cells[0].length) {
      this.logTrace(__filename, method, `Invalid neighbor position: ${row}, ${col}`);
    } else {
      this.logTrace(__filename, method, `Neighbor: ${row}, ${col}`);
    }

    return this.getCell(new MazeLoc(row, col));
  }

  /**
   *
   * @param {row: number, col: number} pos
   * @return {Cell} The requested Cell
   * @throws {Error} Out Of Bounds error if given position is outside of cells array's bounds.
   */
  public getCell(pos: { row: number; col: number }): Cell;

  /**
   * Attempts to find and return the cell in the given position
   *
   * @param {MazeLoc} pos
   * @return {Cell} The requested Cell
   * @throws {Error} Out Of Bounds error if given position is outside of cells array's bounds.
   */
  public getCell(pos: MazeLoc): Cell {
    if (pos.row < 0 || pos.row >= this.cells.length || pos.col < 0 || pos.col > this.cells[0].length) {
      const error = new Error(`Invalid cell coordinates given: [${pos.toString()}].`);
      log.error(__filename, `getCell${pos.row}, ${pos.col}`, 'Cell range out of bounds, throwing error.', error);
      throw error;
    }

    this.logTrace(__filename, `getCell(${pos.toString()}`, 'Returning cell.');

    return this.cells[pos.row][pos.col];
  }

  /**
   * Returns a text rendering of the maze as a grid of 3x3
   * character blocks.
   */
  // tslint:disable-next-line: no-shadowed-variable
  public generateTextRender(forceRegen: boolean, playerPos?: MazeLoc) {
    const H_WALL = '+---';
    const S_DOOR = '+ S ';
    const F_DOOR = '+ F ';
    const V_WALL = '|';
    const H_DOOR = '+   ';
    const V_DOOR = ' ';
    const CENTER = '   ';
    const SOLUTION = ' . ';
    const ROW_END = '+';
    const AVATAR_TRAPPED = '>@<';
    const AVATAR = ' @ ';

    // TODO: Turn back on render caching after solver work is completed
    if (this.textRender.length > 0 && !forceRegen) {
      return this.textRender;
    }

    let textMaze = '';

    // walk the array, one row at a time
    for (let y = 0; y < this.height; y++) {
      for (let subRow = 0; subRow < 3; subRow++) {
        let row = '';

        // each text-cell is actually three
        for (let x = 0; x < this.width; x++) {
          const cell: Cell = this.cells[y][x];
          switch (subRow) {
            case 0:
              // only render north walls on first row
              if (y === 0) {
                if (!!(cell.Tags & CELL_TAGS.START)) {
                  row += S_DOOR;
                } else {
                  row += !!(cell.Exits & DIRS.NORTH) ? H_DOOR : H_WALL;
                }
              }
              break;
            case 1:
              // only render west walls on first column
              if (x === 0) {
                row += !!(cell.Exits & DIRS.WEST) ? V_DOOR : V_WALL;
              }

              // render room center - check for cell properties and render appropriately
              let cellFill = CENTER;
              const tags = cell.Tags;
              const traps = cell.Traps;
              if (!!(tags & CELL_TAGS.PATH)) {
                cellFill = SOLUTION;
              }

              // add a trap icon if one is in this cell
              if (traps > 0) {
                cellFill = this.getCellTrapIcon(traps);
              }

              // override cell fill with avatar location when player position is given
              if (playerPos !== undefined && this.cells[y][x].Location.equals(playerPos)) {
                if (traps !== 0) {
                  cellFill = AVATAR_TRAPPED;
                } else {
                  cellFill = AVATAR;
                }
              }

              row += cellFill;

              // always render east walls (with room center)
              row += !!(cell.Exits & DIRS.EAST) ? V_DOOR : V_WALL;

              break;
            case 2:
              // always render south walls
              if (!!(cell.Tags & CELL_TAGS.FINISH)) {
                row += F_DOOR;
              } else {
                row += !!(cell.Exits & DIRS.SOUTH) ? H_DOOR : H_WALL;
              }
              break;
          }
        }

        if (subRow !== 1) {
          row += ROW_END;
        }

        // end the line - only draw the top subRow if on the first line
        if ((subRow === 0 && y === 0) || subRow > 0) {
          textMaze += row + '\n';
        }
      }
    }

    this.textRender = textMaze.toString();
    return textMaze;
  }

  public get LastUpdated(): number {
    return this.lastUpdated;
  }
  public set LastUpdated(timestamp: number) {
    this.lastUpdated = timestamp;
  }
  public get Height(): number {
    return this.height;
  }
  public get Width(): number {
    return this.width;
  }
  public get Name(): string {
    return this.name;
  }
  public get Seed(): string {
    return this.seed;
  }
  public get ChallengeLevel(): number {
    return this.challenge;
  }
  public get Cells(): Cell[][] {
    return this.cells;
  }
  public get CellCount(): number {
    return this.cells.length * this.cells[0].length;
  }
  public get TextRender(): string {
    return this.textRender;
  }
  public get Id(): string {
    return this.id;
  }
  public get StartCell(): MazeLoc {
    return this.startCell;
  }
  public get FinishCell(): MazeLoc {
    return this.finishCell;
  }
  public get ShortestPathLength(): number {
    return this.shortestPathLength;
  }
  public get TrapCount(): number {
    return this.trapCount;
  }
  public get Note(): string {
    return this.note;
  }
  public set Note(value: string) {
    this.note = value;
  }

  /**
   * Validates and loads the given JSON object into the current MazeBase instance
   *
   * @param jsonData
   */
  public loadData(jsonData: any) {
    this.logDebug(__filename, `loadData(${jsonData})`, 'Loading data...');

    if (jsonData !== undefined) {
      this.id = this.validateDataField('id', jsonData.id, 'string');
      this.height = this.validateDataField('height', jsonData.height, 'number');
      this.width = this.validateDataField('width', jsonData.width, 'number');
      this.challenge = this.validateDataField('challenge', jsonData.challenge, 'number');
      this.name = this.validateDataField('name', jsonData.name, 'string');
      this.seed = this.validateDataField('seed', jsonData.seed, 'string');
      this.cells = this.buildCellsArray(this.validateDataField('cells', jsonData.cells, 'array'));
      this.textRender = this.validateDataField('textRender', jsonData.textRender, 'string', true);
      this.startCell = this.validateDataField('startCell', jsonData.startCell, 'object');
      this.finishCell = this.validateDataField('finishCell', jsonData.finishCell, 'object');
      this.shortestPathLength = this.validateDataField('shortestPathLength', jsonData.shortestPathLength, 'number');
      this.trapCount = this.validateDataField('trapCount', jsonData.trapCount, 'number');
      this.note = this.validateDataField('note', jsonData.note, 'string');
      this.lastUpdated = this.validateDataField('lastUpdated', jsonData.lastUpdated, 'number');
      this.logDebug(__filename, `loadData(${jsonData})`, 'Load successful.');
    } else {
      log.warn(__filename, `loadData(${jsonData})`, 'Unable to load JSON data into MazeBase object: ' + JSON.stringify(jsonData));
    }
  }

  /**
   * Returns only basic maze data - for use
   * with lists, scores, etc
   */
  public getMazeStub(): IMazeStub {
    return {
      id: this.id,
      height: this.height,
      width: this.width,
      challenge: this.challenge,
      name: this.name,
      seed: this.seed,
      note: this.note,
      lastUpdated: this.lastUpdated,
    };
  }

  /**
   * Adds exit to a cell if exit doesn't already exist.
   * Also adds neighboring exit to valid, adjoining cell.
   *
   * @param dir
   * @param cells
   * @returns boolean
   */
  public addExit(dir: DIRS, cell: Cell): boolean {
    this.logTrace(
      __filename,
      `addExit(${DIRS[dir]})`,
      `Calling setExit(ADD, ${DIRS[dir]}) from [${cell.Location.toString()}]. Existing exits: ${cell.listExits()}`,
    );
    return this.setExit(SET_EXIT_MODES.ADD, dir, cell);
  }

  /**
   * Removes exit from the given cell and it's adjoining neighbor.
   *
   * @param {DIRS} dir
   * @param {Cell} cell
   * @returns boolean
   */
  public removeExit(dir: DIRS, cell: Cell): boolean {
    this.logTrace(
      __filename,
      `removeExit(${DIRS[dir]})`,
      `Calling setExit(REMOVE, ${DIRS[dir]}) from [${cell.Location.toString()}]. Existing exits: ${cell.listExits()}`,
    );
    return this.setExit(SET_EXIT_MODES.REMOVE, dir, cell);
  }

  /**
   * Rebuild the maze array from the given data to re-hydrate each individual Cell object
   *
   * @param {Array<Array<Cell>>} cells
   */
  private buildCellsArray(cells: Array<Array<Cell>>): Array<Array<Cell>> {
    this.logTrace(__filename, `buildCellsArray(Array<Array<Cell>>)`, 'Attempting to rebuild cells array from JSON data...');

    const newCells: Array<Array<Cell>> = new Array(this.height);

    for (let row: number = 0; row < this.height; row++) {
      const cols: Array<Cell> = new Array<Cell>();
      for (let col: number = 0; col < this.width; col++) {
        const cData = JSON.parse(JSON.stringify(cells[row][col]));
        const cell: Cell = new Cell(cData);
        this.logTrace(__filename, 'buildCellsArray(Array<Array<Cell>>)', `Adding cell in position [${row}, ${col}]`);
        cols.push(cell);
      }
      newCells[row] = cols;
    }
    return newCells;
  }

  /**
   * Adds or Removes cell exits, depending on SET_EXIT_MODES value.
   * Also adds or removes opposite exit from valid, adjoining cell.
   * Only trace logging - this is called frequently by recursive generation
   * routines.
   *
   * @param dir
   * @param cells
   * @returns boolean
   */
  private setExit(mode: SET_EXIT_MODES, dir: DIRS, cell: Cell): boolean {
    const modeName = mode === SET_EXIT_MODES.ADD ? 'ADD' : 'REMOVE';
    const dirName = DIRS[dir];
    let validMove = true; // only set to true if valid adjoining cell exits to open an exit to

    this.logTrace(__filename, `setExit(${modeName}, ${dirName})`, `Setting exits in [${cell.Location.toString()}]. Existing exits: ${cell.listExits()}.`);

    if (mode === SET_EXIT_MODES.ADD ? !(cell.Exits & dir) : !!(cell.Exits & dir)) {
      let nPos = new MazeLoc(-1, -1); // locate an adjoining cell - must open exit on both sides

      switch (dir) {
        case DIRS.NORTH:
          validMove = cell.Location.row > 0;
          if (validMove) {
            nPos = new MazeLoc(cell.Location.row - 1, cell.Location.col);
          }
          break;
        case DIRS.SOUTH:
          validMove = cell.Location.row < this.Cells.length;
          if (validMove) {
            nPos = new MazeLoc(cell.Location.row + 1, cell.Location.col);
          }
          break;
        case DIRS.EAST:
          validMove = cell.Location.col < this.Cells[0].length;
          if (validMove) {
            nPos = new MazeLoc(cell.Location.row, cell.Location.col + 1);
          }
          break;
        case DIRS.WEST:
          validMove = cell.Location.col > 0;
          if (validMove) {
            nPos = new MazeLoc(cell.Location.row, cell.Location.col - 1);
          }
          break;
      }

      if (validMove) {
        this.logTrace(__filename, 'setExit()', `Valid direction, setting exit from [${cell.Location.toString()}] into [${nPos.row}, ${nPos.col}]`);
        cell.Exits = mode === SET_EXIT_MODES.ADD ? (cell.Exits += dir) : (cell.Exits -= dir);
        this.logTrace(__filename, `setExit(${modeName}, ${dirName})`, `Exits set in cell [${cell.Location.toString()}]. Existing exits: ${cell.listExits()}.`);

        const neighbor: Cell = this.getNeighbor(cell, dir);
        neighbor.Exits = mode === SET_EXIT_MODES.ADD ? (neighbor.Exits += reverseDir(dir)) : (neighbor.Exits -= dir);
        this.logTrace(
          __filename,
          `setExit(${modeName}, ${dirName})`,
          `Reverse exit (${dirName} -> ${
            DIRS[reverseDir(dir)]
          }) set in adjoining cell [${neighbor.Location.toString()}]. Exits: ${neighbor.listExits()}, Tags: ${neighbor.listTags()}.`,
        );
      } else {
        log.warn(__filename, `setExit(${modeName}, ${dirName})`, `Invalid adjoining cell location: [${nPos.toString()}]`);
      }
    } else {
      log.warn(
        __filename,
        `setExit(${modeName}, ${dirName})`,
        `Invalid action in cell [${cell.Location.toString()}]. Exit ${
          mode === SET_EXIT_MODES.ADD ? 'already exists' : 'not found'
        }. Cell exits: ${cell.listExits()}`,
      );
    }

    return validMove;
  } // setExit

  /**
   * Return appropriate trap icon for text-renderer given
   * a cell.Traps bitwise value.
   *
   * @param cellTraps
   */
  private getCellTrapIcon(cellTraps: number): string {
    if (!!(cellTraps & CELL_TRAPS.MOUSETRAP)) {
      return '>m<';
    }
    if (!!(cellTraps & CELL_TRAPS.PIT)) {
      return '>p<';
    }
    if (!!(cellTraps & CELL_TRAPS.FLAMETHROWER)) {
      return '>f<';
    }
    if (!!(cellTraps & CELL_TRAPS.FRAGILE_FLOOR)) {
      return '>F<';
    }
    if (!!(cellTraps & CELL_TRAPS.POISON_DART)) {
      return '>d<';
    }
    if (!!(cellTraps & CELL_TRAPS.TELEPORTER)) {
      return '>T<';
    }
    if (!!(cellTraps & CELL_TRAPS.TARPIT)) {
      return '>t<';
    }
    if (!!(cellTraps & CELL_TRAPS.DEADFALL)) {
      return '>D<';
    }
    if (!!(cellTraps & CELL_TRAPS.CHEESE)) {
      return '>C<';
    }

    return '';
  }
}

export default MazeBase;

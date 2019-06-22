import Cell from './Cell';
import { ObjectBase } from './ObjectBase';
import { MazeLoc } from './MazeLoc';
import { Logger } from '@mazemasterjs/logger';
import IMazeStub from './Interfaces/IMazeStub';
import { CELL_TAGS, CELL_TRAPS, DIRS } from './Enums';

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
   * Attempts to find and return the cell in the given position
   *
   * @param pos
   * @throws Out Of Bounds error if given position is outside of cells array's bounds.
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
              if (!!(traps & CELL_TRAPS.MOUSETRAP)) {
                cellFill = '>b<';
              }
              if (!!(traps & CELL_TRAPS.PIT)) {
                cellFill = '>p<';
              }
              if (!!(traps & CELL_TRAPS.FLAMETHROWER)) {
                cellFill = '>f<';
              }
              if (!!(traps & CELL_TRAPS.TARPIT)) {
                cellFill = '>t<';
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
   * Rebuild the maze array from the given data to instantiate
   * each individual Cell object
   * @param cells
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
}

export default MazeBase;

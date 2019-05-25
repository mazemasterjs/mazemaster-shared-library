import Cell from './Cell';
import { ObjectBase } from './ObjectBase';
import { Location } from './Location';
import Logger from '@mazemasterjs/logger';

export class MazeBase extends ObjectBase {
  protected id: string;
  protected height: number;
  protected width: number;
  protected challenge: number;
  protected name: string;
  protected seed: string;
  protected cells: Cell[][];
  protected textRender: string;
  protected startCell: Location;
  protected finishCell: Location;
  protected shortestPathLength: number;
  protected trapCount: number;
  protected note: string;
  protected lastUpdated: number;

  /**
   * Instantiates or new or pre-loaded Maze object
   * @param data - JSON Object containing stubbed maze data
   */
  constructor() {
    super();

    this.id = '';
    this.height = 0;
    this.width = 0;
    this.challenge = 0;
    this.name = '';
    this.seed = '';
    this.cells = new Array<Array<Cell>>();
    this.textRender = '';
    this.startCell = new Location(0, 0);
    this.finishCell = new Location(0, 0);
    this.shortestPathLength = 0;
    this.trapCount = 0;
    this.note = '';
    this.lastUpdated = Date.now();
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
  public get StartCell(): Location {
    return this.startCell;
  }
  public get FinishCell(): Location {
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
   * @param data
   */
  public loadData(data: any) {
    if (data !== undefined) {
      this.id = this.validateField('id', data.id, 'string');
      this.height = this.validateField('height', data.height, 'number');
      this.width = this.validateField('width', data.width, 'number');
      this.challenge = this.validateField('challenge', data.challenge, 'number');
      this.name = this.validateField('name', data.name, 'string');
      this.seed = this.validateField('seed', data.seed, 'string');
      this.cells = this.buildCellsArray(this.validateField('cells', data.cells, 'array'));
      this.textRender = this.validateField('textRender', data.textRender, 'string');
      this.startCell = this.validateField('startCell', data.startCell, 'object');
      this.finishCell = this.validateField('finishCell', data.finishCell, 'object');
      this.shortestPathLength = this.validateField('shortestPathLength', data.shortestPathLength, 'number');
      this.trapCount = this.validateField('trapCount', data.trapCount, 'number');
      this.note = this.validateField('note', data.note, 'string');
      this.lastUpdated = this.validateField('lastUpdated', data.lastUpdated, 'number');
    }
  }

  /**
   * Rebuild the maze array from the given data to instantiate
   * each individual Cell object
   * @param cells
   */
  private buildCellsArray(cells: Array<Array<Cell>>): Array<Array<Cell>> {
    const newCells: Array<Array<Cell>> = new Array(this.height);

    for (let row: number = 0; row < this.height; row++) {
      const cols: Array<Cell> = new Array<Cell>();
      for (let col: number = 0; col < this.width; col++) {
        const cData = JSON.parse(JSON.stringify(cells[row][col]));
        const cell: Cell = new Cell(cData);
        Logger.getInstance().trace(__filename, 'buildCellsArray()', `Adding cell in position [${row}, ${col}]`);
        cols.push(cell);
      }
      newCells[row] = cols;
    }
    return newCells;
  }
}

export default MazeBase;

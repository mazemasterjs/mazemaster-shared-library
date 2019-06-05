import Cell from './Cell';
import { ObjectBase } from './ObjectBase';
import { Location } from './Location';
import { Logger } from '@mazemasterjs/logger';
import IMazeStub from './IMazeStub';

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
    this.startCell = new Location(0, 0);
    this.finishCell = new Location(0, 0);
    this.shortestPathLength = 0;
    this.trapCount = 0;
    this.note = '';
    this.lastUpdated = Date.now();

    if (jsonData !== undefined) {
      this.loadData(jsonData);
    }
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
   * @param jsonData
   */
  public loadData(jsonData: any) {
    this.logDebug(__filename, `loadData(${jsonData})`, 'Loading data...');

    if (jsonData !== undefined) {
      this.id = this.validateField('id', jsonData.id, 'string');
      this.height = this.validateField('height', jsonData.height, 'number');
      this.width = this.validateField('width', jsonData.width, 'number');
      this.challenge = this.validateField('challenge', jsonData.challenge, 'number');
      this.name = this.validateField('name', jsonData.name, 'string');
      this.seed = this.validateField('seed', jsonData.seed, 'string');
      this.cells = this.buildCellsArray(this.validateField('cells', jsonData.cells, 'array'));
      this.textRender = this.validateField('textRender', jsonData.textRender, 'string', true);
      this.startCell = this.validateField('startCell', jsonData.startCell, 'object');
      this.finishCell = this.validateField('finishCell', jsonData.finishCell, 'object');
      this.shortestPathLength = this.validateField('shortestPathLength', jsonData.shortestPathLength, 'number');
      this.trapCount = this.validateField('trapCount', jsonData.trapCount, 'number');
      this.note = this.validateField('note', jsonData.note, 'string');
      this.lastUpdated = this.validateField('lastUpdated', jsonData.lastUpdated, 'number');
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
    this.logDebug(__filename, `buildCellsArray(Array<Array<Cell>>)`, 'Attempting to rebuild cells array from JSON data...');

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

import { CELL_TAGS, CELL_TRAPS, DIRS } from './Enums';
import { Location } from './Location';
import { ObjectBase } from './ObjectBase';
import { Logger } from '@mazemasterjs/logger';
import * as Helpers from './Helpers';

// we'll need a logger...
const log = Logger.getInstance();

export class CellBase extends ObjectBase {
  protected pos: Location;
  protected exits: number;
  protected tags: number;
  protected traps: number;
  protected visits: number;
  protected lastVisit: number;
  protected notes: string[];

  constructor(jsonData?: any) {
    super();
    log.trace(__filename, 'constructor()', 'Instantiating new CellBase.');
    this.pos = new Location(0, 0);
    this.exits = DIRS.NONE;
    this.tags = CELL_TAGS.NONE;
    this.traps = CELL_TRAPS.NONE;
    this.visits = 0;
    this.lastVisit = 0;
    this.notes = new Array<string>();

    if (jsonData !== undefined) {
      this.loadData(jsonData);
    }
  }

  public loadData(jsonData: any) {
    log.trace(__filename, `loadData(${jsonData})`, 'Attempting to populate CellBase from jsonData...');
    if (jsonData !== undefined) {
      this.pos = this.validateField('pos', jsonData.pos, 'object');
      this.exits = this.validateField('exits', jsonData.exits, 'number');
      this.tags = this.validateField('tags', jsonData.tags, 'number');
      this.traps = this.validateField('traps', jsonData.traps, 'number');
      this.visits = this.validateField('visits', jsonData.visits, 'number');
      this.lastVisit = this.validateField('lastVisit', jsonData.lastVisit, 'number');
      this.notes = this.validateField('notes', jsonData.notes, 'array');
    } else {
      log.warn(__filename, `loadData(${jsonData})`, 'Unable to load JSON Data into CellBase: ' + JSON.stringify(jsonData));
    }
  }

  /**
   * Returns the string array containing player-written notes
   */
  public get Notes(): Array<string> {
    return this.notes;
  }

  /**
   * Add a string to the CellBase.notes array
   */
  public addNote(note: string) {
    this.notes.push(note);
    log.debug(__filename, 'addNote()', 'Note added to cell: ' + note);
  }

  /**
   * Returns the bitwise exits value for the current cell
   */
  public get Exits(): number {
    return this.exits;
  }

  /**
   * Returns a string listing all available exit directions
   */
  public listExits(): string {
    return Helpers.listSelectedBitNames(DIRS, this.exits);
  }

  /**
   * Returns an array representing the cells grid coordinates (row, col)
   */
  public get Location(): Location {
    return new Location(this.pos.row, this.pos.col);
  }

  /**
   * Set the cell's grid coordinates
   * @param x
   * @param y
   */
  public set Location(pos: Location) {
    this.pos = pos;
  }

  /**
   * Returns a bitwise integer value representing cell tags
   */
  public get Tags(): number {
    return this.tags;
  }

  /**
   * Returns the bitwise integer value representing cell traps
   */
  public get Traps(): number {
    return this.traps;
  }

  /**
   * Returns list of string values representing cell tags
   */
  public listTags(): string {
    return Helpers.listSelectedBitNames(CELL_TAGS, this.tags);
  }

  /**
   *  Increment the cell's visits counter by one and update lastVisit moveNumber
   */
  public addVisit(moveNumber: number) {
    this.visits++;
    this.lastVisit = moveNumber;
  }

  /**
   * Returns the number of times the cell has been visited
   */
  public get VisitCount(): number {
    return this.visits;
  }

  /**
   * Returns the move number that the cell was last visited on, 0 if never visited.
   */
  public get LastVisited(): number {
    return this.lastVisit;
  }

  /**
   * Returns true if the cell has an exit in the given direction, otherwise... returns !true
   *
   * @param dir - Direction to check for an exit
   * @returns boolean
   */
  public isDirOpen(dir: DIRS): boolean {
    return !!(this.Exits & dir);
  }
}

export default CellBase;

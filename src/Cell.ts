import * as Helpers from './Helpers';
import { CELL_TAGS, CELL_TRAPS, DIRS } from './Enums';
import { Logger } from '@mazemasterjs/logger';
import { Location } from './Location';
import CellBase from './CellBase';

/**
 * Used to determine mode of functions modifying cell exits
 */
enum FN_MODES {
  ADD = 0,
  REMOVE,
}

const log = Logger.getInstance();

/**
 * Represents a single cell in a maze
 */
export class Cell extends CellBase {
  constructor(jsonData?: any) {
    super();
    if (jsonData !== undefined) {
      this.loadData(jsonData);
    }
  }

  /**
   * Adds the given trap to the cell (unless it's already been set)
   *
   * @param trap - A value from Enums.CELL_TRAPS
   */
  public addTrap(trap: CELL_TRAPS) {
    if (!!(this.traps & trap)) {
      log.warn(
        __filename,
        `addTrap(${trap})`,
        `${CELL_TRAPS[trap]} (${trap}) already set in cell [${this.pos.toString()}]. Current traps: ${Helpers.listSelectedBitNames(CELL_TRAPS, this.traps)}`,
      );
    } else {
      this.traps += trap;
      log.warn(__filename, `addTrap(${trap})`, `${CELL_TRAPS[trap]} (${trap}) added to cell [${this.pos.toString()}].`);
    }
  }

  /**
   * Removes the given trap to the cell (unless it's not found)
   *
   * @param trap - A value from Enums.CELL_TRAPS
   */
  public removeTrap(trap: CELL_TRAPS) {
    if (!!(this.traps && CELL_TRAPS)) {
      this.traps -= trap;
      log.trace(
        __filename,
        `removeTrap(${trap})`,
        `${CELL_TRAPS[trap]} (${trap}) removed from cell [${this.pos.toString()}]. Traps left: ${Helpers.listSelectedBitNames(CELL_TRAPS, this.traps)}`,
      );
    } else {
      log.warn(
        __filename,
        `removeTrap(${trap})`,
        `${CELL_TRAPS[trap]} (${trap}) not found in cell [${this.pos.toString()}]. Current traps: ${Helpers.listSelectedBitNames(CELL_TRAPS, this.traps)}`,
      );
    }
  }

  /**
   * Remove all traps
   */
  public clearTraps() {
    this.traps = CELL_TRAPS.NONE;
  }

  /**
   * Adds an Enums.Tag to this cell if it doesn't already exist
   * @param tag
   */
  public addTag(tag: CELL_TAGS) {
    const tagName = CELL_TAGS[tag];

    if (!(this.tags & tag)) {
      this.tags += tag;

      switch (tag) {
        case CELL_TAGS.START:
          // force north exit on start cell - WARNING: do NOT use addExit() for this!
          if (!(this.exits & DIRS.NORTH)) {
            log.trace(
              __filename,
              'addTag(' + tagName + ')',
              `[${this.pos.row}, ${this.pos.col}] has ${tagName} tag. Forcing NORTH exit through edge. Cell exits: ${this.listExits()}`,
            );
            this.exits += DIRS.NORTH;
          }
          break;
        case CELL_TAGS.FINISH:
          // force south exit on finish cell - WARNING: do NOT use addExit() for this, either!
          if (!(this.exits & DIRS.SOUTH)) {
            log.trace(
              __filename,
              'addTag(' + tagName + ')',
              `[${this.pos.row}, ${this.pos.col}] has ${tagName} tag. Forcing SOUTH exit through edge. Cell exits: ${this.listExits()}`,
            );
            this.exits += DIRS.SOUTH;
          }
          break;
      }
      log.trace(__filename, 'addTag(' + tagName + ')', `Tag ${tagName} added to cell [${this.pos.row}, ${this.pos.col}]. Current tags: ${this.listTags()}.`);
    } else {
      log.warn(
        __filename,
        'addTag(' + tagName + ')',
        `Tag ${tagName} already exists in cell [${this.pos.row}, ${this.pos.col}]. Current tags: ${this.listTags()}.`,
      );
    }
  }

  /**
   * Removes a tag from this cell, if it exists
   * @param tag
   */
  public removeTag(tag: CELL_TAGS) {
    const tagName = CELL_TAGS[tag];
    if (!!(this.tags & tag)) {
      this.tags -= tag;
      log.debug(
        __filename,
        'removeTag(' + tagName + ')',
        `Tag ${tagName} removed from cell [${this.pos.row}, ${this.pos.col}]. Current tags: ${this.listTags()}.`,
      );
    } else {
      log.warn(
        __filename,
        'removeTag(' + tagName + ')',
        `Tag ${tagName} not found in cell [${this.pos.row}, ${this.pos.col}]. Current tags: ${this.listTags()}.`,
      );
    }
  }

  /**
   * Removes all cell tags.
   */
  public clearTags() {
    this.tags = CELL_TAGS.NONE;
  }

  /**
   * Return a count of exits available in this cell
   */
  public getExitCount(): number {
    return Helpers.getSelectedBitNames(DIRS, this.exits).length;
  }

  /**
   * Adds exit to a cell if exit doesn't already exist.
   * Also adds neighboring exit to valid, adjoining cell.
   *
   * @param dir
   * @param cells
   * @returns boolean
   */
  public addExit(dir: DIRS, cells: Array<Array<Cell>>): boolean {
    log.trace(__filename, `addExit(${DIRS[dir]})`, `Calling setExit(ADD, ${DIRS[dir]}) from [${this.pos.toString()}]. Existing exits: ${this.listExits()}`);
    return this.setExit(FN_MODES.ADD, dir, cells);
  }

  /**
   * Removes exit to a cell if it exists.
   * Also removes neighboring exit from valid, adjoining cell.
   *
   * @param dir
   * @param cells
   * @returns boolean
   */
  public removeExit(dir: DIRS, cells: Array<Array<Cell>>): boolean {
    log.trace(
      __filename,
      `removeExit(${DIRS[dir]})`,
      `Calling setExit(REMOVE, ${DIRS[dir]}) from [${this.pos.toString()}]. Existing exits: ${this.listExits()}`,
    );
    return this.setExit(FN_MODES.REMOVE, dir, cells);
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
  private setExit(mode: FN_MODES, dir: DIRS, cells: Array<Array<Cell>>): boolean {
    const modeName = mode === FN_MODES.ADD ? 'ADD' : 'REMOVE';
    const dirName = DIRS[dir];
    let validMove = true; // only set to true if valid adjoining cell exits to open an exit to

    log.trace(__filename, `setExit(${modeName}, ${dirName})`, `Setting exits in [${this.pos.toString()}]. Existing exits: ${this.listExits()}.`);

    if (mode === FN_MODES.ADD ? !(this.exits & dir) : !!(this.exits & dir)) {
      let nPos = new Location(-1, -1); // locate an adjoining cell - must open exit on both sides

      switch (dir) {
        case DIRS.NORTH:
          validMove = this.pos.row > 0;
          if (validMove) {
            nPos = new Location(this.pos.row - 1, this.pos.col);
          }
          break;
        case DIRS.SOUTH:
          validMove = this.pos.row < cells.length;
          if (validMove) {
            nPos = new Location(this.pos.row + 1, this.pos.col);
          }
          break;
        case DIRS.EAST:
          validMove = this.pos.col < cells[0].length;
          if (validMove) {
            nPos = new Location(this.pos.row, this.pos.col + 1);
          }
          break;
        case DIRS.WEST:
          validMove = this.pos.col > 0;
          if (validMove) {
            nPos = new Location(this.pos.row, this.pos.col - 1);
          }
          break;
      }

      if (validMove) {
        log.trace(__filename, 'setExit()', `Valid direction, setting exit from [${this.Location.toString()}] into [${nPos.row}, ${nPos.col}]`);
        this.exits = mode === FN_MODES.ADD ? (this.exits += dir) : (this.exits -= dir);

        const neighbor: Cell = cells[nPos.row][nPos.col];

        log.trace(__filename, `setExit(${modeName}, ${dirName})`, `Exits set in cell [${this.pos.toString()}]. Existing exits: ${this.listExits()}.`);

        neighbor.exits = mode === FN_MODES.ADD ? (neighbor.exits += Helpers.reverseDir(dir)) : (neighbor.exits -= dir);
        log.trace(
          __filename,
          `setExit(${modeName}, ${dirName})`,
          `Reverse exit (${dirName} -> ${
            DIRS[Helpers.reverseDir(dir)]
          }) set in adjoining cell [${neighbor.pos.toString()}]. Exits: ${neighbor.listExits()}, Tags: ${neighbor.listTags()}.`,
        );
      } else {
        log.warn(__filename, `setExit(${modeName}, ${dirName})`, `Invalid adjoining cell location: [${nPos.toString()}]`);
      }
    } else {
      log.warn(
        __filename,
        `setExit(${modeName}, ${dirName})`,
        `Invalid action in cell [${this.pos.toString()}]. Exit ${mode === FN_MODES.ADD ? 'already exists' : 'not found'}. Cell exits: ${this.listExits()}`,
      );
    }

    return validMove;
  } // setExit
}

export default Cell;

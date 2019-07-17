import * as Helpers from './Helpers';
import { CELL_TAGS, CELL_TRAPS, DIRS } from './Enums';
import { Logger } from '@mazemasterjs/logger';
import CellBase from './CellBase';

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
      this.logTrace(
        __filename,
        `addTrap(${trap})`,
        `${CELL_TRAPS[trap]} (${trap}) already set in cell [${this.pos.toString()}]. Current traps: ${Helpers.listSelectedBitNames(CELL_TRAPS, this.traps)}`,
      );
    } else {
      this.traps += trap;
      this.logTrace(__filename, `addTrap(${trap})`, `${CELL_TRAPS[trap]} (${trap}) added to cell [${this.pos.toString()}].`);
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
      this.logTrace(
        __filename,
        `removeTrap(${trap})`,
        `${CELL_TRAPS[trap]} (${trap}) removed from cell [${this.pos.toString()}]. Traps left: ${Helpers.listSelectedBitNames(CELL_TRAPS, this.traps)}`,
      );
    } else {
      this.logTrace(
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
            this.logTrace(
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
            this.logTrace(
              __filename,
              'addTag(' + tagName + ')',
              `[${this.pos.row}, ${this.pos.col}] has ${tagName} tag. Forcing SOUTH exit through edge. Cell exits: ${this.listExits()}`,
            );
            this.exits += DIRS.SOUTH;
          }
          break;
      }
      this.logTrace(
        __filename,
        'addTag(' + tagName + ')',
        `Tag ${tagName} added to cell [${this.pos.row}, ${this.pos.col}]. Current tags: ${this.listTags()}.`,
      );
    } else {
      if (!!(tag & CELL_TAGS.MONSTER)) {
        log.debug(
          __filename,
          'addTag(' + tagName + ')',
          `Tag ${tagName} already exists in cell [${this.pos.row}, ${this.pos.col}]. Current tags: ${this.listTags()}.`,
        );
      } else {
        log.warn(
          __filename,
          'addTag(' + tagName + ')',
          `Tag ${tagName} already exists in cell [${this.pos.row}, ${this.pos.col}]. Current tags: ${this.listTags()}.`,
        );
      }
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
      this.logTrace(
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
}

export default Cell;

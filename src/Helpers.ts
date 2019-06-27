import { DIRS } from './Enums';
import { Logger } from '@mazemasterjs/logger';

/**
 * Helper Functions for Maze Master JS
 */

// static class instances
const log = Logger.getInstance();
// const DEFAULT_MAZE_STUB_FILE = path.resolve('data/maze-list.json');

/**
 * Returns string array of the selected (bitwise) values within
 * the given enumeration.
 *
 * @param bitwiseEnum - Only works with bitwise enumerations!
 * @param selectedBits - Number representing the selected bits
 */
export function listSelectedBitNames(bitwiseEnum: object, selectedBits: number): string {
  let ret = '';

  log.trace(__filename, `listSelectedBitNames(${bitwiseEnum}, ${selectedBits}`, 'Listing selected bit names from enumeration.');

  for (const ele in bitwiseEnum) {
    // having a hard time with isNumber(0) for some reason - isNaN(parseInt()) seems more reliable
    if (!isNaN(parseInt(ele, 10))) {
      const bitVal: number = parseInt(ele, 10);
      if (!!(bitVal & selectedBits)) {
        const stringVal: string = (bitwiseEnum as any)[bitVal];
        ret += ret.length === 0 ? stringVal : ', ' + stringVal;
      }
    }
  }

  if (ret.length === 0) {
    ret = 'NONE';
  }
  log.trace(__filename, `listSelectedBitNames(${bitwiseEnum}, ${selectedBits})`, 'Returning selected bit names: ' + ret);
  return ret;
}

/**
 * Returns string array of the selected (bitwise) values within
 * the given enumeration.
 *
 * @param bitwiseEnum - Only works with bitwise enumerations!
 * @param selectedBits - Number representing the selected bits
 */
export function getSelectedBitNames(bitwiseEnum: object, selectedBits: number): string[] {
  log.trace(__filename, `getSelectedBitNames(${bitwiseEnum}, ${selectedBits})`, 'Creating array of selected bit names for enumeration.');
  const ret: string[] = new Array<string>();

  for (const ele in bitwiseEnum) {
    // having a hard time with isNumber(0) for some reason - isNaN(parseInt()) seems more reliable
    if (!isNaN(parseInt(ele, 10))) {
      const bitVal: number = parseInt(ele, 10);
      if (!!(bitVal & selectedBits)) {
        const stringVal: string = (bitwiseEnum as any)[bitVal];
        ret.push(stringVal);
      }
    }
  }

  if (ret.length === 0) {
    ret.push('NONE');
  }
  log.trace(__filename, `getSelectedBitNames(${bitwiseEnum}, ${selectedBits})`, 'Returning array of selected bit names for enumeration.');
  return ret;
}

/**
 * Returns the opposing direction for a given direction
 * @param dir - The Enums.DIRS direction to reverse
 */
export function reverseDir(dir: DIRS): number {
  log.trace(__filename, `getSelectedBitNames(${dir})`, 'Returning reverse of direction ' + DIRS[dir]);

  switch (dir) {
    case DIRS.NORTH:
      return DIRS.SOUTH;
    case DIRS.SOUTH:
      return DIRS.NORTH;
    case DIRS.EAST:
      return DIRS.WEST;
    case DIRS.WEST:
      return DIRS.EAST;
    default:
      return DIRS.NONE;
  }
}

/**
 * Gets and returns the value of the requested environment variable
 * as the given type.
 *
 * @param varName - the name of the environment variable to get
 * @param typeName - tye name of the type to return the value as (string | number)
 */
export function getEnvVar(varName: string, typeName: string): any {
  const val = process.env[varName];

  // first see if the variable was found - if not, let's blow this sucker up
  if (val === undefined) {
    throw doError(`getVar(${varName}, ${typeName})`, 'Configuration Error', `Environment variable not set: ${varName}`);
  }

  // we have a value - log the good news
  log.trace(__filename, `getVar(${varName}, ${typeName})`, `${varName}=${val}`);

  // convert to expect type and return
  switch (typeName) {
    case 'string': {
      return val;
    }
    case 'number': {
      return parseInt(val, 10); // this could blow up, but that's ok since we'd want it to
    }
    default: {
      // we only want numbers or strings...
      doError(`getVar(${varName}, ${typeName})`, 'Argument Error', `Invalid variable type name: ${typeName}. Try 'string' or 'number' instead.`);
    }
  }
}

/**
 * Wrapping log.error to clean things up a little
 *
 * @param method
 * @param title
 * @param message
 */
export function doError(method: string, title: string, message: string): Error {
  const err = new Error(message);
  log.error(__filename, method, title + ' ->', err);
  return err;
}

/**
 * Returns the next cardinal direction, either clockwise or counter-clockwise
 * depending on arguments provided.
 *
 * @param dir Enum.DIRS starting direction
 * @param counterClockwise If true, will return n
 */
export function getNextDir(dir: DIRS, counterClockwise = false): DIRS {
  let newDir = DIRS.NONE;

  switch (dir) {
    case DIRS.NORTH:
      newDir = DIRS.EAST;
      break;
    case DIRS.SOUTH:
      newDir = DIRS.WEST;
      break;
    case DIRS.EAST:
      newDir = DIRS.SOUTH;
      break;
    case DIRS.WEST:
      newDir = DIRS.NORTH;
      break;
  }

  return counterClockwise ? reverseDir(newDir) : newDir;
}

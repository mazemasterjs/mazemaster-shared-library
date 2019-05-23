import { DIRS } from './Enums';
import { Logger } from '@mazemasterjs/logger';
import { TROPHY_IDS } from './Enums';
import { ITrophyStub } from './ITrophyStub';

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

  for (const dir in bitwiseEnum) {
    if (Number(dir)) {
      const bitVal: number = parseInt(dir, 10);
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

  for (const dir in bitwiseEnum) {
    if (Number(dir)) {
      const bitVal: number = parseInt(dir, 10);
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
      return 0;
  }
}

/**
 * Grants a trophy by increasing the count or adding stubs to the given array
 *
 * @param trophyId number - An enumeration value from Enums.TROPHY_IDS
 * @param trophyStubs Array<ITrophyStub> - Array of stubs to to add the trophy to.
 * @returns Array<ITrophyStub>
 */
export function grantTrophy(trophyId: TROPHY_IDS, trophyStubs: Array<ITrophyStub>): Array<ITrophyStub> {
  // first check for existing trophy and increment count
  for (const trophy of trophyStubs) {
    if (trophy.id === trophyId) {
      trophy.count++;
      return trophyStubs;
    }
  }

  // trophy wasn't found, so we have to add a new stub with a count of 1
  const tStub: ITrophyStub = {
    count: 1,
    id: trophyId,
    name: TROPHY_IDS[trophyId],
  };

  // add it to the array
  trophyStubs.push(tStub);

  // return the array
  return trophyStubs;
}

/**
 * Returns the count (number of times awarded) of the
 * trophy with the given TrophyId from Enums.TROPHY_IDS
 *
 * @param trophyId (Enums.TROPHY_IDS) - The Id of the trophy to get a count of
 */
export function getTrophyCount(trophyId: TROPHY_IDS, trophyStubs: Array<ITrophyStub>): number {
  for (const trophy of trophyStubs) {
    if (trophy.id === trophyId) {
      return trophy.count;
    }
  }
  return 0;
}

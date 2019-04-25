import {format as fmt} from 'util';
import path from 'path';
import {DIRS} from './Enums';
import {Logger} from '@mazemasterjs/logger';

/**
 * Helper Functions for Maze Master JS
 */

// static class instances
const log = Logger.getInstance();
const DEFAULT_MAZE_STUB_FILE = path.resolve('data/maze-list.json');

/**
 * Returns string array of the selected (bitwise) values within
 * the given enumeration.
 *
 * @param bitwiseEnum - Only works with bitwise enumerations!
 * @param selectedBits - Number representing the selected bits
 */
export function listSelectedBitNames(bitwiseEnum: Object, selectedBits: number): string {
    log.trace(__filename, fmt('listSelectedBitNames(%s, %d)', bitwiseEnum, selectedBits), 'Listing selected bit names from enumeration.');
    let ret: string = '';

    for (const dir in bitwiseEnum) {
        if (Number(dir)) {
            let bitVal: number = parseInt(dir);
            if (!!(bitVal & selectedBits)) {
                let stringVal: string = (<any>bitwiseEnum)[bitVal];
                ret += ret.length == 0 ? stringVal : ', ' + stringVal;
            }
        }
    }

    if (ret.length == 0) ret = 'NONE';
    log.trace(__filename, fmt('listSelectedBitNames(%s, %d)', bitwiseEnum, selectedBits), 'Returning selected bit names: ' + ret);
    return ret;
}

/**
 * Returns string array of the selected (bitwise) values within
 * the given enumeration.
 *
 * @param bitwiseEnum - Only works with bitwise enumerations!
 * @param selectedBits - Number representing the selected bits
 */
export function getSelectedBitNames(bitwiseEnum: Object, selectedBits: number): Array<string> {
    log.trace(__filename, fmt('getSelectedBitNames(%s, %d)', bitwiseEnum, selectedBits), 'Creating array of selected bit names for enumeration.');
    let ret: Array<string> = new Array<string>();

    for (const dir in bitwiseEnum) {
        if (Number(dir)) {
            let bitVal: number = parseInt(dir);
            if (!!(bitVal & selectedBits)) {
                let stringVal: string = (<any>bitwiseEnum)[bitVal];
                ret.push(stringVal);
            }
        }
    }

    if (ret.length == 0) ret.push('NONE');
    log.trace(__filename, fmt('getSelectedBitNames(%s, %d)', bitwiseEnum, selectedBits), 'Returning array of selected bit names for enumeration.');
    return ret;
}

/**
 * Returns the opposing direction for a given direction
 * @param dir - The Enums.DIRS direction to reverse
 */
export function reverseDir(dir: DIRS): number {
    log.trace(__filename, fmt('getSelectedBitNames(%d)', dir), 'Returning reverse of direction ' + DIRS[dir]);

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

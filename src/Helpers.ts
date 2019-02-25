/**
 * Helper Functions for Maze Master JS
 */
import path from 'path';
import {DIRS} from './Enums';
import {Logger} from '@mazemasterjs/logger';

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

    return ret;
}

/**
 * Returns the opposing direction for a given direction
 * @param dir - The Enums.DIRS direction to reverse
 */
export function reverseDir(dir: DIRS): number {
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

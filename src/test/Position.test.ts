import { Position } from '../Position';
import { expect } from 'chai';
import Logger, { LOG_LEVELS } from '../Logger';

// load local config, if available
require('dotenv').config();

// configure logger
let log = Logger.getInstance();
log.setLogLevel(parseInt(process.env.LOG_LEVEL + ''));

// dump basic config data
log.info(__filename, ' Initializing', 'NODE_ENV=[' + process.env.NODE_ENV + ']');
log.info(__filename, ' Initializing', 'LOG_LEVEL=[' + process.env.LOG_LEVEL + ']');

describe('Position Tests', () => {
    let pos: Position = new Position(1, 2);
    let expectedStr = `col: ${pos.col}, row: ${pos.row}`;

    it(`Position.toString() should return '${expectedStr}'`, () => {
        expect(pos.toString()).to.equal(`${expectedStr}`);
    });

    it(`Position.equals() should return true`, () => {
        expect(pos.equals(new Position(pos.col, pos.row))).to.equal(true);
    });
});

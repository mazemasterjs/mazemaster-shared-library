import * as Helpers from '../src/Helpers';
import {DIRS} from '../src/Enums';
import {expect} from 'chai';

// test cases
describe('Helpers Tests', () => {
    it(`getSelectedBitNames() should return 'EAST'`, () => {
        expect(Helpers.getSelectedBitNames(DIRS, DIRS.EAST)[0]).to.equal('EAST');
    });

    it(`getSelectedBitNames()[0] should return 'EAST'`, () => {
        expect(Helpers.listSelectedBitNames(DIRS, DIRS.EAST)).to.equal('EAST');
    });

    Helpers.reverseDir;
    it(`reverseDir() should return DIRS.NORTH`, () => {
        expect(Helpers.reverseDir(DIRS.SOUTH)).to.equal(DIRS.NORTH);
    });
});

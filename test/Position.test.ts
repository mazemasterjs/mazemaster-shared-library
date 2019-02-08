import { Position } from '../src/Position';
import { expect } from 'chai';

// test cases
describe('Position Tests', () => {
    let pos: Position = new Position(1, 2);
    let expectedStr = `${pos.row}, ${pos.col}`;

    it(`Position.toString() should return '${expectedStr}'`, () => {
        expect(pos.toString()).to.equal(`${expectedStr}`);
    });

    it(`Position.equals() should return true`, () => {
        expect(pos.equals(new Position(pos.row, pos.col))).to.equal(true);
    });
});

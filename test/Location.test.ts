import { Location } from '../src/Location';
import { expect } from 'chai';

// test cases
describe('Location Tests', () => {
    let loc: Location = new Location(1, 2);
    let expectedStr = `${loc.row}, ${loc.col}`;

    it(`Location.toString() should return '${expectedStr}'`, () => {
        expect(loc.toString()).to.equal(`${expectedStr}`);
    });

    it(`Location.equals() should return true`, () => {
        expect(loc.equals(new Location(loc.row, loc.col))).to.equal(true);
    });
});

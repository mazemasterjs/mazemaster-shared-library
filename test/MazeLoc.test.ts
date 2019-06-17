import { MazeLoc } from '../src/MazeLoc';
import { expect } from 'chai';

// test cases
describe(__filename + ' - Location Tests', () => {
  const loc: MazeLoc = new MazeLoc(1, 2);
  const expectedStr = `${loc.row}, ${loc.col}`;

  it(`Location.toString() should return '${expectedStr}'`, () => {
    expect(loc.toString()).to.equal(`${expectedStr}`);
  });

  it(`Location.equals() should return true`, () => {
    expect(loc.equals(new MazeLoc(loc.row, loc.col))).to.equal(true);
  });
});

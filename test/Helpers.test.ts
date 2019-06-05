import * as Helpers from '../src/Helpers';
import { DIRS } from '../src/Enums';
import { expect } from 'chai';

// test cases
describe(__filename + ' - Helpers Tests', () => {
  it(`getSelectedBitNames() should return 'EAST'`, () => {
    expect(Helpers.getSelectedBitNames(DIRS, DIRS.EAST)[0]).to.equal('EAST');
  });

  it(`getSelectedBitNames()[0] should return 'EAST'`, () => {
    expect(Helpers.listSelectedBitNames(DIRS, DIRS.EAST)).to.equal('EAST');
  });

  it(`reverseDir(DIRS.SOUTH) should return DIRS.NORTH`, () => {
    expect(Helpers.reverseDir(DIRS.SOUTH)).to.equal(DIRS.NORTH);
  });

  it(`reverseDir(DIRS.NORTH) should return DIRS.SOUTH`, () => {
    expect(Helpers.reverseDir(DIRS.NORTH)).to.equal(DIRS.SOUTH);
  });

  it(`reverseDir(DIRS.EAST) should return DIRS.WEST`, () => {
    expect(Helpers.reverseDir(DIRS.EAST)).to.equal(DIRS.WEST);
  });

  it(`reverseDir(DIRS.WEST) should return DIRS.EAST`, () => {
    expect(Helpers.reverseDir(DIRS.WEST)).to.equal(DIRS.EAST);
  });

  it(`reverseDir(DIRS.NONE) should return DIRS.NONE`, () => {
    expect(Helpers.reverseDir(DIRS.NONE)).to.equal(DIRS.NONE);
  });
});

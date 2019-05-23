import { Trophy } from '../src/Trophy';
// import { ITrophyStub } from '../src/ITrophyStub';
import { assert, expect } from 'chai';
// import { TROPHY_IDS } from '../src/Enums';

/**
 * Test cases for Team object
 *
 * Note: Direct instantiation is already covered in Game.test.ts
 */
describe('Trophy Tests', () => {
  // team needs trophies

  //   const stubData: any = {
  //     count: 1,
  //     id: TROPHY_IDS.DAZED_AND_CONFUSED,
  //     name: TROPHY_IDS[TROPHY_IDS.DAZED_AND_CONFUSED],
  //   };

  const goodData = {
    id: 'VALID_TEST_TROPHY_ID',
    name: 'VALID TEST TROPHY NAME',
    description: 'VALID TEST TROPHY DESCRIPTIN',
    bonusAward: 1,
    count: 11,
    lastUpdated: 111,
  };

  const badData1 = {
    id: 2,
    name: 'TEST TROPHY NAME [INVALID ID]',
    description: 'TEST TROPHY DESCRIPTION [INVALID ID]',
    bonusAward: 2,
    count: 22,
    lastUpdated: 222,
  };

  const badData2 = {
    id: 'VALID_TEST_TROPHY_ID [MISSING DESCRIPTION]',
    name: 'TEST TROPHY NAME [MISSING DESCRIPTION]',
    bonusAward: 2,
    count: 22,
    lastUpdated: 222,
  };

  let vt: Trophy;

  //   const trophyDataInvalid1 =
  //     '{"id":"TEST_TROPHY_ID_VALID","name":"THIS IS A VALID TEST TROPHY","description":"THIS IS ONLY A TEST TROPHY","bonusAward":333,"count":333,"lastUpdated":333333333}';

  //   const trophyDataInvalid2 =
  //     '{"id":"TEST_TROPHY_ID_VALID","name":"THIS IS A VALID TEST TROPHY","description":"THIS IS ONLY A TEST TROPHY","bonusAward":333,"count":333,"lastUpdated":333333333}';

  before('Instantiate valid Trophy', () => {
    vt = new Trophy(JSON.parse(JSON.stringify(goodData)));
  });

  it(`vt.Id should be ${goodData.id} `, () => {
    return assert(vt.Id === goodData.id);
  });

  it(`vt.Name should be ${goodData.name} `, () => {
    return assert(vt.Name === goodData.name);
  });

  it(`vt.Description should be ${goodData.description} `, () => {
    return assert(vt.Description === goodData.description);
  });

  it(`vt.BonusAward should be ${goodData.bonusAward} `, () => {
    return assert(vt.BonusAward === goodData.bonusAward);
  });

  it(`vt.Count should be ${goodData.count} `, () => {
    return assert(vt.Count === goodData.count);
  });

  it(`vt.LastUpdated should be ${goodData.lastUpdated} `, () => {
    return assert(vt.LastUpdated === goodData.lastUpdated);
  });

  it(`Trophy from badData1 should throw error`, () => {
    expect(() => {
      return new Trophy(JSON.parse(JSON.stringify(badData1))).Id;
    }).to.throw('Invalid object data provided. See @mazemasterjs/shared-library/Trophy for data requirements.');
  });

  it(`Trophy from badData2 should throw error`, () => {
    expect(() => {
      return new Trophy(JSON.parse(JSON.stringify(badData2))).Id;
    }).to.throw('Invalid object data provided. See @mazemasterjs/shared-library/Trophy for data requirements.');
  });
});

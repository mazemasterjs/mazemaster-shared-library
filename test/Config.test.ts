import { Config } from '../src/Config';
import { expect } from 'chai';

// test cases
describe('Config Tests', () => {
  // declare config object
  const config: Config = Config.getInstance();

  it('Config.getInstance() should not return null.', () => {
    return expect(config).not.be.null;
  });

  it('Environment variables should not be undefined.', () => {
    let missingVar = config.HOST_NAME === undefined;
    missingVar = config.HOST_NAME === undefined;
    missingVar = config.HTTP_PORT === undefined;
    missingVar = config.MAZE_MIN_HEIGHT === undefined;
    missingVar = config.MAZE_MAX_HEIGHT === undefined;
    missingVar = config.MAZE_MIN_WIDTH === undefined;
    missingVar = config.MAZE_MAX_WIDTH === undefined;
    missingVar = config.TRAPS_MIN_CHALLENGE === undefined;
    missingVar = config.TRAPS_ON_PATH_MIN_CHALLENGE === undefined;
    missingVar = config.APP_NAME === undefined;
    missingVar = config.MONGO_COL_MAZES === undefined;
    missingVar = config.MONGO_COL_SCORES === undefined;
    missingVar = config.MONGO_COL_TEAMS === undefined;
    missingVar = config.MONGO_CONNSTR === undefined;
    missingVar = config.MONGO_CON_PW === undefined;
    missingVar = config.MONGO_DB === undefined;
    expect(missingVar).to.equal(false);
  });
});

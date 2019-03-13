import {Config} from '../src/Config';
import {expect} from 'chai';

// test cases
describe('Config Tests', () => {
    // declare config object
    let config: Config = Config.getInstance();

    it('Config.getInstance() should not return null.', () => {
        expect(config).not.be.null;
    });

    it('Environment variables should not be undefined.', () => {
        expect(config.HOST_NAME).not.be.undefined;
        expect(config.HTTP_PORT).not.be.undefined;
        expect(config.MAZE_MIN_HEIGHT).not.be.undefined;
        expect(config.MAZE_MAX_HEIGHT).not.be.undefined;
        expect(config.MAZE_MIN_WIDTH).not.be.undefined;
        expect(config.MAZE_MAX_WIDTH).not.be.undefined;
        expect(config.TRAPS_MIN_CHALLENGE).not.be.undefined;
        expect(config.TRAPS_ON_PATH_MIN_CHALLENGE).not.be.undefined;
        expect(config.APP_NAME).not.be.undefined;
        expect(config.MONGO_COL_MAZES).not.be.undefined;
        expect(config.MONGO_COL_SCORES).not.be.undefined;
        expect(config.MONGO_COL_TEAMS).not.be.undefined;
        expect(config.MONGO_CONNSTR).not.be.undefined;
        expect(config.MONGO_CON_PW).not.be.undefined;
        expect(config.MONGO_DB).not.be.undefined;
    });
});

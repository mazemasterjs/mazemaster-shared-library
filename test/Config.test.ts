import { Config } from '../src/Config';
import { expect } from 'chai';

// declare config object
let config: Config;

// test cases
describe('Config Tests', () => {
    it('Config.getInstance() should not return null.', () => {
        config = Config.getInstance();
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
    });
});

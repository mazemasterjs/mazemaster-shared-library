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

    it('config.HOST_NAME should not be empty.', () => {
        expect(config.HOST_NAME).not.be.empty;
    });
});

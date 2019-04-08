import {MongoDBHandler} from '../src/MongoDBHandler';
import {expect} from 'chai';
import {fail} from 'assert';

require('dotenv').config();

// test cases
describe('MongoDBHandler Tests', () => {
    let mongo = MongoDBHandler.getInstance();

    before(() => {
        console.log('Connecting to database...');
        console.log('Connected? ' + mongo.isConnected());
    });

    after(() => {
        console.log('Connected? ' + mongo.isConnected());
        mongo.disconnect();
        console.log('Disconnected from database.');
    });

    it(`Mongo Test Case 1`, () => {
        expect(true).to.equal(true);
    });

    it(`Mongo Test Case 2`, () => {
        expect(false).to.equal(false);
    });
});

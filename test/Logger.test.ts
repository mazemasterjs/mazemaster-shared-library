import { expect } from 'chai';
import { Logger, LOG_LEVELS } from '../src/Logger';

require('dotenv').config();
let log: Logger;

// test cases
describe('Logger Tests', () => {
    it('Logger.getInstance() should not return null.', () => {
        log = Logger.getInstance();
        expect(log).not.to.be.null;
    });

    it(`log.setLogLevel(INFO) should set log level to INFO.`, () => {
        log.setLogLevel(LOG_LEVELS.INFO);
        expect(log.getLogLevel()).to.equal(LOG_LEVELS.INFO);
    });

    it(`log.packageInfo() should read package.json and return app name and version.`, () => {
        let packageInfo = log.getPackageInfo();
        log.info(__filename, 'Logger test', 'Application: ' + packageInfo.name + ', Version: ' + packageInfo.version);
        expect(packageInfo.name).to.equal('mazemaster-shared-library');
        expect(packageInfo.version).not.to.be.empty;
    });

    it(`log.info() should not generate an error.`, () => {
        log.info(__filename, 'Logger test', 'Test message.');
        expect(null);
    });

    it(`log.setLogLevel(DEBUG) should set log level to DEBUG.`, () => {
        log.setLogLevel(LOG_LEVELS.DEBUG);
        expect(log.getLogLevel()).to.equal(LOG_LEVELS.DEBUG);
    });

    it(`log.debug() should not generate an error.`, () => {
        log.debug(__filename, 'Logger test', 'Test message.');
        expect(null);
    });

    it(`log.setLogLevel(TRACE) should set log level to TRACE.`, () => {
        log.setLogLevel(LOG_LEVELS.TRACE);
        expect(log.getLogLevel()).to.equal(LOG_LEVELS.TRACE);
    });

    it(`log.trace() should not generate an error.`, () => {
        log.trace(__filename, 'Logger test', 'Test message.');
        expect(null);
    });

    it(`log.setLogLevel(WARN) should set log level to WARN.`, () => {
        log.setLogLevel(LOG_LEVELS.WARN);
        expect(log.getLogLevel()).to.equal(LOG_LEVELS.WARN);
    });

    it(`log.warn() should not generate an error.`, () => {
        log.warn(__filename, 'Logger test', 'Test message.');
        expect(null);
    });

    it(`log.setLogLevel(ERROR) should set log level to ERROR.`, () => {
        log.setLogLevel(LOG_LEVELS.ERROR);
        expect(log.getLogLevel()).to.equal(LOG_LEVELS.ERROR);
    });

    it(`log.error() should not generate an error.`, () => {
        log.error(__filename, 'Logger test', 'Test message -> ', new Error('Test Error'));
        expect(null);
    });
});

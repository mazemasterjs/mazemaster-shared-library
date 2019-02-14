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

    it(`log.LogLevel = INFO) should set log level to INFO.`, () => {
        log.LogLevel = LOG_LEVELS.INFO;
        expect(log.LogLevel).to.equal(LOG_LEVELS.INFO);
    });

    it(`log.packageInfo() should read package.json and return app name and version.`, () => {
        let packageInfo = log.PackageInfo;
        log.info(__filename, 'Logger test', 'Application: ' + packageInfo.name + ', Version: ' + packageInfo.version);
        expect(packageInfo.name).to.equal('@mazemasterjs/shared-library');
        expect(packageInfo.version).not.to.be.empty;
    });

    it(`log.info() with a fake __filename should not generate an error.`, () => {
        log.info(__filename + '/fake', 'Logger test', 'Test message.');
        expect(null);
    });

    it(`log.info() should not generate an error.`, () => {
        log.info(__filename, 'Logger test', 'Test message.');
        expect(null);
    });

    it(`log.LogLevel = DEBUG) should set log level to DEBUG.`, () => {
        log.LogLevel = LOG_LEVELS.DEBUG;
        expect(log.LogLevel).to.equal(LOG_LEVELS.DEBUG);
    });

    it(`log.debug() should not generate an error.`, () => {
        log.debug(__filename, 'Logger test', 'Test message.');
        expect(null);
    });

    it(`log.LogLevel = TRACE) should set log level to TRACE.`, () => {
        log.LogLevel = LOG_LEVELS.TRACE;
        expect(log.LogLevel).to.equal(LOG_LEVELS.TRACE);
    });

    it(`log.trace() should not generate an error.`, () => {
        log.trace(__filename, 'Logger test', 'Test message.');
        expect(null);
    });

    it(`log.LogLevel = WARN) should set log level to WARN.`, () => {
        log.LogLevel = LOG_LEVELS.WARN;
        expect(log.LogLevel).to.equal(LOG_LEVELS.WARN);
    });

    it(`log.warn() should not generate an error.`, () => {
        log.warn(__filename, 'Logger test', 'Test message.');
        expect(null);
    });

    it(`log.LogLevel = ERROR) should set log level to ERROR.`, () => {
        log.LogLevel = LOG_LEVELS.ERROR;
        expect(log.LogLevel).to.equal(LOG_LEVELS.ERROR);
    });

    it(`log.error() should not generate an error.`, () => {
        log.error(__filename, 'Logger test', 'Test message -> ', new Error('Test Error'));
        expect(null);
    });

    it(`log.force() should not generate an error.`, () => {
        log.force(__filename, 'Logger test', 'Test message.');
        expect(null);
    });
});

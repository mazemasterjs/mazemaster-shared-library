/**
 * Collect and provide application configuration information
 *
 */
import * as os from 'os';
import {format as fmt, isUndefined} from 'util';
import {Logger, LOG_LEVELS} from './Logger';

export class Config {
    private static instance: Config;

    // General environment variables / global config values
    public HTTP_PORT: number = parseInt(process.env.HTTP_PORT || '8080');
    public HOST_NAME: string = process.env.HOST_NAME || os.hostname();
    public APP_NAME: string = process.env.APP_NAME || 'NOT_SET';

    public LOG_LEVEL: LOG_LEVELS = parseInt(process.env.LOG_LEVEL || LOG_LEVELS.TRACE.toString());
    public WORK_DIR: string = __dirname;

    // Maze-specific environment variables / global config values
    public MAZE_MAX_HEIGHT: number = parseInt(process.env.MAZE_MAX_HEIGHT || '50');
    public MAZE_MIN_HEIGHT: number = parseInt(process.env.MAZE_MIN_HEIGHT || '3');
    public MAZE_MAX_WIDTH: number = parseInt(process.env.MAZE_MAX_WIDTH || '50');
    public MAZE_MIN_WIDTH: number = parseInt(process.env.MAZE_MIN_WIDTH || '3');

    // Minimum challenge level that allows trap generation
    public TRAPS_MIN_CHALLENGE: number = parseInt(process.env.TRAPS_MIN_CHALLENGE || '3');

    // Minimum challenge level that allows trap to be generated on the solution path
    public TRAPS_ON_PATH_MIN_CHALLENGE: number = parseInt(process.env.TRAPS_ON_PATH_MIN_CHALLENGE || '6');

    public MAZES_DB_FILE: string = process.env.MAZES_DB_FILE || './data/mazes.db';
    public MAZES_COLLECTION_NAME = process.env.MAZES_COLLECTION_NAME || 'mazes';

    // must be set to true before health/readiness checks in routes/health.ts will pass
    public READY_TO_ROCK: boolean = false;

    // must use getInstance()
    private constructor() {}

    // singleton instance pattern
    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();

            // configure logger
            let log: Logger = Logger.getInstance();
            log.LogLevel = this.instance.LOG_LEVEL;
            log.force(__filename, 'getInstance()', fmt('Initializing configuration for %s v%s.', log.PackageInfo.name, log.PackageInfo.version));
            log.force(__filename, 'getInstance()', 'HTTP_PORT -> [ ' + this.instance.HTTP_PORT + ' ]');
            log.force(__filename, 'getInstance()', 'HOST_NAME -> [ ' + this.instance.HOST_NAME + ' ]');
            log.force(__filename, 'getInstance()', 'APP_NAME -> [ ' + this.instance.APP_NAME + ' ]');
            log.force(__filename, 'getInstance()', 'WORK_DIR  -> [ ' + this.instance.WORK_DIR + ' ]');
            log.force(__filename, 'getInstance()', 'LOG_LEVEL -> [ ' + LOG_LEVELS[this.instance.LOG_LEVEL] + ' ]');
            log.force(__filename, 'getInstance()', 'MAZE_MAX_HEIGHT  -> [ ' + this.instance.MAZE_MAX_HEIGHT + ' ]');
            log.force(__filename, 'getInstance()', 'MAZE_MIN_HEIGHT  -> [ ' + this.instance.MAZE_MIN_HEIGHT + ' ]');
            log.force(__filename, 'getInstance()', 'MAZE_MAX_WIDTH  -> [ ' + this.instance.MAZE_MAX_WIDTH + ' ]');
            log.force(__filename, 'getInstance()', 'MAZE_MIN_WIDTH  -> [ ' + this.instance.MAZE_MIN_WIDTH + ' ]');
            log.force(__filename, 'getInstance()', 'TRAPS_MIN_CHALLENGE  -> [ ' + this.instance.TRAPS_MIN_CHALLENGE + ' ]');
            log.force(__filename, 'getInstance()', 'TRAPS_ON_PATH_MIN_CHALLENGE  -> [ ' + this.instance.TRAPS_ON_PATH_MIN_CHALLENGE + ' ]');
            log.force(__filename, 'getInstance()', 'MAZES_DB_FILE  -> [ ' + this.instance.MAZES_DB_FILE + ' ]');
            log.force(__filename, 'getInstance()', 'MAZES_COLLECTION_NAME  -> [ ' + this.instance.MAZES_COLLECTION_NAME + ' ]');

            // check if HTTP variables exist and warn if not
            if (isUndefined(process.env.HTTP_PORT)) {
                log.warn(__filename, 'getInstance()', 'HTTP_PORT ENVIRONMENT VARIABLE NOT SET, USING DEFAULT: 8080');
            }

            // check if APP_NAME variables exist and warn if not
            if (isUndefined(process.env.APP_NAME)) {
                log.warn(__filename, 'getInstance()', 'APP_NAME ENVIRONMENT VARIABLE NOT SET, USING DEFAULT: NOT_SET');
            }

            // check for LOG_LEVEL
            if (isUndefined(process.env.LOG_LEVEL)) {
                log.warn(__filename, 'getInstance()', 'LOG_LEVEL ENVIRONMENT VARIABLE NOT SET, USING DEFAULT: LOG_LEVELS.INFO');
            }

            // check if MAZE variables exist and warn if not
            if (
                isUndefined(process.env.MAZE_MAX_HEIGHT) ||
                isUndefined(process.env.MAZE_MIN_HEIGHT) ||
                isUndefined(process.env.MAZE_MAX_WIDTH) ||
                isUndefined(process.env.MAZE_MIN_WIDTH)
            ) {
                log.warn(__filename, 'getInstance()', 'MAZE MIN/MAX ENVIRONMENT VARIABLE(S) NOT SET, USING DEFAULTS');
            }

            // check if TRAP settings exist and warn if not
            if (isUndefined(process.env.TRAPS_MIN_CHALLENGE) || isUndefined(process.env.TRAPS_ON_PATH_MIN_CHALLENGE)) {
                log.warn(__filename, 'getInstance()', 'TRAP CHALLENGE LEVEL VARIABLE(S) NOT SET, USING DEFAULTS');
            }

            // check for maze database / collection settings
            if (isUndefined(process.env.MAZES_DB_FILE) || isUndefined(process.env.MAZES_COLLECTION_NAME)) {
                log.warn(__filename, 'getInstance()', 'MAZE DATABASE VARIABLE(S) NOT SET, USING DEFAULTS');
            }
        }
        return Config.instance;
    }
}

export default Config;

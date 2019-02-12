import path from 'path';
import fs from 'fs';

// console output colors
enum COLORS {
    NONE = '\x1b[49m\x1b[0m',
    RED = '\x1b[49m\x1b[31m',
    YELLOW = '\x1b[49m\x1b[35m',
    BLUE = '\x1b[49m\x1b[36m',
    MAGENTA = '\x1b[49m\x1b[35m',
    WHITE_ON_RED = '\x1b[41m\x1b[37m',
    RED_UNDERLINE = '\x1b[4m\x1b[37m'
}

export enum LOG_LEVELS {
    NONE = 0,
    ERROR,
    WARN,
    INFO,
    DEBUG,
    TRACE
}

export class Logger {
    private static instance: Logger;

    private logLevel: LOG_LEVELS = LOG_LEVELS.INFO;

    // must use getInstance()
    private constructor() {}

    // singleton instance pattern
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * Sets current logging level one of the values in LOG_LEVELS
     */
    public set LogLevel(level: LOG_LEVELS) {
        this.logLevel = level;
        let method = 'setLogLevel(' + level + ')';
        console.log('%s : %s : %s : %s : Log Level set to %s', getTimeStamp(), 'N/A', fileName(__filename), method, LOG_LEVELS[this.logLevel]);
    }

    public get LogLevel(): LOG_LEVELS {
        return this.logLevel;
    }

    /**
     * "debug" logging is moderately verbose and generally not appropriate for production environments
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    public debug(file: string, method: string, message: string) {
        if (this.logLevel >= LOG_LEVELS.DEBUG) {
            console.log(
                '%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s%s',
                COLORS.BLUE,
                getTimeStamp(),
                'DBG',
                fileName(file),
                method,
                message,
                COLORS.NONE
            );
        }
    }

    /**
     * "error" logging should used when an unexpected exception occurs - this demands attention
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    public error(file: string, method: string, message: string, error: Error) {
        if (this.logLevel >= LOG_LEVELS.ERROR) {
            console.log(
                '%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s %s%s',
                COLORS.RED,
                getTimeStamp(),
                'ERR',
                fileName(file),
                method,
                message,
                this.logLevel >= LOG_LEVELS.TRACE ? '\r\n' + error.stack : error.message,
                COLORS.NONE
            );
        }
    }

    /**
     * "warn" logging should be used to indicate a problem or handled error that need attention
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    public warn(file: string, method: string, message: string) {
        if (this.logLevel >= LOG_LEVELS.WARN) {
            console.log(
                '%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s%s',
                COLORS.YELLOW,
                getTimeStamp(),
                'WRN',
                fileName(file),
                method,
                message,
                COLORS.NONE
            );
        }
    }

    /**
     * "info" logging is useful for logging application-level events, like startup or shutdown
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    public info(file: string, method: string, message: string) {
        if (this.logLevel >= LOG_LEVELS.INFO) {
            console.log(
                '%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s%s',
                COLORS.NONE,
                getTimeStamp(),
                'INF',
                fileName(file),
                method,
                message,
                COLORS.NONE
            );
        }
    }

    /**
     * "trace" logging is extremely verbose and should only be used during development
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    public trace(file: string, method: string, message: string) {
        if (this.logLevel >= LOG_LEVELS.TRACE) {
            console.log(
                '%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s',
                COLORS.MAGENTA,
                getTimeStamp(),
                'TRC',
                fileName(file),
                method,
                message,
                COLORS.NONE
            );
        }
    }

    /**
     * "force" is a special log level that ignores the current value of LOG_LEVEL - use sparingly.
     *
     * @param file calling file name (__filename)
     * @param method calling method name
     * @param message message to display
     */
    public force(file: string, method: string, message: string) {
        console.log(
            '%s%s : %s : %s' + (method == '' ? '' : ' : ') + '%s : %s',
            COLORS.RED_UNDERLINE,
            getTimeStamp(),
            'TRC',
            fileName(file),
            method,
            message,
            COLORS.NONE
        );
    }

    /**
     * Reads and returns application name and version from package.json
     *
     * @return name:string, version: string
     */
    public get PackageInfo(): { name: string; version: string } {
        let data = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
        return { name: data.name, version: data.version };
    }
}

// returns the current timestamp
function getTimeStamp(): string {
    var dt = new Date();
    return dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
}

// strips path and returns just the name (and extension) of the file
function fileName(file: string) {
    return typeof file !== 'undefined' ? path.basename(file) : 'FILE_UNKNOWN';
}

export default Logger;

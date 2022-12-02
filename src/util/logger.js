const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf } = format;
const constants = require("../../config/constants.json");

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const consoleFormat = printf(({ level, message }) => {
    return `[${level}]: ${message}`;
});

const sampleFormat = printf(({ message }) => {
    return `${message}`;
});

function getLoggerDir() {
    return global.rootDirectory ? `${global.rootDirectory}/` : '';
}

function makeLogger() {
    if (!global.rootDirectory) {
        global.rootDirectory = __dirname.replace(/[\\/]src[\\/]util[\\/]?$/, '');
    }
    global.logger = createLogger({
        level: constants.LOG_LEVEL,
        format: combine(
            timestamp(),
            logFormat
        ),
        transports: [
            new transports.File({ filename: `${getLoggerDir()}logs/error.log`, level: 'error' }),
            new transports.File({
                filename: `${getLoggerDir()}logs/combined.log`,
                maxsize: 10000000,
                maxFiles: 5
            }),
            new transports.Console({ format: consoleFormat, level: 'info' })
        ]
    });
}

function makeSampleLogger() {
    global.sampleLogger = createLogger({
        level: constants.SAMPLE_LOG_LEVEL,
        format: sampleFormat,
        transports: [
            new transports.File({
                maxsize: 10000000,
                maxFiles: 2,
                filename: `${getLoggerDir()}/logs/samples.log`
            })
        ]
    });
}

function makeTwitterLogger() {
    global.logger = createLogger({
        level: constants.LOG_LEVEL,
        format: combine(
            timestamp(),
            logFormat
        ),
        transports: [
            new transports.File({ filename: 'logs/error.log', level: 'error' }),
            new transports.File({
                filename: `${getLoggerDir()}logs/twitCombined.log`,
                maxsize: 10000000,
                maxFiles: 5
            }),
            new transports.Console({ format: consoleFormat, level: 'info' })
        ]
    });
}

function makeTwitterSampleLogger() {
    global.sampleLogger = createLogger({
        level: constants.SAMPLE_LOG_LEVEL,
        format: sampleFormat,
        transports: [
            new transports.File({
                maxsize: 10000000,
                maxFiles: 2,
                filename: `${getLoggerDir()}logs/twitSamples.log`
            })
        ]
    });
}

function createTestLogger() {
    global.logger = createLogger({
        level: constants.TEST_LOG_LEVEL || 'silly',
        format: format.simple(),
        transports: [
            new transports.Console({ format: format.simple(), level: 'silly'})
        ]
    });
    global.sampleLogger = createLogger({
        level: 'emerg',
        transports: [
            new transports.Console({ format: format.simple()})
        ]
    });
}

function createSampleTestLogger(loggerLevel) {
    global.logger = createLogger({
        level: loggerLevel,
        format: format.simple(),
        transports: [
            new transports.Console({ format: format.simple() })
        ]
    });
    global.sampleLogger = createLogger({
        level: 'emerg',
        transports: [
            new transports.Console({ format: format.simple()})
        ]
    });
}

module.exports = {
    "makeLogger": makeLogger,
    "makeSampleLogger": makeSampleLogger,
    "makeTwitterLogger": makeTwitterLogger,
    "makeTwitterSampleLogger": makeTwitterSampleLogger,
    "createTestLogger": createTestLogger,
    "createSampleTestLogger": createSampleTestLogger
}
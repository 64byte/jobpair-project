var winston = require('winston');
var winstonDaily = require('winston-daily-rotate-file');

const { splat, combine, timestamp, printf } = winston.format;

const printFomrmatter = printf(({ timestamp, level, message, meta }) => {
    return `[${timestamp}:${level}]: ${message} ${meta? JSON.stringify(meta) : ''}`;
  });

var logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    format: combine(
        timestamp(),
        splat(),
        printFomrmatter
    ),
    transports: [
        new (winstonDaily)({
            name: 'info-file',
            filename: './log/log_%DATE%.log',
            datePattern: 'YYYY-MM-DD',
        }),
        new (winston.transports.Console)({
            name: 'debug-console',
            colorize: true,
            level: 'debug',
            showLevel: true,
        })
    ]
});

module.exports = logger;
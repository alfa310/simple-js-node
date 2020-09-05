import winston from "winston";
import expressWinston from "express-winston";

export function getLogger() {
  return expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg:
      "HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}} \r\n", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute() {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  });
}

export function getErrorLogger() {
  return expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    colorize: true,
  });
}

export function withLogger(logger, layer, fn) {
  return async function _wrappedFn(...args) {
    try {
      logger.info(`[${layer}] - ${fn.name} start`);
      const result = await fn(...args);
      logger.info(`[${layer}] - ${fn.name} end`);
      return result;
    } catch (error) {
      logger.error(`[${layer}] - ${fn.name} error`);
      throw error;
    }
  };
}

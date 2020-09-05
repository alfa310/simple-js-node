import express from "express";
// this is all it takes to enable async/await for express middleware
import "express-async-errors";
import logger from "loglevel";

import { getRouters } from "./routers";
import { getDatabase } from "./database";
import { getPorts } from "./ports";
import { getEnvironment } from "./config/environment";
import { getLogger, getErrorLogger } from "./config/loggers";

async function startServer() {
  const { port, databaseURI } = getEnvironment();
  const {
    connection: databaseConnection,
    models: database,
  } = await getDatabase(databaseURI);
  const ports = getPorts(database, logger);
  const app = express();
  // I mount my entire app to the /api route (or you could just do "/" if you want)
  app.use(async (req, res, next) => {
    req.context = { ports, logger };
    next();
  });
  app.use("/api", getRouters());

  // add the generic error handler just in case errors are missed by middleware
  app.use(getLogger());
  app.use(getErrorLogger());

  app.use(errorMiddleware);
  app.get("/health", (req, res) => res.send({ status: "OK" }));

  // I prefer dealing with promises. It makes testing easier, among other things.
  // So this block of code allows me to start the express app and resolve the
  // promise with the express server
  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      logger.info(`Listening on port ${server.address().port}`);
      // this block of code turns `server.close` into a promise API
      const originalClose = server.close.bind(server);
      server.close = () => {
        return new Promise((resolveClose) => {
          originalClose(resolveClose);
        });
      };
      setupCloseOnExit(server, databaseConnection);
      resolve(server);
    });
  });
}

function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    next(error);
  } else {
    logger.error(error);
    res.status(500);
    res.json({
      message: error.message,
      // we only add a `stack` property in non-production environments
      ...(process.env.NODE_ENV === "production"
        ? null
        : { stack: error.stack }),
    });
  }
}

function setupCloseOnExit(server, databaseConnection) {
  async function exitHandler(options = {}) {
    await databaseConnection.connection
      .close()
      .then(() => {
        logger.info("Database connection successfully closed");
      })
      .catch((e) => {
        logger.warn(
          "Something went wrong closing the database connection",
          e.stack
        );
      });
    await server
      .close()
      .then(() => {
        logger.info("Server successfully closed");
      })
      .catch((e) => {
        logger.warn("Something went wrong closing the server", e.stack);
      });
    if (options.exit) process.exit();
  }
  // do something when app is closing
  process.on("exit", exitHandler);
  // catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(null, { exit: true }));
  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
  // catches uncaught exceptions
  process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}
export { startServer };

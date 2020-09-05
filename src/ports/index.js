import BookPort from "./BookPort";

function getPorts(database, logger) {
  const context = { database, logger };
  return {
    bookPort: BookPort.initPorts(context),
  };
}

export { getPorts };

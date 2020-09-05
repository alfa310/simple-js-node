import { withLogger } from "../config/loggers";

function withDatabase(fn, context) {
  const { database } = context;
  return async function _wrappedFn(...args) {
    const result = await fn(database, ...args);
    return result;
  };
}

async function createPort(database, book) {
  const { Book } = database;
  const newBook = new Book(book);
  const savedBook = await newBook.save();
  return savedBook;
}

async function getAllPort(database) {
  const { Book } = database;
  const books = await Book.find().exec();
  return books;
}

function initPorts(context) {
  const layer = "BookPort";
  const { logger } = context;

  return {
    create: withDatabase(withLogger(logger, layer, createPort), context),
    getAll: withDatabase(withLogger(logger, layer, getAllPort), context),
  };
}

export default { initPorts };

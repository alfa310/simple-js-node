import { withLogger } from "../config/loggers";

async function createBookService(context, book) {
  const { bookPort } = context.ports;
  const createdBook = await bookPort.create(book);
  return createdBook;
}

async function getAllBooksService(context) {
  const { bookPort } = context.ports;
  const books = await bookPort.getAll();
  return books;
}

function withContext(fn, context) {
  return async function _wrappedFn(...args) {
    const result = await fn(context, ...args);
    return result;
  };
}

function initServices(context) {
  const layer = "BookService";
  const { logger } = context;
  return {
    createBook: withContext(
      withLogger(logger, layer, createBookService),
      context
    ),

    getAllBooks: withContext(
      withLogger(logger, layer, getAllBooksService),
      context
    ),
  };
}

export default { initServices };

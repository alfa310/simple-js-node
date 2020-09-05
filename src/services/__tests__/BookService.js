import BookService from "../BookService";
import { buildContext, buildBook } from "utils/generate";
import { buildInputBook } from "../../../test/utils/generate";

test("getAllBooks should get all books", async (done) => {
  const context = buildContext();
  const books = [buildBook(), buildBook(), buildBook()];
  const { getAll } = context.ports.bookPort;
  getAll.mockReturnValueOnce(books);

  const service = BookService.initServices(context);
  const result = await service.getAllBooks();
  expect(result).toEqual(books);
  expect(getAll).toHaveBeenCalledTimes(1);
  expect(getAll).toHaveBeenCalledWith(/* nothing */);
  done();
});

test("createBook should create a book", async (done) => {
  const context = buildContext();
  const inputBook = buildInputBook();
  const book = buildBook({
    title: inputBook.title,
    content: inputBook.content,
  });
  const { create } = context.ports.bookPort;
  create.mockReturnValueOnce(book);

  const service = BookService.initServices(context);
  const result = await service.createBook(inputBook);
  expect(result).toEqual(book);
  expect(create).toHaveBeenCalledTimes(1);
  expect(create).toHaveBeenCalledWith(inputBook);
  done();
});

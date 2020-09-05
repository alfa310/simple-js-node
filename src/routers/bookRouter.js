import express from "express";
import bodyParser from "body-parser";
import Joi from "joi";
import { BookService } from "../services";

function getBookRouter() {
  const router = express.Router();
  const jsonParser = bodyParser.json();
  router.post("/", jsonParser, withValidInput(createBook));
  router.get("/", getAllBooks);
  return router;
}

function parseBook(book) {
  return {
    id: book._id,
    title: book.title,
    content: book.content,
    createdAt: book.createdAt.toUTCString(),
    updatedAt: book.updatedAt.toUTCString(),
  };
}

function withValidInput(fn) {
  return async function wrappedFn(req, res) {
    try {
      await validateInputBook(req.body);
    } catch (error) {
      res.status(400);
      return res.json({ error });
    }
    const result = await fn(req, res);
    return result;
  };
}

async function validateInputBook(inputBook) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
  });
  await schema.validateAsync(inputBook);
}

async function createBook(req, res) {
  const service = BookService.initServices(req.context);
  const book = await service.createBook(req.body);
  res.status(200);
  return res.json(parseBook(book));
}

async function getAllBooks(req, res) {
  const service = BookService.initServices(req.context);
  const books = await service.getAllBooks();
  res.status(200);
  return res.json(books.map(parseBook));
}

export { getBookRouter };

import express from "express";
import { getMathRouter } from "./mathRouter";
import { getBookRouter } from "./bookRouter";

function getRouters() {
  const router = express.Router();
  router.use("/math", getMathRouter());
  router.use("/book", getBookRouter());
  return router;
}

export { getRouters };

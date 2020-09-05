import { Schema, model } from "mongoose";

const BookSchema = new Schema({
  title: { type: String, required: "tittle cannot be blank" },
  content: { type: String },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

const Book = model("Book", BookSchema);

export default Book;

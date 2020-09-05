import mongoose from "mongoose";
import models from "./models";

async function getDatabase(databaseURI) {
  try {
    await mongoose.connect(databaseURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to a MongoDB instance");
  } catch (error) {
    console.error(error);
  }
  return { connection: mongoose, models };
}

export { getDatabase };

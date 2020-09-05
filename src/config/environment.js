import dotenv from "dotenv";

export function getEnvironment() {
  dotenv.config();
  return {
    port: process.env.PORT,
    databaseURI: process.env.DB,
  };
}

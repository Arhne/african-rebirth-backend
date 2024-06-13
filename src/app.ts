import express from "express";
import * as pino from "pino";
import dotenv from "dotenv";
import { database } from "./config/db.config.js";
import middleware from "./middleware/index.middleware.js";
dotenv.config();

const app = express();

export const logger = pino.pino();
const port = process.env.PORT;
middleware(app);

const start = () => {
  app.listen(port, (): void => {
    logger.info(`listening on port ${port}`);
  });
  database();
};


start();
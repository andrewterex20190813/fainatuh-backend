import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import httpError from "http-errors";
import webpush from "web-push";
import dotenv from "dotenv";

import routes from "./routes";
import errorHandler from "./middleware/ErrorHandler";
import config from "./config/app";

const app = express();

dotenv.config();

const morganFormat = config.isDev ? "dev" : "combined";
app.use(morgan(morganFormat));

mongoose
  .connect(config.mongoUri, { useNewUrlParser: true })
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());

webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

app.use("/api", ...routes);

app.use((req, res, next) => {
  next(httpError(404));
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server started ${config.host}:${config.port}`);
});

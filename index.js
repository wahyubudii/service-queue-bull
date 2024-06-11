import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import express from "express";
import morgan from "morgan";
import { dbConnect } from "./config/dbConnect.js";
import { documentRouter } from "./routes/documentRouter.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { userRouter } from "./routes/userRouter.js";

import { bull } from "./service/bull/worker.js";

const host = process.env.HOST;
const port = process.env.PORT || 5001;
const baseUrl = host + port;

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// database
dbConnect();

// celery
// celery();

// bull queue
bull();

// API ROUTE
app.use("/api/v1/user", userRouter);
app.use("/api/v1/document", documentRouter);

// EXCEPTION FILTER
app.use(notFound);
app.use(errorHandler);

// LISTENER SERVER
app.listen(port, () => console.log(`Server running on ${baseUrl}`));

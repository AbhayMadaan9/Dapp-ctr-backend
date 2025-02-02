import express, { type Express, type Request, type Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import http from "http";
import cors from "cors"
import errorHandler from "./error-handler.middleware"
import dotenv from "dotenv";
import { PrismaClient, User } from "@prisma/client"


dotenv.config();
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const port = Number(process.env.PORT) ?? 5000;
const allowedOrigins = [process.env.FE_BASE_URL]
const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, true)
      // callback(new Error('Not allowed by CORS'))
    }
  }
}))
const initApp = async (): Promise<void> => {

  app.get("/", (req: Request, res: Response) => {
    res.send({ status: "ok" });
  });

  // error handler
  app.use(errorHandler);
  http.createServer(app).listen(port, () => {
    console.log("Server is runnuing on port", port);
  });
};

void initApp();

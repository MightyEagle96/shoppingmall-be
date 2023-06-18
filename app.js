import express from "express";
import { ConnectDatabase } from "./database.js";
import router from "./router.js";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import crypto from "asymmetric-crypto";
// const crypto = require('asymmetric-crypto')
const app = express();

export const mySecret = {
  secretKey:
    "qOMPNdx1Ef2IcsJxpe3muLHW7Kucs8p3Co0Zsnl7/pWrhyt7oDNwRDn66YHeNHK7tDeJnejYH7kb1xZJcuiwQw==",
  publicKey: "q4cre6AzcEQ5+umB3jRyu7Q3iZ3o2B+5G9cWSXLosEM=",
};

ConnectDatabase();

app
  .use(cookieParser())
  .use(express.json())
  .use(morgan("dev"))
  .use(cors({ origin: "http://localhost:3000", credentials: true }))
  .use(router);

app.listen(3400, () => {
  console.log("App is listening");
});

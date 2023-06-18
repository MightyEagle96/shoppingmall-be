import express from "express";
import {
  AttendanceSummary,
  CreateAccount,
  LoginAccount,
} from "./controller.js";

const router = express.Router();

router
  .get("/", (req, res) => res.send("Hello from the backend"))
  .post("/createaccount", CreateAccount)
  .post("/login", LoginAccount)
  .get("/attendance", AttendanceSummary);

export default router;

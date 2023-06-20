import express from "express";
import {
  CreateAccount,
  IsLoggedIn,
  LoginAccount,
  RestrictTo,
} from "./controllers/controller.js";
import { CreateVendor } from "./controllers/adminController.js";

const router = express.Router();

router
  .get("/", (req, res) => res.send("Hello from the backend"))
  .post("/createaccount", CreateAccount)
  .post("/login", LoginAccount)

  //admin section
  .post("/createvendor", IsLoggedIn, RestrictTo("vendor"), CreateVendor)
  .use("*", (req, res) => res.status(404).send("Route not found"));

export default router;

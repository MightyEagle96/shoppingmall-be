import express from "express";
import {
  CreateAccount,
  IsLoggedIn,
  LoginAccount,
  RestrictTo,
} from "./controllers/controller.js";
import { CreateVendor } from "./controllers/adminController.js";
import { CreateProduct } from "./controllers/productController.js";
import { VendorLogin } from "./controllers/vendorController.js";

const router = express.Router();

const rootPath = (path) => `/api/v1/${path}`;

router
  .get(rootPath(""), (req, res) => res.send("Hello from the backend"))
  .post(rootPath("createaccount"), CreateAccount)
  .post(rootPath("login"), LoginAccount)

  //admin section
  .post(rootPath("createvendor"), IsLoggedIn, RestrictTo("admin"), CreateVendor)

  //vendor section
  .post(rootPath("vendor/login"), VendorLogin)
  .post(
    rootPath("vendor/createproduct"),
    IsLoggedIn,
    RestrictTo("vendor"),
    CreateProduct
  )
  .use("*", (req, res) => res.status(404).send("Route not found"));

export default router;

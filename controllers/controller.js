import accountModel from "../models/accountModel.js";
import { createAccessToken, verifyAccessToken } from "./auth.js";
import { readFile } from "fs";
import bcrypt from "bcryptjs";
import XLSX from "xlsx";

import { mySecret } from "../app.js";
import vendorModel from "../models/vendorModel.js";

export const CreateAccount = async (req, res) => {
  try {
    //check if the email exists
    const existingEmail = await accountModel.findOne({ email: req.body.email });

    if (existingEmail)
      return res.status(400).send("Email address already exists");

    const user = await accountModel.create(req.body);

    const accessToken = createAccessToken(user);
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 60 * 1000),
      })
      .json(accessToken);
  } catch (error) {
    res.status(500).send(new Error(error).message);
  }
};

export const LoginAccount = async (req, res) => {
  try {
    //check the email
    const user = await accountModel.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("No email address found");

    //check the password
    const result = await bcrypt.compare(req.body.password, user.password);

    if (!result) return res.status(400).send("Password don't match");

    user.password = undefined;
    const accessToken = createAccessToken(user);
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 60 * 1000),
      })
      .json(accessToken);
  } catch (error) {
    res.status(500).send(new Error(error).message);
  }
};

export const IsLoggedIn = async (req, res, next) => {
  try {
    //verify the access token
    if (!req.cookies.accessToken)
      return res.status(401).send("Access token has expired");

    req.account = verifyAccessToken(req.cookies.accessToken);
    next();
  } catch (error) {
    res.status(401).send(new Error(error).message);
  }
};

export const RestrictTo =
  (...roles) =>
  async (req, res, next) => {
    if (!roles.includes(req.account.role))
      return res
        .status(403)
        .send("You don't have permission to access this resource");
    next();
  };

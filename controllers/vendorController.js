import productModel from "../models/productModel.js";
import vendorModel from "../models/vendorModel.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "./auth.js";

export const CreateProduct = async (req, res) => {
  try {
    req.body.vendor = req.account._id;

    if (!req.account.productCategories.includes(req.body.category))
      return res
        .status(400)
        .send(
          "This product category is not specified in your products category list."
        );

    await productModel.create(req.body);
    res.status(201).send("Product created");
  } catch (error) {
    res.status(500).send(new Error(error).message);
  }
};

export const VendorLogin = async (req, res) => {
  try {
    const vendor = await vendorModel.findOne({ email: req.body.email });

    if (!vendor)
      return res
        .status(400)
        .send("No vendor exists with that email address provided");

    const result = await bcrypt.compare(req.body.password, vendor.password);

    if (!result) return res.status(400).send("Password don't match");

    vendor.password = undefined;
    const accessToken = createAccessToken(vendor);
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

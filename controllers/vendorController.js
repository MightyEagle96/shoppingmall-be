import productModel from "../models/productModel";

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

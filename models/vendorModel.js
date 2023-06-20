import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
  name: { type: String, trim: true },
  organisationId: { type: String, unique: true },
  productCategories: [{ type: String }],
  email: String,
  password: String,
});

export default model("Vendor", schema);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const { Schema, model } = mongoose;

const schema = new Schema({
  name: { type: String, trim: true },
  organisationId: { type: String, unique: true },
  productCategories: [{ type: String }],
  email: String,
  password: String,
});

//this only works on es5 function call
schema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

export default model("Vendor", schema);

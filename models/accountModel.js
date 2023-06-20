import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const { Schema, model } = mongoose;

const schema = new Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, trim: true },
  password: { type: String, trim: true },
  role: { type: String, default: "user" },
});

//this only works on es5 function call
schema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

export default model("Account", schema);

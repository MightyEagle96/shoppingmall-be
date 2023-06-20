import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const { Schema, model } = mongoose;

const schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  ratings: [
    {
      remark: { type: String, trim: true },
      additionComment: { type: String, trim: true },
      star: Number,
      commenter: { type: Schema.Types.ObjectId, ref: "Account" },
    },
  ],
});

export default model("Rating", schema);

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const schema = new Schema({
  name: { type: String, trim: true },
  category: String,
  price: Number,
  quantity: Number,
  imageUrl: { type: String, trim: true },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
});

export default model("Product", schema);

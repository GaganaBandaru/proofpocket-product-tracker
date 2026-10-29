
import mongoose from "mongoose";

const repairSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    issue: {
      type: String,
      trim: true,
    },
    workPerformed: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    purchaseDate: {
      type: Date,
    },
    purchasePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    warrantyExpiry: {
      type: Date,
    },
    nextServiceDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    repairs: {
      type: [repairSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

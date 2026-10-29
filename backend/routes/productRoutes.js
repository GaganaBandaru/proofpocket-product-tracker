import express from "express";
import mongoose from "mongoose";
import Product from "../models/product.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Require authentication for all product and repair operations
router.use(protect);

// CREATE a product (scoped to authenticated user)
router.post("/", async (req, res) => {
  try {
    const { name, category } = req.body || {};

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Product name is required" });
    }

    if (!category || typeof category !== "string" || !category.trim()) {
      return res.status(400).json({ message: "Product category is required" });
    }

    // Never trust client-supplied user or id fields
    const { user: _ignoreUser, _id: _ignoreId, ...safeData } = req.body;

    const product = await Product.create({
      ...safeData,
      name: name.trim(),
      category: category.trim(),
      user: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// READ all products belonging to the authenticated user
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ one product (only if owned by the authenticated user)
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a product (only if owned by the authenticated user)
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // Prevent changing ownership or directly overwriting subdocuments via PUT
    const { user: _ignoreUser, _id: _ignoreId, repairs: _ignoreRepairs, ...safeUpdate } = req.body;

    if (safeUpdate.name !== undefined && (typeof safeUpdate.name !== "string" || !safeUpdate.name.trim())) {
      return res.status(400).json({ message: "Product name cannot be empty" });
    }

    if (safeUpdate.category !== undefined && (typeof safeUpdate.category !== "string" || !safeUpdate.category.trim())) {
      return res.status(400).json({ message: "Product category cannot be empty" });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      safeUpdate,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a product (only if owned by the authenticated user)
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ── Repair sub-routes (ownership verified) ─────────────────

// ADD a repair record to an owned product
router.post("/:id/repairs", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { date, issue, workPerformed, cost } = req.body || {};

    product.repairs.push({
      date: date || undefined,
      issue: typeof issue === "string" ? issue.trim() : "",
      workPerformed: typeof workPerformed === "string" ? workPerformed.trim() : "",
      cost: typeof cost === "number" && cost >= 0 ? cost : 0,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a repair record from an owned product
router.delete("/:id/repairs/:repairId", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    if (!mongoose.isValidObjectId(req.params.repairId)) {
      return res.status(400).json({ message: "Invalid repair ID" });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const repair = product.repairs.id(req.params.repairId);
    if (!repair) {
      return res.status(404).json({ message: "Repair record not found" });
    }

    repair.deleteOne();
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

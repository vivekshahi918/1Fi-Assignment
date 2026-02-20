import mongoose, { Schema, model, models } from 'mongoose';

const VariantSchema = new Schema({
  id: String,
  storage: String,
  color: String,
  colorCode: String,
  price: Number,
  mrp: Number,
  image: String,
});

const EMIPlanSchema = new Schema({
  tenure: Number,
  interestRate: Number,
  cashback: Number,
});

const ProductSchema = new Schema({
  name: String,
  slug: { type: String, unique: true },
  brand: String,
  description: String,
  variants: [VariantSchema],
  defaultEMIPlans: [EMIPlanSchema],
});

export const Product = models.Product || model('Product', ProductSchema);
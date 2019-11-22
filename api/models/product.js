const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);

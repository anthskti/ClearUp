// Model, Schema for postgreSQL

export const productSchema = new Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "Cleanser",
      "Toner",
      "Essences",
      "Serum",
      "Eye Cream",
      "Moisturizer",
      "Sunscreen",
      "Other",
    ],
    required: true,
  },
  skinTypes: {
    type: String,
    enum: ["oily", "dry", "combination", "senseitive", "normal", "acne-prone"],
    required: true,
  },
  benefits: { type: String },
  ingredients: { type: String },
  country: { type: String },
  imageUrls: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

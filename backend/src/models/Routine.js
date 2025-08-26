const routineSchema = new Schema({
  userId: { type: Schema.Type.ObjectId, ref: "User", required: True },
  name: { type: String, required: True },
  description: { type: String },
  products: [
    {
      productId: {
        type: SChema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      timeOfDay: { type: String, enum: ["morning", "evening", "both"] },
    },
  ],
  //   totalCost: { type: Number, default: 0 },       will implement links later, have lowest cost
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, defualt: Date.now },
});

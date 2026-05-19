import mongoose, { Schema, Document } from "mongoose";

export interface IReview {
  username: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[]; // 🌟 FIXED: Ab yeh strict string array ban gaya hai interface mein bhi
  stock: number;
  sellerId: mongoose.Types.ObjectId;
  reviews: IReview[]; 
}

const ProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: [{ type: String, required: true }], // 🌟 Matches perfectly with the interface array now
    stock: { type: Number, required: true, default: 0 },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    reviews: [
      {
        username: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
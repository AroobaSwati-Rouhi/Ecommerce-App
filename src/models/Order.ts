import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: Array<{
    productId: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    title: string;
    price: number;
    quantity: number;
    image: string;
    category: string;
  }>;
  totalAmount: number;
  shippingFee: number;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled"; 
  paymentMethod: "cod" | "stripe";
  address: string;
  customerEmail: string;
  customerPhone: string;
  stripeTransactionId?: string;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, required: true },
    sellerId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 10 },
    status: { 
      type: String, 
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending" 
    },
    paymentMethod: { type: String, required: true },
    address: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    stripeTransactionId: { type: String, default: null },
    idempotencyKey: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1 });
OrderSchema.index({ idempotencyKey: 1 }, { unique: true });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
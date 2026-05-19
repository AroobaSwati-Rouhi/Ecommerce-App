import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// POST: Order Place karne ke liye
export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
 const newOrder = await Order.create(body);
  return NextResponse.json(newOrder, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  await connectToDatabase();
  const orders = await Order.find({}); 
  return NextResponse.json(orders);
}

export async function PUT(req: Request) {
  const { orderId, newStatus } = await req.json();
  await connectToDatabase();
  const updated = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true });
  return NextResponse.json(updated);
}
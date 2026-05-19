import { auth } from "@/auth"; // <-- Ye line add karein (check karein ke path sahi hai)
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // Aapka jo bhi path hai
import Order from "@/models/Order";


export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}
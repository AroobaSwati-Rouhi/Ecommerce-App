import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication checkpoint failed." }, { status: 401 });
    }

    await connectToDatabase();
    
    // User ID ke mutabik orders fetch karenge sorted by newest first
    const userOrders = await Order.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });
    
    return NextResponse.json(userOrders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to query personal tracking logs" }, { status: 500 });
  }
}
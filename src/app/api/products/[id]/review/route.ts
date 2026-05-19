import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Please login to leave a review." }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { rating, comment } = await request.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectToDatabase();

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Naya review object array mein push karne ke liye
    const newReview = {
      username: session.user.name || "Anonymous Member",
      rating: Number(rating),
      comment: comment,
      createdAt: new Date()
    };

    product.reviews.push(newReview);
    await product.save();

    return NextResponse.json({ message: "Review appended successfully!", reviews: product.reviews });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Feedback Error" }, { status: 500 });
  }
}
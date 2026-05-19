import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { auth } from "@/auth";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let queryFilter: any = {};

    if (category && category !== "all") {
      queryFilter.category = category;
    }

    if (search) {
      queryFilter.title = { $regex: search, $options: "i" }; // 'i' means ignore case (A vs a same)
    }

    const products = await Product.find(queryFilter).sort({ createdAt: -1 });

    return NextResponse.json(products, { status: 200 });

  } catch (error: any) {
    console.error("❌ CRITICAL BACKEND GET PIPELINE CRASH:", error);
    return NextResponse.json(
      { error: "Failed to stream asset matrices", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized access node." }, { status: 401 });
    }
    const body = await request.json();
    const { title, description, price, category, stock, images, image } = body;

    if (!title || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required product fields." }, { status: 400 });
    }

    await connectToDatabase();

    let finalImagesArray: string[] = [];

    if (images && Array.isArray(images) && images.length > 0) {
      finalImagesArray = images;
    } else if (image && typeof image === "string" && image.trim() !== "") {
      finalImagesArray = [image.trim()]; // String into array fallback parser
    }

    if (finalImagesArray.length === 0) {
      return NextResponse.json({ error: "At least one product image URL is required." }, { status: 400 });
    }
    const activeSellerId = session.user.id || (session.user as any)._id;
    if (!activeSellerId) {
      return NextResponse.json({ error: "Invalid identity signature link map missing." }, { status: 400 });
    }

    const newProduct = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      stock: Number(stock) || 0,
      images: finalImagesArray, 
      sellerId: activeSellerId,
    });

    return NextResponse.json(
      { message: "Product cluster successfully mutation synced!", product: newProduct },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("❌ CRITICAL BACKEND MATRIX CRASH:", error);
    return NextResponse.json(
      { error: "Catalog mutation rejected", details: error.message },
      { status: 500 }
    );
  }
}
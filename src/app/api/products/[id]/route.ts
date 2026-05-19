import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

// 1. GET Method (Pehle se maujood hai)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: "Product asset not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Internal Database Pipeline Error" }, { status: 500 });
  }
}

// 2. ✅ Yahan PUT Method add karein taake Update kaam kar sake
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json(); // Front-end se aane wala data

    // Product update logic
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      body, 
      { new: true } // Update hone ke baad naya object return karega
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update rejected by server." }, { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete request rejected by server." }, { status: 500 });
  }
}
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    console.log("Starting Seeding Matrix Engine...");
    await connectToDatabase();
    
    // Schema structure tracking strict alignment
    const Product = mongoose.models.Product || mongoose.model("Product", new mongoose.Schema({
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true },
      image: { type: String, required: true },
      stock: { type: Number, required: true, default: 10 },
      slug: { type: String } // Explicit inclusion to prevent dynamic allocation drops
    }, { timestamps: true }));

    console.log("Cleaning collection contents...");
    await Product.deleteMany({});

    // Added unique slugs mathematically to bypass unique constraints indices
    const dummyCatalog = [
      {
        title: "Minimalist Leather Pack",
        description: "Waterproof structural matte architectural backup core assets.",
        price: 180,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=600",
        stock: 12,
        slug: `leather-pack-${Date.now()}-1`
      },
      {
        title: "Cybernetic Mechanical Keyboard",
        description: "Hot-swappable tactile performance engine keys.",
        price: 240,
        category: "tech",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600",
        stock: 8,
        slug: `mech-keyboard-${Date.now()}-2`
      },
      {
        title: "Monolithic Alabaster Vase",
        description: "Brutalist ceramic structural design piece.",
        price: 95,
        category: "decor",
        image: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=600",
        stock: 15,
        slug: `alabaster-vase-${Date.now()}-3`
      },
      {
        title: "Wireless ANC Audio Nodes",
        description: "Active high fidelity isolated sound waves device.",
        price: 320,
        category: "tech",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
        stock: 5,
        slug: `anc-nodes-${Date.now()}-4`
      }
    ];

    console.log("Injecting dynamic unique array drops into MongoDB...");
    await Product.insertMany(dummyCatalog);
    
    return NextResponse.json({ success: true, message: "Cloud catalog seeded successfully with enterprise drops!" });
  } catch (error: any) {
    console.error("Seeding failed crash log:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal crash" }, { status: 500 });
  }
}
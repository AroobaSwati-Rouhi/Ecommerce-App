"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("clothing"); 
  const [stock, setStock] = useState("10");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // 🌟 Main array tracking string state (Now completely optional)
  const [imageUrls, setImageUrls] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Comma-separated links ko parse karke array format mein clean build karna
    // Agar khali hoga toh empty array bhejega, back-end automatic manage kar lega
    const finalImagesArray = imageUrls
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url !== "");

    const productPayload = {
      title,
      price: Number(price),
      description,
      category,
      stock: Number(stock),
      images: finalImagesArray, // Array layout passes smoothly even if empty
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to create product");
      }

      alert("🎉 Product published successfully under your seller ID!");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      alert("❌ Database Rejection Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center items-center">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm w-full max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Add New Product</h1>
          <p className="text-xs text-slate-400 mt-1">List a new asset across decentralized inventory networks.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Title</label>
            <input 
              type="text" 
              placeholder="e.g., Embroidered Summer Kurti" 
              className="w-full p-3.5 bg-slate-50 rounded-xl outline-none text-xs font-semibold border border-slate-100 focus:border-black transition-all" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          {/* Price & Stock info row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price ($)</label>
              <input 
                type="number" 
                placeholder="45" 
                min="1" 
                className="w-full p-3.5 bg-slate-50 rounded-xl outline-none text-xs font-semibold border border-slate-100 focus:border-black transition-all" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Stock Units</label>
              <input 
                type="number" 
                placeholder="10" 
                min="1" 
                className="w-full p-3.5 bg-slate-50 rounded-xl outline-none text-xs font-semibold border border-slate-100 focus:border-black transition-all" 
                value={stock} 
                onChange={(e) => setStock(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Category Dropdown Segment */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category Segment</label>
            <select 
              className="w-full p-3.5 bg-slate-50 rounded-xl outline-none text-xs font-bold border border-slate-100 focus:border-black transition-all cursor-pointer" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="clothing">Clothing & Apparel</option>
              <option value="footwear">Footwear & Shoes</option>
              <option value="cosmetic">Cosmetics & Makeup</option>
              <option value="jewelery">Jewelry & Accessories</option>
              <option value="crockery">Crockery & Kitchenware</option>
              <option value="stationery">Stationery & Books</option>
            </select>
          </div>

          {/* 🌟 OPTIONAL MULTI-IMAGES PIPELINE (Required attribute removed) */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Product Images (Optional - Comma Separated URLs)
            </label>
            <textarea
              rows={2}
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder="https://link1.com, https://link2.com"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs font-semibold outline-none focus:border-black transition-all"
            />
          </div>

          {/* 🌟 NEW: Description Block Element Added at the very bottom */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Product Description</label>
            <textarea 
              rows={4}
              placeholder="Describe the asset quality, dimensions, material layout details..." 
              className="w-full p-3.5 bg-slate-50 rounded-xl outline-none text-xs font-semibold border border-slate-100 focus:border-black transition-all resize-none" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-black text-white py-4 rounded-full text-xs font-bold tracking-widest uppercase mt-4 disabled:bg-slate-200 disabled:text-slate-400 transition-all cursor-pointer"
          >
            {loading ? "Publishing to Marketplace Catalog..." : "Publish Product"}
          </button>
        </form>
      </div>
    </main>
  );
}
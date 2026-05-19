"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, SlidersHorizontal, PackageCheck, AlertTriangle, Edit3, Trash2 } from "lucide-react";
import Link from "next/link"; 

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[]; 
  image?: string;    
  stock: number;
}

const CATEGORY_TAGS = [
  { id: "all", label: "All Assets" },
  { id: "clothing", label: "Clothing" },
  { id: "footwear", label: "Footwear" },
  { id: "cosmetic", label: "Cosmetics" },
  { id: "jewelery", label: "Jewelry" },
  { id: "crockery", label: "Crockery" }, 
  { id: "stationery", label: "Stationery" },
];

export default function AdminShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const streamCatalogData = async () => {
    try {
      let url = `/api/products?`;
      if (selectedCategory !== "all") url += `category=${selectedCategory}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed syncing streaming data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const timingHook = setTimeout(() => {
      streamCatalogData();
    }, 300);

    return () => clearTimeout(timingHook);
  }, [selectedCategory, searchQuery]);

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to permanently delete this product?")) {
      return;
    }

    setDeletingId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Deletion rejected by server.");

      setProducts((prev) => prev.filter((p) => p._id !== productId));
      alert("🗑️ Product removed successfully.");
    } catch (err: any) {
      alert("❌ Deletion Failed: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-12 text-slate-900 mt-16">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight uppercase">Console Inventory</h1>
        <p className="text-xs text-slate-400 mt-1">Manage, modify, and optimize your live shop listings instantly.</p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="bg-white px-4 py-3 rounded-full border border-slate-100 shadow-sm flex items-center gap-3 w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search items by keyword..." 
            className="w-full bg-transparent outline-none text-xs font-semibold"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 mr-1 hidden md:block" />
          {CATEGORY_TAGS.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedCategory(tag.id)}
              className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                selectedCategory === tag.id
                  ? "bg-black text-white border-black shadow-sm"
                  : "bg-white text-slate-400 border-slate-100 hover:text-black"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-black stroke-[2.5]" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-slate-100 text-xs font-semibold text-slate-400">
          No items found matching the criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const targetDisplayImage = 
              product.images && product.images.length > 0 
                ? product.images[0] 
                : (product.image || "/placeholder.jpg");

            const isDeleting = deletingId === product._id;

            return (
              <div key={product._id} className="relative group bg-white rounded-4xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between p-4">
                
                <div className="absolute top-7 right-7 z-20 pointer-events-none">
                  {product.stock > 0 ? (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <PackageCheck className="w-3 h-3 text-emerald-600" /> {product.stock} In Stock
                    </span>
                  ) : (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200/60 px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" /> Sold Out
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="w-full aspect-square rounded-3xl bg-slate-50 overflow-hidden relative">
                    <img 
                      src={targetDisplayImage} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-slate-800 shadow-sm border border-white/50">
                      {product.category}
                    </span>
                  </div>

                  <div className="px-1 space-y-1">
                    <h3 className="text-xs font-black text-slate-900 tracking-tight line-clamp-1 uppercase">{product.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 font-medium leading-relaxed">{product.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-50 mt-auto">
                  
                  <div className="px-1">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Price Variant</p>
                    <p className="text-sm font-black text-slate-900">${product.price}</p>
                  </div>

                  {/* 🚀 SELLER EXCLUSIVE CONTROLS: Show hamesha on /admin/shop */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link 
                      href={`/admin/edit-product/${product._id}`}
                      className="flex items-center justify-center gap-1.5 bg-black hover:bg-slate-800 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-center"
                    >
                      <Edit3 className="w-3 h-3" /> Modify
                    </Link>
                    
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteProduct(product._id);
                      }}
                      className="flex items-center justify-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <><Trash2 className="w-3 h-3" /> Delete</>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
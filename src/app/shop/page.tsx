"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, SlidersHorizontal, ShoppingCart, PackageCheck, AlertTriangle } from "lucide-react";
import { useCart } from "@/context/CartContext"; 
import Link from "next/link"; 

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[]; // 🌟 UPGRADED: Dynamic array layout support
  image?: string;    // Fallback support for older documents
  stock: number;
}

const CATEGORY_TAGS = [
  { id: "all", label: "All Assets" },
  { id: "clothing", label: "Clothing" },
  { id: "footwear", label: "Footwear" },
  { id: "cosmetic", label: "Cosmetics" },
  { id: "jewelery", label: "Jewelry" },
  { id: "crockery", label: "Crockery" }, // 🌟 FIXED: Value mapping synchronization
  { id: "stationery", label: "Stationery" },
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart(); 

  useEffect(() => {
    async function streamCatalogData() {
      setLoading(true);
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
        console.error("Failed syncing streaming data node:", err);
      } finally {
        setLoading(false);
      }
    }

    const timingHook = setTimeout(() => {
      streamCatalogData();
    }, 300);

    return () => clearTimeout(timingHook);
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-12 text-slate-900 mt-16">
      
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight uppercase">Global Catalog</h1>
        <p className="text-xs text-slate-400 mt-1">Discover, analyze, and dispatch premium utility products instantly.</p>
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
          No items found matching the selected categorization criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            // 🌟 DEFENSIVE EXTRACTOR: Resolving array vs single string dynamically
            const targetDisplayImage = 
              product.images && product.images.length > 0 
                ? product.images[0] 
                : (product.image || "/placeholder.jpg");

            return (
              <div key={product._id} className="relative group bg-white rounded-4xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between p-4">
                
                {/* Live Responsive Inventory Look Badge Layer */}
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

                {/* Clickable Area for Image and Text Specs */}
                <Link href={`/product/${product._id}`} className="block cursor-pointer space-y-3 mb-4">
                  <div className="w-full aspect-square rounded-3xl bg-slate-50 overflow-hidden relative">
                    <img 
                      src={targetDisplayImage} // 🌟 UPDATED: Clean responsive image feed
                      alt={product.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-white/80 backdrop-blur-md text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-slate-800 shadow-sm border border-white/50">
                      {product.category}
                    </span>
                  </div>

                  <div className="px-1 space-y-1">
                    <h3 className="text-xs font-black text-slate-900 tracking-tight line-clamp-1 uppercase">{product.title}</h3>
                    <p className="text-[11px] text-slate-400 line-clamp-2 font-medium leading-relaxed">{product.description}</p>
                  </div>
                </Link>

                {/* Bottom Action Footer Row */}
                <div className="pt-2 px-1 flex items-center justify-between mt-auto border-t border-slate-50">
                  <div>
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Price Variant</p>
                    <p className="text-sm font-black text-slate-900">${product.price}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      addToCart({
                        productId: product._id,
                        title: product.title,
                        price: product.price,
                        image: targetDisplayImage, // 🌟 UPDATED: Passing verified array link to context state
                        category: product.category,
                        quantity: 1
                      });
                      alert(`🛍️ Added ${product.title} to your cart layout.`);
                    }}
                    disabled={product.stock === 0}
                    className="bg-slate-50 hover:bg-black text-slate-900 hover:text-white px-4 py-2.5 rounded-full text-[10px] font-black tracking-wider uppercase transition-all disabled:bg-slate-100 disabled:text-slate-300 border border-slate-100 hover:border-black flex items-center gap-1.5 cursor-pointer z-10"
                  >
                    <ShoppingCart className="w-3 h-3" />
                    {product.stock > 0 ? "Add To Cart" : "Out of Stock"}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
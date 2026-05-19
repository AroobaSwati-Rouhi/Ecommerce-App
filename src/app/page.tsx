"use client";
import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    // 🌟 UPGRADED: Safe Fetch implementation with runtime response guards
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Catalog connection breakdown: Status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Normalizing schema differences inline for robust UI representation
          const normalizedData = data.map((p: any) => ({
            ...p,
            // Fallback checking to keep ProductCard component secure
            images: p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : ["/placeholder.jpg"])
          }));
          setProducts(normalizedData.slice(0, 4));
        } else {
          console.error("Data received from cluster is not iterable:", data);
          setFetchError(true);
        }
      })
      .catch((err) => {
        console.error("❌ Critical pipeline error caught inside Home:", err);
        setFetchError(true);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden px-4 md:px-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/30 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070" 
            alt="Core Platform Hero" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="relative z-20 max-w-7xl mx-auto w-full text-white">
          <span className="text-xs font-bold tracking-[0.4em] uppercase text-white/70 block mb-3">Enterprise Standard</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95]">RAW<br />PERFORMANCE.</h1>
          <div className="mt-8">
            <Link href="/shop" className="bg-white text-black px-8 py-4 rounded-full font-bold inline-flex items-center gap-3 text-sm shadow-xl hover:bg-slate-100 transition-all">
              Enter Catalog <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Curated Items Grid Section */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <div className="mb-10">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Curated Pipeline Items</h2>
          <p className="text-xs text-slate-400 mt-1">Directly extracted database streams.</p>
        </div>
        
        {fetchError ? (
          <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-xs font-semibold text-slate-400">
            Unable to stream matrix data nodes. Verify server or clear local development build configs.
          </div>
        ) : products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-full aspect-[4/5] bg-white border border-slate-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p: any) => (
              <Link 
                href={`/product/${p._id}`} 
                key={p._id} 
                className="block cursor-pointer transition-transform active:scale-[0.98]"
              >
                <ProductCard product={p} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
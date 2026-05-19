"use client";

import { useEffect, useState, use } from "react";
import { useCart } from "@/context/CartContext";
import { Loader2, ShoppingBag, ShieldCheck, ArrowLeft, Layers, ArrowUpRight, Star, User, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Review {
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  images: string[]; // 🌟 UPDATED: Image string converted to an Array of strings
  image?: string;   // Fallback configuration if string data persists
  category: string;
  stock: number;
  sellerId: string;
  reviews: Review[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // Gallery Active View State Indicator
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review Form States
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductCoreData = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error("Catalog node missing.");
      const data = await res.json();
      
      // Data Normalization Guard: Ensures data format is always an array
      if (data && data.image && !data.images) {
        data.images = [data.image];
      }
      if (data && (!data.images || data.images.length === 0)) {
        data.images = ["/placeholder.jpg"];
      }
      
      setProduct(data);

      const globalRes = await fetch("/api/products");
      if (globalRes.ok) {
        const allProducts: Product[] = await globalRes.json();
        const filtered = allProducts.filter(
          (p) => p.category === data.category && p._id !== data._id
        );
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (err) {
      console.error("Pipeline breakdown error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductCoreData();
  }, [productId]);

  // 🚀 SUBMIT NEW FEEDBACK CORE
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${productId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: userRating, comment: userComment }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to log review");
      }

      alert("🎉 Your product feedback has been safely logged!");
      setUserComment("");
      setUserRating(5);
      fetchProductCoreData(); // Reload specifications matrix
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-black" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Streaming Product Specs...</p>
      </main>
    );
  }

  if (!product) return <main className="min-h-screen bg-slate-50 flex items-center justify-center">Product missing.</main>;

  // Safe Variable Extract for Image source URL
  const activeImageSrc = product.images?.[activeImageIndex] || product.image || "/placeholder.jpg";

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-12 text-slate-900 mt-16">
      <div className="max-w-6xl mx-auto space-y-16">
        
        <Link href="/shop" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-black transition-colors w-fit group">
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Back to Catalog
        </Link>

        {/* Product specs details grid box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-white p-6 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
          
          {/* 🌟 LEFT SIDE: MULTI-IMAGE GALLERY MATRIX WORKSPACE */}
          <div className="space-y-4 w-full">
            {/* Main Active Box Display */}
            <div className="w-full aspect-square rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden relative group">
              <img src={activeImageSrc} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102" />
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                {product.category}
              </div>
            </div>

            {/* Thumbnails Row Strip Grid Selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                {product.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 bg-slate-50 flex-shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx 
                        ? "border-black scale-95 shadow-sm opacity-100" 
                        : "border-slate-100 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt={`Angle verification ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: SPECIFICATIONS ACTION BLOCK */}
          <div className="space-y-6 lg:py-4">
            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight leading-tight">{product.title}</h1>
              <div className="text-lg font-mono font-black text-black">${product.price}</div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">{product.description}</p>
            
            {product.stock > 0 ? (
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">{product.stock} Units Available</span>
            ) : (
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">Warehouse Exhausted</span>
            )}

            <hr className="border-slate-100" />

            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full p-1 w-full sm:w-auto">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-full font-bold hover:bg-white text-xs cursor-pointer">-</button>
                  <span className="px-4 text-xs font-black font-mono w-8 text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-10 h-10 rounded-full font-bold hover:bg-white text-xs cursor-pointer">+</button>
                </div>

                <button 
                  onClick={() => {
                    addToCart({ 
                      productId: product._id, 
                      title: product.title, 
                      price: product.price, 
                      image: activeImageSrc, // Uses the active image layout variant URL
                      category: product.category, 
                      quantity: quantity 
                    });
                    alert(`🛍️ Added ${quantity}x elements to cart.`);
                  }}
                  className="w-full flex-1 bg-black text-white py-4 px-6 rounded-full text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Add Package to Cart
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Seller Security Verified
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* REVIEWS INFRASTRUCTURE FEEDBACK SYSTEM WORKS              */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Review Submission Form Box */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" /> Post User Review
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Share your positive or negative product validation.</p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Rating Stars Scale</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="focus:outline-none cursor-pointer transition-transform active:scale-90"
                    >
                      <Star className={`w-5 h-5 ${star <= userRating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Experience Feedback Comment</label>
                <textarea
                  rows={3}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder="Tell us what you think about this product variant asset..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-semibold outline-none focus:border-slate-300 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-black hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:bg-slate-200"
              >
                {submittingReview ? "Logging Node..." : "Publish Review"}
              </button>
            </form>
          </div>

          {/* Reviews Stream Index Tracker Feed List */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Community Reviews Log ({product.reviews?.length || 0})</h3>
              <p className="text-xs text-slate-400 mt-0.5">Live aggregated user statements straight from database entries.</p>
            </div>

            {!product.reviews || product.reviews.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-12 text-center text-xs font-semibold text-slate-400">
                No active tracking reviews have been posted for this product block yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {product.reviews.map((rev, idx) => (
                  <div key={idx} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center text-slate-500">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-black uppercase tracking-wide block text-slate-800">{rev.username}</span>
                          <span className="text-[9px] text-slate-400 font-bold block">{new Date(rev.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-0.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-mono font-black text-amber-700">{rev.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed pl-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Related pipeline rows */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-slate-200/60">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Related Pipeline Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relProduct) => {
                // Safeguard related items rendering URLs fallback
                const relImg = relProduct.images && relProduct.images[0] ? relProduct.images[0] : (relProduct.image || "/placeholder.jpg");
                return (
                  <div key={relProduct._id} onClick={() => window.location.href = `/product/${relProduct._id}`} className="bg-white rounded-[2rem] border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer">
                    <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-50 mb-3">
                      <img src={relImg} alt={relProduct.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[11px] font-black text-slate-900 uppercase truncate">{relProduct.title}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase">{relProduct.category}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-50 mt-1">
                        <span className="text-xs font-mono font-black text-black">${relProduct.price}</span>
                        <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-colors">→</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
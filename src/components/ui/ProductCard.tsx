"use client";

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  images?: string[]; // 🌟 Array variant support
  image?: string;    // Fallback single string support
  category: string;
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  // 🌟 DEFENSIVE EXTRACTOR: Pehle check karega agar images array hai toh uski pehli image nikalega,
  // nahi toh purani single image string use karega, aur agar kuch na mile toh placeholder chalayega.
  const displayImage = 
    product.images && product.images.length > 0 
      ? product.images[0] 
      : (product.image || "/placeholder.jpg");

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full min-h-[380px]">
      {/* Product Image Wrapper Layout */}
      <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-50 mb-4 relative">
        <img 
          src={displayImage} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
          {product.category}
        </div>
      </div>

      {/* Product Information Vector Matrix */}
      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-black text-slate-900 uppercase truncate">{product.title}</h4>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{product.category}</p>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-slate-50 mt-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Price</span>
            <span className="text-sm font-mono font-black text-black">${product.price}</span>
          </div>
          <div className="w-7 h-7 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-colors text-xs font-bold">
            →
          </div>
        </div>
      </div>
    </div>
  );
}
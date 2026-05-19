"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save } from "lucide-react";

interface ProductForm {
  title: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();

  const [form, setForm] = useState<ProductForm>({
    title: "",
    price: 0,
    category: "",
    stock: 0,
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to load product data");
        const data = await res.json();
        setForm({
          title: data.title || "",
          price: data.price || 0,
          category: data.category || "",
          stock: data.stock || 0,
          description: data.description || ""
        });
      } catch (err) {
        console.error(err);
        alert("❌ Error loading product data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Update rejected by server.");
      
      alert("✅ Product updated successfully!");
      router.push("/catalog");
    } catch (err: any) {
      alert("❌ Update Failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-black" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading Product Data Matrix...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-12 text-slate-900 mt-16">
      <div className="max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => router.push("/catalog")}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight">Modify Inventory Asset</h1>
            <p className="text-[11px] text-slate-400 font-medium">Update prices, titles, and available tracking stock.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Product Title</label>
            <input 
              type="text" 
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold uppercase outline-none focus:border-slate-800 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Price ($)</label>
              <input 
                type="number" 
                required
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-mono font-bold outline-none focus:border-slate-800 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Available Stock Units</label>
              <input 
                type="number" 
                required
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-mono font-bold outline-none focus:border-slate-800 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Category Node</label>
            <input 
              type="text" 
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-semibold uppercase outline-none focus:border-slate-800 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Asset Description</label>
            <textarea 
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-slate-800 transition-all resize-none"
            />
          </div>

          <button 
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <><Save className="w-4 h-4" /> Save Asset Changes</>
            )}
          </button>
        </form>

      </div>
    </main>
  );
}
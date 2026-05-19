"use client";

import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, clearCart } = useCart();
  const { data: session } = useSession();
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Calculation logic
  const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!session) return alert("Please establish identity authentication session token first.");
    if (!address) return alert("Valid endpoint physical routing address requested.");
    
    setIsSubmitting(true);

    const tokenSeed = `${(session.user as any).id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const orderPayload = {
      userId: (session.user as any).id,
      items: cart.map((item: any) => ({
        productId: item.productId,
       sellerId: item.sellerId || "6a0b86e58e8aeaf354f1a823",
  title: item.title,
  price: item.price,
  quantity: item.quantity,
  image: item.image,
  category: item.category,
})),
      totalAmount: total,
      shippingFee: 10,
      paymentMethod: "cod",
      customerEmail: (session.user as any).email || "user@example.com",
      customerPhone: "N/A",
      address: address,
      idempotencyKey: tokenSeed 
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      if (res.ok) {
        alert("Transaction locked and fulfilled safely!");
        clearCart();
        router.push("/orders");
      } else {
        const data = await res.json();
        alert(data.error || "Transaction pipeline rejected request allocation.");
      }
    } catch (err) {
      alert("Network dropped during synchronization request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 max-w-5xl mx-auto px-4 pb-20">
      <h1 className="text-2xl font-black tracking-tight mb-8">Allocation Manifest</h1>
      
      {cart.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Items Section */}
          <div className="md:col-span-2 space-y-3">
            {cart.map((item: any, index: number) => (
              <div key={`${item.productId}-${index}`} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">${item.price} x {item.quantity}</p>
                </div>
                <span className="font-black text-sm">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Checkout Section */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 h-fit space-y-4 shadow-sm">
            <h3 className="font-black text-base tracking-tight">Financial Calculations</h3>
            <div className="flex justify-between font-black text-sm border-b pb-3">
              <span>Balance due:</span>
              <span>${total}</span>
            </div>
            
            <input 
              type="text" 
              placeholder="Physical Destination Node..." 
              className="w-full p-3 bg-slate-50 rounded-xl outline-none text-xs font-semibold border border-slate-100" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
            />
            
            <button 
              onClick={handleCheckout} 
              disabled={isSubmitting} 
              className="w-full bg-black text-white py-4 rounded-full font-black text-xs tracking-widest uppercase transition-all hover:bg-slate-800 disabled:bg-slate-300 cursor-pointer shadow-md"
            >
              {isSubmitting ? "Processing Transaction..." : "Lock Operations & Order"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">State arrays vacant.</p>
        </div>
      )}
    </main>
  );
}
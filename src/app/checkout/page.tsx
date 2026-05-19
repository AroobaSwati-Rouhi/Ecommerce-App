"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Trash2, ShoppingBag, ShieldCheck, ArrowRight, Loader2, Mail, Phone, MapPin, CreditCard, Wallet, ReceiptText } from "lucide-react";

export default function CheckoutPage() {
  const { cart, removeFromCart, cartTotal, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod" or "stripe"
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // 🌟 LOGISTICS & SHIPPING FEE CONFIGURATION MATRIX
  const shippingFee = 10; 
  const finalTotalAmount = cartTotal + shippingFee;

  // Stripe Dummy Card State Management
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");


  const handlePlaceOrder = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!session?.user) return alert("Please log in to place an order.");
  if (cart.length === 0) return alert("Your cart is empty.");

  setLoading(true);

  const orderPayload = {
    userId: (session.user as any).id,
    items: cart.map((item: any) => ({
      productId: item.productId,
      sellerId: item.sellerId || item.vendorId, 
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: item.category,
    })),
    totalAmount: finalTotalAmount,
    shippingFee,
    customerEmail: email.toLowerCase().trim(),
    customerPhone: phone.trim(),
    address: address.trim(),
    paymentMethod,
    idempotencyKey: `idmp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to place order.");

    alert("🎉 Order placed successfully!");
    clearCart();
    router.push("/orders"); 
  } catch (err: any) {
    alert("❌ Error: " + err.message);
  } finally {
    setLoading(false);
  }
};

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm max-w-sm w-full text-center space-y-4">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider text-slate-900">Your Cart is Empty</h1>
            <p className="text-xs text-slate-400 mt-1">No pending assets are staged for checkout routing pipelines.</p>
          </div>
          <button 
            onClick={() => window.location.href = "/shop"}
            className="w-full bg-black text-white py-3.5 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-slate-800 transition-all cursor-pointer"
          >
            Browse Global Catalog
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-12 text-slate-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        
        {/* Left Side: Staged Cart Items & Contact Information Forms */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Section 1: Cart Items Review */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">Review Staged Items</h1>
              <p className="text-xs text-slate-400 mt-1">Verify asset specifications across different registered vendors.</p>
            </div>

            <div className="divide-y divide-slate-100">
              {/* ✅ INDEX ADDED IN MAP PARAMS FOR UNIQUE KEY COMBINATION */}
              {cart.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase line-clamp-1">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.category}</p>
                      <p className="text-xs font-bold text-slate-500 mt-1">
                        ${item.price} <span className="text-slate-300 font-medium">x {item.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Remove Item Node"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Professional Contact Form Logistics Fields */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Customer Shipping Coordinates</h2>
              <p className="text-xs text-slate-400 mt-0.5">Please fill your valid dispatch contact logs below.</p>
            </div>

            <div className="space-y-4">
              {/* Email Token Input */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 px-1">Email Token Address</label>
                <div className="bg-slate-50 rounded-xl border border-slate-100 focus-within:border-black transition-all flex items-center px-4 gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input type="email" placeholder="name@domain.com" className="w-full py-3.5 bg-transparent outline-none text-xs font-semibold text-slate-800" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>

              {/* Phone Input Field */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 px-1">Contact Phone Number</label>
                <div className="bg-slate-50 rounded-xl border border-slate-100 focus-within:border-black transition-all flex items-center px-4 gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <input type="tel" placeholder="+92 300 1234567" className="w-full py-3.5 bg-transparent outline-none text-xs font-semibold text-slate-800" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
              </div>

              {/* Destination Coordinates */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 px-1">Physical Delivery Address</label>
                <div className="bg-slate-50 rounded-xl border border-slate-100 focus-within:border-black transition-all flex items-start px-4 pt-3.5 gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <textarea rows={3} placeholder="House/Apartment No, Street Name, City, Country..." className="w-full bg-transparent outline-none text-xs font-semibold text-slate-800 resize-none pb-2" value={address} onChange={e => setAddress(e.target.value)} required />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Infrastructure Modules & Financial Ledger */}
        <div className="lg:col-span-2 space-y-6 sticky top-28">
          
          {/* Payment Architecture Component */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400px-1">Payment Infrastructure</h2>
            <div className="grid grid-cols-1 gap-2.5">
              
              {/* Cash On Delivery Option Trigger */}
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 rounded-2xl border flex items-center gap-4 text-left transition-all ${
                  paymentMethod === "cod" ? "border-black bg-black text-white shadow-md" : "border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-300"
                }`}
              >
                <Wallet className="w-4 h-4" />
                <div>
                  <p className="text-xs font-black uppercase tracking-wide">Cash On Delivery</p>
                  <p className={`text-[10px] ${paymentMethod === "cod" ? "text-slate-300" : "text-slate-400"} font-medium`}>Pay securely at your doorstep.</p>
                </div>
              </button>

              {/* Stripe Credit Card Trigger Node */}
              <button
                type="button"
                onClick={() => setPaymentMethod("stripe")}
                className={`p-4 rounded-2xl border flex items-center gap-4 text-left transition-all ${
                  paymentMethod === "stripe" ? "border-black bg-black text-white shadow-md" : "border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-300"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <div>
                  <p className="text-xs font-black uppercase tracking-wide">Stripe Smart Card Gateway</p>
                  <p className={`text-[10px] ${paymentMethod === "stripe" ? "text-slate-300" : "text-slate-400"} font-medium`}>Generates tokenized digital receipt.</p>
                </div>
              </button>

            </div>

            {/* EMBEDDED STRIPE INPUT CONSOLE CONTEXT PANEL */}
            {paymentMethod === "stripe" && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 mt-3 text-slate-900 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  <ReceiptText className="w-3.5 h-3.5 text-black" /> Stripe Dummy Console Terminal
                </div>
                <div>
                  <input 
                    type="text" 
                    maxLength={16}
                    placeholder="4242 4242 4242 4242 (Stripe Test Card)" 
                    className="w-full p-3 bg-white rounded-xl outline-none text-xs font-mono font-bold border border-slate-200 focus:border-black transition-all"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    maxLength={5}
                    placeholder="MM/YY" 
                    className="w-full p-3 bg-white rounded-xl outline-none text-xs font-mono font-bold border border-slate-200 focus:border-black transition-all text-center"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    required
                  />
                  <input 
                    type="password" 
                    maxLength={3}
                    placeholder="CVC" 
                    className="w-full p-3 bg-white rounded-xl outline-none text-xs font-mono font-bold border border-slate-200 focus:border-black transition-all text-center"
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pricing Pipeline Breakdown Panel */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">Order Dispatch Summary</h2>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Subtotal Value</span>
                <span>${cartTotal}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Logistics / Shipping Fee</span>
                <span className="text-slate-900 font-bold">${shippingFee}</span>
              </div>
              <hr className="border-slate-200/60 my-1" />
              <div className="flex justify-between text-sm font-black text-slate-900">
                <span>Total Pool</span>
                <span>${finalTotalAmount}</span>
              </div>
            </div>

            {/* Final Submission Endpoint Form */}
            <form onSubmit={handlePlaceOrder} className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black hover:bg-slate-900 text-white py-4 rounded-full text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 disabled:bg-slate-200 transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> DISPATCHING PIPELINE...</>
                ) : (
                  <>CONFIRM & PLACE ORDER <ArrowRight className="w-4 h-4 stroke-3" /></>
                )}
              </button>
            </form>

            <div className="flex items-center gap-2 justify-center text-[10px] text-slate-400 font-bold uppercase tracking-wider pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Secured Encryption Active
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
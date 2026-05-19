"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Wallet, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: "cod" | "stripe";
  address: string;
  createdAt: string;
}

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await fetch("/api/user/orders");
        if (!res.ok) throw new Error("Failed to pull account logs");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Tracking buffer error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  // Timeline Tracker Steps Visualizer Logic
  const getStepStatus = (currentStatus: string, step: string) => {
    if (currentStatus === "Cancelled") return "bg-rose-100 text-rose-600 border-rose-200";
    
    const stepsOrder = ["Pending", "Shipped", "Delivered"];
    const currentIndex = stepsOrder.indexOf(currentStatus);
    const stepIndex = stepsOrder.indexOf(step);

    if (currentIndex >= stepIndex) {
      return "bg-black text-white border-black"; // Active milestone completed
    }
    return "bg-slate-50 text-slate-300 border-slate-200"; // Staged but not reached yet
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-black" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading Tracking Ledger...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-12 text-slate-900 mt-16">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Console */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase">My Delivery Logs</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time dynamic shipping pipelines status and receipts.</p>
          </div>
          <ShoppingBag className="w-5 h-5 text-slate-400" />
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-[2.5rem] border border-slate-100 shadow-sm max-w-sm mx-auto space-y-4">
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider">No Orders Logged</h3>
              <p className="text-xs text-slate-400 mt-1">You haven't initiated any payment routing tokens yet.</p>
            </div>
            <button 
              onClick={() => window.location.href = "/shop"}
              className="w-full bg-black text-white py-3 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-slate-800 transition-all cursor-pointer"
            >
              Shop Catalog Now
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                
                {/* Header Row Information */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50 pb-4">
                  <div className="grid grid-cols-2 sm:flex items-center gap-4 sm:gap-8">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Order Node ID</span>
                      <span className="text-xs font-mono font-bold text-slate-700">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Staged Date</span>
                      <span className="text-xs font-bold text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Pool</span>
                      <span className="text-xs font-black text-black">${order.totalAmount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 self-start sm:self-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    {order.paymentMethod === "stripe" ? <><CreditCard className="w-3.5 h-3.5 text-purple-600" /> Stripe Paid</> : <><Wallet className="w-3.5 h-3.5 text-amber-600" /> COD</>}
                  </div>
                </div>

                {/* 🌟 PIPELINE LOGISTICS VISUAL TIMELINE TRACKER MAP */}
                {order.status === "Cancelled" ? (
                  <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center text-xs font-bold text-rose-700 uppercase tracking-wider">
                    ❌ This order pipeline has been terminated / cancelled by the warehouse manager.
                  </div>
                ) : (
                  <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6">
                    <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-2">
                      
                      {/* Step 1: Pending / Confirmed */}
                      <div className="flex items-center gap-3 z-10">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${getStepStatus(order.status, "Pending")}`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider">Confirmed</p>
                          <p className="text-[10px] text-slate-400 font-medium">Order locked in database</p>
                        </div>
                      </div>

                      {/* Step 2: Shipped */}
                      <div className="flex items-center gap-3 z-10">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${getStepStatus(order.status, "Shipped")}`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider">In Transit</p>
                          <p className="text-[10px] text-slate-400 font-medium">Shipped via logistics hub</p>
                        </div>
                      </div>

                      {/* Step 3: Delivered */}
                      <div className="flex items-center gap-3 z-10">
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${getStepStatus(order.status, "Delivered")}`}>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider">Delivered</p>
                          <p className="text-[10px] text-slate-400 font-medium">Arrived at target address</p>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* Staged Package Items Mini List Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="md:col-span-2 space-y-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Package Content</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 border border-slate-100 p-2 rounded-xl">
                        <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg bg-slate-50" />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 uppercase truncate">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">{item.category} <span className="text-slate-200">|</span> ${item.price} x {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Destination Coordinates */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Shipping Coordinates</span>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex gap-2.5 text-xs text-slate-600 font-medium leading-relaxed">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                      <span>{order.address}</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
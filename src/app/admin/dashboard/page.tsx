"use client";

import { useEffect, useState } from "react";
import { Loader2, Package, Truck, CheckCircle, XCircle, Mail, Phone, MapPin, CreditCard, Wallet, RefreshCw } from "lucide-react";

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
  customerEmail: string;
  customerPhone: string;
  stripeTransactionId?: string;
  createdAt: string;
}

export default function SellerDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch only orders belonging to current logged-in seller products catalog
  const fetchSellerOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load pipeline index");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Dashboard pull error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  // 🌟 DYNAMIC TRACKING STATE LIFECYCLE CONTROLLER
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Tracking state rejection.");
      
      // Update local matrix state seamlessly
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus as any } : o));
      alert(`🚀 Order milestone state safely shifted to: ${newStatus}`);
    } catch (err: any) {
      alert("❌ Operational Error: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-50 text-amber-700 border-amber-100";
      case "Shipped": return "bg-blue-50 text-blue-700 border-blue-100";
      case "Delivered": return "bg-emerald-50 text-emerald-700 border-emerald-100";
      default: return "bg-rose-50 text-rose-700 border-rose-100";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-black" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Syncing Seller Console Database...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-12 text-slate-900 mt-16">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Infrastructure Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase">Seller Order Console</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Manage cross-vendor logistics, tracking milestones and financial payouts.</p>
          </div>
          <button 
            onClick={fetchSellerOrders}
            className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Live Sync
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-[2.5rem] border border-slate-100 shadow-sm max-w-md mx-auto space-y-3">
            <Package className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-xs font-black uppercase tracking-wider">No Active Orders</h3>
            <p className="text-xs text-slate-400">Your products haven't been staged in any consumer checkout pipelines yet.</p>
          </div>
        ) : (
          /* Main Bento Grid List Grid Layout */
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative overflow-hidden">
                
                {/* Segment A: Order Tracking Header & Items Data Block */}
                <div className="space-y-4 lg:border-r lg:border-slate-100 lg:pr-8">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-50 pb-3">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Order ID</span>
                      <span className="text-xs font-mono font-bold text-slate-700">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </div>
                  </div>

                  {/* Staged Items Loop */}
                  <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                        <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-100" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[11px] font-black text-slate-900 uppercase truncate">{item.title}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{item.category} <span className="text-slate-300">|</span> Qty: {item.quantity}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-600">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Segment B: Customer Shipping & Contact Metrics */}
                <div className="space-y-4 lg:border-r lg:border-slate-100 lg:px-4">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Customer Coordinates</h3>
                    <div className="space-y-2.5 text-xs font-semibold text-slate-700">
                      <div className="flex items-center gap-2.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{order.customerEmail}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{order.customerPhone}</span>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-500 leading-normal text-[11px] font-medium">{order.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Segment C: Financial Breakdown & Operational Milestones Actions */}
                <div className="space-y-5 lg:pl-4 flex flex-col justify-between h-full">
                  {/* Financial calculation rows */}
                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <span>Gateway Method:</span>
                      <span className="flex items-center gap-1 font-bold text-slate-800">
                        {order.paymentMethod === "stripe" ? (
                          <><CreditCard className="w-3 h-3 text-purple-600" /> Stripe Paid</>
                        ) : (
                          <><Wallet className="w-3 h-3 text-amber-600" /> Cash On Delivery</>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs font-black text-slate-900 border-t border-slate-200/60 pt-2 mt-1">
                      <span>Total Payout:</span>
                      <span>${order.totalAmount}</span>
                    </div>
                  </div>

                  {/* 🚀 ACTION TRIGGER DROPDOWN BOX */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-0.5">Shift Logistics Milestone</label>
                    <div className="relative">
                      <select
                        disabled={updatingId === order._id}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="w-full bg-black text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest outline-none transition-all disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer border border-transparent focus:border-slate-800"
                      >
                        <option value="Pending" className="bg-white text-black font-bold">⏳ Stage As Pending</option>
                        <option value="Shipped" className="bg-white text-black font-bold">🚚 Dispatch & Ship Order</option>
                        <option value="Delivered" className="bg-white text-black font-bold">✅ Mark As Delivered</option>
                        <option value="Cancelled" className="bg-white text-black font-bold">❌ Cancel Order Pipeline</option>
                      </select>
                      {updatingId === order._id && (
                        <div className="absolute right-3 top-3.5">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                        </div>
                      )}
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
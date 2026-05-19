"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, Truck, Package } from "lucide-react";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const res = await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, newStatus }),
    });

    if (res.ok) {
      alert(`Order marked as ${newStatus}`);
      window.location.reload(); 
    } else {
      alert("Failed to update status.");
    }
  };

  if (loading) {
    return (
      <main className="p-12 flex justify-center min-h-screen items-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </main>
    );
  }

  return (
    <main className="p-8 max-w-5xl mx-auto bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-black mb-8">Orders Console</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center text-slate-400">
          No orders found.
        </div>
      ) : (
        orders.map((order: any) => (
          <div key={order._id} className="bg-white border border-slate-100 p-6 rounded-3xl mb-6 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</p>
                <p className="text-xs font-bold font-mono text-slate-900">{order._id}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                order.status === "Confirmed" ? "bg-blue-100 text-blue-700" :
                order.status === "Shipped" ? "bg-purple-100 text-purple-700" :
                "bg-green-100 text-green-700"
              }`}>
                {order.status}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  {/* Image hata di gayi hai */}
                  <div>
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-[11px] font-medium text-slate-600 mb-6">
              <p><span className="font-black">Email:</span> {order.customerEmail}</p>
              <p><span className="font-black">Address:</span> {order.address}</p>
            </div>

            <div className="flex gap-2">
              {order.status === "Pending" && (
                <button onClick={() => updateStatus(order._id, "Confirmed")} className="flex-1 bg-black text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-slate-800">
                  <CheckCircle size={14} /> Confirm Order
                </button>
              )}
              {order.status === "Confirmed" && (
                <button onClick={() => updateStatus(order._id, "Shipped")} className="flex-1 bg-purple-600 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-purple-700">
                  <Truck size={14} /> Mark as Shipped
                </button>
              )}
              {order.status === "Shipped" && (
                <button onClick={() => updateStatus(order._id, "Delivered")} className="flex-1 bg-green-600 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-green-700">
                  <Package size={14} /> Mark as Delivered
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </main>
  );
}
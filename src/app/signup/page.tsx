"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Store, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"customer" | "admin">("customer"); // Default role selection
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const signupPayload = {
      name,
      email: email.toLowerCase().trim(),
      password,
      role, // Instantly injects "customer" or "admin" based on user choice
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration pipeline blocked.");
      }

      alert(`🎉 Account created successfully as a ${role === "admin" ? "Seller" : "Buyer"}!`);
      router.push("/login"); // Securely redirect to unified login checkpoint
    } catch (err: any) {
      alert("❌ Sign-Up Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50 text-slate-900 py-12">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm w-full max-w-md">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Create Account</h1>
          <p className="text-xs text-slate-400 mt-1">Join our decentralized multi-vendor marketplace engine.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* 🌟 USER INTENT ROLE SELECTION MATRIX */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2 text-center">
              What do you want to do?
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Buyer Card Button */}
              <button
                type="button"
                onClick={() => setRole("customer")}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all group ${
                  role === "customer"
                    ? "border-black bg-black text-white shadow-sm"
                    : "border-slate-100 bg-slate-50 text-slate-400 hover:text-black hover:border-slate-300"
                }`}
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                <span className="text-xs font-black uppercase tracking-wide">Buy Products</span>
              </button>

              {/* Seller Card Button */}
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all group ${
                  role === "admin"
                    ? "border-black bg-black text-white shadow-sm"
                    : "border-slate-100 bg-slate-50 text-slate-400 hover:text-black hover:border-slate-300"
                }`}
              >
                <Store className="w-5 h-5 stroke-[2.5]" />
                <span className="text-xs font-black uppercase tracking-wide">Sell Products</span>
              </button>

            </div>
          </div>

          <hr className="border-slate-100 my-2" />

          {/* Standard Form Inputs */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">Full Name</label>
            <input type="text" placeholder="e.g., Laiba Khan" className="w-full p-3.5 bg-slate-50 rounded-xl outline-none text-xs font-semibold border border-slate-100 focus:border-black transition-all" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">Email Token</label>
            <input type="email" placeholder="name@domain.com" className="w-full p-3.5 bg-slate-50 rounded-xl outline-none text-xs font-semibold border border-slate-100 focus:border-black transition-all" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-1">Security Passphrase</label>
            <input type="password" placeholder="Min. 6 encrypted characters" className="w-full p-3.5 bg-slate-50 rounded-xl outline-none text-xs font-semibold border border-slate-100 focus:border-black transition-all" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-black text-white py-4 rounded-full text-xs font-bold tracking-widest uppercase mt-2 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                SECURE REGISTERING...
              </>
            ) : (
              `REGISTER AS ${role === "admin" ? "SELLER" : "BUYER"}`
            )}
          </button>

          <p className="text-center text-[11px] font-semibold text-slate-400 pt-2">
            Already have an identity token?{" "}
            <Link href="/login" className="text-black font-bold underline underline-offset-2">
              Log In
            </Link>
          </p>

        </form>
      </div>
    </main>
  );
}
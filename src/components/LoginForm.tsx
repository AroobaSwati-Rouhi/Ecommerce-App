"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleIdentityCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.toLowerCase().trim(),
        password: password,
      });

      if (res?.error) {
        alert("Authentication system rejected: " + res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      alert("Pipeline operational breakdown.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm w-full max-w-sm">
        <h1 className="text-xl font-black tracking-tight mb-2 text-center text-slate-900">Welcome Back</h1>
        <p className="text-xs text-slate-400 text-center mb-6">Secure authorization checkpoint for sellers & customers.</p>
        
        <form onSubmit={handleIdentityCallback} className="space-y-3">
          <input 
            type="email" 
            placeholder="Account Email Token" 
            className="w-full p-3.5 bg-slate-50 rounded-xl outline-none text-xs font-semibold border border-slate-100 focus:border-black transition-all" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Security Passphrase" 
            className="w-full p-3.5 bg-slate-50 rounded-xl outline-none text-xs font-semibold border border-slate-100 focus:border-black transition-all" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-black text-white py-4 rounded-full text-xs font-bold tracking-widest uppercase mt-2 disabled:bg-slate-300 transition-all"
          >
            {loading ? "VERIFYING IDENTITY..." : "AUTHORIZE & ENTER"}
          </button>

          <p className="text-center text-[11px] font-semibold text-slate-400 pt-4">
            New to the marketplace?{" "}
            <Link href="/signup" className="text-black font-bold underline underline-offset-2 hover:text-slate-700 transition-colors">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
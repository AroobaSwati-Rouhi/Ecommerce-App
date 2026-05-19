"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation"; // 🚀 Path check karne ke liye import kiya
import { Plus, ShoppingBag, User, LogOut, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext"; 

export default function Navbar() {
  const { data: session } = useSession();
  const { cartCount } = useCart(); 
  const pathname = usePathname(); // 🔍 Isse current active link detect hoga

  // 🔐 DYNAMIC CATALOG ROUTER: Role check karke sahi page ka path decide karega
  const isAdmin = session?.user && (session.user as any).role === "admin";
  const catalogLink = isAdmin ? "/admin/shop" : "/shop";

  return (
    <nav className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 px-4 md:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Link 
          href="/" 
          className="text-lg font-[1000] tracking-wider uppercase text-black drop-shadow-sm flex items-center gap-2 group"
          style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black transform group-hover:rotate-12 transition-transform duration-300"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span>Online Shopping Hub</span>
        </Link>

        {/* 💻 LINKS NAVIGATION BLOCK */}
        <div className="hidden sm:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Link 
            href="/" 
            className={`transition-colors hover:text-black ${pathname === "/" ? "text-black font-black" : ""}`}
          >Home
          </Link>
          
          {/* 🌟 DYNAMIC LINK: Seller ko /admin/shop par aur Customer ko /shop par le kar jayega */}
          <Link 
            href={catalogLink} 
            className={`transition-colors hover:text-black ${pathname === catalogLink ? "text-black font-black underline underline-offset-4" : ""}`}
          >Catalog
          </Link>

          <div className="flex gap-4">
        <Link href="/orders" className="text-xs font-bold">My Orders</Link> 
      </div>

          {isAdmin && (
            <Link 
              href="/seller/orders" 
              className={`transition-colors hover:text-black ${pathname === "/admin/dashboard" ? "text-black font-black underline underline-offset-4" : ""}`}
            >Orders Console</Link> 
          )}
         
        </div>
        <div className="flex items-center gap-3">
          
          <Link 
            href="/checkout" 
            className="p-2 text-slate-400 hover:text-black relative hover:bg-slate-50 rounded-xl transition-all"
            title="Open Checkout Framework"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse scale-90">
                {cartCount}
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link 
              href="/admin/add-product" 
              className="inline-flex items-center gap-1.5 bg-black text-white px-4 py-2 rounded-full text-[11px] font-bold tracking-wide uppercase hover:bg-slate-800 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-3" />
              Add Asset
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                {isAdmin ? "Seller" : "Customer"}
              </span>
              <button 
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Log Out Profile"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="p-2 text-slate-400 hover:text-black hover:bg-slate-50 rounded-xl transition-all flex items-center gap-1"
            >
              <User className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline px-1">Login</span>
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
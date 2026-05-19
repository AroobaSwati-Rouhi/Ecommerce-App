"use client";

import Link from "next/link";
import { ShieldCheck, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black text-white mt-24 px-4 md:px-12 py-16 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Column 1: Brand & Identity Matrix */}
        <div className="space-y-4">
          {/* 🌟 UPDATED: Brand heading using custom bold Comic Sans look */}
          <h3 
            className="text-base font-[1000] tracking-wider uppercase text-white"
            style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}
          >
            Online Shopping Hub <span className="text-zinc-500 font-medium text-[9px] font-sans">v1.0</span>
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed font-medium">
            A premium decentralized bento grid multi-vendor e-commerce marketplace engine. Built for ultimate scaling and elite design.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-black uppercase tracking-wider bg-emerald-950/50 border border-emerald-900/60 px-3 py-1.5 rounded-full w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure Node Active
          </div>
        </div>

        {/* Column 2: Quick Catalog Navigation */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-200">
            CORE CATALOG
          </h4>
          <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <li>
              <Link href="/shop" className="hover:text-white transition-colors flex items-center gap-1 group">
                All Assets <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
              </Link>
            </li>
            <li><Link href="/shop?category=clothing" className="hover:text-white transition-colors">Clothing</Link></li>
            <li><Link href="/shop?category=cosmetic" className="hover:text-white transition-colors">Cosmetics</Link></li>
            <li><Link href="/shop?category=crochry" className="hover:text-white transition-colors">Crockery</Link></li>
          </ul>
        </div>

        {/* Column 3: Operational Control Links */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-200">
            ACCOUNT CENTER
          </h4>
          <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <li><Link href="/login" className="hover:text-white transition-colors">Gateway Login</Link></li>
            <li><Link href="/signup" className="hover:text-white transition-colors">Register Token</Link></li>
            <li><Link href="/checkout" className="hover:text-white transition-colors">Staged Cart</Link></li>
            <li><Link href="/admin/dashboard" className="hover:text-white transition-colors">Seller Console</Link></li>
          </ul>
        </div>

        {/* Column 4: Infrastructure Logistics / Contact Info */}
        <div className="space-y-4">
          <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-200">
            HUB SUPPORT
          </h4>
          <ul className="space-y-3.5 text-xs font-bold text-zinc-300">
            <li className="flex items-center gap-2.5 group cursor-pointer">
              <Mail className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
              <span className="truncate hover:text-white transition-colors">support@marketplace.com</span>
            </li>
            <li className="flex items-center gap-2.5 group cursor-pointer">
              <Phone className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors shrink-0" />
              <span className="hover:text-white transition-colors">+92 300 1234567</span>
            </li>
            <li className="flex items-start gap-2.5 text-zinc-400 font-medium">
              <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
              <span className="leading-relaxed text-[11px]">Sector I-8, Embedded Tech Center, Islamabad, PK.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Legal Ledger Boundary */}
      {/* 🌟 UPDATED: Legal line reflecting the new custom hub naming */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
        <div style={{ fontFamily: "'Comic Sans MS', 'Comic Sans', cursive" }}>
          &copy; {currentYear} ONLINE SHOPPING HUB. TERMINAL SYSTEMS RESERVED.
        </div>
        <div className="flex gap-6 font-sans">
          <span className="cursor-pointer hover:text-white transition-colors">Privacy Logs</span>
          <span className="cursor-pointer hover:text-white transition-colors">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
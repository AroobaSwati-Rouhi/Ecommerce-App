import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/ui/Navbar";
import NextAuthProvider from "@/components/Provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Minimalist Multi-Vendor Marketplace",
  description: "Bento-style decentralized grid architecture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider >
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </NextAuthProvider >
      </body>
    </html>
  );
}
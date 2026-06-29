import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";
import Navbar from "../components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "SEAPEDIA — Marketplace Hasil Laut",
  description: "Marketplace terpercaya untuk produk hasil laut dan kelautan Indonesia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#DBEAFE] selection:text-[#0369A1]">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";
import Navbar from "../components/Navbar";
import MainWrapper from "../components/MainWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "SEAPEDIA — Marketplace Terpercaya Indonesia",
  description: "Temukan jutaan produk terbaik dari penjual terverifikasi di seluruh Indonesia. Belanja aman, mudah, dan terpercaya hanya di SEAPEDIA.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans" style={{ background: '#F5F5F5', color: '#111827' }}>
        <AuthProvider>
          <Navbar />
          <MainWrapper>
            {children}
          </MainWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

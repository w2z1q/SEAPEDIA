'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { usePathname } from 'next/navigation';
import { translateRole } from '../lib/utils';
import { LogOut, ShoppingBag, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout, switchRole } = useAuth();
  const pathname = usePathname();
  const [switching, setSwitching] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
    return null;
  }

  const handleRoleSwitch = async (role) => {
    setSwitching(true);
    await switchRole(role);
    setSwitching(false);
    if (role === 'SELLER') window.location.href = '/seller/dashboard';
    else if (role === 'DRIVER') window.location.href = '/driver/dashboard';
    else if (role === 'ADMIN') window.location.href = '/admin/dashboard';
    else window.location.href = '/buyer/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E2E8F0] h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <img 
            src="/logo.png" 
            onError={(e) => { e.target.onerror = null; e.target.src = '/hasil-laut.jpeg'; }} 
            alt="Seapedia Logo" 
            className="w-9 h-9 rounded-lg object-cover border border-[#E2E8F0] group-hover:opacity-90 transition-opacity shadow-sm" 
          />
          <span className="text-lg font-semibold tracking-tight text-[#0F172A]">
            SEAPEDIA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {(!user || user.activeRole === 'BUYER') && (
            <>
              <NavLink href="/" active={pathname === '/'}>Katalog</NavLink>
              {user && (
                <>
                  <NavLink href="/buyer/dashboard" active={pathname === '/buyer/dashboard'}>Dashboard</NavLink>
                  <NavLink href="/cart" active={pathname === '/cart'}>Keranjang</NavLink>
                  <NavLink href="/orders" active={pathname === '/orders'}>Pesanan</NavLink>
                  <NavLink href="/wallet" active={pathname === '/wallet'}>Dompet</NavLink>
                </>
              )}
            </>
          )}

          {user?.activeRole === 'SELLER' && (
            <>
              <NavLink href="/seller/dashboard" active={pathname === '/seller/dashboard'}>Dashboard</NavLink>
              <NavLink href="/seller/products" active={pathname === '/seller/products'}>Produk</NavLink>
              <NavLink href="/seller/orders" active={pathname === '/seller/orders'}>Pesanan</NavLink>
            </>
          )}

          {user?.activeRole === 'DRIVER' && (
            <>
              <NavLink href="/driver/dashboard" active={pathname === '/driver/dashboard'}>Dashboard</NavLink>
              <NavLink href="/driver/jobs" active={pathname === '/driver/jobs'}>Lowongan Antar</NavLink>
            </>
          )}

          {user?.activeRole === 'ADMIN' && (
            <NavLink href="/admin/dashboard" active={pathname === '/admin/dashboard'}>Dashboard</NavLink>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Role selector */}
              <div className="hidden sm:flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg py-1.5 px-3">
                {user.roles && user.roles.length > 1 ? (
                  <select
                    value={user.activeRole || 'BUYER'}
                    onChange={(e) => handleRoleSwitch(e.target.value)}
                    disabled={switching}
                    className="bg-[#0369A1] text-white text-xs font-medium rounded-md py-1 px-2.5 border-none focus:ring-2 focus:ring-[#0369A1]/40 outline-none cursor-pointer disabled:opacity-50"
                  >
                    {user.roles.map((r) => (
                      <option key={r} value={r}>
                        {r === 'BUYER' ? user.name || 'Pembeli' : translateRole(r)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="bg-[#0369A1] text-white text-xs font-medium rounded-md py-1 px-2.5">
                    {(user.activeRole || user.role || 'BUYER') === 'BUYER'
                      ? user.name || 'Pembeli'
                      : translateRole(user.activeRole || user.role)}
                  </span>
                )}
              </div>

              {/* Logout */}
              <button
                onClick={logout}
                className="flex items-center gap-2 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] font-medium py-2 px-3.5 rounded-lg text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Keluar</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="font-medium text-sm text-[#0369A1] hover:bg-[#EFF6FF] border border-[#E2E8F0] px-4 py-2 rounded-lg transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="font-medium text-sm bg-[#0369A1] text-white hover:bg-[#075985] px-4 py-2 rounded-lg transition-colors"
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#475569] hover:bg-[#F8FAFC] rounded-lg transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#E2E8F0] px-4 py-3 space-y-1">
          {(!user || user.activeRole === 'BUYER') && (
            <>
              <MobileLink href="/" onClick={() => setMobileOpen(false)}>Katalog</MobileLink>
              {user && (
                <>
                  <MobileLink href="/buyer/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
                  <MobileLink href="/cart" onClick={() => setMobileOpen(false)}>Keranjang</MobileLink>
                  <MobileLink href="/orders" onClick={() => setMobileOpen(false)}>Pesanan</MobileLink>
                  <MobileLink href="/wallet" onClick={() => setMobileOpen(false)}>Dompet</MobileLink>
                </>
              )}
            </>
          )}
          {user?.activeRole === 'SELLER' && (
            <>
              <MobileLink href="/seller/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
              <MobileLink href="/seller/products" onClick={() => setMobileOpen(false)}>Produk</MobileLink>
              <MobileLink href="/seller/orders" onClick={() => setMobileOpen(false)}>Pesanan</MobileLink>
            </>
          )}
          {user?.activeRole === 'DRIVER' && (
            <>
              <MobileLink href="/driver/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
              <MobileLink href="/driver/jobs" onClick={() => setMobileOpen(false)}>Lowongan Antar</MobileLink>
            </>
          )}
          {user?.activeRole === 'ADMIN' && (
            <MobileLink href="/admin/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</MobileLink>
          )}
        </div>
      )}
    </header>
  );
}

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`text-sm px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'font-semibold text-[#0369A1] bg-[#EFF6FF]'
          : 'font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-sm font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] px-3 py-2.5 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}

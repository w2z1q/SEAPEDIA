'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { translateRole } from '../lib/utils';
import {
  ShoppingCart,
  Search,
  X,
  LayoutDashboard,
  Wallet,
  PackageCheck,
  LogOut,
  ChevronDown,
  User,
  Home,
  Menu,
  MapPin,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, switchRole } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile search on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchOpen && searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
    return null;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleRoleSwitch = async (role) => {
    setSwitching(true);
    await switchRole(role);
    setSwitching(false);
    setDropdownOpen(false);
    if (role === 'SELLER') window.location.href = '/seller/dashboard';
    else if (role === 'DRIVER') window.location.href = '/driver/dashboard';
    else if (role === 'ADMIN') window.location.href = '/admin/dashboard';
    else window.location.href = '/buyer/dashboard';
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const activeRole = user?.activeRole || user?.role || 'BUYER';
  const isBuyer = activeRole === 'BUYER';
  const isDashboardRole = pathname?.startsWith('/seller') || pathname?.startsWith('/driver') || pathname?.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm" style={{ borderBottom: '1px solid #FECACA' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">

        {/* ── Logo ── */}
        {!isBuyer ? (
          <div className="shrink-0 flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight" style={{ color: '#DC2626', letterSpacing: '-0.5px' }}>SEA</span>
            <span className="text-xl font-bold tracking-tight text-gray-900" style={{ letterSpacing: '-0.5px' }}>PEDIA</span>
          </div>
        ) : (
          <Link href="/" className="shrink-0 flex items-center gap-1 group" aria-label="SEAPEDIA beranda">
            <span className="text-xl font-bold tracking-tight" style={{ color: '#DC2626', letterSpacing: '-0.5px' }}>SEA</span>
            <span className="text-xl font-bold tracking-tight text-gray-900" style={{ letterSpacing: '-0.5px' }}>PEDIA</span>
          </Link>
        )}

        {/* ── Search Bar (desktop) ── */}
        {!isDashboardRole && (
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 mx-4 relative"
          >
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full rounded-full border bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                style={{
                  borderColor: '#E5E7EB',
                  '--tw-ring-color': '#FCA5A5',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#DC2626';
                  e.target.style.background = '#fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.background = '#F9FAFB';
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ml-2 px-5 py-2 rounded-full text-sm font-semibold text-white transition-colors shrink-0"
              style={{ background: '#DC2626' }}
              onMouseEnter={(e) => (e.target.style.background = '#B91C1C')}
              onMouseLeave={(e) => (e.target.style.background = '#DC2626')}
            >
              Cari
            </button>
          </form>
        )}

        {/* ── Right Actions ── */}
        <div className="ml-auto flex items-center gap-2 shrink-0">

          {/* Mobile: Search toggle */}
          {!isDashboardRole && (
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              aria-label="Cari"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {user ? (
            <>
              {/* Cart icon (buyer only) */}
              {isBuyer && (
                <Link
                  href="/cart"
                  className="relative p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  aria-label="Keranjang belanja"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Link>
              )}

              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 group"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm transition-opacity group-hover:opacity-90"
                    style={{ background: '#DC2626' }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown Panel */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-slide-down"
                  >
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-red-50">
                      <p className="font-semibold text-sm text-gray-900 truncate">{user.name}</p>
                      <p className="text-xs mt-0.5 font-medium" style={{ color: '#DC2626' }}>
                        {translateRole(activeRole)}
                      </p>
                    </div>

                    {/* Role switcher (if multi-role) */}
                    {user.roles && user.roles.length > 1 && (
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400 mb-1.5 font-medium">Ganti Peran</p>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((r) => (
                            <button
                              key={r}
                              onClick={() => handleRoleSwitch(r)}
                              disabled={switching || r === activeRole}
                              className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors disabled:opacity-60"
                              style={
                                r === activeRole
                                  ? { background: '#DC2626', color: '#fff' }
                                  : { background: '#F3F4F6', color: '#374151' }
                              }
                            >
                              {translateRole(r)}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Menu items */}
                    <div className="py-1">
                      <DropdownItem
                        icon={<LayoutDashboard className="w-4 h-4" />}
                        href={
                          activeRole === 'SELLER'
                            ? '/seller/dashboard'
                            : activeRole === 'DRIVER'
                            ? '/driver/dashboard'
                            : activeRole === 'ADMIN'
                            ? '/admin/dashboard'
                            : '/buyer/dashboard'
                        }
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </DropdownItem>

                      {isBuyer && (
                        <>
                          <DropdownItem
                            icon={<Wallet className="w-4 h-4" />}
                            href="/wallet"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Dompet
                          </DropdownItem>
                          <DropdownItem
                            icon={<MapPin className="w-4 h-4" />}
                            href="/addresses"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Alamat Pengiriman
                          </DropdownItem>
                          <DropdownItem
                            icon={<PackageCheck className="w-4 h-4" />}
                            href="/orders"
                            onClick={() => setDropdownOpen(false)}
                          >
                            Pesanan
                          </DropdownItem>
                        </>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-semibold px-4 py-2 rounded-full border transition-colors"
                style={{ borderColor: '#DC2626', color: '#DC2626' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FEF2F2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold px-4 py-2 rounded-full text-white transition-colors"
                style={{ background: '#DC2626' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#B91C1C')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#DC2626')}
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar (expand on toggle) */}
      {searchOpen && !isDashboardRole && (
        <div className="md:hidden px-4 pb-3 pt-1 bg-white border-t border-gray-100" ref={searchRef}>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:outline-none"
                style={{ borderColor: '#DC2626' }}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-full text-sm font-semibold text-white shrink-0"
              style={{ background: '#DC2626' }}
            >
              Cari
            </button>
          </form>
        </div>
      )}


    </header>
  );
}

function DropdownItem({ icon, href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors font-medium"
    >
      <span className="text-gray-400 group-hover:text-red-500">{icon}</span>
      {children}
    </Link>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Briefcase, 
  Users,
  ChevronRight
} from 'lucide-react';

export default function SidebarLayout({ role, children }) {
  const pathname = usePathname();

  let links = [];
  if (role === 'SELLER') {
    links = [
      { name: 'Dashboard', href: '/seller/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { name: 'Manajemen Produk', href: '/seller/products', icon: <Package className="w-5 h-5" /> },
      { name: 'Pesanan Toko', href: '/seller/orders', icon: <ShoppingBag className="w-5 h-5" /> },
    ];
  } else if (role === 'DRIVER') {
    links = [
      { name: 'Dashboard', href: '/driver/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { name: 'Cari Pekerjaan', href: '/driver/jobs', icon: <Briefcase className="w-5 h-5" /> },
    ];
  } else if (role === 'ADMIN') {
    links = [
      { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    ];
  }

  // Active link check
  const isActive = (href) => {
    if (href === `/${role.toLowerCase()}/dashboard` && pathname === href) return true;
    if (href !== `/${role.toLowerCase()}/dashboard` && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-65px)] w-full bg-[#F5F5F5]">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white border-r border-[#E2E8F0] sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto">
        <div className="p-5 border-b border-[#E2E8F0]">
          <h2 className="font-bold text-gray-800 text-sm tracking-wide uppercase">
            Menu {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}
          </h2>
        </div>
        <nav className="flex flex-col p-3 gap-1 flex-1">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                  active 
                    ? 'bg-red-50 text-red-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`${active ? 'text-red-500' : 'text-gray-400'}`}>
                  {link.icon}
                </span>
                {link.name}
                {active && <ChevronRight className="w-4 h-4 ml-auto text-red-400" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Top Tabs - Mobile */}
      <div className="md:hidden w-full bg-white border-b border-[#E2E8F0] overflow-hidden sticky top-[65px] z-10">
        <nav className="flex overflow-x-auto hide-scrollbar">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                  active 
                    ? 'border-red-500 text-red-600 bg-red-50/50' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={`${active ? 'text-red-500' : 'text-gray-400'}`}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 p-4 md:p-8">
        <div className="mx-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
}

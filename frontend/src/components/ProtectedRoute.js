'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { translateRole } from '../lib/utils';
import Link from 'next/link';
import Button from './Button';
import { Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, switchRole } = useAuth();
  const [switching, setSwitching] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0369A1]" />
        <span className="text-sm text-[#475569]">Memeriksa akses...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-10 text-center shadow-sm max-w-md mx-auto my-12 space-y-5">
        <div className="w-14 h-14 bg-[#F8FAFC] rounded-xl flex items-center justify-center mx-auto border border-[#E2E8F0]">
          <Lock className="w-6 h-6 text-[#475569]" />
        </div>
        <h2 className="text-xl font-semibold text-[#0F172A]">Halaman Terbatas</h2>
        <p className="text-sm text-[#475569]">Silakan masuk ke akun Anda untuk mengakses halaman ini.</p>
        <Link href="/login" className="inline-block">
          <Button variant="primary">Masuk</Button>
        </Link>
      </div>
    );
  }

  const currentRole = user.activeRole || 'BUYER';
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    const targetRole = allowedRoles[0];

    const handleQuickSwitch = async () => {
      setSwitching(true);
      await switchRole(targetRole);
      setSwitching(false);
      window.location.reload();
    };

    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-10 text-center shadow-sm max-w-md mx-auto my-12 space-y-5">
        <div className="w-14 h-14 bg-[#F8FAFC] rounded-xl flex items-center justify-center mx-auto border border-[#E2E8F0]">
          <AlertCircle className="w-6 h-6 text-[#475569]" />
        </div>
        <h2 className="text-xl font-semibold text-[#0F172A]">Akses Khusus {translateRole(targetRole)}</h2>
        <p className="text-sm text-[#475569]">
          Anda sedang aktif sebagai <span className="font-semibold text-[#0F172A]">{translateRole(currentRole)}</span>. Halaman ini hanya untuk <span className="font-semibold text-[#0F172A]">{translateRole(targetRole)}</span>.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#E2E8F0]">
          <Link href="/">
            <Button variant="secondary">Kembali</Button>
          </Link>
          <Button variant="primary" isLoading={switching} onClick={handleQuickSwitch}>
            Beralih ke {translateRole(targetRole)}
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import { useAuth } from '../../../lib/AuthContext';
import Link from 'next/link';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const resData = response.data?.data || response.data;
      const token = resData?.accessToken || resData?.token;
      if (resData && token) {
        login(token, resData.user);
        const role = resData.user?.activeRole || resData.user?.role || 'BUYER';
        if (role === 'SELLER') router.push('/seller/dashboard');
        else if (role === 'DRIVER') router.push('/driver/jobs');
        else if (role === 'ADMIN') router.push('/admin/dashboard');
        else router.push('/');
      } else {
        setError('Gagal mendapatkan token sesi dari server.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 w-full">
      <div className="w-full max-w-sm bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-sm space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
            Masuk ke SEAPEDIA
          </h1>
          <p className="text-sm text-[#475569]">Masukkan email dan password Anda</p>
        </div>

        {error && (
          <div className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] p-3.5 text-sm text-[#991B1B] flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="nama@email.com"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Masukkan password"
          />

          <Button
            variant="primary"
            type="submit"
            isLoading={loading}
            className="w-full py-2.5"
          >
            Masuk
          </Button>
        </form>

        <div className="text-center text-sm text-[#475569] border-t border-[#E2E8F0] pt-5">
          Belum punya akun?{' '}
          <Link href="/register" className="font-medium text-[#0369A1] hover:underline">
            Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}

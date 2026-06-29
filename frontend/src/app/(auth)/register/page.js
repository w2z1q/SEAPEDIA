'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/axios';
import { useAuth } from '../../../lib/AuthContext';
import Link from 'next/link';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import { AlertTriangle } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
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
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data && response.data.success) {
        try {
          const loginRes = await api.post('/auth/login', { email, password });
          const resData = loginRes.data?.data || loginRes.data;
          const token = resData?.accessToken || resData?.token;
          if (resData && token) {
            login(token, resData.user);
            router.push('/');
            return;
          }
        } catch (loginErr) {
          // Jika login otomatis gagal, arahkan ke halaman login
        }
        alert('Pendaftaran berhasil! Silakan masuk dengan akun Anda.');
        router.push('/login');
      } else {
        setError('Pendaftaran gagal. Periksa kembali data Anda.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal. Periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 w-full">
      <div className="w-full max-w-sm bg-white border border-[#E2E8F0] rounded-xl p-7 shadow-sm space-y-6">
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">
            Daftar di SEAPEDIA
          </h1>
          <p className="text-sm text-[#475569]">Buat akun baru untuk mulai bertransaksi</p>
        </div>

        {error && (
          <div className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] p-3.5 text-sm text-[#991B1B] flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Nama Anda"
          />

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
            placeholder="Buat password"
          />

          <Button
            variant="primary"
            type="submit"
            isLoading={loading}
            className="w-full py-2.5"
          >
            Daftar
          </Button>
        </form>

        <div className="text-center text-sm text-[#475569] border-t border-[#E2E8F0] pt-5">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-[#0369A1] hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}

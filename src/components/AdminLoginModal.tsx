import React, { useState } from 'react';
import { X, Lock, User, Eye, EyeOff, KeyRound } from 'lucide-react';
import { NarLogo } from './NarLogo';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: () => void;
}

export const ADMIN_STORAGE_KEY = 'nar_optik_admin_session';
export const ADMIN_CUSTOM_PASS_KEY = 'nar_optik_admin_custom_password';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validUsername = username.trim().toLowerCase();
    const storedCustomPass = localStorage.getItem(ADMIN_CUSTOM_PASS_KEY);
    const expectedPassword = storedCustomPass || 'naroptik_ömer16';

    const isValidUser =
      validUsername === 'naroptiklens@gmail.com' ||
      validUsername === 'naroptiklens' ||
      validUsername === 'admin' ||
      validUsername === 'omer.yoldas' ||
      validUsername === 'naroptik';

    const isPassMatch =
      password === expectedPassword ||
      (expectedPassword === 'naroptik_ömer16' && (password === 'naroptik_omer16' || password === 'naroptik16'));

    if (isValidUser && isPassMatch) {
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      } catch {
        // fallback
      }
      onSuccessLogin();
      onClose();
    } else {
      setError('E-posta / Kullanıcı adı veya şifre hatalı. Lütfen kontrol ediniz.');
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#141414] border-2 border-[#c1121f] rounded-3xl shadow-2xl text-white overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#c1121f] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NarLogo size={36} showText={false} />
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-90 block">
                Yetkili Girişi
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-none">
                Yönetici Paneli Girişi
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center pb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-amber-400 mb-2">
              <KeyRound className="w-6 h-6" />
            </div>
            <p className="text-xs text-stone-300">
              Kategori, alt kategori, ürün ve kampanya fiyatlarını yönetmek için giriş yapınız.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-xs text-red-200 text-center">
              {error}
            </div>
          )}

          {/* Username / Email Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
              E-posta / Kullanıcı Adı
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="E-posta veya kullanıcı adı"
                className="w-full bg-[#1e1e1e] border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#c1121f] transition-colors"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-300 uppercase tracking-wider block">
              Şifre
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1e1e1e] border border-white/15 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#c1121f] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#c1121f] hover:bg-[#a50e1a] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all tracking-wide uppercase mt-2 cursor-pointer"
          >
            Yönetici Paneline Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

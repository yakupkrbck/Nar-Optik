import React, { useState } from 'react';
import { CatalogCategory, CATALOG_CATEGORIES } from '../data/storeCatalogData';
import { X, MessageCircle, Phone, Lock, ShieldCheck, LogOut, Settings, MapPin, FileText, Download } from 'lucide-react';
import { NarLogo } from './NarLogo';

export const NAR_OPTIK_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Nar+Optik,+Z%C3%BCbeyde+Han%C4%B1m+Cd.+No:12/A,+K%C3%BCk%C3%BCrtl%C3%BC,+Osmangazi,+Bursa';

interface HamburgerMenuProps {
  activeCategory: string;
  onSelectCategory: (catId: string) => void;
  categories?: CatalogCategory[];
  isAdmin?: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
  onLogoutAdmin?: () => void;
  hideFloatingButtons?: boolean;
  onOpenLegalNotice?: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  activeCategory,
  onSelectCategory,
  categories = CATALOG_CATEGORIES,
  isAdmin = false,
  onOpenAdminLogin,
  onOpenAdminDashboard,
  onLogoutAdmin,
  hideFloatingButtons = false,
  onOpenLegalNotice,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadingType, setDownloadingType] = useState<string | null>(null);

  const triggerDownload = async (url: string, filename: string, typeName: string) => {
    try {
      setDownloadingType(typeName);
      const res = await fetch(url);
      if (!res.ok) throw new Error('İndirme başarısız');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
    } catch (err) {
      console.error('İndirme hatası:', err);
      window.location.href = url;
    } finally {
      setDownloadingType(null);
    }
  };

  const toggle = () => setIsOpen((prev) => !prev);

  const handleItemClick = (catId: string) => {
    onSelectCategory(catId);
    setIsOpen(false);

    // Smooth scroll to element if present
    const el = document.getElementById(catId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* SOLDA EN ÜSTTE SABİT HAMBURGER MENÜ BUTONU */}
      {!hideFloatingButtons && !isOpen && (
        <div
          className={`fixed ${
            isAdmin ? 'top-12' : 'top-3.5'
          } left-3.5 z-[90] animate-in fade-in duration-200`}
        >
          <button
            id="hbg-btn"
            onClick={toggle}
            aria-label="Menüyü Aç"
            className="bg-black/85 hover:bg-black border border-white/20 hover:border-red-500/50 p-2.5 rounded-xl flex items-center justify-center cursor-pointer shadow-xl transition-all active:scale-95 backdrop-blur-md group"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <span className="block w-full h-[2px] bg-white group-hover:bg-[#c1121f] rounded-full transition-colors"></span>
              <span className="block w-3/4 h-[2px] bg-white group-hover:bg-[#c1121f] rounded-full transition-colors"></span>
              <span className="block w-full h-[2px] bg-white group-hover:bg-[#c1121f] rounded-full transition-colors"></span>
            </div>
          </button>
        </div>
      )}

      {/* HAMBURGER OVERLAY */}
      {isOpen && (
        <div
          onClick={toggle}
          className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* HAMBURGER MENÜ (UYUMLU & KURUMSAL KIRMIZI/SİYAH TASARIM) */}
      <div
        className={`fixed top-0 left-0 w-full max-w-sm sm:max-w-md h-full z-[9999] bg-[#121212] border-r border-white/10 shadow-2xl flex flex-col justify-between py-5 transition-transform duration-300 ease-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <NarLogo size={42} showText={false} />
              <div>
                <div className="text-xl font-black text-white tracking-tight leading-none">
                  Nar Optik
                </div>
                <div className="text-xs font-semibold text-stone-400 mt-1">
                  Opt. Ömer YOLDAŞ
                </div>
                {/* Tıklanabilir Haritalar Nar Optik Konumu */}
                <a
                  href={NAR_OPTIK_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-stone-400 hover:text-amber-300 flex items-center gap-1 transition-colors mt-1 group"
                  title="Google Haritalar'da Nar Optik Mağazasını Aç"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#c1121f] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="underline decoration-dotted underline-offset-2">
                    Kükürtlü, Zübeyde Hanım Cd. No:12/A, Osmangazi / BURSA
                  </span>
                </a>
              </div>
            </div>
            <button
              onClick={toggle}
              className="text-stone-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menü Maddeleri */}
          <nav className="mt-3 flex flex-col">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleItemClick(cat.id)}
                  className={`flex items-center gap-3 px-6 py-3 text-left text-sm font-semibold border-b border-white/5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#c1121f]/20 text-white font-bold border-l-4 border-[#c1121f]'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{cat.emoji}</span>
                  <div className="flex-1 flex items-center justify-between">
                    <span>{cat.label}</span>
                    {cat.isCustom && (
                      <span className="text-[9px] font-bold uppercase text-stone-400 bg-white/10 px-1.5 py-0.5 rounded">
                        Özel
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Contact & Admin Actions */}
        <div className="px-6 pt-4 border-t border-white/10 space-y-2.5">
          {/* Reçete Gönder (WhatsApp) Butonu */}
          <a
            href="https://wa.me/905321305080?text=Merhaba%20Nar%20Optik,%20g%C3%B6zl%C3%BCk%20/%20lens%20re%C3%A7etemi%20payla%C5%9Fmak%20ve%20fiyat/bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <FileText className="w-4 h-4" />
            <span>Reçete Gönder (0532 130 50 80)</span>
          </a>

          {/* Phone Call */}
          <a
            href="tel:02242340099"
            className="w-full py-2 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-stone-400" />
            <span>Sabit Hat (0224 234 00 99)</span>
          </a>

          {/* Yasal Bilgilendirme & KVKK Linki */}
          {onOpenLegalNotice && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenLegalNotice();
              }}
              className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/5"
            >
              <FileText className="w-3.5 h-3.5 text-stone-400" />
              <span>Yasal Bilgilendirme & KVKK</span>
            </button>
          )}

          {/* 💾 TÜM DOSYALARI ZIP İNDİR BUTONLARI */}
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              disabled={downloadingType !== null}
              onClick={() => triggerDownload('/nar-optik-tam-proje.zip', 'nar-optik-tam-proje.zip', 'full')}
              className="w-full py-2 px-3 bg-blue-950/90 hover:bg-blue-900 border border-blue-500/60 text-blue-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md disabled:opacity-50"
            >
              <Download className={`w-3.5 h-3.5 text-blue-400 ${downloadingType === 'full' ? 'animate-bounce' : ''}`} />
              <span>
                {downloadingType === 'full' ? 'İndiriliyor (18.6 MB)...' : '📦 Tam Projeyi İndir (.ZIP - 18.6 MB)'}
              </span>
            </button>

            <button
              type="button"
              disabled={downloadingType !== null}
              onClick={() => triggerDownload('/nar-optik-kodlar.zip', 'nar-optik-kodlar.zip', 'code')}
              className="w-full py-1.5 px-3 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-3 h-3 text-emerald-400 ${downloadingType === 'code' ? 'animate-bounce' : ''}`} />
              <span>
                {downloadingType === 'code' ? 'İndiriliyor (122 KB)...' : '⚡ Sadece Kodlar (.ZIP - 122 KB)'}
              </span>
            </button>
          </div>

          {/* 🔐 YÖNETİCİ PANELİ BUTONU */}
          <div className="pt-2 border-t border-white/10">
            {!isAdmin ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdminLogin();
                }}
                className="w-full py-2 px-3 bg-stone-900 hover:bg-stone-800 border border-red-500/30 hover:border-red-500 text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#c1121f]" />
                <span>🔐 Yönetici Girişi (Yetkili Paneli)</span>
              </button>
            ) : (
              <div className="space-y-1.5 bg-red-950/40 border border-red-500/50 p-2.5 rounded-2xl">
                <div className="flex items-center justify-between text-[11px] text-stone-300 px-1">
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Yönetici: Opt. Ömer Yoldaş</span>
                  </span>
                  {onLogoutAdmin && (
                    <button
                      onClick={() => {
                        onLogoutAdmin();
                        setIsOpen(false);
                      }}
                      className="text-stone-400 hover:text-white flex items-center gap-0.5 text-[10px] cursor-pointer"
                      title="Çıkış Yap"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Çıkış</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAdminDashboard();
                  }}
                  className="w-full py-2 bg-[#c1121f] hover:bg-red-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Yönetici Panelini Aç</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

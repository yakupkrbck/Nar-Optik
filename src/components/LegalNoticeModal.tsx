import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, FileText, Lock, Mail, MapPin } from 'lucide-react';
import { NarLogo } from './NarLogo';
import { LegalNoticeConfig, DEFAULT_LEGAL_CONFIG } from '../firebase';

const STORAGE_KEY = 'nar_optik_legal_ack';

export interface LegalNoticeModalProps {
  onVisibilityChange?: (isOpen: boolean) => void;
  config?: LegalNoticeConfig;
  isOpenControlled?: boolean;
  onCloseControlled?: () => void;
}

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({
  onVisibilityChange,
  config = DEFAULT_LEGAL_CONFIG,
  isOpenControlled,
  onCloseControlled,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  const activeConfig = {
    ...DEFAULT_LEGAL_CONFIG,
    ...config,
  };

  const isModalOpen = isOpenControlled !== undefined ? isOpenControlled : internalOpen;

  useEffect(() => {
    if (isOpenControlled === undefined) {
      try {
        const acknowledged = localStorage.getItem(STORAGE_KEY);
        if (acknowledged !== 'true') {
          setInternalOpen(true);
          onVisibilityChange?.(true);
        } else {
          onVisibilityChange?.(false);
        }
      } catch {
        setInternalOpen(true);
        onVisibilityChange?.(true);
      }
    }
  }, [isOpenControlled, onVisibilityChange]);

  useEffect(() => {
    if (isModalOpen) {
      onVisibilityChange?.(true);
      const timer = setTimeout(() => {
        confirmBtnRef.current?.focus();
      }, 100);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      onVisibilityChange?.(false);
    }
  }, [isModalOpen, onVisibilityChange]);

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Ignore if localStorage fails
    }
    if (onCloseControlled) {
      onCloseControlled();
    } else {
      setInternalOpen(false);
    }
    onVisibilityChange?.(false);
  };

  if (!isModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-notice-title"
      className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-[#ffffff] text-stone-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border-2 border-[#c1121f]">
        
        {/* Header */}
        <div className="bg-[#c1121f] text-white px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <NarLogo size={34} showText={false} />
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-90 block">
                Yasal Bilgilendirme
              </span>
              <h2
                id="legal-notice-title"
                className="text-base sm:text-lg font-black tracking-tight leading-none"
              >
                {activeConfig.companyTitle || 'Nar Optik'} | KVKK & Aydınlatma
              </h2>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Bilgilendirmeyi Kapat"
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/35 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3.5 text-xs sm:text-[13px] leading-relaxed text-stone-700">
          
          {/* Optisyenlik ve Tanıtım Mevzuatı */}
          <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-[#c1121f] shrink-0" />
              <span>{activeConfig.regulationTitle || 'Optisyenlik ve Tanıtım Mevzuatı'}</span>
            </div>
            <p className="text-stone-600 text-xs leading-relaxed whitespace-pre-line">
              {activeConfig.regulationText}
            </p>
          </div>

          {/* KVKK Aydınlatması */}
          <div className="bg-stone-50 border border-stone-200/80 p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
              <FileText className="w-4 h-4 text-[#c1121f] shrink-0" />
              <span>{activeConfig.kvkkTitle || 'Kişisel Verilerin Korunması (KVKK)'}</span>
            </div>
            <p className="text-stone-600 text-xs leading-relaxed whitespace-pre-line">
              {activeConfig.kvkkText}
            </p>

            <div className="pt-2.5 border-t border-stone-200/80 text-[11px] text-stone-600 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#c1121f] shrink-0" />
                <span>{activeConfig.companyAddress || 'Kükürtlü, Osmangazi / BURSA'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-700">
                <Mail className="w-3.5 h-3.5 text-[#c1121f] shrink-0" />
                <a
                  href={`mailto:${activeConfig.contactEmail || 'naroptiklens@gmail.com'}`}
                  className="text-[#c1121f] hover:underline font-semibold"
                >
                  {activeConfig.contactEmail || 'naroptiklens@gmail.com'}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 shrink-0">
          <button
            ref={confirmBtnRef}
            onClick={handleClose}
            className="w-full py-3 px-5 bg-[#c1121f] hover:bg-[#a50e1a] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg transition-all tracking-wide uppercase cursor-pointer"
          >
            Okudum, Devam Et
          </button>
        </div>

      </div>
    </div>
  );
};

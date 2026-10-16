import React from 'react';
import { Camera } from 'lucide-react';

interface HeaderProps {
  onOpenVirtualTryOn: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenVirtualTryOn }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-18">
        
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:text-stone-700 transition-colors"
        >
          Nar Optik Lens
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a
            href="#vitrin"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            2'li Butik Vitrin
          </a>
          <a
            href="#sanal-ayna"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            Sanal Ayna
          </a>
          <a
            href="#ekartman-rehberi"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            Ekartman Rehberi
          </a>
          <a
            href="#butikler"
            className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            Butiklerimiz
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenVirtualTryOn}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-sm whitespace-nowrap shrink-0"
          >
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>Sanal Aynayı Başlat</span>
          </button>
        </div>

      </div>
    </header>
  );
};

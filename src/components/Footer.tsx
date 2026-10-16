import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#18181b] text-stone-300 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-stone-800 pb-8">
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-white">
              Nar Optik Lens
            </div>
            <p className="mt-1 text-xs text-stone-400 max-w-md">
              Zanaatkar işçilik, saf titanyum mühendisliği ve kişiselleştirilmiş sanal ayna deneyimi ile butik optik vitrini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-400">
            <a href="#vitrin" className="hover:text-white transition-colors">
              Model Vitrini
            </a>
            <a href="#sanal-ayna" className="hover:text-white transition-colors">
              Sanal Deneme Aynası
            </a>
            <a href="#ekartman-rehberi" className="hover:text-white transition-colors">
              Ekartman ve Cam Standartları
            </a>
            <a href="#butikler" className="hover:text-white transition-colors">
              Butiklerimiz & Randevu
            </a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} Nar Optik Lens. Tüm hakları saklıdır. Sepetsiz butik vitrin sergisidir.
          </p>
          <p className="text-[11px] text-stone-500">
            Reçeteli numaralı camlar ve kontakt lensler uzman optisyenlerimiz eşliğinde butiklerimizde teslim edilir.
          </p>
        </div>

      </div>
    </footer>
  );
};

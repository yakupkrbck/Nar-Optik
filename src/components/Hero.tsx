import React from 'react';
import { Camera, ArrowRight, Sparkles, Compass, Shield, Eye } from 'lucide-react';
import { EYEWEAR_MODELS } from '../data/eyewearData';

interface HeroProps {
  onOpenVirtualTryOn: () => void;
  onExploreCollection: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenVirtualTryOn,
  onExploreCollection,
}) => {
  const modelA = EYEWEAR_MODELS[0]; // Nar Aero Rimless
  const modelB = EYEWEAR_MODELS[1]; // Nar Amalfi Honey

  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-20 border-b border-stone-200 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Top Headline */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-widest">
            <span>Nar Optik Lens Butik Vitrini</span>
            <span aria-hidden="true">·</span>
            <span>2026/2027 Koleksiyonu</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1] text-balance">
            Optik Zarafet & Mimari Çizgiler.
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Her tasarımın teknik inceliklerini, milimetrik ekartman blueprintlerini ve yüzdeki duruşunu yan yana <strong>ikili vitrin düzeninde</strong> ve <strong>canlı sanal aynada</strong> keşfedin.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={onOpenVirtualTryOn}
              className="flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-2xl transition-all shadow-lg group"
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>Sanal Aynada Modelleri Dene</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={onExploreCollection}
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-2xl transition-colors shadow-xs"
            >
              2'li Vitrini İncele
            </button>
          </div>
        </div>

        {/* 2'Lİ VİTRİN HERO PREVIEW (Dual Featured Showcase Preview) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Card 1: Aero Rimless */}
          <div className="group relative bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-md transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
              <span className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
                {modelA.categoryLabel}
              </span>
              <span className="font-mono text-stone-400">{modelA.code}</span>
            </div>

            <div className="aspect-[16/10] bg-stone-50 rounded-2xl p-6 flex items-center justify-center overflow-hidden mb-6">
              <img
                src={modelA.images.main}
                alt={modelA.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  {modelA.name}
                </h3>
                <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                  {modelA.weight} gram
                </span>
              </div>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {modelA.description}
              </p>
              <div className="pt-3 flex items-center justify-between text-xs font-mono text-stone-500 border-t border-stone-100">
                <span>Ekartman: {modelA.dimensions.lensWidth}口{modelA.dimensions.bridge} {modelA.dimensions.temple}</span>
                <button
                  onClick={onOpenVirtualTryOn}
                  className="font-sans font-bold text-stone-900 hover:text-amber-700 flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Aynada Gör</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Amalfi Honey */}
          <div className="group relative bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-md transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
              <span className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
                {modelB.categoryLabel}
              </span>
              <span className="font-mono text-stone-400">{modelB.code}</span>
            </div>

            <div className="aspect-[16/10] bg-stone-50 rounded-2xl p-6 flex items-center justify-center overflow-hidden mb-6">
              <img
                src={modelB.images.main}
                alt={modelB.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-108"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                  {modelB.name}
                </h3>
                <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-lg">
                  {modelB.weight} gram
                </span>
              </div>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {modelB.description}
              </p>
              <div className="pt-3 flex items-center justify-between text-xs font-mono text-stone-500 border-t border-stone-100">
                <span>Ekartman: {modelB.dimensions.lensWidth}口{modelB.dimensions.bridge} {modelB.dimensions.temple}</span>
                <button
                  onClick={onOpenVirtualTryOn}
                  className="font-sans font-bold text-stone-900 hover:text-amber-700 flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Aynada Gör</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 3 Pillars strip */}
        <div className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-semibold">İkili Vitrin Mimarisi</strong>
              <span>Modelleri sıkışık kartlar yerine geniş, ferah ve yan yana ikili bloklarda inceleme konforu.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Compass className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-semibold">Milimetrik Teknik Doğruluk</strong>
              <span>Cam genişliği, köprü mesafesi ve sap uzunluğu uluslararası optik standartlarında.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Camera className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block font-semibold">Gerçek Zamanlı Sanal Ayna</strong>
              <span>Kameranızla modelleri anında deneyin, açı ve boyutu yüzünüze göre kişiselleştirin.</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

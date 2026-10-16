import React, { useState } from 'react';
import { Camera, Ruler, Info, Scale, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { EyewearModel } from '../types';

interface ModelCardProps {
  model: EyewearModel;
  onOpenDetails: (model: EyewearModel) => void;
  onLaunchTryOn: (model: EyewearModel) => void;
  isCompared?: boolean;
  onToggleCompare?: (model: EyewearModel) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  onOpenDetails,
  onLaunchTryOn,
  isCompared = false,
  onToggleCompare,
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const activeColor = model.colors[selectedColorIdx] || model.colors[0];

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white rounded-3xl border border-stone-200/80 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-stone-400/80"
    >
      {/* Top Bar: Editorial Tag & Compare Pin */}
      <div className="px-6 sm:px-8 pt-6 pb-2 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
            {model.categoryLabel}
          </span>
          <span aria-hidden="true" className="text-stone-300">/</span>
          <span className="text-stone-600 font-medium">{model.shapeLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-stone-400 font-medium tracking-tight">
            {model.code}
          </span>
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(model)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                isCompared
                  ? 'bg-amber-100 text-amber-900 font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
              title="Karşılaştırma Masasına Ekle"
            >
              <Scale className="w-3 h-3" />
              <span className="hidden sm:inline">{isCompared ? 'Karşılaştırılıyor' : 'Kıyasla'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Expansive Image Stage (2'li Vitrin Hero Box) */}
      <div
        onClick={() => onOpenDetails(model)}
        className="relative aspect-[16/11] bg-gradient-to-b from-[#f9f8f5] to-[#f2efe9] mx-4 sm:mx-6 my-2 rounded-2xl flex items-center justify-center p-6 sm:p-10 cursor-pointer overflow-hidden border border-stone-200/50"
      >
        <img
          src={isHovered && model.images.detail ? model.images.detail : model.images.main}
          alt={model.name}
          className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-108"
          referrerPolicy="no-referrer"
        />

        {/* Floating Ekartman Blueprint Pill */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-xs flex items-center gap-1.5 text-xs text-stone-700 font-mono">
          <Ruler className="w-3.5 h-3.5 text-stone-500" />
          <span>{model.dimensions.lensWidth}口{model.dimensions.bridge} {model.dimensions.temple} mm</span>
        </div>

        {/* Weight Callout */}
        <div className="absolute bottom-3 right-3 bg-stone-900/90 text-white backdrop-blur-md px-3 py-1.5 rounded-xl shadow-xs text-xs font-mono font-medium">
          {model.weight}g
        </div>

        {/* Hover Micro Badge */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur px-3 py-1 rounded-lg text-[11px] font-medium text-stone-800 shadow-xs">
          Detaylı İncele
        </div>
      </div>

      {/* Product Details & Actions */}
      <div className="p-6 sm:p-8 pt-3 space-y-5">
        
        {/* Title, Origin & Narrative */}
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3
              onClick={() => onOpenDetails(model)}
              className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight hover:text-stone-700 cursor-pointer transition-colors"
            >
              {model.name}
            </h3>
            <span className="text-xs text-stone-500 font-mono shrink-0">
              {model.origin.split('/')[0]}
            </span>
          </div>

          <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-2">
            {model.description}
          </p>
        </div>

        {/* Color Variations with Swatches */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 font-medium">Mevcut Tonlar:</span>
            <div className="flex items-center gap-1.5">
              {model.colors.map((color, idx) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColorIdx(idx)}
                  title={color.name}
                  className={`w-5 h-5 rounded-full border transition-all ${
                    selectedColorIdx === idx
                      ? 'ring-2 ring-stone-900 scale-115 border-white shadow-xs'
                      : 'border-black/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
          <span className="text-xs text-stone-600 font-medium">
            {activeColor.name}
          </span>
        </div>

        {/* Technical Specification Summary Strip */}
        <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/80 grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Gövde Materyali</span>
            <span className="text-stone-900 font-medium truncate block mt-0.5">
              {model.frameMaterial.split('(')[0]}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Cam Koruması</span>
            <span className="text-stone-900 font-medium truncate block mt-0.5">
              {model.opticalFeatures.polarization ? 'HD Polarize UV400' : 'Antirefle Mavi Işık'}
            </span>
          </div>
        </div>

        {/* Dual Actions (NO Add-to-cart!) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => onOpenDetails(model)}
            className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
          >
            <Info className="w-4 h-4 text-stone-500" />
            <span>Teknik Özellikler</span>
          </button>

          <button
            onClick={() => onLaunchTryOn(model)}
            className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-md group-hover:bg-amber-600"
          >
            <Camera className="w-4 h-4 text-amber-300" />
            <span>Sanal Aynada Dene</span>
          </button>
        </div>

      </div>
    </article>
  );
};

import React from 'react';
import { X, Camera, ArrowRight, Scale, Check, Trash2 } from 'lucide-react';
import { EyewearModel } from '../types';

interface ComparisonDrawerProps {
  compareList: EyewearModel[];
  onRemoveFromCompare: (modelId: string) => void;
  onClearCompare: () => void;
  onOpenDetails: (model: EyewearModel) => void;
  onLaunchTryOn: (model: EyewearModel) => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  compareList,
  onRemoveFromCompare,
  onClearCompare,
  onOpenDetails,
  onLaunchTryOn,
}) => {
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#121215]/95 backdrop-blur-xl border-t border-white/10 text-white shadow-2xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        
        {/* Drawer header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Model Karşılaştırma Masası ({compareList.length}/3 Model)
            </span>
            <span className="text-[11px] text-stone-400 hidden sm:inline">
              · Ölçü, ağırlık ve materyal farklarını yan yana inceleyin
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearCompare}
              className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-white transition-colors px-2 py-1"
            >
              <Trash2 className="w-3 h-3" />
              <span>Temizle</span>
            </button>
          </div>
        </div>

        {/* Side-by-side cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {compareList.map((model) => (
            <div
              key={model.id}
              className="relative bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between space-y-3"
            >
              <button
                onClick={() => onRemoveFromCompare(model.id)}
                className="absolute top-2 right-2 p-1 text-stone-400 hover:text-white bg-black/40 hover:bg-black/80 rounded-md transition-colors"
                title="Listeden Çıkar"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-16 h-12 bg-white/10 rounded-lg p-1 shrink-0 flex items-center justify-center overflow-hidden">
                  <img src={model.images.main} alt={model.name} className="w-full h-full object-contain" />
                </div>
                <div className="pr-6">
                  <div className="text-xs font-bold text-white truncate">{model.name}</div>
                  <div className="text-[11px] font-mono text-amber-300/90">{model.code}</div>
                  <div className="text-[10px] text-stone-400">{model.categoryLabel}</div>
                </div>
              </div>

              {/* Quick Specs Matrix */}
              <div className="grid grid-cols-3 gap-1.5 py-1.5 border-y border-white/10 text-[11px] font-mono text-center">
                <div className="bg-white/5 p-1 rounded">
                  <span className="text-stone-400 block text-[9px]">AĞIRLIK</span>
                  <span className="font-semibold text-white">{model.weight}g</span>
                </div>
                <div className="bg-white/5 p-1 rounded">
                  <span className="text-stone-400 block text-[9px]">EKARTMAN</span>
                  <span className="font-semibold text-white">{model.dimensions.lensWidth}口{model.dimensions.bridge}</span>
                </div>
                <div className="bg-white/5 p-1 rounded">
                  <span className="text-stone-400 block text-[9px]">KORUMA</span>
                  <span className="font-semibold text-white truncate block">
                    {model.opticalFeatures.polarization ? 'Polarize' : 'Antirefle'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onOpenDetails(model)}
                  className="py-1.5 px-2 bg-white/10 hover:bg-white/20 text-stone-200 rounded-lg text-center transition-colors text-[11px]"
                >
                  Detayları Aç
                </button>
                <button
                  onClick={() => onLaunchTryOn(model)}
                  className="py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold rounded-lg text-center transition-colors text-[11px] flex items-center justify-center gap-1"
                >
                  <Camera className="w-3 h-3" />
                  <span>Aynada Gör</span>
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

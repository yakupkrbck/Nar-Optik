import React, { useState, useMemo } from 'react';
import { Search, Filter, RotateCcw, ArrowUpDown, Sparkles, SlidersHorizontal } from 'lucide-react';
import { EyewearModel, EyewearCategory, FrameShape, FrameGender } from '../types';
import { EYEWEAR_MODELS } from '../data/eyewearData';
import { ModelCard } from './ModelCard';

interface VitrinSectionProps {
  onOpenDetails: (model: EyewearModel) => void;
  onLaunchTryOn: (model: EyewearModel) => void;
  compareList: EyewearModel[];
  onToggleCompare: (model: EyewearModel) => void;
}

type SortOption = 'featured' | 'lightest' | 'widest';

export const VitrinSection: React.FC<VitrinSectionProps> = ({
  onOpenDetails,
  onLaunchTryOn,
  compareList,
  onToggleCompare,
}) => {
  const [activeCategory, setActiveCategory] = useState<EyewearCategory>('all');
  const [activeShape, setActiveShape] = useState<FrameShape>('all');
  const [activeGender, setActiveGender] = useState<FrameGender>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Compute category counts
  const categoryCounts = useMemo(() => {
    return {
      all: EYEWEAR_MODELS.length,
      sunglasses: EYEWEAR_MODELS.filter((m) => m.category === 'sunglasses').length,
      optical: EYEWEAR_MODELS.filter((m) => m.category === 'optical').length,
      titanium: EYEWEAR_MODELS.filter((m) => m.category === 'titanium').length,
      bluelight: EYEWEAR_MODELS.filter((m) => m.category === 'bluelight').length,
      limited: EYEWEAR_MODELS.filter((m) => m.category === 'limited').length,
    };
  }, []);

  const filteredModels = useMemo(() => {
    let result = EYEWEAR_MODELS.filter((model) => {
      // Category filter
      if (activeCategory !== 'all' && model.category !== activeCategory) {
        return false;
      }
      // Shape filter
      if (activeShape !== 'all' && model.shape !== activeShape) {
        return false;
      }
      // Gender filter
      if (activeGender !== 'all' && model.gender !== activeGender && model.gender !== 'unisex') {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = model.name.toLowerCase().includes(query);
        const matchesCode = model.code.toLowerCase().includes(query);
        const matchesMaterial = model.frameMaterial.toLowerCase().includes(query);
        const matchesDesc = model.description.toLowerCase().includes(query);
        return matchesName || matchesCode || matchesMaterial || matchesDesc;
      }
      return true;
    });

    // Sorting
    if (sortBy === 'lightest') {
      result.sort((a, b) => a.weight - b.weight);
    } else if (sortBy === 'widest') {
      result.sort((a, b) => b.dimensions.totalWidth - a.dimensions.totalWidth);
    }

    return result;
  }, [activeCategory, activeShape, activeGender, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveShape('all');
    setActiveGender('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const isCompareActive = (id: string) => compareList.some((m) => m.id === id);

  return (
    <section id="vitrin" className="py-20 bg-[#faf9f6] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with 2'li Vitrin Concept */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Nar Optik Lens · 2'li İkili Vitrin Formatı</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
              Özel Çerçeve & Optik Seçkisi
            </h2>
            <p className="mt-2 text-sm text-stone-600 max-w-2xl leading-relaxed">
              Her model, zanaatkar detayları ve milimetrik ekartman ölçüleriyle yan yana geniş ikili vitrin bloklarında sergilenmektedir.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
            <span>Toplam <strong className="text-stone-900 text-sm font-bold">{filteredModels.length}</strong> Model</span>
            <span aria-hidden="true">·</span>
            <span>İkili Vitrin Düzeni</span>
          </div>
        </div>

        {/* Filter Navigation Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200/90 shadow-sm space-y-4 mb-10">
          
          {/* Category Tabs & Search Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all ${
                  activeCategory === 'all'
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Tüm Koleksiyon ({categoryCounts.all})
              </button>

              <button
                onClick={() => setActiveCategory('sunglasses')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all ${
                  activeCategory === 'sunglasses'
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Güneş Gözlükleri ({categoryCounts.sunglasses})
              </button>

              <button
                onClick={() => setActiveCategory('optical')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all ${
                  activeCategory === 'optical'
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Reçeteli Optik ({categoryCounts.optical})
              </button>

              <button
                onClick={() => setActiveCategory('titanium')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all ${
                  activeCategory === 'titanium'
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Beta-Titanyum ({categoryCounts.titanium})
              </button>

              <button
                onClick={() => setActiveCategory('bluelight')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all ${
                  activeCategory === 'bluelight'
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Mavi Işık ({categoryCounts.bluelight})
              </button>

              <button
                onClick={() => setActiveCategory('limited')}
                className={`px-4 py-2.5 text-xs font-semibold rounded-2xl whitespace-nowrap transition-all ${
                  activeCategory === 'limited'
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                Özel Seri ({categoryCounts.limited})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[280px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Model adı, kod veya materyal ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          {/* Secondary Controls: Shape Chips, Gender & Sort */}
          <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs">
            
            {/* Shape selection chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-stone-400 mr-1 text-[11px] font-semibold uppercase tracking-wider">Form:</span>
              {(
                [
                  { id: 'all', label: 'Tümü' },
                  { id: 'rimless', label: 'Çerçevesiz' },
                  { id: 'square', label: 'Köşeli / Kare' },
                  { id: 'round', label: 'Yuvarlak / Panto' },
                  { id: 'aviator', label: 'Aviator' },
                  { id: 'cat-eye', label: 'Cat-Eye' },
                  { id: 'geometric', label: 'Geometrik' },
                ] as const
              ).map((shapeItem) => (
                <button
                  key={shapeItem.id}
                  onClick={() => setActiveShape(shapeItem.id as FrameShape)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    activeShape === shapeItem.id
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {shapeItem.label}
                </button>
              ))}
            </div>

            {/* Gender and Sort options */}
            <div className="flex items-center gap-3">
              <select
                value={activeGender}
                onChange={(e) => setActiveGender(e.target.value as FrameGender)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-700 text-xs focus:outline-none"
              >
                <option value="all">Tüm Cinsiyetler</option>
                <option value="unisex">Unisex</option>
                <option value="kadin">Kadın Koleksiyonu</option>
                <option value="erkek">Erkek Koleksiyonu</option>
              </select>

              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-700 text-xs focus:outline-none"
                >
                  <option value="featured">Öne Çıkanlar</option>
                  <option value="lightest">En Hafif (Gramaj)</option>
                  <option value="widest">Geniş Ekartman</option>
                </select>
              </div>

              {(activeCategory !== 'all' || activeShape !== 'all' || activeGender !== 'all' || searchQuery || sortBy !== 'featured') && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors ml-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sıfırla</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* 2'Lİ VİTRİN DÜZENİ (2 Columns Side-by-Side Grid) */}
        {filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onOpenDetails={onOpenDetails}
                onLaunchTryOn={onLaunchTryOn}
                isCompared={isCompareActive(model.id)}
                onToggleCompare={onToggleCompare}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Aradığınız kriterlere uygun model bulunamadı
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Filtreleri genişleterek veya arama teriminizi değiştirerek tüm modellerimizi görüntüleyebilirsiniz.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-medium hover:bg-stone-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tüm Modelleri Göster</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Ruler, Eye, Sun, Sparkles, Check, HelpCircle, Shield } from 'lucide-react';

export const LensGuideSection: React.FC = () => {
  const [selectedFaceShape, setSelectedFaceShape] = useState<'oval' | 'round' | 'square' | 'heart'>('oval');

  const faceShapes = {
    oval: {
      title: 'Oval Yüz Tipi',
      desc: 'Doğal simetriye ve dengeli oranlara sahiptir. Neredeyse tüm gözlük formları estetik bir uyum sağlar.',
      recommendation: 'Panto, Geometrik, Cat-eye veya Aviator modeller.',
      avoid: 'Yüz genişliğinden aşırı taşan hantal boyutlar haricinde kısıtlama yoktur.',
    },
    round: {
      title: 'Yuvarlak Yüz Tipi',
      desc: 'Geniş elmacık kemikleri ve yumuşak çene hattına sahiptir.',
      recommendation: 'Köşeli, dikdörtgen ve mimari fasetli çerçeveler (Nar Cortina, Nar Riviera) yüzü daha uzun ve dengeli gösterir.',
      avoid: 'Aşırı küçük ve yuvarlak çerçevelerden kaçınılmalıdır.',
    },
    square: {
      title: 'Kare / Köşeli Yüz Tipi',
      desc: 'Güçlü ve belirgin çene kemikleri, geniş alın ve düz hatlar öne çıkar.',
      recommendation: 'Yuvarlak titanyum teller (Nar Kyoto, Nar Luna) ve yumuşak panto hatlar çene hatlarını yumuşatır.',
      avoid: 'Çok kalın ve sert köşeli çerçeveler.',
    },
    heart: {
      title: 'Kalp / Üçgen Yüz Tipi',
      desc: 'Geniş alın ve daralan zarif bir çene yapısı karakteristiktir.',
      recommendation: 'Aşağıya doğru genişleyen hafif aviator modelleri ve ince titanyum çerçeveler.',
      avoid: 'Üst kısmı çok ağır ve kalın hantal kaşlı modeller.',
    },
  };

  return (
    <section id="ekartman-rehberi" className="py-16 bg-[#faf9f6] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Teknik Optik Rehberi
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Ekartman ve Cam Standartları
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600">
            Kusursuz bir gözlük deneyimi, doğru ekartman ölçüsü ve göz sağlığınıza uygun cam teknolojisi ile başlar.
          </p>
        </div>

        {/* 1. Ekartman Explanation Interactive Graphic */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-3 text-stone-900 font-serif text-lg font-bold">
              <Ruler className="w-5 h-5 text-amber-600" />
              <h3>Ekartman Numarası Nasıl Okunur?</h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
              Mevcut gözlüğünüzün sapının iç yüzeyine baktığınızda genellikle <strong>51 口 20 145</strong> gibi üçlü bir kod görürsünüz. Bu değerler milimetre cinsindendir:
            </p>

            {/* Visual Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-2xl font-mono font-bold text-stone-900">
                  51 <span className="text-xs text-stone-500 font-normal">mm</span>
                </div>
                <div className="text-xs font-semibold text-stone-800 mt-1">Cam Genişliği (A)</div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Tek bir camın yatay eksendeki en geniş mesafesidir. Gözbebeğinizin cam merkezine oturmasını sağlar.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-2xl font-mono font-bold text-stone-900">
                  20 <span className="text-xs text-stone-500 font-normal">mm</span>
                </div>
                <div className="text-xs font-semibold text-stone-800 mt-1">Köprü Mesafesi (B)</div>
                <p className="text-[11px] text-stone-500 mt-1">
                  İki cam arasındaki burun sırtı mesafesidir. Gözlüğün burundan kaymaması için kritik parametredir.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="text-2xl font-mono font-bold text-stone-900">
                  145 <span className="text-xs text-stone-500 font-normal">mm</span>
                </div>
                <div className="text-xs font-semibold text-stone-800 mt-1">Sap Uzunluğu (C)</div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Menteşeden başlayıp kulak arkasını kavrayan sapın toplam açılmış boyudur.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Interactive Face Shape Matching */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                Yüz Şeklinize En Uygun Çerçeve Formunu Keşfedin
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Yüz tipinizi seçerek optisyenlerimizin form ve oran tavsiyelerini görüntüleyin
              </p>
            </div>

            {/* Shape Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
              {(['oval', 'round', 'square', 'heart'] as const).map((shape) => (
                <button
                  key={shape}
                  onClick={() => setSelectedFaceShape(shape)}
                  className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all border ${
                    selectedFaceShape === shape
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {faceShapes[shape].title.replace(' Tipi', '')}
                </button>
              ))}
            </div>

            {/* Active Face Shape Information Card */}
            <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-stone-900">
                  {faceShapes[selectedFaceShape].title}
                </span>
                <span className="text-[11px] text-stone-400 font-mono">Optisyen İpuçları</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {faceShapes[selectedFaceShape].desc}
              </p>
              <div className="pt-2 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-emerald-800 block mb-1">
                    ✓ Önerilen Çerçeve Formları:
                  </span>
                  <p className="text-stone-600">{faceShapes[selectedFaceShape].recommendation}</p>
                </div>
                <div>
                  <span className="font-semibold text-stone-600 block mb-1">
                    ! Dikkat Edilmesi Gerekenler:
                  </span>
                  <p className="text-stone-500">{faceShapes[selectedFaceShape].avoid}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Lens Technology Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <Sun className="w-5 h-5 text-amber-600" />
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              CR-39 Polarize UV400
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Yatay su ve yol parlamalarını filtreleyerek doğal renk doğruluğu ve maksimum netlik sunar.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <Eye className="w-5 h-5 text-sky-600" />
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              BlueProtect 420nm
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Monitör ve telefon ekranlarından yayılan yüksek enerjili görünür mavi ışığı engelleyerek göz yorgunluğunu azaltır.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Antirefle & Hidrofobik
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Cam içi yansımaları sıfıra indirir; su, toz ve parmak izi tutmayan kaygan nano yüzey kaplaması içerir.
            </p>
          </div>

          <div className="p-5 bg-white rounded-xl border border-stone-200 space-y-2">
            <Sparkles className="w-5 h-5 text-stone-800" />
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              High-Index İnceltme
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              1.67 ve 1.74 yüksek indeksli organik hammaddeler sayesinde yüksek numaralarda dahi ince ve estetik kenarlar.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

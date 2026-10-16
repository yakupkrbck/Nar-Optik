import React, { useState } from 'react';
import { X, Camera, ShieldCheck, Ruler, Sparkles, MessageCircle, Calendar, Check, ArrowRight, Sun, Glasses, Eye } from 'lucide-react';
import { EyewearModel } from '../types';

interface ProductDetailModalProps {
  model: EyewearModel | null;
  onClose: () => void;
  onLaunchTryOn: (model: EyewearModel) => void;
}

type VisionSimulatorMode = 'normal' | 'polarized' | 'bluelight' | 'photochromic';

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  model,
  onClose,
  onLaunchTryOn,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [visionMode, setVisionMode] = useState<VisionSimulatorMode>('polarized');
  const [showAppointmentSuccess, setShowAppointmentSuccess] = useState<boolean>(false);
  const [appointmentName, setAppointmentName] = useState<string>('');
  const [appointmentPhone, setAppointmentPhone] = useState<string>('');
  const [appointmentBoutique, setAppointmentBoutique] = useState<string>('Nişantaşı Butiği');

  if (!model) return null;

  const galleryImages = [
    model.images.main,
    model.images.detail || '/src/assets/images/hero_optik_campaign_1792075602888.jpg',
  ].filter(Boolean);

  const activeColor = model.colors[selectedColorIndex] || model.colors[0];

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentName.trim()) return;
    setShowAppointmentSuccess(true);
    setTimeout(() => {
      setShowAppointmentSuccess(false);
      setAppointmentName('');
      setAppointmentPhone('');
    }, 4000);
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `Merhaba Nar Optik, ${model.name} (${model.code}) modeli hakkında bilgi almak ve mağaza stok durumunu öğrenmek istiyorum.`
    );
    window.open(`https://wa.me/905321234567?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-5 lg:p-8 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#faf9f6] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200">
        
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <span>{model.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{model.shapeLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-stone-700">{model.code}</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              {model.name}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onLaunchTryOn(model)}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-xl transition-all shadow-sm"
            >
              <Camera className="w-4 h-4 text-amber-300" />
              <span>Sanal Aynada Canlı Dene</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Top Section: Visual Gallery & Primary Technical Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Visual Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[4/3] bg-white rounded-2xl border border-stone-200 overflow-hidden flex items-center justify-center p-6 shadow-sm">
                <img
                  src={galleryImages[activeImageIndex] || galleryImages[0]}
                  alt={model.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-[11px] font-mono text-stone-600 border border-stone-200">
                  {model.origin}
                </div>

                <div className="absolute bottom-4 right-4 bg-stone-900/90 text-white backdrop-blur px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-amber-300" />
                  <span className="font-mono">
                    {model.dimensions.lensWidth}口{model.dimensions.bridge} {model.dimensions.temple}
                  </span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-16 rounded-lg border overflow-hidden transition-all ${
                        activeImageIndex === idx
                          ? 'border-stone-900 ring-2 ring-stone-900'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Açı" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Specs & Actions */}
            <div className="lg:col-span-5 space-y-6">
              
              <div>
                <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-2">
                  Tasarım ve Zanaat Hikayesi
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-3">
                  {model.description}
                </p>
                <p className="text-stone-500 text-xs italic leading-relaxed border-l-2 border-stone-300 pl-3">
                  "{model.designStory}"
                </p>
              </div>

              {/* Color variants */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  Renk Seçenekleri
                </label>
                <div className="flex flex-wrap gap-2">
                  {model.colors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColorIndex(idx)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                        selectedColorIndex === idx
                          ? 'border-stone-900 bg-white font-medium text-stone-900 shadow-sm'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Specification Highlights */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Çerçeve Materyali</span>
                  <span className="font-medium text-stone-800 text-right">{model.frameMaterial}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Cam Teknolojisi</span>
                  <span className="font-medium text-stone-800 text-right">{model.lensType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Menteşe Yapısı</span>
                  <span className="font-medium text-stone-800 text-right">{model.hingeType}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Ağırlık</span>
                  <span className="font-mono font-medium text-stone-800">{model.weight} gram (Ultra Hafif)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Garanti</span>
                  <span className="font-medium text-stone-800">{model.warranty}</span>
                </div>
              </div>

              {/* Inquiry & Appointment CTAs (No shopping cart as requested) */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleWhatsAppInquiry}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp ile Bilgi & Butik Stok Durumu Sor</span>
                </button>
              </div>

            </div>

          </div>

          {/* Section 2: Technical Ekartman Blueprint Diagram */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Ekartman ve Geometrik Ölçü Şeması
                </h3>
                <p className="text-xs text-stone-500">
                  Gözlüğün sapının iç kısmında yer alan uluslararası standart optik ölçüleri ({model.dimensions.lensWidth}口{model.dimensions.bridge} {model.dimensions.temple})
                </p>
              </div>
              <span className="text-xs font-mono bg-stone-100 px-3 py-1.5 rounded-lg text-stone-700">
                Toplam Genişlik: {model.dimensions.totalWidth} mm
              </span>
            </div>

            {/* Visual Technical Diagram Representation */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span className="block text-stone-400 text-[11px] uppercase tracking-wider mb-1 font-mono">
                  [A] Cam Genişliği
                </span>
                <span className="font-mono text-2xl font-bold text-stone-900">
                  {model.dimensions.lensWidth} <span className="text-xs font-normal text-stone-500">mm</span>
                </span>
                <span className="block text-[11px] text-stone-500 mt-1">Tek bir camın yatay ekseni</span>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span className="block text-stone-400 text-[11px] uppercase tracking-wider mb-1 font-mono">
                  [B] Köprü Mesafesi
                </span>
                <span className="font-mono text-2xl font-bold text-stone-900">
                  {model.dimensions.bridge} <span className="text-xs font-normal text-stone-500">mm</span>
                </span>
                <span className="block text-[11px] text-stone-500 mt-1">İki cam arası burun boşluğu</span>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span className="block text-stone-400 text-[11px] uppercase tracking-wider mb-1 font-mono">
                  [C] Sap Uzunluğu
                </span>
                <span className="font-mono text-2xl font-bold text-stone-900">
                  {model.dimensions.temple} <span className="text-xs font-normal text-stone-500">mm</span>
                </span>
                <span className="block text-[11px] text-stone-500 mt-1">Menteşeden kulak arkasına</span>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span className="block text-stone-400 text-[11px] uppercase tracking-wider mb-1 font-mono">
                  [D] Cam Yüksekliği
                </span>
                <span className="font-mono text-2xl font-bold text-stone-900">
                  {model.dimensions.lensHeight} <span className="text-xs font-normal text-stone-500">mm</span>
                </span>
                <span className="block text-[11px] text-stone-500 mt-1">Dikey cam yüksekliği</span>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span className="block text-stone-400 text-[11px] uppercase tracking-wider mb-1 font-mono">
                  Gövde Ağırlığı
                </span>
                <span className="font-mono text-2xl font-bold text-stone-900">
                  {model.weight} <span className="text-xs font-normal text-stone-500">g</span>
                </span>
                <span className="block text-[11px] text-stone-500 mt-1">Camlar hariç ağırlık</span>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Yüz Tipi Uyumu:</strong> Bu model özellikle{' '}
                <strong>{model.faceShapeSuitability.join(', ')}</strong> yüz hatlarına sahip
                kullanıcılarımızda estetik altın oran dengesi sağlamaktadır. Dilerseniz üst kısımdaki{' '}
                <strong>Sanal Ayna</strong> ile kendi yüzünüzde deneyebilirsiniz.
              </span>
            </div>
          </div>

          {/* Section 3: Interactive Lens Optics Simulator ("Camdan Dünyayı Görün") */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-stone-700" />
                  Nar Optik Cam Görüş Simülatörü
                </h3>
                <p className="text-xs text-stone-500">
                  Farklı filtre kaplamalarının yansıma, kontrast ve UV ışığına karşı görsel etkisini simüle edin
                </p>
              </div>

              {/* Mode toggles */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-xl text-xs">
                <button
                  onClick={() => setVisionMode('normal')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    visionMode === 'normal'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Çıplak Göz
                </button>
                <button
                  onClick={() => setVisionMode('polarized')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    visionMode === 'polarized'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Polarize Filtre
                </button>
                <button
                  onClick={() => setVisionMode('bluelight')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    visionMode === 'bluelight'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Mavi Işık Filtresi
                </button>
                <button
                  onClick={() => setVisionMode('photochromic')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    visionMode === 'photochromic'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Fotokromik Geçiş
                </button>
              </div>
            </div>

            {/* Visual Screen with Filter Applied */}
            <div className="relative aspect-[16/7] rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
              {/* Scene background representing bright sunny coastal highway / city landscape */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
                  visionMode === 'polarized'
                    ? 'brightness-90 contrast-125 saturate-110'
                    : visionMode === 'bluelight'
                    ? 'sepia-[0.25] brightness-95'
                    : visionMode === 'photochromic'
                    ? 'brightness-75 contrast-110'
                    : 'brightness-110 contrast-90'
                }`}
                style={{
                  backgroundImage: `url('/src/assets/images/hero_optik_campaign_1792075602888.jpg')`,
                }}
              />

              {/* Blinding glare overlay (disappears in polarized mode!) */}
              {visionMode === 'normal' && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/40 pointer-events-none animate-pulse" />
              )}

              {/* Polarized Lens Rim Silhouette in Center */}
              <div className="relative z-10 p-4 bg-black/60 backdrop-blur-md rounded-2xl text-white max-w-md text-center border border-white/10 mx-4">
                <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
                  {visionMode === 'normal' && 'Filtresiz Standart Görüş (Yansımalı)'}
                  {visionMode === 'polarized' && 'HD Polarize Filtre Aktif'}
                  {visionMode === 'bluelight' && 'Mavi Işık Koruması Aktif (420nm)'}
                  {visionMode === 'photochromic' && 'Fotokromik Güneş Geçişi (Transitions)'}
                </div>
                <p className="text-xs text-white/90 leading-relaxed">
                  {visionMode === 'normal' &&
                    'Güneş ışınları cam ve su yüzeylerinden sekerek parlamaya yol açar, kontrastı düşürür ve gözü çabuk yorar.'}
                  {visionMode === 'polarized' &&
                    'Polarize kristal tabaka yatay parlamaları %99.9 oranında bloke eder. Derin kontrast, canlı renkler ve netlik sağlar.'}
                  {visionMode === 'bluelight' &&
                    'Telefon, tablet ve monitörlerden yayılan zararlı HEV mavi ışığı absorbe ederek göz kuruluğunu ve baş ağrısını önler.'}
                  {visionMode === 'photochromic' &&
                    'UV ışınlarına duyarlı moleküller sayesinde kapalı alanda şeffaf optik cam, dışarı çıkıldığında ise güneş gözlüğüne dönüşür.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Full Specifications Table (Kapsamlı Teknik Künye) */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Kapsamlı Teknik Künye
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Model Adı & Kodu</span>
                <span className="font-semibold text-stone-900">{model.name} ({model.code})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Koleksiyon Kategorisi</span>
                <span className="text-stone-800">{model.categoryLabel}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Çerçeve Malzemesi</span>
                <span className="text-stone-800">{model.frameMaterial}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Menteşe Teknolojisi</span>
                <span className="text-stone-800">{model.hingeType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Cam Tipi & Standardı</span>
                <span className="text-stone-800">{model.lensType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">UV Koruma Seviyesi</span>
                <span className="text-stone-800">{model.opticalFeatures.uvProtection}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Polarizasyon</span>
                <span className="text-stone-800">{model.opticalFeatures.polarization ? 'Var (100% Polarize)' : 'Yok (Numaralı Optik)'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Mavi Işık Koruması</span>
                <span className="text-stone-800">{model.opticalFeatures.blueLightBlock ? 'Var (BlueBlock Kaplamalı)' : 'Standart'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Reçeteli Cam Uyumluluğu</span>
                <span className="text-stone-800">{model.prescriptionReady ? 'Tüm Reçetelere Uyumlu (Tek Odaklı & Progressive)' : 'Sadece Güneş'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Menşei & Atölye</span>
                <span className="text-stone-800">{model.origin}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Garanti & Destek</span>
                <span className="text-stone-800">{model.warranty}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100">
                <span className="text-stone-500 font-medium">Kutu İçeriği</span>
                <span className="text-stone-800">Deri Kılıf, Mikrofiber Temizleme Bezi, Garanti Belgesi</span>
              </div>
            </div>
          </div>

          {/* Section 5: Boutique Trial & Optician Appointment Form (No Cart) */}
          <div className="bg-[#f2efe9] rounded-2xl border border-stone-300/80 p-6">
            <div className="max-w-2xl">
              <h3 className="font-serif text-lg font-bold text-stone-900 mb-1">
                Butiklerimizde Birebir Deneyin & Optisyen Danışmanlığı Alın
              </h3>
              <p className="text-xs text-stone-600 mb-4">
                Nar Optik Lens butiklerimizde bu modeli yüz yapınıza göre ücretsiz ayarlatabilir, reçetenize en uygun cam indeksini uzman optisyenlerimizle belirleyebilirsiniz.
              </p>

              {showAppointmentSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-3">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong>Talebiniz Alındı!</strong> {appointmentBoutique} uzman optisyenimiz{' '}
                    {appointmentName} adına {model.name} modelini rezerve edecek ve en kısa sürede sizinle iletişime geçecektir.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookAppointment} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Adınız Soyadınız"
                    value={appointmentName}
                    onChange={(e) => setAppointmentName(e.target.value)}
                    className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Telefon Numaranız"
                    value={appointmentPhone}
                    onChange={(e) => setAppointmentPhone(e.target.value)}
                    className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                  <select
                    value={appointmentBoutique}
                    onChange={(e) => setAppointmentBoutique(e.target.value)}
                    className="px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  >
                    <option value="Nişantaşı Butiği">Nişantaşı Butiği</option>
                    <option value="Bağdat Caddesi Butiği">Bağdat Caddesi Butiği</option>
                    <option value="Kanyon AVM Butiği">Kanyon AVM Butiği</option>
                  </select>
                  <button
                    type="submit"
                    className="sm:col-span-3 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-amber-300" />
                    <span>Ücretsiz Randevu & Model Ayırma Talebi Gönder</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

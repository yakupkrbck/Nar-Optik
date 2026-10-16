import React from 'react';
import { X, MessageCircle, Sparkles, Phone, Tag, Edit2 } from 'lucide-react';
import { CatalogItem } from '../data/storeCatalogData';

interface ItemDetailModalProps {
  item: CatalogItem | null;
  onClose: () => void;
  isAdmin?: boolean;
  onEditItem?: (item: CatalogItem) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  isAdmin = false,
  onEditItem,
}) => {
  if (!item) return null;

  const productCode = item.code || '-';
  const priceInfo = item.campaignPrice
    ? `[Kampanyalı Fiyat: ${item.campaignPrice}]`
    : item.price
    ? `[Fiyat: ${item.price}]`
    : '';

  const whatsappText = encodeURIComponent(
    `Merhaba Nar Optik, "${item.name}" (Ürün Kodu: ${productCode}) ${priceInfo} hakkında WhatsApp üzerinden detaylı bilgi ve stok durumunu öğrenmek istiyorum. [${item.specs}]`
  );
  const whatsappUrl = `https://wa.me/905321305080?text=${whatsappText}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-5 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#141414] border-2 border-[#c1121f]/70 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xl transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-5">
          
          {/* Circular Stage / Image Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-[#c1121f] overflow-hidden bg-black shrink-0 shadow-2xl flex items-center justify-center p-2">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {item.badge && (
                  <span className="inline-block px-3 py-1 bg-[#c1121f] text-white font-extrabold text-[10px] tracking-wider uppercase rounded-full">
                    {item.badge}
                  </span>
                )}
                {isAdmin && onEditItem && (
                  <button
                    onClick={() => {
                      onClose();
                      onEditItem(item);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-full text-[10px] font-bold hover:bg-amber-500/30 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Yönetici Olarak Düzenle</span>
                  </button>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black uppercase text-white leading-tight">
                {item.name}
              </h2>
              <p className="text-xs text-amber-400 font-semibold">
                {item.subtitle}
              </p>

              {/* High visibility product code & pricing */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                {item.code && (
                  <div className="inline-flex items-center gap-2 bg-stone-900 border border-[#c1121f]/60 px-3 py-1.5 rounded-xl shadow-inner">
                    <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">
                      Ürün Kodu:
                    </span>
                    <span className="text-base font-mono font-black text-[#c1121f]">
                      {item.code}
                    </span>
                  </div>
                )}

                {(item.campaignPrice || item.price) && (
                  <div className="inline-flex items-center gap-2 bg-stone-900 border border-white/10 px-3 py-1.5 rounded-xl">
                    <Tag className="w-3.5 h-3.5 text-amber-400" />
                    {item.campaignPrice ? (
                      <div className="flex items-center gap-1.5">
                        {item.price && (
                          <span className="text-xs line-through text-stone-400">
                            {item.price}
                          </span>
                        )}
                        <span className="text-base font-black text-emerald-400">
                          {item.campaignPrice}
                        </span>
                        <span className="text-[9px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-500/40 uppercase">
                          Kampanyalı
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-white font-mono">
                        {item.price}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs sm:text-sm text-stone-300 leading-relaxed">
            {item.details}
          </div>

          {/* WhatsApp Direct Guidance Notice */}
          <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-2xl p-4 flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-emerald-300">
                Ürün Kodu ile WhatsApp Üzerinden Bilgi Alın
              </p>
              <p className="text-stone-300 text-[11.5px] leading-relaxed">
                Bu web sitesi bilgilendirme vitrinidir (satış yapılmamaktadır). 
                <strong className="text-white"> {productCode} </strong> ürün kodunu belirterek WhatsApp hattımızdan optisyenimize stok durumu, reçeteli cam uyumu ve mağaza randevusu için anında danışabilirsiniz.
              </p>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Teknik Özellikler ve Ölçüler</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* For Eyewear */}
              {item.dimensions && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase">Ekartman Ölçüsü</span>
                  <span className="font-mono font-bold text-white text-sm">{item.dimensions}</span>
                </div>
              )}

              {item.techData?.material && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase">Gövde / Malzeme</span>
                  <span className="font-medium text-white">{item.techData.material}</span>
                </div>
              )}

              {item.techData?.origin && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase">Menşei / Üretim</span>
                  <span className="font-medium text-white">{item.techData.origin}</span>
                </div>
              )}

              {item.techData?.lensType && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase">Cam Tipi / Filtre</span>
                  <span className="font-medium text-white">{item.techData.lensType}</span>
                </div>
              )}

              {/* For Contact Lenses */}
              {item.techData?.baseCurve && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase">Temel Eğri (BC)</span>
                  <span className="font-mono font-bold text-white">{item.techData.baseCurve}</span>
                </div>
              )}

              {item.techData?.diameter && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase">Çap (DIA)</span>
                  <span className="font-mono font-bold text-white">{item.techData.diameter}</span>
                </div>
              )}

              {item.techData?.waterContent && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase">Su İçeriği & Nem</span>
                  <span className="font-medium text-white">{item.techData.waterContent}</span>
                </div>
              )}

              {item.techData?.oxygen && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase">Oksijen Geçirgenliği</span>
                  <span className="font-mono font-bold text-emerald-400">{item.techData.oxygen}</span>
                </div>
              )}

              {item.techData?.replacement && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase">Kullanım / Değişim Periyodu</span>
                  <span className="font-medium text-white">{item.techData.replacement}</span>
                </div>
              )}

              {item.techData?.warranty && (
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase">Garanti & Orijinallik</span>
                  <span className="font-medium text-white">{item.techData.warranty}</span>
                </div>
              )}

              {/* Dynamic Custom Technical Specification Boxes */}
              {item.techData?.customFields &&
                item.techData.customFields
                  .filter((field) => field.label?.trim() && field.value?.trim())
                  .map((field, idx) => (
                    <div
                      key={field.id || idx}
                      className="bg-black/40 p-2.5 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                    >
                      <span className="text-amber-400/90 block text-[10px] uppercase font-semibold">
                        {field.label}
                      </span>
                      <span className="font-medium text-white text-xs">{field.value}</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Action Buttons: WhatsApp & Phone */}
          <div className="space-y-2 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2.5 transition-colors shadow-lg active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 text-white" />
              <span>WhatsApp ile Bu Ürün Kodunu Sor ({productCode})</span>
            </a>

            <a
              href="tel:05321305080"
              className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-stone-400" />
              <span>Mağazayı Doğrudan Ara: 0532 130 50 80</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

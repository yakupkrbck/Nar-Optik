import React from 'react';
import { MessageCircle, ChevronRight, Edit2 } from 'lucide-react';
import { CatalogItem } from '../data/storeCatalogData';

interface ProductCardProps {
  item: CatalogItem;
  onOpenDetails: (item: CatalogItem) => void;
  isAdmin?: boolean;
  onEditItem?: (item: CatalogItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  onOpenDetails,
  isAdmin = false,
  onEditItem,
}) => {
  const productCode = item.code || '-';
  const priceInfo = item.campaignPrice
    ? `[Kampanyalı Fiyat: ${item.campaignPrice}]`
    : item.price
    ? `[Fiyat: ${item.price}]`
    : '';

  const whatsappText = encodeURIComponent(
    `Merhaba Nar Optik, "${item.name}" (Ürün Kodu: ${productCode}) ${priceInfo} hakkında bilgi ve stok durumu öğrenmek istiyorum.`
  );
  const whatsappUrl = `https://wa.me/905321305080?text=${whatsappText}`;

  const getFallbackImage = (cat: string) => {
    switch (cat) {
      case 'optik-cam':
        return '/images/optical_lens_coating_1792095026819.jpg';
      case 'optik-gozluk':
        return '/images/eyewear_titanium_minimal_1792075603727.jpg';
      case 'gunes-gozlugu':
        return '/images/eyewear_acetat_havana_1792075603090.jpg';
      case 'numarali-lens':
        return '/images/lens_contact_box_1792095024550.jpg';
      case 'renkli-lens':
        return '/images/lens_color_eye_1792095024686.jpg';
      case 'aksesuar':
        return '/images/eyewear_accessories_kit_1792095026151.jpg';
      default:
        return '/images/optical_lens_coating_1792095026819.jpg';
    }
  };

  return (
    <div className="menu-item group flex flex-col items-center">
      {/* 1. Circular Stage / Visual Preview */}
      <div
        className="item-img-container"
        onClick={() => onOpenDetails(item)}
        role="button"
        tabIndex={0}
        aria-label={`${item.name} detaylarını gör`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onOpenDetails(item);
          }
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getFallbackImage(item.category);
          }}
        />
        {item.badge && (
          <div className="absolute top-1 right-1 bg-[#c1121f] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
            {item.badge}
          </div>
        )}
      </div>

      {/* 2. Info Card with Product Code, Price & Direct WhatsApp Guidance */}
      <div className="info-card">
        {/* Clickable Product Info */}
        <div
          className="cursor-pointer"
          onClick={() => onOpenDetails(item)}
        >
          <h3 className="item-name line-clamp-1">{item.name}</h3>
          <p className="item-description line-clamp-1">{item.subtitle}</p>

          {/* Product Code Badge */}
          {item.code && (
            <div className="my-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
              <span className="text-[9px] uppercase font-bold text-stone-500">Kod:</span>
              <span className="text-[11px] font-mono font-black text-[#c1121f]">
                {item.code}
              </span>
            </div>
          )}

          {/* Pricing Display */}
          {(item.campaignPrice || item.price) && (
            <div className="my-1 flex items-center justify-center gap-1.5 flex-wrap">
              {item.campaignPrice ? (
                <>
                  {item.price && (
                    <span className="text-[10px] line-through text-stone-400 font-medium">
                      {item.price}
                    </span>
                  )}
                  <span className="text-xs font-black text-[#c1121f]">
                    {item.campaignPrice}
                  </span>
                </>
              ) : (
                <span className="text-xs font-bold text-stone-800 font-mono">
                  {item.price}
                </span>
              )}
            </div>
          )}

          {/* Technical Specs Summary */}
          <div className="sub-spec line-clamp-1">{item.specs}</div>
        </div>

        {/* Bottom Actions: WhatsApp Guidance Button & Detail Link */}
        <div className="pt-2 flex flex-col gap-1 w-full">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.name} (${productCode}) hakkında WhatsApp'tan bilgi al`}
            className="w-full py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-[10px] sm:text-[11px] rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span>WhatsApp Bilgi</span>
          </a>

          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetails(item)}
              className="text-[9.5px] text-stone-500 hover:text-[#c1121f] font-bold py-0.5 flex items-center justify-center gap-0.5 transition-colors cursor-pointer"
            >
              <span>Teknik Detaylar</span>
              <ChevronRight className="w-2.5 h-2.5" />
            </button>

            {isAdmin && onEditItem && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditItem(item);
                }}
                className="text-[9px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 py-0.5 px-1.5 rounded flex items-center gap-0.5 border border-amber-200 transition-colors cursor-pointer"
              >
                <Edit2 className="w-2.5 h-2.5" />
                <span>Düzenle</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

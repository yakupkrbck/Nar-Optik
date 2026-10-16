/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CATALOG_CATEGORIES,
  CATALOG_ITEMS,
  CatalogCategory,
  CatalogItem,
} from './data/storeCatalogData';
import { HamburgerMenu, NAR_OPTIK_MAPS_URL } from './components/HamburgerMenu';
import { ProductCard } from './components/ProductCard';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AdminLoginModal, ADMIN_STORAGE_KEY } from './components/AdminLoginModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { LegalNoticeModal } from './components/LegalNoticeModal';
import { NarLogo } from './components/NarLogo';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Mail,
  Instagram,
  Search,
  Navigation,
  ShieldCheck,
  Settings,
  PlusCircle,
  Cloud,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react';
import {
  saveCategoriesToFirestore,
  saveItemsToFirestore,
  fetchCategoriesFromFirestore,
  fetchItemsFromFirestore,
  subscribeCategories,
  subscribeItems,
  sortCategories,
  sortItems,
  fetchLegalConfigFromFirestore,
  subscribeLegalConfig,
  saveLegalConfigToFirestore,
  LegalNoticeConfig,
  DEFAULT_LEGAL_CONFIG,
} from './firebase';

const STORAGE_CATS_KEY = 'nar_optik_categories_v2';
const STORAGE_ITEMS_KEY = 'nar_optik_items_v2';
const STORAGE_LEGAL_KEY = 'nar_optik_legal_config_v1';

export default function App() {
  // Categories and Items with local persistence & strict sorting
  const [categories, setCategories] = useState<CatalogCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CATS_KEY);
      if (saved) return sortCategories(JSON.parse(saved));
    } catch {
      // fallback
    }
    return sortCategories(CATALOG_CATEGORIES);
  });

  const [items, setItems] = useState<CatalogItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ITEMS_KEY);
      if (saved) return sortItems(JSON.parse(saved));
    } catch {
      // fallback
    }
    return sortItems(CATALOG_ITEMS);
  });

  // Admin state
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isLegalNoticeOpen, setIsLegalNoticeOpen] = useState<boolean>(false);
  const [isManualLegalNoticeOpen, setIsManualLegalNoticeOpen] = useState<boolean>(false);

  // Legal Notice & KVKK texts state with local fallback & Firestore sync
  const [legalConfig, setLegalConfig] = useState<LegalNoticeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEGAL_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_LEGAL_CONFIG;
  });

  // Active category filter & per-category subcategory filters
  const [selectedCategory, setSelectedCategory] = useState<string>('optik-cam');
  const [subCategoryByCat, setSubCategoryByCat] = useState<Record<string, string>>({});
  const [productSort, setProductSort] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc'>('default');
  const [selectedItemForModal, setSelectedItemForModal] = useState<CatalogItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Check if any modal or module is currently open
  const isAnyModalOpen = Boolean(
    selectedItemForModal !== null ||
    isAdminLoginOpen ||
    isAdminDashboardOpen ||
    isLegalNoticeOpen ||
    isManualLegalNoticeOpen
  );

  // Firestore real-time sync & initial load
  useEffect(() => {
    let unsubCats: (() => void) | undefined;
    let unsubItems: (() => void) | undefined;
    let unsubLegal: (() => void) | undefined;

    fetchCategoriesFromFirestore()
      .then((remoteCats) => {
        if (remoteCats && remoteCats.length > 0) {
          const sorted = sortCategories(remoteCats);
          setCategories(sorted);
          try {
            localStorage.setItem(STORAGE_CATS_KEY, JSON.stringify(sorted));
          } catch {
            // ignore
          }
        } else if (remoteCats && remoteCats.length === 0) {
          // Genuinely empty in Firestore, seed initial defaults
          saveCategoriesToFirestore(sortCategories(CATALOG_CATEGORIES));
        }
      })
      .catch((err) => console.warn('Categories init notice:', err));

    fetchItemsFromFirestore()
      .then((remoteItems) => {
        if (remoteItems && remoteItems.length > 0) {
          const sorted = sortItems(remoteItems);
          setItems(sorted);
          try {
            localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(sorted));
          } catch {
            // ignore
          }
        } else if (remoteItems && remoteItems.length === 0) {
          // Genuinely empty in Firestore, seed initial defaults
          saveItemsToFirestore(sortItems(CATALOG_ITEMS));
        }
      })
      .catch((err) => console.warn('Items init notice:', err));

    fetchLegalConfigFromFirestore()
      .then((remoteConfig) => {
        if (remoteConfig) {
          setLegalConfig(remoteConfig);
          try {
            localStorage.setItem(STORAGE_LEGAL_KEY, JSON.stringify(remoteConfig));
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => console.warn('Legal config init notice:', err));

    try {
      unsubCats = subscribeCategories(
        (remoteCats) => {
          if (remoteCats && remoteCats.length > 0) {
            setCategories(sortCategories(remoteCats));
          }
        },
        () => {
          // In offline mode or reconnecting, UI gracefully maintains local state
        }
      );
      unsubItems = subscribeItems(
        (remoteItems) => {
          if (remoteItems && remoteItems.length > 0) {
            setItems(sortItems(remoteItems));
          }
        },
        () => {
          // In offline mode or reconnecting, UI gracefully maintains local state
        }
      );
      unsubLegal = subscribeLegalConfig(
        (remoteConfig) => {
          if (remoteConfig) {
            setLegalConfig(remoteConfig);
            try {
              localStorage.setItem(STORAGE_LEGAL_KEY, JSON.stringify(remoteConfig));
            } catch {
              // ignore
            }
          }
        },
        () => {
          // In offline mode or reconnecting, UI gracefully maintains local state
        }
      );
    } catch (e) {
      console.warn('Realtime sync subscription warning:', e);
    }

    return () => {
      if (unsubCats) unsubCats();
      if (unsubItems) unsubItems();
      if (unsubLegal) unsubLegal();
    };
  }, []);

  // Save changes to localStorage & Firebase Firestore
  const handleUpdateCategories = (newCats: CatalogCategory[]) => {
    const sorted = sortCategories(newCats);
    setCategories(sorted);
    try {
      localStorage.setItem(STORAGE_CATS_KEY, JSON.stringify(sorted));
    } catch (e) {
      console.error(e);
    }
    saveCategoriesToFirestore(sorted);
  };

  const handleUpdateItems = (newItems: CatalogItem[]) => {
    const sorted = sortItems(newItems);
    setItems(sorted);
    try {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(sorted));
    } catch (e) {
      console.error(e);
    }
    saveItemsToFirestore(sorted);
  };

  const handleUpdateLegalConfig = async (newConfig: LegalNoticeConfig) => {
    setLegalConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_LEGAL_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.error(e);
    }
    await saveLegalConfigToFirestore(newConfig);
  };

  const handleResetDefaults = () => {
    try {
      localStorage.removeItem(STORAGE_CATS_KEY);
      localStorage.removeItem(STORAGE_ITEMS_KEY);
    } catch (e) {
      console.error(e);
    }
    const defaultCats = sortCategories(CATALOG_CATEGORIES);
    const defaultItems = sortItems(CATALOG_ITEMS);
    setCategories(defaultCats);
    setItems(defaultItems);
    saveCategoriesToFirestore(defaultCats);
    saveItemsToFirestore(defaultItems);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
    setIsAdmin(false);
    setIsAdminDashboardOpen(false);
  };

  const parseNumericPrice = (p?: string): number => {
    if (!p) return 0;
    const digits = p.replace(/[^0-9]/g, '');
    return digits ? parseInt(digits, 10) : 0;
  };

  // Filter & sort items for a specific category
  const getItemsForCategory = (catId: string) => {
    let catItems = items.filter((item) => item.category === catId);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      catItems = catItems.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q) ||
          (i.code && i.code.toLowerCase().includes(q)) ||
          i.specs.toLowerCase().includes(q) ||
          (i.price && i.price.toLowerCase().includes(q)) ||
          (i.campaignPrice && i.campaignPrice.toLowerCase().includes(q))
      );
    }

    const currentSubFilter = subCategoryByCat[catId] || 'all';
    if (currentSubFilter !== 'all') {
      catItems = catItems.filter((i) => i.subcategory === currentSubFilter);
    }

    if (productSort === 'price-asc') {
      catItems = [...catItems].sort((a, b) => {
        const pA = parseNumericPrice(a.campaignPrice || a.price);
        const pB = parseNumericPrice(b.campaignPrice || b.price);
        return pA - pB;
      });
    } else if (productSort === 'price-desc') {
      catItems = [...catItems].sort((a, b) => {
        const pA = parseNumericPrice(a.campaignPrice || a.price);
        const pB = parseNumericPrice(b.campaignPrice || b.price);
        return pB - pA;
      });
    } else if (productSort === 'name-asc') {
      catItems = [...catItems].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
    }

    return catItems;
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-[#ffffff] pb-16 font-sans">
      
      {/* 0. ADMIN ACTIVE BAR (If logged in) */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-red-950 via-[#c1121f] to-stone-900 text-white text-xs py-2 px-4 flex items-center justify-between sticky top-0 z-[180] shadow-md border-b border-red-500/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span className="font-extrabold">Yönetici Modu Açık:</span>
            <span className="hidden sm:inline text-stone-200">Opt. Ömer YOLDAŞ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="py-1 px-3 bg-white text-stone-900 hover:bg-stone-100 rounded-lg font-black text-[11px] flex items-center gap-1 shadow cursor-pointer transition-all"
            >
              <Settings className="w-3.5 h-3.5 text-[#c1121f]" />
              <span>Yönetim Panelini Aç</span>
            </button>
            <button
              onClick={handleLogout}
              className="py-1 px-2.5 bg-black/30 hover:bg-black/50 text-white rounded-lg font-bold text-[11px] cursor-pointer"
            >
              Çıkış
            </button>
          </div>
        </div>
      )}

      {/* 1. FIXED HAMBURGER MENU (SOLDA MENÜ & DESTEK AL BUTONU) */}
      <HamburgerMenu
        activeCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setSubCategoryByCat((prev) => ({ ...prev, [catId]: 'all' }));
        }}
        categories={categories}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        onLogoutAdmin={handleLogout}
        hideFloatingButtons={isAnyModalOpen}
        onOpenLegalNotice={() => setIsManualLegalNoticeOpen(true)}
      />

      {/* 2. HEADER WITH REAL NAR OPTİK LOGO & BURSA STORE BRANDING */}
      <header className="pt-10 pb-8 text-center bg-gradient-to-b from-red-950/40 via-stone-900/30 to-transparent px-4">
        
        {/* Real Brand Logo from Business Card */}
        <div className="flex justify-center mb-3">
          <NarLogo size={64} showText={true} />
        </div>

        {/* Optician Sub-title */}
        <div className="mt-1 flex justify-center items-center gap-2 mb-2">
          <span className="h-px w-8 bg-[#c1121f]"></span>
          <p className="text-stone-300 text-xs font-bold tracking-[0.25em] uppercase">
            Opt. Ömer YOLDAŞ · BURSA
          </p>
          <span className="h-px w-8 bg-[#c1121f]"></span>
        </div>

        <p className="text-stone-400 text-xs max-w-md mx-auto leading-relaxed">
          Mağaza içi ve mobil seçim rehberidir (Satış sitesi değildir). Modellerimizi ve lens seçeneklerimizi inceleyebilir, beğendiğiniz ürünün kodu ile WhatsApp hattımızdan anında bilgi alabilirsiniz.
        </p>

        {/* Symmetrical & Balanced Unified Search & Sort Bar */}
        <div className="mt-5 max-w-md mx-auto px-4">
          <div className="relative flex items-center bg-[#151515] border border-white/15 hover:border-white/25 focus-within:border-[#c1121f] rounded-full shadow-lg transition-all pl-3.5 pr-2 py-1.5">
            <Search className="w-4 h-4 text-stone-400 shrink-0 pointer-events-none" />
            
            <input
              type="text"
              placeholder="Gözlük, lens, model veya kod ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent px-3 text-xs text-white placeholder:text-stone-500 focus:outline-none"
            />

            {/* Clear search button */}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white flex items-center justify-center text-[10px] mr-1.5 cursor-pointer transition-colors shrink-0"
                title="Aramayı Temizle"
              >
                ✕
              </button>
            )}

            {/* Subtle Divider */}
            <span className="h-4 w-px bg-white/15 shrink-0 mx-1"></span>

            {/* SADECE SİMGE İLE SIRALAMA BUTONU (ESTETİK, SİMETRİK & DENGELİ) */}
            <div
              className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all shrink-0 cursor-pointer ${
                productSort !== 'default'
                  ? 'bg-[#c1121f] text-white shadow-md'
                  : 'text-stone-400 hover:text-white hover:bg-white/10'
              }`}
              title={
                productSort === 'price-asc'
                  ? 'Sıralama: Fiyat Artan (En Düşük)'
                  : productSort === 'price-desc'
                  ? 'Sıralama: Fiyat Azalan (En Yüksek)'
                  : productSort === 'name-asc'
                  ? 'Sıralama: İsim A - Z'
                  : 'Sıralama Seçenekleri (Vitrin Önerisi)'
              }
            >
              <ArrowUpDown className="w-3.5 h-3.5 pointer-events-none" />
              {productSort !== 'default' && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse pointer-events-none"></span>
              )}
              <select
                value={productSort}
                onChange={(e) => setProductSort(e.target.value as any)}
                aria-label="Ürünleri Sırala"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              >
                <option value="default" className="bg-[#1a1a1a] text-white">🌟 Vitrin Önerisi (Varsayılan)</option>
                <option value="price-asc" className="bg-[#1a1a1a] text-white">💰 Fiyat: En Düşükten Yükseğe</option>
                <option value="price-desc" className="bg-[#1a1a1a] text-white">💎 Fiyat: En Yüksekten Düşüğe</option>
                <option value="name-asc" className="bg-[#1a1a1a] text-white">🔤 İsim: A&apos;dan Z&apos;ye</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Category Anchor Navigation */}
        <div className="mt-6 flex items-center justify-center gap-2 overflow-x-auto px-4 pb-2 scrollbar-none">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              onClick={() => {
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-[#c1121f] text-white border-red-500 shadow-md'
                  : 'bg-white/10 text-stone-300 border-white/10 hover:bg-white/20'
              }`}
            >
              <span className="mr-1">{cat.emoji}</span>
              <span>{cat.label}</span>
            </a>
          ))}
        </div>
      </header>

      {/* 3. MAIN CATALOG GRID (DİNAMİK KATEGORİLER & 2'Lİ WİTRİN DÜZENİ) */}
      <main className="px-4 max-w-5xl mx-auto pt-4 space-y-16">
        
        {/* Empty Search Result Notice */}
        {searchQuery.trim() &&
          categories.filter((cat) => cat.id !== 'bize-ulasin' && getItemsForCategory(cat.id).length > 0).length === 0 && (
            <div className="bg-[#141414] border border-white/10 rounded-3xl p-10 text-center max-w-md mx-auto space-y-3">
              <Search className="w-8 h-8 text-stone-500 mx-auto" />
              <h3 className="text-base font-bold text-white">Eşleşen Ürün Bulunamadı</h3>
              <p className="text-xs text-stone-400">
                &ldquo;{searchQuery}&rdquo; ile eşleşen bir ürün veya model bulunamadı. Lütfen farklı bir model adı veya ürün kodu deneyin.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="py-2 px-4 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Aramayı Temizle
              </button>
            </div>
          )}

        {/* Render each category dynamically */}
        {categories
          .filter((cat) => cat.id !== 'bize-ulasin')
          .filter((cat) => !searchQuery.trim() || getItemsForCategory(cat.id).length > 0)
          .map((cat) => {
            const catItems = getItemsForCategory(cat.id);
            return (
              <section key={cat.id} id={cat.id} className="text-center pt-4">
                
                {/* Category Header with Pill & Admin Shortcut */}
                <div className="flex flex-col items-center justify-center mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="section-pill mb-0">
                      {cat.emoji} {cat.label}
                    </h2>
                    {isAdmin && (
                      <button
                        onClick={() => setIsAdminDashboardOpen(true)}
                        className="p-2 bg-stone-900 hover:bg-[#c1121f] border border-white/20 text-white rounded-full transition-colors cursor-pointer"
                        title="Yönetici Paneli: Ürün / Kategori Düzenle"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Subcategories Filter Chips if available */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
                      <button
                        onClick={() =>
                          setSubCategoryByCat((prev) => ({ ...prev, [cat.id]: 'all' }))
                        }
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          (subCategoryByCat[cat.id] || 'all') === 'all'
                            ? 'bg-white text-stone-900 shadow'
                            : 'bg-white/10 text-stone-300 hover:bg-white/15'
                        }`}
                      >
                        Tümü ({items.filter((i) => i.category === cat.id).length})
                      </button>
                      {cat.subcategories.map((sub) => {
                        const count = items.filter(
                          (i) => i.category === cat.id && i.subcategory === sub.id
                        ).length;
                        return (
                          <button
                            key={sub.id}
                            onClick={() =>
                              setSubCategoryByCat((prev) => ({ ...prev, [cat.id]: sub.id }))
                            }
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              (subCategoryByCat[cat.id] || 'all') === sub.id
                                ? 'bg-[#c1121f] text-white shadow'
                                : 'bg-white/10 text-stone-300 hover:bg-white/15'
                            }`}
                          >
                            <span>{sub.name}</span>
                            {count > 0 && <span className="ml-1 opacity-75">({count})</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Items Grid (2'li witrin tarzı) */}
                {catItems.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md mx-auto text-center space-y-2">
                    <p className="text-xs text-stone-400">
                      Bu kategoride henüz sergilenen ürün bulunmuyor.
                    </p>
                    {isAdmin && (
                      <button
                        onClick={() => setIsAdminDashboardOpen(true)}
                        className="py-1.5 px-3 bg-[#c1121f] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        + Bu Kategoriye Ürün Ekle
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-4">
                    {catItems.map((item) => (
                      <ProductCard
                        key={item.id}
                        item={item}
                        onOpenDetails={(selected) => setSelectedItemForModal(selected)}
                        isAdmin={isAdmin}
                        onEditItem={() => setIsAdminDashboardOpen(true)}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}

        {/* 📞 BİZE ULAŞIN SECTION (SİMETRİK, ESTETİK VE KURUMSAL DÜZEN) */}
        <section id="bize-ulasin" className="text-center pt-10 border-t border-stone-800/80">
          <div className="flex flex-col items-center justify-center mb-6">
            <h2 className="section-pill mb-1.5">📞 BİZE ULAŞIN</h2>
            <p className="text-xs text-stone-400 font-medium">
              Opt. Ömer YOLDAŞ · Kükürtlü, Osmangazi / BURSA
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-gradient-to-b from-[#161616] to-[#0f0f0f] border border-white/10 rounded-3xl p-6 sm:p-8 text-left shadow-2xl space-y-6">
            
            {/* 1. Üst Kurumsal Kimlik Kartı */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="p-1.5 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                  <NarLogo size={46} showText={false} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white tracking-tight">Nar Optik Lens</h3>
                    <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full font-bold">
                      BURSA
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#c1121f]">Opt. Ömer YOLDAŞ</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Ruhsatlı Optik Müessesesi</span>
                </span>
              </div>
            </div>

            {/* 2. Google Haritalar Konum & Adres Kartı (Tam Simetrik) */}
            <a
              href={NAR_OPTIK_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block group bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-[#c1121f]/50 p-5 rounded-2xl transition-all shadow-md cursor-pointer"
              title="Google Haritalar'da Nar Optik'i Bul ve Yol Tarifi Al"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-8 h-8 rounded-xl bg-[#c1121f]/20 border border-red-500/30 flex items-center justify-center text-[#c1121f] group-hover:scale-105 transition-transform shrink-0">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      Mağaza Konumu & Adres
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Doğrudan Google Haritalar Nar Optik noktası
                    </span>
                  </div>
                </div>

                <span className="self-start sm:self-auto text-xs font-bold text-amber-400 group-hover:text-amber-300 flex items-center gap-1.5 bg-amber-950/40 border border-amber-500/30 px-3 py-1.5 rounded-xl transition-all shrink-0">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Haritada Yol Tarifi Al ›</span>
                </span>
              </div>

              <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <p className="text-xs sm:text-sm font-bold text-stone-100 group-hover:text-amber-300 transition-colors leading-relaxed">
                  Kükürtlü, Zübeyde Hanım Cd. No:12/A, 16220 Osmangazi / BURSA
                </p>
                <span className="text-[11px] text-stone-400 font-medium shrink-0 hidden sm:inline">
                  Haritada Aç ↗
                </span>
              </div>
            </a>

            {/* 3. İletişim Kanalları (2 Eşit Simetrik Kart) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="tel:02242340099"
                className="group bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 p-4 rounded-2xl transition-all flex items-center gap-3.5 shadow-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-[#c1121f] group-hover:scale-110 transition-transform shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                    Sabit Hat · Danışma
                  </span>
                  <span className="text-sm sm:text-base font-extrabold font-mono text-white group-hover:text-amber-300 transition-colors block truncate">
                    0 224 234 00 99
                  </span>
                </div>
              </a>

              <a
                href="https://wa.me/905321305080?text=Merhaba%20Nar%20Optik,%20lens%20ve%20g%C3%B6zl%C3%BCk%20se%C3%A7imi%20i%C3%A7in%20dan%C4%B1%C5%9Fmak%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 p-4 rounded-2xl transition-all flex items-center gap-3.5 shadow-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                    GSM & WhatsApp Hattı
                  </span>
                  <span className="text-sm sm:text-base font-extrabold font-mono text-white group-hover:text-emerald-300 transition-colors block truncate">
                    0 532 130 50 80
                  </span>
                </div>
              </a>
            </div>

            {/* 4. Çalışma Saatleri (3 Eşit Sütun & Kusursuz Simetri) */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="text-xs font-extrabold text-stone-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#c1121f]" />
                <span>Mağaza Çalışma Saatlerimiz</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center space-y-1">
                  <span className="block text-stone-400 text-[10px] font-semibold uppercase tracking-wider">
                    Pazartesi - Cuma
                  </span>
                  <span className="font-extrabold text-white font-mono text-xs sm:text-sm block">
                    09:00 - 18:30
                  </span>
                  <span className="inline-block text-[9.5px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Açık
                  </span>
                </div>

                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center space-y-1">
                  <span className="block text-stone-400 text-[10px] font-semibold uppercase tracking-wider">
                    Cumartesi
                  </span>
                  <span className="font-extrabold text-white font-mono text-xs sm:text-sm block">
                    09:00 - 17:00
                  </span>
                  <span className="inline-block text-[9.5px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Açık
                  </span>
                </div>

                <div className="bg-black/30 border border-white/5 p-3 rounded-xl text-center space-y-1">
                  <span className="block text-stone-400 text-[10px] font-semibold uppercase tracking-wider">
                    Pazar
                  </span>
                  <span className="font-extrabold text-red-400 font-mono text-xs sm:text-sm block">
                    KAPALI
                  </span>
                  <span className="inline-block text-[9.5px] text-stone-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full font-bold">
                    Dinlenme
                  </span>
                </div>
              </div>
            </div>

            {/* 5. Sosyal Medya & E-posta (Simetrik 2 Kart) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="https://instagram.com/naroptiklens"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 p-3 rounded-xl flex items-center justify-center gap-2 text-xs text-stone-300 hover:text-white transition-all group"
              >
                <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold">@naroptiklens</span>
                <span className="text-[10px] text-stone-500">(Instagram)</span>
              </a>

              <a
                href="mailto:naroptiklens@gmail.com"
                className="bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 p-3 rounded-xl flex items-center justify-center gap-2 text-xs text-stone-300 hover:text-white transition-all group"
              >
                <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="font-bold">naroptiklens@gmail.com</span>
              </a>
            </div>

          </div>
        </section>

      </main>

      {/* 4. FOOTER */}
      <footer className="text-center border-t border-stone-800 pt-10 mt-16 max-w-5xl mx-auto px-4">
        <p className="text-[#c1121f] font-extrabold tracking-widest uppercase mb-4 text-sm">
          Net Görüş & Sağlıklı Gözler!
        </p>
        <div className="flex justify-center space-x-8 text-stone-300 text-xs">
          <a href="tel:02242340099" className="flex flex-col items-center hover:text-white transition-colors">
            <span className="text-xl mb-1">📞</span>
            <span className="text-[10px] font-bold">0224 234 00 99</span>
          </a>
          <a
            href="https://wa.me/905321305080?text=Merhaba%20Nar%20Optik%20Lens%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-white transition-colors"
          >
            <span className="text-xl mb-1">💬</span>
            <span className="text-[10px] font-bold">0532 130 50 80</span>
          </a>
          <a
            href={NAR_OPTIK_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center hover:text-white transition-colors group"
            title="Google Haritalar'da Nar Optik"
          >
            <span className="text-xl mb-1 group-hover:scale-110 transition-transform">📍</span>
            <span className="text-[10px] font-bold group-hover:text-amber-400">NAR OPTİK / BURSA</span>
          </a>
        </div>
        <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-stone-500">
          <button
            type="button"
            onClick={() => setIsManualLegalNoticeOpen(true)}
            className="hover:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
          >
            ⚖️ Yasal Bilgilendirme & KVKK
          </button>
        </div>
        <p className="text-[11px] text-stone-500 mt-4">
          © {new Date().getFullYear()} Nar Optik Lens · Opt. Ömer YOLDAŞ · Kükürtlü, Osmangazi / BURSA
        </p>
      </footer>

      {/* 5. ITEM DETAIL & SPECS MODAL */}
      <ItemDetailModal
        item={selectedItemForModal}
        onClose={() => setSelectedItemForModal(null)}
        isAdmin={isAdmin}
        onEditItem={() => setIsAdminDashboardOpen(true)}
      />

      {/* 6. ADMIN LOGIN MODAL */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccessLogin={() => {
          setIsAdmin(true);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* 7. ADMIN DASHBOARD MODAL */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        categories={categories}
        items={items}
        onUpdateCategories={handleUpdateCategories}
        onUpdateItems={handleUpdateItems}
        onResetDefaults={handleResetDefaults}
        onLogout={handleLogout}
        legalConfig={legalConfig}
        onUpdateLegalConfig={handleUpdateLegalConfig}
        onOpenLegalNoticePreview={() => setIsManualLegalNoticeOpen(true)}
      />

      {/* 8. YASAL BİLGİLENDİRME & KVKK POPUP'I */}
      <LegalNoticeModal
        onVisibilityChange={setIsLegalNoticeOpen}
        config={legalConfig}
        isOpenControlled={isManualLegalNoticeOpen ? true : undefined}
        onCloseControlled={() => setIsManualLegalNoticeOpen(false)}
      />

    </div>
  );
}

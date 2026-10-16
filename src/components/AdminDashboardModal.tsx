import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  FolderPlus,
  Package,
  Layers,
  Search,
  Check,
  RotateCcw,
  Tag,
  DollarSign,
  Sparkles,
  Image as ImageIcon,
  LogOut,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Shield,
  Key,
  Upload,
  Camera,
  CheckCircle,
  RefreshCw,
  Cloud,
  Database,
  Save,
  FileText,
  Lock,
  Eye,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { CatalogCategory, CatalogItem, SubCategory } from '../data/storeCatalogData';
import { ADMIN_STORAGE_KEY, ADMIN_CUSTOM_PASS_KEY } from './AdminLoginModal';
import { NarLogo } from './NarLogo';
import {
  saveCategoriesToFirestore,
  saveItemsToFirestore,
  deleteCategoryFromFirestore,
  deleteItemFromFirestore,
  saveLegalConfigToFirestore,
  LegalNoticeConfig,
  DEFAULT_LEGAL_CONFIG,
} from '../firebase';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CatalogCategory[];
  items: CatalogItem[];
  onUpdateCategories: (categories: CatalogCategory[]) => void;
  onUpdateItems: (items: CatalogItem[]) => void;
  onResetDefaults: () => void;
  onLogout: () => void;
  legalConfig?: LegalNoticeConfig;
  onUpdateLegalConfig?: (newConfig: LegalNoticeConfig) => Promise<void> | void;
  onOpenLegalNoticePreview?: () => void;
}

const PRESET_IMAGES = [
  { label: 'Optik Cam Kaplama', path: '/images/optical_lens_coating_1792095026819.jpg' },
  { label: 'Minimal Titanyum', path: '/images/eyewear_titanium_minimal_1792075603727.jpg' },
  { label: 'Havana Asetat Güneş', path: '/images/eyewear_acetat_havana_1792075603090.jpg' },
  { label: 'Çerçevesiz Titanyum', path: '/images/eyewear_rimless_titanium_1792076598122.jpg' },
  { label: 'Siyah Cat-Eye', path: '/images/eyewear_cat_eye_black_1792075604545.jpg' },
  { label: 'Altın Aviator', path: '/images/eyewear_aviator_gold_1792075604578.jpg' },
  { label: 'Kehribar Amalfi', path: '/images/eyewear_amber_amalfi_1792076599340.jpg' },
  { label: 'Monaco Shield', path: '/images/eyewear_monaco_shield_1792076599786.jpg' },
  { label: 'Numaralı Lens Kutusu', path: '/images/lens_contact_box_1792095024550.jpg' },
  { label: 'Renkli Lens Göz', path: '/images/lens_color_eye_1792095024686.jpg' },
  { label: 'Aksesuar & Solüsyon Kiti', path: '/images/eyewear_accessories_kit_1792095026151.jpg' },
];

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  categories,
  items,
  onUpdateCategories,
  onUpdateItems,
  onResetDefaults,
  onLogout,
  legalConfig,
  onUpdateLegalConfig,
  onOpenLegalNoticePreview,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  // Product Form State (for adding or editing a product)
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  
  const [formData, setFormData] = useState({
    id: '',
    category: categories[0]?.id || 'optik-gozluk',
    subcategory: '',
    name: '',
    subtitle: '',
    code: '',
    price: '',
    campaignPrice: '',
    badge: '',
    specs: '',
    details: '',
    image: PRESET_IMAGES[0].path,
    dimensions: '',
    material: '',
    origin: '',
    warranty: '2 Yıl Nar Optik Güvencesi',
    lensType: '',
    baseCurve: '',
    diameter: '',
    waterContent: '',
    oxygen: '',
    replacement: '',
    customFields: [] as { id: string; label: string; value: string }[],
  });

  // Legal Notice / KVKK popup editing state for Tab 3 (Ayarlar)
  const [legalForm, setLegalForm] = useState<LegalNoticeConfig>(
    legalConfig || DEFAULT_LEGAL_CONFIG
  );
  const [isSavingLegal, setIsSavingLegal] = useState(false);
  const [legalSavedSuccess, setLegalSavedSuccess] = useState(false);

  useEffect(() => {
    if (legalConfig) {
      setLegalForm(legalConfig);
    }
  }, [legalConfig]);

  // System Notice Banner
  const [systemNotice, setSystemNotice] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showNotice = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setSystemNotice({ text, type });
    setTimeout(() => setSystemNotice(null), 4000);
  };

  // In-app confirmation dialog state (replaces window.confirm)
  const [pendingConfirm, setPendingConfirm] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    danger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // Firebase syncing state
  const [isSyncingFirebase, setIsSyncingFirebase] = useState(false);

  // Image upload state
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessNote, setUploadSuccessNote] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotice('Lütfen geçerli bir görsel dosyası seçiniz (JPG, PNG, WEBP vb.).', 'error');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.86);
          setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
          setUploadSuccessNote(`Görsel başarıyla yüklendi: ${file.name}`);
          showNotice(`Görsel başarıyla yüklendi: ${file.name}`, 'success');
          setTimeout(() => setUploadSuccessNote(null), 4000);
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        setIsUploading(false);
        showNotice('Görsel yüklenirken bir sorun oluştu.', 'error');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Category & Subcategory Creation Form State
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('👓');

  const [isNewSubCatOpen, setIsNewSubCatOpen] = useState(false);
  const [targetCatIdForSub, setTargetCatIdForSub] = useState('');
  const [newSubCatName, setNewSubCatName] = useState('');

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  if (!isOpen) return null;

  // Filtered products list
  const filteredItems = items.filter((item) => {
    const matchesCat =
      selectedFilterCategory === 'all' || item.category === selectedFilterCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.code && item.code.toLowerCase().includes(q)) ||
      item.specs.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Open product form for creating new item
  const handleOpenAddProduct = (defaultCatId?: string) => {
    const targetCat = defaultCatId || (categories[0]?.id || 'optik-gozluk');
    const firstSub = categories.find((c) => c.id === targetCat)?.subcategories?.[0]?.id || '';
    
    setEditingItem(null);
    setFormData({
      id: `item-${Date.now()}`,
      category: targetCat,
      subcategory: firstSub,
      name: '',
      subtitle: '',
      code: `NAR-${Math.floor(100 + Math.random() * 900)}`,
      price: '',
      campaignPrice: '',
      badge: '',
      specs: '',
      details: '',
      image: PRESET_IMAGES[1].path,
      dimensions: '51口20 145 mm',
      material: '',
      origin: 'Japonya / Sabae',
      warranty: '2 Yıl Nar Optik Güvencesi',
      lensType: '',
      baseCurve: '',
      diameter: '',
      waterContent: '',
      oxygen: '',
      replacement: '',
      customFields: [],
    });
    setIsProductFormOpen(true);
  };

  // Open product form for editing
  const handleOpenEditProduct = (item: CatalogItem) => {
    setEditingItem(item);
    setFormData({
      id: item.id,
      category: item.category,
      subcategory: item.subcategory || '',
      name: item.name,
      subtitle: item.subtitle,
      code: item.code || '',
      price: item.price || '',
      campaignPrice: item.campaignPrice || '',
      badge: item.badge || '',
      specs: item.specs,
      details: item.details,
      image: item.image,
      dimensions: item.dimensions || '',
      material: item.techData?.material || '',
      origin: item.techData?.origin || '',
      warranty: item.techData?.warranty || '2 Yıl Nar Optik Güvencesi',
      lensType: item.techData?.lensType || '',
      baseCurve: item.techData?.baseCurve || '',
      diameter: item.techData?.diameter || '',
      waterContent: item.techData?.waterContent || '',
      oxygen: item.techData?.oxygen || '',
      replacement: item.techData?.replacement || '',
      customFields: item.techData?.customFields
        ? item.techData.customFields.map((cf, i) => ({
            id: cf.id || `cf-${Date.now()}-${i}`,
            label: cf.label,
            value: cf.value,
          }))
        : [],
    });
    setIsProductFormOpen(true);
  };

  // Add custom tech spec box
  const handleAddCustomTechField = () => {
    setFormData((prev) => ({
      ...prev,
      customFields: [
        ...prev.customFields,
        { id: `cf-${Date.now()}-${Math.floor(Math.random() * 1000)}`, label: '', value: '' },
      ],
    }));
  };

  // Update custom tech spec box
  const handleUpdateCustomTechField = (id: string, field: 'label' | 'value', val: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.map((cf) => (cf.id === id ? { ...cf, [field]: val } : cf)),
    }));
  };

  // Remove custom tech spec box
  const handleRemoveCustomTechField = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((cf) => cf.id !== id),
    }));
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanStr = (val?: string) => {
      const trimmed = val ? val.trim() : '';
      return trimmed.length > 0 ? trimmed : undefined;
    };

    const techDataCleaned: Record<string, any> = {};
    if (formData.material?.trim()) techDataCleaned.material = formData.material.trim();
    if (formData.origin?.trim()) techDataCleaned.origin = formData.origin.trim();
    if (formData.warranty?.trim()) techDataCleaned.warranty = formData.warranty.trim();
    if (formData.lensType?.trim()) techDataCleaned.lensType = formData.lensType.trim();
    if (formData.baseCurve?.trim()) techDataCleaned.baseCurve = formData.baseCurve.trim();
    if (formData.diameter?.trim()) techDataCleaned.diameter = formData.diameter.trim();
    if (formData.waterContent?.trim()) techDataCleaned.waterContent = formData.waterContent.trim();
    if (formData.oxygen?.trim()) techDataCleaned.oxygen = formData.oxygen.trim();
    if (formData.replacement?.trim()) techDataCleaned.replacement = formData.replacement.trim();

    const validCustomFields = formData.customFields
      .filter((cf) => cf.label.trim().length > 0 && cf.value.trim().length > 0)
      .map((cf) => ({
        id: cf.id,
        label: cf.label.trim(),
        value: cf.value.trim(),
      }));

    if (validCustomFields.length > 0) {
      techDataCleaned.customFields = validCustomFields;
    }

    const rawItem: CatalogItem = {
      id: formData.id || `item-${Date.now()}`,
      category: formData.category,
      name: formData.name.trim(),
      subtitle: formData.subtitle.trim(),
      specs: formData.specs.trim(),
      details: formData.details.trim(),
      image: formData.image.trim(),
      ...(cleanStr(formData.subcategory) && { subcategory: cleanStr(formData.subcategory) }),
      ...(cleanStr(formData.code) && { code: cleanStr(formData.code)?.toUpperCase() }),
      ...(cleanStr(formData.price) && { price: cleanStr(formData.price) }),
      ...(cleanStr(formData.campaignPrice) && { campaignPrice: cleanStr(formData.campaignPrice) }),
      ...(cleanStr(formData.badge) && { badge: cleanStr(formData.badge) }),
      ...(cleanStr(formData.dimensions) && { dimensions: cleanStr(formData.dimensions) }),
      ...(Object.keys(techDataCleaned).length > 0 && { techData: techDataCleaned }),
    };

    const updatedItem: CatalogItem = JSON.parse(JSON.stringify(rawItem));

    if (editingItem) {
      const updated = items.map((i) =>
        i.id === editingItem.id ? { ...updatedItem, order: i.order ?? editingItem.order } : i
      );
      onUpdateItems(updated);
      showNotice('Ürün başarıyla güncellendi ve Firebase bulutuna kaydedildi.', 'success');
    } else {
      const updated = [{ ...updatedItem, order: 1 }, ...items].map((i, idx) => ({
        ...i,
        order: idx + 1,
      }));
      onUpdateItems(updated);
      showNotice('Yeni ürün başarıyla eklendi ve vitrinde en başa yerleştirildi.', 'success');
    }

    setIsProductFormOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = (id: string, name: string) => {
    setPendingConfirm({
      title: 'Ürünü Sil',
      message: `"${name}" ürününü silmek istediğinize emin misiniz? Bu işlem ürünü hem listeden hem de buluttan kaldırır.`,
      confirmText: 'Evet, Ürünü Sil',
      danger: true,
      onConfirm: async () => {
        const updated = items.filter((i) => i.id !== id);
        onUpdateItems(updated);
        await deleteItemFromFirestore(id);
        showNotice(`"${name}" ürünü başarıyla silindi.`, 'success');
        setPendingConfirm(null);
      },
    });
  };

  // Add New Category with explicit order
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;

    const slug = newCatLabel
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9ğüşıöç]/g, '-')
      .replace(/-+/g, '-');
    const newCatId = `cat-${slug || Date.now()}`;

    // Insert before 'bize-ulasin'
    const bizeUlasin = categories.find((c) => c.id === 'bize-ulasin');
    const otherCats = categories.filter((c) => c.id !== 'bize-ulasin');

    const newCategory: CatalogCategory = {
      id: newCatId,
      label: newCatLabel.trim(),
      emoji: newCatEmoji || '👓',
      subcategories: [],
      isCustom: true,
      order: otherCats.length + 1,
    };

    const updated = bizeUlasin
      ? [...otherCats, newCategory, { ...bizeUlasin, order: 9999 }]
      : [...categories, newCategory];
    onUpdateCategories(updated);
    setNewCatLabel('');
    setIsNewCategoryOpen(false);
    showNotice(`"${newCategory.label}" kategorisi eklendi ve buluta kaydedildi.`, 'success');
  };

  // Delete Category
  const handleDeleteCategory = (catId: string, label: string) => {
    if (catId === 'bize-ulasin') {
      showNotice('"Bize Ulaşın" bölümü temel sistem kategorisidir ve silinemez.', 'error');
      return;
    }
    setPendingConfirm({
      title: 'Kategoriyi Sil',
      message: `"${label}" kategorisini ve altındaki tüm ürünleri silmek istediğinize emin misiniz?`,
      confirmText: 'Evet, Kategoriyi Sil',
      danger: true,
      onConfirm: async () => {
        const updatedCats = categories.filter((c) => c.id !== catId);
        const updatedItems = items.filter((i) => i.category !== catId);
        onUpdateCategories(updatedCats);
        onUpdateItems(updatedItems);
        await deleteCategoryFromFirestore(catId);
        showNotice(`"${label}" kategorisi ve bağlı ürünler silindi.`, 'success');
        setPendingConfirm(null);
      },
    });
  };

  // Reorder / Move Category Up or Down
  const handleMoveCategory = (catId: string, direction: 'up' | 'down') => {
    const listWithoutBizeUlasin = categories.filter((c) => c.id !== 'bize-ulasin');
    const currentIndex = listWithoutBizeUlasin.findIndex((c) => c.id === catId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= listWithoutBizeUlasin.length) return;

    const reordered = [...listWithoutBizeUlasin];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    // Reassign order
    const updatedWithOrder = reordered.map((cat, idx) => ({
      ...cat,
      order: idx + 1,
    }));

    const bizeUlasin = categories.find((c) => c.id === 'bize-ulasin');
    const finalCats = bizeUlasin ? [...updatedWithOrder, { ...bizeUlasin, order: 999 }] : updatedWithOrder;

    onUpdateCategories(finalCats);
    showNotice(`"${moved.label}" kategorisi ${direction === 'up' ? 'öne' : 'sonraya'} taşındı.`, 'info');
  };

  // Add SubCategory to a Category
  const handleAddSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCatName.trim() || !targetCatIdForSub) return;

    const subSlug = newSubCatName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9ğüşıöç]/g, '-')
      .replace(/-+/g, '-');
    const newSub: SubCategory = {
      id: `sub-${subSlug || Date.now()}`,
      name: newSubCatName.trim(),
    };

    const updated = categories.map((cat) => {
      if (cat.id === targetCatIdForSub) {
        return {
          ...cat,
          subcategories: [...(cat.subcategories || []), newSub],
        };
      }
      return cat;
    });

    onUpdateCategories(updated);
    setNewSubCatName('');
    setIsNewSubCatOpen(false);
    showNotice(`"${newSub.name}" alt kategorisi eklendi.`, 'success');
  };

  // Delete SubCategory
  const handleDeleteSubCategory = (catId: string, subId: string) => {
    setPendingConfirm({
      title: 'Alt Kategoriyi Sil',
      message: 'Bu alt kategoriyi silmek istediğinize emin misiniz?',
      confirmText: 'Sil',
      danger: true,
      onConfirm: () => {
        const updated = categories.map((cat) => {
          if (cat.id === catId) {
            return {
              ...cat,
              subcategories: (cat.subcategories || []).filter((s) => s.id !== subId),
            };
          }
          return cat;
        });
        onUpdateCategories(updated);
        showNotice('Alt kategori silindi.', 'success');
        setPendingConfirm(null);
      },
    });
  };

  // Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length >= 4) {
      localStorage.setItem(ADMIN_CUSTOM_PASS_KEY, newPassword.trim());
      setPassSuccess(true);
      setTimeout(() => setPassSuccess(false), 3000);
      setNewPassword('');
    } else {
      showNotice('Şifre en az 4 karakter olmalıdır.', 'error');
    }
  };

  // JSON Export / Backup
  const handleExportData = () => {
    const data = {
      categories,
      items,
      exportedAt: new Date().toISOString(),
      store: 'Nar Optik Lens - Bursa',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nar-optik-katalog-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [downloadingZipType, setDownloadingZipType] = useState<string | null>(null);

  const handleDownloadZipFile = async (url: string, filename: string, typeName: string) => {
    try {
      setDownloadingZipType(typeName);
      const res = await fetch(url);
      if (!res.ok) throw new Error('İndirme başarısız');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      showNotice(`${filename} başarıyla indirildi.`, 'success');
    } catch (err) {
      console.error('İndirme hatası:', err);
      showNotice('İndirme başlatılamadı, doğrudan bağlantı deneniyor...', 'error');
      window.location.href = url;
    } finally {
      setDownloadingZipType(null);
    }
  };

  // Save Legal Notice & KVKK texts to Firestore & app state
  const handleSaveLegalNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingLegal(true);
    try {
      await saveLegalConfigToFirestore(legalForm);
      if (onUpdateLegalConfig) {
        await onUpdateLegalConfig(legalForm);
      }
      setLegalSavedSuccess(true);
      showNotice('Yasal Bilgilendirme ve KVKK metinleri başarıyla kaydedildi.', 'success');
      setTimeout(() => setLegalSavedSuccess(false), 4000);
    } catch {
      showNotice('Metinler kaydedilirken bir hata oluştu.', 'error');
    } finally {
      setIsSavingLegal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#141414] border-2 border-[#c1121f] rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col h-[94vh]">
        
        {/* TOP BAR */}
        <div className="bg-[#c1121f] text-white px-5 sm:px-8 py-3.5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <NarLogo size={36} showText={false} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-black tracking-tight uppercase">
                  Nar Optik Yönetim Paneli
                </h2>
                <span className="hidden sm:inline bg-black/25 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Canlı Vitrin Kontrolü
                </span>
              </div>
              <p className="text-[10px] text-white/90">
                Yetkili: Opt. Ömer YOLDAŞ · Kükürtlü, Zübeyde Hanım Cd. No:12/A, 16220 Osmangazi / BURSA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              title="Çıkış Yap"
              className="py-1.5 px-3 bg-black/30 hover:bg-black/50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-200" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/25 hover:bg-black/45 text-white flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global System Notice Toast Banner */}
        {systemNotice && (
          <div
            className={`py-2 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 ${
              systemNotice.type === 'error'
                ? 'bg-red-950 text-red-200 border-b border-red-500/40'
                : systemNotice.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-b border-emerald-500/40'
                : 'bg-stone-800 text-stone-200 border-b border-white/10'
            }`}
          >
            <span>{systemNotice.text}</span>
          </div>
        )}

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-white/10 bg-[#191919] px-4 sm:px-8 shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#c1121f] text-white bg-white/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>Ürün Yönetimi ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'categories'
                ? 'border-[#c1121f] text-white bg-white/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Kategoriler & Alt Kategoriler ({categories.length - 1})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-extrabold flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#c1121f] text-white bg-white/5'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Ayarlar & Yedekleme</span>
          </button>
        </div>

        {/* TAB 1: ÜRÜN YÖNETİMİ */}
        {activeTab === 'products' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/5 p-3 sm:p-4 rounded-2xl border border-white/10">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ürün adı, kod veya özellik ara..."
                    className="w-full bg-[#111111] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={selectedFilterCategory}
                  onChange={(e) => setSelectedFilterCategory(e.target.value)}
                  className="bg-[#111111] border border-white/15 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-[#c1121f] cursor-pointer"
                >
                  <option value="all">Tüm Kategoriler ({items.length})</option>
                  {categories
                    .filter((c) => c.id !== 'bize-ulasin')
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.label} (
                        {items.filter((i) => i.category === cat.id).length})
                      </option>
                    ))}
                </select>
              </div>

              {/* Add Product Button */}
              <button
                onClick={() => handleOpenAddProduct()}
                className="py-2.5 px-4 bg-[#c1121f] hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Ürün Ekle</span>
              </button>
            </div>

            {/* Product Table / Cards */}
            <div className="grid grid-cols-1 gap-2.5">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs bg-white/5 rounded-2xl border border-white/5">
                  Aradığınız kriterlere uygun ürün bulunamadı.
                </div>
              ) : (
                filteredItems.map((item) => {
                  const catObj = categories.find((c) => c.id === item.category);
                  return (
                    <div
                      key={item.id}
                      className="bg-[#181818] border border-white/10 hover:border-white/20 p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-full border-2 border-[#c1121f] overflow-hidden bg-black shrink-0 shadow">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] text-stone-400 font-bold bg-white/5 px-2 py-0.5 rounded">
                              {catObj?.emoji} {catObj?.label || item.category}
                            </span>
                            {item.code && (
                              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded">
                                Kod: {item.code}
                              </span>
                            )}
                            {item.badge && (
                              <span className="text-[9px] font-extrabold text-white bg-[#c1121f] px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-extrabold text-white truncate">
                            {item.name}
                          </h3>

                          <p className="text-[11px] text-stone-400 truncate">
                            {item.subtitle} · <span className="text-stone-300">{item.specs}</span>
                          </p>
                        </div>
                      </div>

                      {/* Right: Price & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                        {/* Price box */}
                        <div className="text-left sm:text-right">
                          {item.campaignPrice ? (
                            <div>
                              {item.price && (
                                <span className="text-[10px] line-through text-stone-400 mr-1.5 block">
                                  {item.price}
                                </span>
                              )}
                              <span className="text-sm font-extrabold text-emerald-400">
                                {item.campaignPrice}
                              </span>
                              <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded ml-1 font-bold">
                                Kampanya
                              </span>
                            </div>
                          ) : item.price ? (
                            <span className="text-sm font-bold text-white font-mono">
                              {item.price}
                            </span>
                          ) : (
                            <span className="text-[11px] text-stone-500 italic">
                              Fiyat Belirtilmedi
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(item)}
                            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors cursor-pointer"
                            title="Düzenle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id, item.name)}
                            className="p-2 bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-200 rounded-xl transition-colors cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: KATEGORİ & ALT KATEGORİ YÖNETİMİ */}
        {activeTab === 'categories' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Top info and Add Category button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Katalog Kategorileri ve Alt Segmentler
                </h3>
                <p className="text-xs text-stone-400">
                  Yeni kategori veya mevcut kategorilere alt segmentler ekleyip vitrinde anında sergileyebilirsiniz.
                </p>
              </div>

              <button
                onClick={() => setIsNewCategoryOpen(true)}
                className="py-2.5 px-4 bg-[#c1121f] hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <FolderPlus className="w-4 h-4" />
                <span>+ Yeni Kategori Ekle</span>
              </button>
            </div>

            {/* Category Cards Tree */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories
                .filter((c) => c.id !== 'bize-ulasin')
                .map((cat) => {
                  const catItemsCount = items.filter((i) => i.category === cat.id).length;
                  return (
                    <div
                      key={cat.id}
                      className="bg-[#181818] border border-white/10 rounded-2xl p-4 space-y-3 shadow"
                    >
                      {/* Category Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{cat.emoji}</span>
                          <div>
                            <h4 className="text-sm font-extrabold text-white">
                              {cat.label}
                            </h4>
                            <span className="text-[10px] text-stone-400 font-mono">
                              ID: {cat.id} · {catItemsCount} Ürün
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Order / Reorder Buttons */}
                          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveCategory(cat.id, 'up')}
                              className="p-1 hover:bg-white/15 text-stone-300 hover:text-white rounded transition-colors cursor-pointer"
                              title="Öne Taşı (Yukarı)"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveCategory(cat.id, 'down')}
                              className="p-1 hover:bg-white/15 text-stone-300 hover:text-white rounded transition-colors cursor-pointer"
                              title="Sonraya Taşı (Aşağı)"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              setTargetCatIdForSub(cat.id);
                              setIsNewSubCatOpen(true);
                            }}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Alt Kategori Ekle"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Alt Kategori</span>
                          </button>

                          {cat.isCustom && (
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.label)}
                              className="p-1.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Kategoriyi Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subcategories Chips */}
                      <div>
                        <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1.5">
                          Alt Kategoriler:
                        </span>
                        {(!cat.subcategories || cat.subcategories.length === 0) ? (
                          <p className="text-[11px] text-stone-500 italic">
                            Tanımlı alt kategori bulunmuyor.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {cat.subcategories.map((sub) => (
                              <span
                                key={sub.id}
                                className="inline-flex items-center gap-1 bg-white/5 border border-white/10 text-stone-200 px-2.5 py-1 rounded-lg text-xs"
                              >
                                <span>{sub.name}</span>
                                <button
                                  onClick={() => handleDeleteSubCategory(cat.id, sub.id)}
                                  className="text-stone-400 hover:text-red-400 ml-1 cursor-pointer"
                                  title="Alt Kategoriyi Sil"
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Quick Add Product to this Category */}
                      <div className="pt-1">
                        <button
                          onClick={() => handleOpenAddProduct(cat.id)}
                          className="w-full py-1.5 bg-black/40 hover:bg-black/60 border border-white/5 text-amber-400 hover:text-amber-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Bu Kategoriye Ürün Ekle</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

          </div>
        )}

        {/* TAB 3: AYARLAR & YEDEKLEME */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-2xl mx-auto space-y-6 w-full">
            
            {/* Change Password Card */}
            <div className="bg-[#181818] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Yönetici Şifresini Değiştir</span>
              </div>
              <p className="text-xs text-stone-400">
                Hamburger menüden panele giriş yaparken kullanılan şifreyi buradan güncelleyebilirsiniz.
              </p>

              <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yeni şifrenizi giriniz..."
                  className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#c1121f]"
                />
                <button
                  type="submit"
                  className="py-2 px-4 bg-[#c1121f] hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Şifreyi Güncelle
                </button>
                {passSuccess && (
                  <span className="text-xs text-emerald-400 font-bold ml-2">
                    ✓ Şifre başarıyla güncellendi!
                  </span>
                )}
              </form>
            </div>

            {/* 📜 Yasal Bilgilendirme & KVKK Metin Yönetimi (Popup İçeriği) */}
            <div className="bg-[#181818] border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                  <FileText className="w-4 h-4 text-[#c1121f]" />
                  <span>Yasal Bilgilendirme & KVKK Metinleri (Popup)</span>
                </div>
                <span className="text-[10px] bg-red-950/60 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                  Canlı Popup
                </span>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                Site açılışında ziyaretçilere gösterilen mevzuat ve KVKK metinlerini buradan düzenleyebilirsiniz. Kaydettiğiniz metinler anında güncellenir ve Firebase Firestore bulut veritabanına işlenir.
              </p>

              <form onSubmit={handleSaveLegalNotice} className="space-y-4">
                {/* 1. Bölüm: Optisyenlik ve Tanıtım Mevzuatı */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c1121f]" />
                    <span>1. Bölüm: Optisyenlik ve Tanıtım Mevzuatı</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block mb-1">
                      Mevzuat Başlığı
                    </label>
                    <input
                      type="text"
                      value={legalForm.regulationTitle}
                      onChange={(e) => setLegalForm({ ...legalForm, regulationTitle: e.target.value })}
                      placeholder="Optisyenlik ve Tanıtım Mevzuatı"
                      className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block mb-1">
                      Mevzuat Açıklama Metni
                    </label>
                    <textarea
                      rows={3}
                      value={legalForm.regulationText}
                      onChange={(e) => setLegalForm({ ...legalForm, regulationText: e.target.value })}
                      placeholder="5193 sayılı kanun ve tanıtım rehberi bilgisi..."
                      className="w-full bg-[#111111] border border-white/15 rounded-xl p-2.5 text-xs text-stone-200 leading-relaxed focus:outline-none focus:border-[#c1121f]"
                      required
                    />
                  </div>
                </div>

                {/* 2. Bölüm: KVKK & Veri Güvenliği */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Lock className="w-3.5 h-3.5 text-[#c1121f]" />
                    <span>2. Bölüm: Kişisel Verilerin Korunması (KVKK)</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block mb-1">
                      KVKK Başlığı
                    </label>
                    <input
                      type="text"
                      value={legalForm.kvkkTitle}
                      onChange={(e) => setLegalForm({ ...legalForm, kvkkTitle: e.target.value })}
                      placeholder="Kişisel Verilerin Korunması (KVKK)"
                      className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block mb-1">
                      KVKK Aydınlatma & Veri Güvenliği Açıklaması
                    </label>
                    <textarea
                      rows={4}
                      value={legalForm.kvkkText}
                      onChange={(e) => setLegalForm({ ...legalForm, kvkkText: e.target.value })}
                      placeholder="6698 sayılı kanun gereği veri güvenliği ve aktarımı açıklaması..."
                      className="w-full bg-[#111111] border border-white/15 rounded-xl p-2.5 text-xs text-stone-200 leading-relaxed focus:outline-none focus:border-[#c1121f]"
                      required
                    />
                  </div>
                </div>

                {/* 3. Bölüm: Kurumsal İletişim & Veri Sorumlusu */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-3.5 space-y-2.5">
                  <span className="text-xs font-bold text-amber-300 block">
                    3. Bölüm: Veri Sorumlusu & İletişim Bilgileri
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 block mb-1">
                        Kurum Unvanı
                      </label>
                      <input
                        type="text"
                        value={legalForm.companyTitle}
                        onChange={(e) => setLegalForm({ ...legalForm, companyTitle: e.target.value })}
                        placeholder="Nar Optik"
                        className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-400 block mb-1">
                        İletişim E-posta Adresi
                      </label>
                      <input
                        type="email"
                        value={legalForm.contactEmail}
                        onChange={(e) => setLegalForm({ ...legalForm, contactEmail: e.target.value })}
                        placeholder="naroptiklens@gmail.com"
                        className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-400 block mb-1">
                      Mağaza Adresi
                    </label>
                    <input
                      type="text"
                      value={legalForm.companyAddress}
                      onChange={(e) => setLegalForm({ ...legalForm, companyAddress: e.target.value })}
                      placeholder="Kükürtlü, Zübeyde Hanım Cd. No:12/A, Osmangazi / BURSA"
                      className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSavingLegal}
                    className="py-2.5 px-4 bg-[#c1121f] hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingLegal ? 'Kaydediliyor...' : 'Metinleri Kaydet & Popup\'ı Güncelle'}</span>
                  </button>

                  {onOpenLegalNoticePreview && (
                    <button
                      type="button"
                      onClick={onOpenLegalNoticePreview}
                      className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Popup&apos;ı Şimdi Görüntüle</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setLegalForm(DEFAULT_LEGAL_CONFIG);
                      showNotice('Metinler varsayılan ayarlara getirildi. Uygulamak için kaydet butonuna basınız.', 'info');
                    }}
                    className="py-2 px-3 text-stone-400 hover:text-white text-xs font-semibold cursor-pointer ml-auto"
                  >
                    Varsayılana Sıfırla
                  </button>
                </div>

                {legalSavedSuccess && (
                  <div className="p-2.5 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Yasal metinler ve KVKK içeriği başarıyla kaydedildi!</span>
                  </div>
                )}
              </form>
            </div>

            {/* Backup & Export Card */}
            <div className="bg-[#181818] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Veri Yedekleme & Dışa Aktarma</span>
              </div>
              <p className="text-xs text-stone-400">
                Katalogdaki tüm kategorileri, alt kategorileri ve ürünleri JSON dosyası olarak bilgisayarınıza indirebilirsiniz.
              </p>
              <button
                onClick={handleExportData}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Katalog Yedeğini İndir (JSON)</span>
              </button>
            </div>

            {/* Firebase Firestore Cloud Database Card */}
            <div className="bg-[#181818] border border-amber-500/30 rounded-2xl p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-extrabold text-sm">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Firebase Firestore Bulut Veritabanı</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Canlı & Aktif</span>
                </span>
              </div>

              <div className="text-xs text-stone-300 space-y-1.5 bg-black/40 p-3.5 rounded-xl border border-white/5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-stone-400">Firebase Proje ID:</span>
                  <span className="text-amber-200 font-bold">sanguine-server-7v9wh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Yönetici E-posta:</span>
                  <span className="text-white font-bold">naroptiklens@gmail.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Veritabanı Koleksiyonları:</span>
                  <span className="text-emerald-300">categories, catalog_items</span>
                </div>
              </div>

              <p className="text-xs text-stone-400">
                Eklediğiniz kategoriler, alt kategoriler ve teknik detaylı ürünler otomatik olarak Firebase Firestore&apos;a kaydedilir.
              </p>

              <button
                type="button"
                disabled={isSyncingFirebase}
                onClick={async () => {
                  setIsSyncingFirebase(true);
                  try {
                    await Promise.all([
                      saveCategoriesToFirestore(categories),
                      saveItemsToFirestore(items),
                    ]);
                    showNotice('Tüm katalog verileri Firebase Firestore ile başarıyla eşitlendi!', 'success');
                  } catch {
                    showNotice('Firebase senkronizasyonunda hata oluştu.', 'error');
                  } finally {
                    setIsSyncingFirebase(false);
                  }
                }}
                className="py-2.5 px-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <Cloud className={`w-4 h-4 ${isSyncingFirebase ? 'animate-spin' : ''}`} />
                <span>
                  {isSyncingFirebase ? 'Firebase Bulutuna Eşitleniyor...' : 'Kataloğu Şimdi Firebase ile Eşitle & Kaydet'}
                </span>
              </button>
            </div>

            {/* Proje Dosyalarını İndir (.ZIP) Kartı */}
            <div className="bg-[#181818] border border-blue-900/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-extrabold text-sm">
                <Download className="w-4 h-4 text-blue-400" />
                <span>Tüm Proje Kaynak Kodları ve Dosyaları (.ZIP)</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Tüm React &amp; TypeScript kaynak kodları, bileşenler, görseller, Firebase kuralları ve yerel çalıştırma rehberini (<code className="text-blue-300">README.md</code>) içeren eksiksiz proje arşivini bilgisayarınıza indirin.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={downloadingZipType !== null}
                  onClick={() => handleDownloadZipFile('/nar-optik-tam-proje.zip', 'nar-optik-tam-proje.zip', 'full')}
                  className="inline-flex items-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  <Download className={`w-4 h-4 ${downloadingZipType === 'full' ? 'animate-bounce' : ''}`} />
                  <span>
                    {downloadingZipType === 'full' ? 'İndiriliyor (18.6 MB)...' : '📦 Tam Projeyi İndir (.ZIP - 18.6 MB)'}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={downloadingZipType !== null}
                  onClick={() => handleDownloadZipFile('/nar-optik-kodlar.zip', 'nar-optik-kodlar.zip', 'code')}
                  className="inline-flex items-center gap-2 py-2.5 px-4 bg-stone-800 hover:bg-stone-700 border border-stone-600 disabled:opacity-50 text-emerald-300 font-bold text-xs rounded-xl transition-colors shadow-md cursor-pointer"
                >
                  <Download className={`w-4 h-4 ${downloadingZipType === 'code' ? 'animate-bounce' : ''}`} />
                  <span>
                    {downloadingZipType === 'code' ? 'İndiriliyor (122 KB)...' : '⚡ Sadece Kodları İndir (.ZIP - 122 KB)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Reset Defaults Card */}
            <div className="bg-[#181818] border border-red-900/40 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-extrabold text-sm">
                <RotateCcw className="w-4 h-4 text-red-400" />
                <span>Fabrika / Orijinal Kataloğa Sıfırla</span>
              </div>
              <p className="text-xs text-stone-400">
                Yapılan tüm ürün ve kategori değişikliklerini sıfırlayıp ilk açılıştaki zengin örnek kataloğa geri döndürür.
              </p>
              <button
                type="button"
                onClick={() => {
                  setPendingConfirm({
                    title: 'Varsayılan Kataloğu Yükle',
                    message: 'Tüm özel eklemelerinizi sıfırlayıp ilk varsayılan kataloğu geri yüklemek istediğinize emin misiniz?',
                    confirmText: 'Sıfırla ve Yükle',
                    danger: true,
                    onConfirm: () => {
                      onResetDefaults();
                      showNotice('Katalog başarıyla ilk varsayılan haline getirildi.', 'success');
                      setPendingConfirm(null);
                    },
                  });
                }}
                className="py-2.5 px-4 bg-stone-800 hover:bg-red-950 border border-red-500/30 text-red-300 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Varsayılan Kataloğu Yükle</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: ADD / EDIT PRODUCT FORM */}
      {isProductFormOpen && (
        <div className="fixed inset-0 z-[10010] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-3xl bg-[#161616] border-2 border-[#c1121f] rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Header */}
            <div className="bg-[#c1121f] px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <h3 className="font-extrabold text-base">
                  {editingItem ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h3>
              </div>
              <button
                onClick={() => setIsProductFormOpen(false)}
                className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/35 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-5">
              
              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-300 uppercase">
                    Ana Kategori *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const sub = categories.find((c) => c.id === newCat)?.subcategories?.[0]?.id || '';
                      setFormData({ ...formData, category: newCat, subcategory: sub });
                    }}
                    className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c1121f]"
                  >
                    {categories
                      .filter((c) => c.id !== 'bize-ulasin')
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-300 uppercase">
                    Alt Kategori (Opsiyonel)
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#c1121f]"
                  >
                    <option value="">(Seçilmedi)</option>
                    {categories
                      .find((c) => c.id === formData.category)
                      ?.subcategories?.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Name & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-300 uppercase">
                    Ürün Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Nar Cortina Havana"
                    className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c1121f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-300 uppercase">
                    Ürün Kodu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Örn: NAR-802 HVN"
                    className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>

              {/* Subtitle & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-300 uppercase">
                    Kısa Açıklama / Alt Başlık *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Örn: Bal Rengi Havana Asetat · Amber Polarize"
                    className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c1121f]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-300 uppercase">
                    Rozet / Etiket (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="Örn: KAMPANYA, YENİ, TİTANYUM"
                    className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c1121f]"
                  />
                </div>
              </div>

              {/* Pricing Section (Fiyat & Kampanyalı Fiyat) */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                  <DollarSign className="w-4 h-4" />
                  <span>Fiyatlandırma & Kampanya Bilgisi</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-300">
                      Normal Fiyat
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Örn: 4.500 ₺"
                      className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c1121f]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-emerald-400">
                      Kampanyalı / İndirimli Fiyat
                    </label>
                    <input
                      type="text"
                      value={formData.campaignPrice}
                      onChange={(e) => setFormData({ ...formData, campaignPrice: e.target.value })}
                      placeholder="Örn: 3.750 ₺ (Eski fiyatın üzeri çizilir)"
                      className="w-full bg-[#111111] border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-emerald-300 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* Visual Image Selector (Device Upload, Presets, or Custom URL) */}
              <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Ürün Görseli Seçimi & Yükleme</span>
                  </label>

                  {/* Method Switcher */}
                  <div className="flex items-center gap-1 bg-[#111111] p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setUploadMethod('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        uploadMethod === 'upload'
                          ? 'bg-[#c1121f] text-white shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Cihazdan Yükle</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUploadMethod('preset')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        uploadMethod === 'preset'
                          ? 'bg-[#c1121f] text-white shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Hazır Galeri</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUploadMethod('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                        uploadMethod === 'url'
                          ? 'bg-[#c1121f] text-white shadow'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <span>Web Linki</span>
                    </button>
                  </div>
                </div>

                {/* Active Preview & Upload Area */}
                <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                  {/* Live Circular Preview (Identical to Vitrine display) */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#c1121f] overflow-hidden bg-black shadow-xl relative flex items-center justify-center p-1">
                      <img
                        src={formData.image}
                        alt="Önizleme"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PRESET_IMAGES[0].path;
                        }}
                      />
                      {formData.badge && (
                        <span className="absolute top-1 right-1 bg-[#c1121f] text-white text-[7px] font-extrabold px-1.5 py-0.5 rounded-full">
                          {formData.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 font-semibold">
                      Vitrin Görünümü
                    </span>
                  </div>

                  {/* Method 1: Upload from device (Computer or Phone) */}
                  {uploadMethod === 'upload' && (
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/20 hover:border-[#c1121f] rounded-2xl p-5 text-center cursor-pointer transition-all bg-[#111111] hover:bg-[#181818] flex flex-col items-center justify-center space-y-2 group"
                      >
                        <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 group-hover:border-[#c1121f] flex items-center justify-center text-amber-400 group-hover:scale-105 transition-all">
                          {isUploading ? (
                            <RefreshCw className="w-5 h-5 animate-spin text-[#c1121f]" />
                          ) : (
                            <Upload className="w-5 h-5 text-amber-400" />
                          )}
                        </div>

                        <div>
                          <span className="text-xs font-bold text-white block">
                            {isUploading ? 'Görsel optimize ediliyor...' : 'Kendi Fotoğrafınızı Yüklemek İçin Dokunun'}
                          </span>
                          <span className="text-[11px] text-stone-400 block mt-0.5">
                            Bilgisayarınızdan dosya seçin veya cep telefonunuzun kamerası / galerisinden fotoğraf yükleyin
                          </span>
                          <span className="text-[9.5px] text-stone-500 block mt-1">
                            JPG, PNG, WEBP desteklenir · Yüksek çözünürlük otomatik olarak optimize edilir
                          </span>
                        </div>
                      </div>

                      {uploadSuccessNote && (
                        <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-1.5 justify-center font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{uploadSuccessNote}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Method 2: Preset Gallery */}
                  {uploadMethod === 'preset' && (
                    <div className="flex-1 w-full space-y-2">
                      <span className="text-[11px] text-stone-400 block">
                        Aşağıdaki hazır yüksek çözünürlüklü optik katalog görsellerinden birine dokunarak seçebilirsiniz:
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {PRESET_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: preset.path })}
                            className={`relative rounded-xl overflow-hidden border-2 p-0.5 group transition-all cursor-pointer text-left ${
                              formData.image === preset.path
                                ? 'border-[#c1121f] scale-105 shadow-md bg-white/5'
                                : 'border-white/10 hover:border-white/30'
                            }`}
                          >
                            <img
                              src={preset.path}
                              alt={preset.label}
                              className="w-full h-12 object-cover rounded-lg"
                            />
                            <span className="block text-[8.5px] text-stone-300 truncate mt-0.5 px-0.5">
                              {preset.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Method 3: Custom Web URL */}
                  {uploadMethod === 'url' && (
                    <div className="flex-1 w-full space-y-2">
                      <label className="text-[11px] text-stone-300 block">
                        İnternet üzerindeki herhangi bir görselin doğrudan bağlantısını yapıştırın:
                      </label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://example.com/optik-gozluk.jpg"
                        className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-[#c1121f]"
                      />
                      <span className="text-[10px] text-stone-500 block">
                        Bağlantı girildiğinde sol taraftaki yuvarlak çerçevede anında önizlenecektir.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Specifications (Teknik Bilgilendirmeler) */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Teknik Bilgilendirmeler & Ölçüler</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400">
                      Özet Özellik (Kartta Görünen) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.specs}
                      onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                      placeholder="Örn: 51口20 145 mm · Polarize UV400"
                      className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400">
                      Ekartman Ölçüsü (Gözlük İçin)
                    </label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="Örn: 51口20 145 mm"
                      className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400">
                      Gövde / Malzeme
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      placeholder="Örn: Japon Beta-Titanyum / Mazzucchelli Asetat"
                      className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400">
                      Menşei / Üretim
                    </label>
                    <input
                      type="text"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      placeholder="Örn: Japonya / Sabae veya İtalya"
                      className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400">
                      Cam Tipi / Filtre
                    </label>
                    <input
                      type="text"
                      value={formData.lensType}
                      onChange={(e) => setFormData({ ...formData, lensType: e.target.value })}
                      placeholder="Örn: UV400 Polarize Kat. 3 / Anti-Refle"
                      className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400">
                      Garanti & Orijinallik
                    </label>
                    <input
                      type="text"
                      value={formData.warranty}
                      onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                      placeholder="Örn: 2 Yıl Nar Optik Güvencesi"
                      className="w-full bg-[#111111] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Contact Lens Specific Specs */}
                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-400 uppercase block">
                    Kontakt Lens Parametreleri (Gerekirse):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <input
                      type="text"
                      value={formData.baseCurve}
                      onChange={(e) => setFormData({ ...formData, baseCurve: e.target.value })}
                      placeholder="BC (Örn: 8.4 mm)"
                      className="bg-[#111111] border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white"
                      title="Temel Eğri (BC)"
                    />
                    <input
                      type="text"
                      value={formData.diameter}
                      onChange={(e) => setFormData({ ...formData, diameter: e.target.value })}
                      placeholder="DIA (Örn: 14.2 mm)"
                      className="bg-[#111111] border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white"
                      title="Çap (DIA)"
                    />
                    <input
                      type="text"
                      value={formData.waterContent}
                      onChange={(e) => setFormData({ ...formData, waterContent: e.target.value })}
                      placeholder="Su (Örn: %38)"
                      className="bg-[#111111] border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white"
                      title="Su İçeriği & Nem"
                    />
                    <input
                      type="text"
                      value={formData.oxygen}
                      onChange={(e) => setFormData({ ...formData, oxygen: e.target.value })}
                      placeholder="Oksijen (Örn: 147 Dk/t)"
                      className="bg-[#111111] border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white"
                      title="Oksijen Geçirgenliği"
                    />
                    <input
                      type="text"
                      value={formData.replacement}
                      onChange={(e) => setFormData({ ...formData, replacement: e.target.value })}
                      placeholder="Değişim (Örn: Aylık)"
                      className="bg-[#111111] border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white"
                      title="Kullanım Periyodu"
                    />
                  </div>
                </div>

                {/* Dynamic Custom Technical Specification Boxes */}
                <div className="pt-3 border-t border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-amber-300 block">
                        Özel / İlave Teknik Özellik Kutucukları
                      </span>
                      <span className="text-[10px] text-stone-400 block">
                        Ürüne özel eklemek istediğiniz kutucuklar (örneğin: Ağırlık, Polarize Katmanı, Burun Pedi vb.)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddCustomTechField}
                      className="py-1.5 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Yeni Kutu Ekle</span>
                    </button>
                  </div>

                  {formData.customFields.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {formData.customFields.map((cf, idx) => (
                        <div
                          key={cf.id}
                          className="flex items-center gap-2 bg-[#111111] p-2.5 rounded-xl border border-white/10"
                        >
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={cf.label}
                              onChange={(e) =>
                                handleUpdateCustomTechField(cf.id, 'label', e.target.value)
                              }
                              placeholder={`Kutu Başlığı (Örn: Ağırlık / Polarizasyon)`}
                              className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-amber-200 placeholder:text-stone-500"
                            />
                            <input
                              type="text"
                              value={cf.value}
                              onChange={(e) =>
                                handleUpdateCustomTechField(cf.id, 'value', e.target.value)
                              }
                              placeholder="Kutu Değeri (Örn: 11 gram / Kat. 3 UV400)"
                              className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-stone-500"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCustomTechField(cf.id)}
                            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Bu Kutuyu Kaldır"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-300 uppercase">
                  Detaylı Açıklama *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Ürünün işçiliği, malzemesi ve kullanıcıya sağladığı konforu anlatınız..."
                  className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c1121f]"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductFormOpen(false)}
                  className="py-2.5 px-5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-6 bg-[#c1121f] hover:bg-red-700 active:scale-95 text-white font-extrabold text-xs rounded-xl shadow-lg cursor-pointer"
                >
                  {editingItem ? 'Değişiklikleri Kaydet' : 'Ürünü Vitrine Ekle'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CATEGORY */}
      {isNewCategoryOpen && (
        <div className="fixed inset-0 z-[10010] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#161616] border-2 border-[#c1121f] rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[#c1121f]" />
                <span>Yeni Kategori Ekle</span>
              </h3>
              <button
                onClick={() => setIsNewCategoryOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  required
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  placeholder="Örn: Spor Gözlükleri, Çocuk Gözlükleri"
                  className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c1121f]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">
                  Emoji / İkon
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCatEmoji}
                    onChange={(e) => setNewCatEmoji(e.target.value)}
                    placeholder="👓"
                    className="w-16 bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-center text-lg text-white"
                  />
                  <div className="flex gap-1.5">
                    {['👓', '🕶️', '👁️', '🤿', '🚴', '👶', '✨'].map((em) => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setNewCatEmoji(em)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-base cursor-pointer"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryOpen(false)}
                  className="py-2 px-4 bg-white/10 text-xs font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#c1121f] hover:bg-red-700 text-xs font-extrabold text-white rounded-xl shadow cursor-pointer"
                >
                  Kategoriyi Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD SUBCATEGORY */}
      {isNewSubCatOpen && (
        <div className="fixed inset-0 z-[10010] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#161616] border-2 border-[#c1121f] rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>Yeni Alt Kategori Ekle</span>
              </h3>
              <button
                onClick={() => setIsNewSubCatOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubCategory} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">
                  Üst Kategori
                </label>
                <div className="text-xs font-bold text-amber-400 bg-white/5 p-2 rounded-xl border border-white/10">
                  {categories.find((c) => c.id === targetCatIdForSub)?.emoji}{' '}
                  {categories.find((c) => c.id === targetCatIdForSub)?.label}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-300">
                  Alt Kategori Adı *
                </label>
                <input
                  type="text"
                  required
                  value={newSubCatName}
                  onChange={(e) => setNewSubCatName(e.target.value)}
                  placeholder="Örn: Balıkçı Serisi, Mavi Işık Korumalı"
                  className="w-full bg-[#202020] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#c1121f]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewSubCatOpen(false)}
                  className="py-2 px-4 bg-white/10 text-xs font-bold rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-emerald-600 hover:bg-emerald-500 text-xs font-extrabold text-white rounded-xl shadow cursor-pointer"
                >
                  Alt Kategoriyi Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IN-APP CONFIRMATION MODAL */}
      {pendingConfirm && (
        <div className="fixed inset-0 z-[10020] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#181818] border border-white/20 rounded-3xl p-6 shadow-2xl text-white space-y-4">
            <h3 className="text-base font-black text-white">
              {pendingConfirm.title}
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {pendingConfirm.message}
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingConfirm(null)}
                className="py-2 px-4 bg-white/10 hover:bg-white/15 text-stone-300 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={pendingConfirm.onConfirm}
                className={`py-2 px-5 text-xs font-black text-white rounded-xl shadow-lg transition-all cursor-pointer ${
                  pendingConfirm.danger
                    ? 'bg-red-600 hover:bg-red-700 active:scale-95'
                    : 'bg-[#c1121f] hover:bg-red-700 active:scale-95'
                }`}
              >
                {pendingConfirm.confirmText || 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

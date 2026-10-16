export interface SubCategory {
  id: string;
  name: string;
  description?: string;
}

export interface CatalogCategory {
  id: string;
  label: string;
  emoji: string;
  order?: number;
  subcategories?: SubCategory[];
  isCustom?: boolean;
}

export interface CatalogItem {
  id: string;
  category: string;
  subcategory?: string;
  name: string;
  subtitle: string;
  order?: number;
  code?: string;
  specs: string;
  details: string;
  image: string;
  badge?: string;
  price?: string;
  campaignPrice?: string;
  isEyewear?: boolean;
  colorOptions?: string[];
  dimensions?: string; // For glasses
  techData?: {
    material?: string;
    origin?: string;
    warranty?: string;
    lensType?: string;
    baseCurve?: string; // For lenses BC
    diameter?: string;  // For lenses DIA
    waterContent?: string;
    oxygen?: string;
    replacement?: string;
    additionalNotes?: string;
    customFields?: { id?: string; label: string; value: string }[];
  };
}

export const CATALOG_CATEGORIES: CatalogCategory[] = [
  {
    id: 'optik-cam',
    label: 'Optik Camlar',
    emoji: '👁️',
    order: 1,
    subcategories: [
      { id: 'progresif', name: 'Progresif Camlar' },
      { id: 'mavi-isik', name: 'Mavi Işık Filtreli' },
      { id: 'fotokromik', name: 'Fotokromik (Transitions)' },
      { id: 'ultra-ince', name: 'İnceltilmiş (1.67 / 1.74)' },
    ],
  },
  {
    id: 'optik-gozluk',
    label: 'Optik Gözlük',
    emoji: '👓',
    order: 2,
    subcategories: [
      { id: 'titanyum', name: 'Beta-Titanyum' },
      { id: 'asetat', name: 'Asetat & Kemik' },
      { id: 'cercevesiz', name: 'Çerçevesiz (Rimless)' },
      { id: 'geometrik', name: 'Geometrik Modeller' },
    ],
  },
  {
    id: 'gunes-gozlugu',
    label: 'Güneş Gözlüğü',
    emoji: '🕶️',
    order: 3,
    subcategories: [
      { id: 'polarize', name: 'Polarize Filtreli' },
      { id: 'aviator', name: 'Aviator & Pilot' },
      { id: 'cat-eye', name: 'Cat-Eye Tasarım' },
      { id: 'retro', name: 'Retro & Vintage' },
    ],
  },
  {
    id: 'numarali-lens',
    label: 'Numaralı Lensler',
    emoji: '👁️',
    order: 4,
    subcategories: [
      { id: 'aylik', name: 'Aylık Değişim' },
      { id: 'gunluk', name: 'Günlük Kullan-At' },
      { id: 'torik', name: 'Torik (Astigmatlı)' },
    ],
  },
  {
    id: 'renkli-lens',
    label: 'Renkli Lensler',
    emoji: '👁️',
    order: 5,
    subcategories: [
      { id: 'numarasiz-renkli', name: 'Numarasız Kozmetik' },
      { id: 'numarali-renkli', name: 'Numaralı Renkli' },
      { id: 'haresiz', name: 'Haresiz Doğal Seri' },
    ],
  },
  {
    id: 'aksesuar',
    label: 'Aksesuar',
    emoji: '👓',
    order: 6,
    subcategories: [
      { id: 'solusyon', name: 'Lens Solüsyonları' },
      { id: 'temizlik', name: 'Temizleme Setleri' },
      { id: 'kilif', name: 'Deri Kılıf & İp' },
    ],
  },
  { id: 'bize-ulasin', label: 'Bize Ulaşın', emoji: '📞', order: 999 },
];

export const CATALOG_ITEMS: CatalogItem[] = [
  // ── 1. OPTİK CAMLAR ──
  {
    id: 'cam-progresif-hd',
    category: 'optik-cam',
    name: 'FreeForm HD Progresif Cam',
    subtitle: 'Uzak · Orta · Yakın Kesintisiz',
    code: 'CAM-PRO-HD',
    specs: 'Kişiye Özel Dijital Yüzey İşleme',
    details: 'Baş hareketini minimuma indiren geniş görüş koridoru. Bilgisayar ekranı ve okuma mesafesi arasında yumuşak odaklama.',
    image: '/images/optical_lens_coating_1792095026819.jpg',
    badge: 'KİŞİYE ÖZEL',
    price: '4.800 ₺',
    campaignPrice: '3.950 ₺',
    subcategory: 'progresif',
    techData: {
      material: '1.60 / 1.67 MR-8 Organik Polimer',
      origin: 'Almanya Laboratuvar Üretimi',
      warranty: '2 Yıl Adaptasyon Garantisi',
      lensType: 'Çok Odaklı Dijital FreeForm',
    },
  },
  {
    id: 'cam-blueprotect',
    category: 'optik-cam',
    name: 'BlueProtect 420nm Ekran Camı',
    subtitle: 'Zararlı Mavi Işık Kalkanı',
    code: 'CAM-BLUE-420',
    specs: 'HEV 420nm %99.4 Filtreleme',
    details: 'Monitör, telefon ve tabletlerden yayılan zararlı mavi ışığı kırarak göz yorgunluğunu, yanmayı ve baş ağrılarını önler.',
    image: '/images/optical_lens_coating_1792095026819.jpg',
    badge: 'DİJİTAL KALKAN',
    price: '1.850 ₺',
    campaignPrice: '1.450 ₺',
    subcategory: 'mavi-isik',
    techData: {
      material: '1.56 / 1.61 İnceltilmiş Polimer',
      origin: 'Japonya Optik Hammaddesi',
      warranty: '2 Yıl Kaplama Garantisi',
      lensType: 'Antirefle & Mavi Işık Filtresi',
    },
  },
  {
    id: 'cam-transitions-gen8',
    category: 'optik-cam',
    name: 'Transitions Gen-8 Fotokromik',
    subtitle: 'Akıllı Işığa Duyarlı Renk Geçişi',
    code: 'CAM-TRANS-G8',
    specs: 'Kapalı Alanda %100 Şeffaf · Güneşte Koyu',
    details: 'Güneş ışığına çıktığınızda 15 saniyede kararır, kapalı alana girdiğinizde hızla şeffaflaşır. Hem optik hem güneş gözlüğü.',
    image: '/images/optical_lens_coating_1792095026819.jpg',
    badge: 'AKILLI CAM',
    techData: {
      material: 'Akıllı Moleküler Fotokromik Matris',
      origin: 'İrlanda / Fransa Üretimi',
      warranty: '2 Yıl Nar Optik Güvencesi',
      lensType: 'UV400 + Fotokromik + AR',
    },
  },
  {
    id: 'cam-ultra-ince-174',
    category: 'optik-cam',
    name: '1.74 Ultra İnceltilmiş Asferik',
    subtitle: 'Yüksek Numaralara %60 İncelik',
    code: 'CAM-INDEX-174',
    specs: 'Sıfır Kenar Kalınlığı · Asferik Düz Yüzey',
    details: 'Yüksek miyop ve hipermetroplarda gözün arkadan küçük veya büyük görünmesini engeller. Minimum ağırlık, maksimum zarafet.',
    image: '/images/optical_lens_coating_1792095026819.jpg',
    badge: 'ULTRA İNCE',
    techData: {
      material: 'Mitsui MR-174 Yüksek Kırılma İndeksi',
      origin: 'Japonya Hassas Döküm',
      warranty: '2 Yıl Çizilmezlik Garantisi',
      lensType: 'Çift Taraflı Asferik Antirefle',
    },
  },
  {
    id: 'cam-polarize-receteli',
    category: 'optik-cam',
    name: 'Reçeteli Polarize HD Cam',
    subtitle: 'Numaralı Güneş Koruması',
    code: 'CAM-POL-RX',
    specs: '%99.9 Su & Asfalt Parlama Önleyici',
    details: 'Göz doktorunuzun yazdığı reçeteye birebir uyumlu, parlamaları sıfırlayan ve renk kontrastını artıran güneş camı.',
    image: '/images/optical_lens_coating_1792095026819.jpg',
    badge: 'PARLAMA SIFIR',
    techData: {
      material: 'Polarize Film Enjeksiyonlu CR-39',
      origin: 'İtalya Belluno Laboratuvarı',
      warranty: '2 Yıl Delaminasyon Garantisi',
      lensType: 'Polarize Kategori 3 UV400',
    },
  },
  {
    id: 'cam-drivesafe',
    category: 'optik-cam',
    name: 'DriveSafe Gece Sürüş Camı',
    subtitle: 'Far & Yağmur Yansıma Azaltıcı',
    code: 'CAM-DRV-SAFE',
    specs: 'LED & Xenon Far Parlama Kesici',
    details: 'Karşıdan gelen araç farlarının yarattığı kamaşmayı engeller, alacakaranlıkta ve sisli havalarda yol derinliği sağlar.',
    image: '/images/optical_lens_coating_1792095026819.jpg',
    badge: 'GÜVENLİ SÜRÜŞ',
    techData: {
      material: 'Luminance Design Teknolojisi',
      origin: 'Almanya Üretimi',
      warranty: '2 Yıl Kaplama Garantisi',
      lensType: 'Kontrast Artırıcı Nano AR',
    },
  },

  // ── 2. OPTİK GÖZLÜK ──
  {
    id: 'nar-aero-rimless',
    category: 'optik-gozluk',
    name: 'Nar Aero Rimless',
    subtitle: '11g Beta-Titanyum Çerçevesiz',
    code: 'NAR-001 AER',
    specs: '52口19 145 mm · 11 Gram',
    details: 'Japon Sabae atölyesinde vidasız monoblok titanyumdan üretilmiştir. Yüzde hissedilmeyecek kadar hafif, minimalist delikli montaj.',
    image: '/images/eyewear_rimless_titanium_1792076598122.jpg',
    badge: '11 GRAM',
    price: '5.900 ₺',
    campaignPrice: '4.850 ₺',
    subcategory: 'cercevesiz',
    isEyewear: true,
    dimensions: '52口19 145 mm',
    techData: {
      material: 'Japonya Beta-Titanyum (Nikel İçermez)',
      origin: 'Japonya / Sabae',
      warranty: '3 Yıl Nar Optik Garantisi',
    },
  },
  {
    id: 'nar-kyoto-titanium',
    category: 'optik-gozluk',
    name: 'Nar Kyoto Titanium',
    subtitle: 'Yuvarlak Minimalist Saf Titanyum',
    code: 'NAR-108 TIT',
    specs: '48口21 142 mm · 12 Gram',
    details: 'Sıfır vida prensibiyle yekpare esnek titanyum halkalar. Hipoalerjenik, burun köprüsünde iz bırakmayan anatomik titanyum pedler.',
    image: '/images/eyewear_titanium_minimal_1792075603727.jpg',
    badge: 'JAPON ZANAAT',
    price: '4.600 ₺',
    subcategory: 'titanyum',
    isEyewear: true,
    dimensions: '48口21 142 mm',
    techData: {
      material: 'Pure Grade-2 Titanium',
      origin: 'Japonya / Fukui',
      warranty: '2 Yıl Nar Optik Garantisi',
    },
  },
  {
    id: 'nar-stella-cat-eye',
    category: 'optik-gozluk',
    name: 'Nar Stella Cat-Eye',
    subtitle: 'Fasetli Piyano Siyah İtalyan Asetat',
    code: 'NAR-601 CAT',
    specs: '53口17 140 mm · 22 Gram',
    details: 'El ile fasetlenmiş mimari açılar elmacık kemiklerini ön plana çıkarır. Kalın sap yapısında gizli altın menteşe mühür.',
    image: '/images/eyewear_cat_eye_black_1792075604545.jpg',
    badge: 'MİMARİ FORM',
    isEyewear: true,
    dimensions: '53口17 140 mm',
    techData: {
      material: 'Mazzucchelli 1849 Doğal Asetat',
      origin: 'İtalya / Venedik',
      warranty: '2 Yıl Nar Optik Garantisi',
    },
  },
  {
    id: 'nar-bauhaus-square',
    category: 'optik-gozluk',
    name: 'Nar Bauhaus Modern',
    subtitle: '0.6mm Fırçalanmış Cerrahi Çelik',
    code: 'NAR-310 BAU',
    specs: '50口18 145 mm · 14 Gram',
    details: 'Fonksiyonel Alman tasarım diline sahip lehimsiz ve vidasız geçmeli patentli menteşe. Kompakt köşeli modern profil.',
    image: '/images/eyewear_rimless_titanium_1792076598122.jpg',
    badge: 'VİDASIZ ÇELİK',
    isEyewear: true,
    dimensions: '50口18 145 mm',
    techData: {
      material: 'İsveç Paslanmaz Cerrahi Çelik',
      origin: 'Almanya / Dessau',
      warranty: '2 Yıl Nar Optik Garantisi',
    },
  },
  {
    id: 'nar-luna-panto',
    category: 'optik-gozluk',
    name: 'Nar Luna Panto',
    subtitle: 'Şampanya Kristal Biyo-Asetat',
    code: 'NAR-205 LUN',
    specs: '49口22 145 mm · 23 Gram',
    details: 'Fransız anahtar delikli burun köprüsü (keyhole bridge) ve ışığı kıran şeffaf şampanya asetat plakaları ile entelektüel duruş.',
    image: '/images/eyewear_amber_amalfi_1792076599340.jpg',
    badge: 'FRANSIZ PANTO',
    isEyewear: true,
    dimensions: '49口22 145 mm',
    techData: {
      material: 'Biyo-Çözünür Doğal Selüloz Asetat',
      origin: 'Fransa / Oyonnax',
      warranty: '2 Yıl Nar Optik Garantisi',
    },
  },
  {
    id: 'nar-hexa-pure',
    category: 'optik-gozluk',
    name: 'Nar Hexa Pure',
    subtitle: 'Lazer Kesim Altıgen Geometrik',
    code: 'NAR-412 HEX',
    specs: '50口19 142 mm · 16 Gram',
    details: 'Modern sekizgen-altıgen hibrit geometrisi ve ince çelik gövdesiyle yüz hatlarını dengeleyen özgün form.',
    image: '/images/eyewear_titanium_minimal_1792075603727.jpg',
    badge: 'GEOMETRİK',
    isEyewear: true,
    dimensions: '50口19 142 mm',
    techData: {
      material: 'İsveç Paslanmaz Çeliği',
      origin: 'İsveç / Stockholm',
      warranty: '2 Yıl Nar Optik Garantisi',
    },
  },

  // ── 3. GÜNEŞ GÖZLÜĞÜ ──
  {
    id: 'nar-amalfi-honey',
    category: 'gunes-gozlugu',
    name: 'Nar Amalfi Honey',
    subtitle: '8mm Kalın Bal Kehribar Asetat',
    code: 'NAR-880 AMF',
    specs: '54口21 145 mm · 34 Gram',
    details: 'Geniş fasetli kalın hatları ve ışığı içine çeken sıcak kehribar tonu. Koyu kahve degradé polarize filtre.',
    image: '/images/eyewear_amber_amalfi_1792076599340.jpg',
    badge: 'POLARİZE HD',
    isEyewear: true,
    dimensions: '54口21 145 mm',
    techData: {
      material: 'Mazzucchelli 8mm Biyo-Asetat',
      origin: 'İtalya / Belluno',
      warranty: '2 Yıl Nar Optik Garantisi',
    },
  },
  {
    id: 'nar-monaco-shield',
    category: 'gunes-gozlugu',
    name: 'Nar Monaco Shield',
    subtitle: 'Düz Üst Hatlı Mat Siyah Pilot',
    code: 'NAR-995 MNC',
    specs: '57口17 145 mm · 23 Gram',
    details: 'Düz üst kaş hattı ve keskin açılar. Asfalt ve su parlamalarını sıfıra indiren füme polarize HD camlar.',
    image: '/images/eyewear_monaco_shield_1792076599786.jpg',
    badge: 'FLAT TOP',
    isEyewear: true,
    dimensions: '57口17 145 mm',
    techData: {
      material: 'Karbon Fiber Takviyeli TR90',
      origin: 'Almanya / Rathenow',
      warranty: '2 Yıl Nar Optik Garantisi',
    },
  },
  {
    id: 'nar-cortina-havana',
    category: 'gunes-gozlugu',
    name: 'Nar Cortina Havana',
    subtitle: 'Klasik İtalyan Asetat & Kehribar',
    code: 'NAR-802 HVN',
    specs: '51口20 145 mm · 26 Gram',
    details: 'Dolomit dağlarının sonbahar tonlarından ilham alan el parlatması Havana asetatı ve altın menteşe pinleri.',
    image: '/images/eyewear_acetat_havana_1792075603090.jpg',
    badge: 'İTALYAN HAVANA',
    isEyewear: true,
    dimensions: '51口20 145 mm',
    techData: {
      material: 'Mazzucchelli Doğal Asetat',
      origin: 'İtalya / Belluno',
      warranty: '2 Yıl Nar Optik Garantisi',
    },
  },
  {
    id: 'nar-aethel-aviator',
    category: 'gunes-gozlugu',
    name: 'Nar Aethel Aviator',
    subtitle: '24K Altın Kaplama Çift Köprü Pilot',
    code: 'NAR-904 AVI',
    specs: '58口15 145 mm · 29 Gram',
    details: 'Çizilmeye dirençli mineral kristal camı ve derin zümrüt yeşili polarize filtresiyle havacılık klasiği.',
    image: '/images/eyewear_aviator_gold_1792075604578.jpg',
    badge: '24K ALTIN',
    isEyewear: true,
    dimensions: '58口15 145 mm',
    techData: {
      material: '24K Mikron Altın Kaplama Çelik',
      origin: 'Almanya Optik Laboratuvarı',
      warranty: '2 Yıl Nar Optik Garantisi',
    },
  },
  {
    id: 'nar-solaris-gold',
    category: 'gunes-gozlugu',
    name: 'Nar Solaris Gold Limited',
    subtitle: 'Rose Gold Titanyum & Fotokromik',
    code: 'NAR-990 SOL',
    specs: '54口19 145 mm · 21 Gram',
    details: 'Kapalı alanda açık ton, güneş altında anında koyulaşan hibrit polarize geçişli lüks koleksiyon.',
    image: '/images/eyewear_aviator_gold_1792075604578.jpg',
    badge: 'FOTOKROMİK',
    isEyewear: true,
    dimensions: '54口19 145 mm',
    techData: {
      material: '18K Rose Gold Titanyum',
      origin: 'İsviçre & İtalya Özel Seri',
      warranty: '3 Yıl Nar Optik Garantisi',
    },
  },
  {
    id: 'nar-riviera-polarized',
    category: 'gunes-gozlugu',
    name: 'Nar Riviera Polarized',
    subtitle: 'Darbe Dayanımlı Esnek TR90 Marin',
    code: 'NAR-730 RIV',
    specs: '56口18 148 mm · 20 Gram',
    details: 'Deniz ve yolculuk tutkunları için ultra hafif, ter ve tuzlu suya dayanıklı esnek gövde ve koyu füme filtre.',
    image: '/images/eyewear_monaco_shield_1792076599786.jpg',
    badge: 'MARİN POLARİZE',
    isEyewear: true,
    dimensions: '56口18 148 mm',
    techData: {
      material: 'TR90 Grilamid & Titanyum',
      origin: 'Türkiye & İtalya Ortak Üretim',
      warranty: '2 Yıl Nar Optik Garantisi',
    },
  },

  // ── 4. NUMARALI LENSLER ──
  {
    id: 'lens-acuvue-oasys',
    category: 'numarali-lens',
    name: 'Acuvue Oasys HydraLuxe',
    subtitle: '15 Günlük / Günlük Nem Tutucu',
    code: 'LNS-ACV-OAS',
    specs: 'BC: 8.4/8.8 · DIA: 14.3mm · Senofilcon A',
    details: 'Gözyaşı filmiyle entegre HydraLuxe teknolojisi. Klimalı ve ekran karşısında geçen ortamlarda dahi kuruluk hissettirmez.',
    image: '/images/lens_contact_box_1792095024550.jpg',
    badge: 'MAKSİMUM NEM',
    techData: {
      baseCurve: '8.4 mm / 8.8 mm',
      diameter: '14.3 mm',
      waterContent: '%38 Su İçeriği (Yüksek Oksijen)',
      oxygen: '147 Dk/t Oksijen Geçirgenliği',
      replacement: '15 Günlük veya 1 Aylık Değişim',
    },
  },
  {
    id: 'lens-dailies-total1',
    category: 'numarali-lens',
    name: 'Dailies Total 1',
    subtitle: 'Su Gradyanlı Günlük Kontak Lens',
    code: 'LNS-DT1-DAY',
    specs: 'Yüzeyde %80+ Su Oranı · Delefilcon A',
    details: 'Dünyanın ilk su gradyanlı lensi. Göze temas eden dış yüzeyde neredeyse saf su hissi sunar, gün sonunda varlığını hissettirmez.',
    image: '/images/lens_contact_box_1792095024550.jpg',
    badge: 'SU GRADYANLI',
    techData: {
      baseCurve: '8.5 mm',
      diameter: '14.1 mm',
      waterContent: 'Çekirdekte %33, Yüzeyde %80+',
      oxygen: '156 Dk/t Ultra Yüksek Nefes Alma',
      replacement: 'Tek Kullanımlık Günlük',
    },
  },
  {
    id: 'lens-air-optix-hydra',
    category: 'numarali-lens',
    name: 'Air Optix Plus HydraGlyde',
    subtitle: 'Aylık Silikon Hidrojel',
    code: 'LNS-AOP-HYD',
    specs: 'SmartShield Depozit Koruması · Lotrafilcon B',
    details: 'Lipid ve protein kalıntılarının yüzeye tutunmasını engelleyen koruyucu kalkan. 30 gün boyunca pürüzsüz netlik.',
    image: '/images/lens_contact_box_1792095024550.jpg',
    badge: '30 GÜNLÜK',
    techData: {
      baseCurve: '8.6 mm',
      diameter: '14.2 mm',
      waterContent: '%33 Su Oranı',
      oxygen: '138 Dk/t',
      replacement: 'Aylık Değişim',
    },
  },
  {
    id: 'lens-biofinity-toric',
    category: 'numarali-lens',
    name: 'Biofinity Toric (Astigmatlı)',
    subtitle: 'Optimize Balast Astigmat Düzeltici',
    code: 'LNS-BIO-TOR',
    specs: 'Kusursuz Stabilite · Comfilcon A',
    details: 'Her göz kırpışta doğru aks açısına kilitlenen optimize geometri. Bulanıklaşmayan, kristal netliğinde astigmatlı görüş.',
    image: '/images/lens_contact_box_1792095024550.jpg',
    badge: 'ASTİGMAT ÖZEL',
    techData: {
      baseCurve: '8.7 mm',
      diameter: '14.5 mm',
      waterContent: '%48 Su İçeriği',
      oxygen: '160 Dk/t Doğal Islanabilirlik',
      replacement: 'Aylık Değişim',
    },
  },
  {
    id: 'lens-ultra-multifocal',
    category: 'numarali-lens',
    name: 'Bausch+Lomb Ultra Multifocal',
    subtitle: 'Uzak ve Yakın Odaklı Numaralı Lens',
    code: 'LNS-BL-MUL',
    specs: '3 Bölgeli Progresif Optik Tasarım',
    details: '40 yaş sonrası yakın okuma zorluğu (presbiyopi) yaşayanlar için gözlüksüz, hem telefon ekranını hem yolu net görme imkanı.',
    image: '/images/lens_contact_box_1792095024550.jpg',
    badge: 'UZAK & YAKIN',
    techData: {
      baseCurve: '8.5 mm',
      diameter: '14.2 mm',
      waterContent: '%46 MoistureSeal Teknolojisi',
      oxygen: '163 Dk/t',
      replacement: 'Aylık Değişim',
    },
  },

  // ── 5. RENKLİ LENSLER ──
  {
    id: 'lens-solotica-mel',
    category: 'renkli-lens',
    name: 'Solótica Natural Colors - Mel',
    subtitle: 'Haresiz Doğal Bal Ela Rengi',
    code: 'COL-SOL-MEL',
    specs: 'Mikro Noktalama · Doğal İris Geçişi',
    details: 'Koyu kahverengi gözleri dahi doğal olarak yumuşak kehribar-yeşil bal rengine dönüştüren dünyanın en ünlü renkli lens serisi.',
    image: '/images/lens_color_eye_1792095024686.jpg',
    badge: 'ÇOK SATAN',
    techData: {
      baseCurve: '8.7 mm',
      diameter: '14.2 mm',
      waterContent: '%38 Polimacon',
      replacement: 'Yıllık veya Aylık Seçenekler',
    },
  },
  {
    id: 'lens-desio-caramel',
    category: 'renkli-lens',
    name: 'Desio Sensual Beauty - Caramel',
    subtitle: 'Karamel & Sıcak Fındık Tonu',
    code: 'COL-DES-CAR',
    specs: 'İtalyan Lüks Kozmetik Lens',
    details: 'Bakışlara sıcak, derin ve büyüleyici bir parlaklık kazandırır. Numaralı ve numarasız seçenekleri mevcuttur.',
    image: '/images/lens_color_eye_1792095024686.jpg',
    badge: 'İTALYAN TASARIM',
    techData: {
      baseCurve: '8.7 mm',
      diameter: '14.3 mm',
      waterContent: '%38 HEMA Kopolimer',
      replacement: '3 Aylık Değişim',
    },
  },
  {
    id: 'lens-freshlook-green',
    category: 'renkli-lens',
    name: 'FreshLook ColorBlends - Green',
    subtitle: '3’ü 1 Arada Zümrüt Yeşili',
    code: 'COL-FRL-GRN',
    specs: 'Doğal İris Çerçeveli Zümrüt Tonu',
    details: 'İç hare, ana zümrüt rengi ve dış çerçevenin harmanlanmasıyla derinlikli, gerçekçi yeşil göz görünümü sağlar.',
    image: '/images/lens_color_eye_1792095024686.jpg',
    badge: 'ZÜMRÜT YEŞİLİ',
    techData: {
      baseCurve: '8.6 mm',
      diameter: '14.5 mm',
      waterContent: '%55 Yüksek Su Oranı',
      replacement: 'Aylık Değişim',
    },
  },
  {
    id: 'lens-airoptix-blue',
    category: 'renkli-lens',
    name: 'Air Optix Colors - Brilliant Blue',
    subtitle: 'Oksijen Geçiren Canlı Saf Mavi',
    code: 'COL-AOP-BLU',
    specs: 'Silikon Hidrojel Nefes Alan Malzeme',
    details: 'Geleneksel renkli lenslerin aksine 6 kat daha fazla oksijen geçirgenliğine sahiptir. Gözde kızarıklık ve kuruluk yapmaz.',
    image: '/images/lens_color_eye_1792095024686.jpg',
    badge: 'NEFES ALAN RENK',
    techData: {
      baseCurve: '8.6 mm',
      diameter: '14.2 mm',
      waterContent: '%33 Lotrafilcon B',
      oxygen: '138 Dk/t',
      replacement: 'Aylık Değişim',
    },
  },

  // ── 6. AKSESUAR ──
  {
    id: 'aks-deri-kilif',
    category: 'aksesuar',
    name: 'Toskana Deri Sert Gözlük Kılıfı',
    subtitle: 'El Yapımı Bitkisel Tabaklama',
    code: 'AKS-CASE-LEA',
    specs: 'Darbe Emici İç Kadife Astar',
    details: 'İtalyan Toskana derisinden el işçiliğiyle dikilmiştir. Çantanızda veya cebinizde gözlüğünüzü çizilme ve ezilmelere karşı korur.',
    image: '/images/eyewear_accessories_kit_1792095026151.jpg',
    badge: 'HAKİKİ DERİ',
    techData: {
      material: 'Hakiki İtalyan Sığır Derisi & Pirinç Toka',
      origin: 'Floransa / İtalya',
      warranty: '5 Yıl Dayanım Garantisi',
    },
  },
  {
    id: 'aks-renu-solusyon',
    category: 'aksesuar',
    name: 'Renu MultiPlus Solüsyon Kiti',
    subtitle: 'Dezenfektan & Protein Temizleyici',
    code: 'AKS-RENU-KIT',
    specs: '360ml Şişe + Antibakteriyel Lens Kabı',
    details: 'Lenslerinizin günlük temizliği, durulanması, dezenfeksiyonu ve nemlendirilmesi için hekimlerin 1 numaralı tavsiyesi.',
    image: '/images/lens_contact_box_1792095024550.jpg',
    badge: 'STERİL HİJYEN',
    techData: {
      material: 'Steril İzotonik Solüsyon & Poloxamine',
      origin: 'ABD Laboratuvarları',
      warranty: 'Orijinal Emniyet Kilitli Ambalaj',
    },
  },
  {
    id: 'aks-antifog-bez',
    category: 'aksesuar',
    name: 'Nano Anti-Fog Buğu Önleyici Bez',
    subtitle: '24 Saat Kesintisiz Netlik',
    code: 'AKS-ANTIFOG',
    specs: '300+ Kez Yeniden Kullanılabilir',
    details: 'Maske takarken, sıcak kahve içerken veya soğuktan sıcağa geçerken camlarınızın buğulanmasını tamamen engeller.',
    image: '/images/eyewear_accessories_kit_1792095026151.jpg',
    badge: 'BUĞU ÖNLEYİCİ',
    techData: {
      material: 'Nano Polimerik Mikrofiber Kumaş',
      origin: 'Güney Kore',
      warranty: 'Orijinal Kilitli Poşetinde Saklanır',
    },
  },
  {
    id: 'aks-titanyum-zincir',
    category: 'aksesuar',
    name: 'Saf Titanyum Gözlük Askı Zinciri',
    subtitle: 'Alerji Yapmayan Lüks Boyunluk',
    code: 'AKS-TIT-CHN',
    specs: 'Ultra Hafif 6g · Silikon Kaymaz Halka',
    details: 'Gözlüğünüzü boynunuzda güvenle taşıyabileceğiniz, paslanmaz ve kararmaz saf titanyum baklalı tasarım aksesuar.',
    image: '/images/eyewear_accessories_kit_1792095026151.jpg',
    badge: 'SAF TİTANYUM',
    techData: {
      material: 'Hipoalerjenik Titanyum & Dayanıklı Silikon',
      origin: 'Japonya',
      warranty: '2 Yıl Kararmazlık Garantisi',
    },
  },
];

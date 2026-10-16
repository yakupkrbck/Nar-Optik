import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type { CatalogCategory, CatalogItem } from './data/storeCatalogData';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with configured databaseId and auto long-polling fallback for iframe/proxy environments
function getOrInitFirestore() {
  try {
    return initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId || undefined
    );
  } catch {
    return firebaseConfig.firestoreDatabaseId
      ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
      : getFirestore(app);
  }
}

export const db = getOrInitFirestore();

// Initialize Auth
export const auth = getAuth(app);

// Validate connection per Firebase Skill guidelines, gracefully handling transient offline states
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (
      err?.code === 'unavailable' ||
      err?.message?.includes('offline') ||
      err?.message?.includes('unavailable') ||
      err?.message?.includes('Could not reach Cloud Firestore')
    ) {
      // Offline mode or reconnecting; client operates seamlessly using local cache
      return false;
    }
    return false;
  }
}

// Automatically test connection on boot with a brief delay to allow transport negotiation
setTimeout(() => {
  testConnection().catch(() => {});
}, 1500);

// FIRESTORE SERVICES FOR NAR OPTİK CATALOG

export const CATEGORIES_COLLECTION = 'categories';
export const CATALOG_ITEMS_COLLECTION = 'catalog_items';

export const DEFAULT_CATEGORY_ORDER: Record<string, number> = {
  'optik-cam': 1,
  'optik-gozluk': 2,
  'gunes-gozlugu': 3,
  'numarali-lens': 4,
  'renkli-lens': 5,
  'aksesuar': 6,
  'bize-ulasin': 9999,
};

/**
 * Sorts categories strictly by their configured order, ensuring 'bize-ulasin' is always last.
 */
export function sortCategories(cats: CatalogCategory[]): CatalogCategory[] {
  return [...cats].sort((a, b) => {
    if (a.id === 'bize-ulasin') return 1;
    if (b.id === 'bize-ulasin') return -1;
    const orderA = a.order ?? DEFAULT_CATEGORY_ORDER[a.id] ?? 50;
    const orderB = b.order ?? DEFAULT_CATEGORY_ORDER[b.id] ?? 50;
    return orderA - orderB;
  });
}

/**
 * Sorts catalog items by their order
 */
export function sortItems(items: CatalogItem[]): CatalogItem[] {
  return [...items].sort((a, b) => {
    const orderA = a.order ?? 9999;
    const orderB = b.order ?? 9999;
    return orderA - orderB;
  });
}

/**
 * Recursively removes all undefined and null-undefined properties from an object or array
 * so Firestore setDoc never encounters unsupported undefined values (e.g. in optional fields like badge).
 */
export function sanitizeForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj
      .filter((v) => v !== undefined)
      .map((v) => sanitizeForFirestore(v)) as unknown as T;
  }
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (value !== undefined) {
      clean[key] =
        typeof value === 'object' && value !== null
          ? sanitizeForFirestore(value)
          : value;
    }
  }
  return clean as T;
}

/**
 * Save single or multiple categories to Firestore with explicit ordering
 */
export async function saveCategoriesToFirestore(categories: CatalogCategory[]): Promise<void> {
  try {
    const sorted = sortCategories(categories);
    const promises = sorted.map((cat, idx) => {
      const docRef = doc(db, CATEGORIES_COLLECTION, cat.id);
      const computedOrder = cat.id === 'bize-ulasin' ? 9999 : (cat.order ?? idx + 1);
      const payload = sanitizeForFirestore({
        ...cat,
        order: computedOrder,
        updatedAt: new Date().toISOString(),
      });
      return setDoc(docRef, payload, { merge: true });
    });
    await Promise.all(promises);
  } catch (err) {
    console.error('Error saving categories to Firestore:', err);
  }
}

/**
 * Delete a category from Firestore
 */
export async function deleteCategoryFromFirestore(categoryId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, categoryId));
  } catch (err) {
    console.error('Error deleting category from Firestore:', err);
  }
}

/**
 * Save single or multiple catalog items to Firestore with explicit ordering
 */
export async function saveItemsToFirestore(items: CatalogItem[]): Promise<void> {
  try {
    const promises = items.map((item, idx) => {
      const docRef = doc(db, CATALOG_ITEMS_COLLECTION, item.id);
      const payload = sanitizeForFirestore({
        ...item,
        order: item.order ?? idx + 1,
        updatedAt: new Date().toISOString(),
      });
      return setDoc(docRef, payload, { merge: true });
    });
    await Promise.all(promises);
  } catch (err) {
    console.error('Error saving items to Firestore:', err);
  }
}

/**
 * Delete a catalog item from Firestore
 */
export async function deleteItemFromFirestore(itemId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, CATALOG_ITEMS_COLLECTION, itemId));
  } catch (err) {
    console.error('Error deleting item from Firestore:', err);
  }
}

/**
 * Fetch all categories from Firestore with strict ordering
 * Returns CatalogCategory[] if found, [] if collection is empty, or null if fetch failed (offline/error)
 */
export async function fetchCategoriesFromFirestore(): Promise<CatalogCategory[] | null> {
  try {
    const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    if (querySnapshot.empty) return [];
    const list: CatalogCategory[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as CatalogCategory);
    });
    return sortCategories(list);
  } catch (err) {
    console.warn('Categories fetch from Firestore deferred (offline or reconnecting):', err);
    return null;
  }
}

/**
 * Fetch all catalog items from Firestore with strict ordering
 * Returns CatalogItem[] if found, [] if collection is empty, or null if fetch failed (offline/error)
 */
export async function fetchItemsFromFirestore(): Promise<CatalogItem[] | null> {
  try {
    const querySnapshot = await getDocs(collection(db, CATALOG_ITEMS_COLLECTION));
    if (querySnapshot.empty) return [];
    const list: CatalogItem[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as CatalogItem);
    });
    return sortItems(list);
  } catch (err) {
    console.warn('Items fetch from Firestore deferred (offline or reconnecting):', err);
    return null;
  }
}

/**
 * Real-time listener for categories with auto-sorting
 */
export function subscribeCategories(
  onUpdate: (cats: CatalogCategory[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    collection(db, CATEGORIES_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: CatalogCategory[] = [];
        snapshot.forEach((d) => list.push(d.data() as CatalogCategory));
        onUpdate(sortCategories(list));
      }
    },
    (error) => {
      if (onError) onError(error);
      else console.warn('Categories subscription notice:', error);
    }
  );
}

/**
 * Real-time listener for catalog items with auto-sorting
 */
export function subscribeItems(
  onUpdate: (items: CatalogItem[]) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    collection(db, CATALOG_ITEMS_COLLECTION),
    (snapshot) => {
      if (!snapshot.empty) {
        const list: CatalogItem[] = [];
        snapshot.forEach((d) => list.push(d.data() as CatalogItem));
        onUpdate(sortItems(list));
      }
    },
    (error) => {
      if (onError) onError(error);
      else console.warn('Items subscription notice:', error);
    }
  );
}

export const ADMIN_CONFIG_COLLECTION = 'admin_config';
export const LEGAL_NOTICE_DOC = 'legal_notice';

export interface LegalNoticeConfig {
  regulationTitle: string;
  regulationText: string;
  kvkkTitle: string;
  kvkkText: string;
  companyTitle: string;
  companyAddress: string;
  contactEmail: string;
  updatedAt?: string;
}

export const DEFAULT_LEGAL_CONFIG: LegalNoticeConfig = {
  regulationTitle: 'Optisyenlik ve Tanıtım Mevzuatı',
  regulationText:
    'Bu internet sitesi, Nar Optik tarafından optik cam, gözlük ve lens koleksiyonlarının tanıtımı ile seçim rehberi sunulması amacıyla hazırlanmıştır. Sitemiz üzerinden doğrudan online satış, sepet veya ödeme işlemi yapılmamaktadır. Tanıtım ve bilgilendirme faaliyetleri 5193 sayılı Optisyenlik Hakkında Kanun ve ilgili mevzuat çerçevesinde değerlendirilir.',
  kvkkTitle: 'Kişisel Verilerin Korunması (KVKK)',
  kvkkText:
    '6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca, Nar Optik olarak kişisel verilerinizin gizliliğine ve güvenliğine azami özen göstermekteyiz. Web sitemizde üyelik hesabı oluşturulmaz ve kredi kartı verisi toplanmaz. İletişim hatlarımız (WhatsApp, telefon, e-posta) üzerinden kendi inisiyatifinizle paylaştığınız ad, telefon ve reçete bilgileri yalnızca danışmanlık ve randevu sürecinin yürütülmesi amacıyla işlenir. Kişisel veriler ticari amaçla üçüncü kişilere devredilmez veya satılmaz.',
  companyTitle: 'Nar Optik',
  companyAddress: 'Kükürtlü, Zübeyde Hanım Cd. No:12/A, Osmangazi / BURSA',
  contactEmail: 'naroptiklens@gmail.com',
};

/**
 * Fetch Legal & KVKK texts configuration from Firestore
 */
export async function fetchLegalConfigFromFirestore(): Promise<LegalNoticeConfig | null> {
  try {
    const docRef = doc(db, ADMIN_CONFIG_COLLECTION, LEGAL_NOTICE_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as LegalNoticeConfig;
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch legal config from Firestore:', err);
    return null;
  }
}

/**
 * Save Legal & KVKK texts configuration to Firestore
 */
export async function saveLegalConfigToFirestore(config: LegalNoticeConfig): Promise<void> {
  try {
    const docRef = doc(db, ADMIN_CONFIG_COLLECTION, LEGAL_NOTICE_DOC);
    const payload = sanitizeForFirestore({
      ...config,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.error('Error saving legal config to Firestore:', err);
    throw err;
  }
}

/**
 * Real-time listener for Legal & KVKK texts configuration
 */
export function subscribeLegalConfig(
  onUpdate: (config: LegalNoticeConfig) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    doc(db, ADMIN_CONFIG_COLLECTION, LEGAL_NOTICE_DOC),
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as LegalNoticeConfig);
      }
    },
    (error) => {
      if (onError) onError(error);
      else console.warn('Legal config subscription notice:', error);
    }
  );
}

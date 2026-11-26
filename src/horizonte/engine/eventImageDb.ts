export interface StoredEventIllustrationRecord {
  eventId: number;
  title: string;
  category: string;
  svgMarkup: string;
  source: 'ai';
  createdAt: string;
}

const DB_NAME = 'HorizonteEstelarEventsDB';
const DB_VERSION = 1;
const STORE_NAME = 'illustrations';

const memoryCache = new Map<number, StoredEventIllustrationRecord>();

function openEventsDb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'eventId' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function getSavedEventIllustration(
  eventId: number
): Promise<StoredEventIllustrationRecord | null> {
  const mem = memoryCache.get(eventId);
  if (mem) return mem;
  const db = await openEventsDb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(eventId);
      req.onsuccess = () => {
        const res = req.result as StoredEventIllustrationRecord | undefined;
        if (res && typeof res.svgMarkup === 'string') {
          memoryCache.set(eventId, res);
          resolve(res);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveEventIllustration(
  record: StoredEventIllustrationRecord
): Promise<void> {
  memoryCache.set(record.eventId, record);
  const db = await openEventsDb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

// AGB-Analyzer Datenbank
export class Database {
    constructor() {
        this.dbName = 'agb-analyzer';
        this.dbVersion = 1;
        this.db = null;
    }

    async initialize() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                reject(new Error('Fehler beim Öffnen der Datenbank'));
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Erstelle Stores für verschiedene Datentypen
                if (!db.objectStoreNames.contains('analyses')) {
                    const analysesStore = db.createObjectStore('analyses', { keyPath: 'url' });
                    analysesStore.createIndex('timestamp', 'timestamp', { unique: false });
                    analysesStore.createIndex('rating', 'rating', { unique: false });
                }

                if (!db.objectStoreNames.contains('cache')) {
                    const cacheStore = db.createObjectStore('cache', { keyPath: 'url' });
                    cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    async saveAnalysis(url, analysis) {
        const transaction = this.db.transaction(['analyses'], 'readwrite');
        const store = transaction.objectStore('analyses');

        const data = {
            url,
            ...analysis,
            timestamp: Date.now()
        };

        return new Promise((resolve, reject) => {
            const request = store.put(data);

            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(new Error('Fehler beim Speichern der Analyse'));
        });
    }

    async getAnalysis(url) {
        const transaction = this.db.transaction(['analyses'], 'readonly');
        const store = transaction.objectStore('analyses');

        return new Promise((resolve, reject) => {
            const request = store.get(url);

            request.onsuccess = () => {
                const result = request.result;
                if (result && this.isAnalysisValid(result.timestamp)) {
                    resolve(result);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => reject(new Error('Fehler beim Laden der Analyse'));
        });
    }

    async saveToCache(url, content) {
        const transaction = this.db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');

        const data = {
            url,
            content,
            timestamp: Date.now()
        };

        return new Promise((resolve, reject) => {
            const request = store.put(data);

            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(new Error('Fehler beim Cache-Speichern'));
        });
    }

    async getFromCache(url) {
        const transaction = this.db.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');

        return new Promise((resolve, reject) => {
            const request = store.get(url);

            request.onsuccess = () => {
                const result = request.result;
                if (result && this.isCacheValid(result.timestamp)) {
                    resolve(result.content);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => reject(new Error('Fehler beim Cache-Laden'));
        });
    }

    async saveSetting(key, value) {
        const transaction = this.db.transaction(['settings'], 'readwrite');
        const store = transaction.objectStore('settings');

        return new Promise((resolve, reject) => {
            const request = store.put({ key, value });

            request.onsuccess = () => resolve(value);
            request.onerror = () => reject(new Error('Fehler beim Speichern der Einstellung'));
        });
    }

    async getSetting(key) {
        const transaction = this.db.transaction(['settings'], 'readonly');
        const store = transaction.objectStore('settings');

        return new Promise((resolve, reject) => {
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result ? request.result.value : null);
            request.onerror = () => reject(new Error('Fehler beim Laden der Einstellung'));
        });
    }

    isAnalysisValid(timestamp) {
        // Analysen sind 7 Tage gültig
        const maxAge = 7 * 24 * 60 * 60 * 1000;
        return (Date.now() - timestamp) < maxAge;
    }

    isCacheValid(timestamp) {
        // Cache ist 24 Stunden gültig
        const maxAge = 24 * 60 * 60 * 1000;
        return (Date.now() - timestamp) < maxAge;
    }

    async clearOldData() {
        const stores = ['analyses', 'cache'];
        const now = Date.now();

        for (const storeName of stores) {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const index = store.index('timestamp');

            const cursorRequest = index.openCursor();

            cursorRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const data = cursor.value;
                    if (
                        (storeName === 'analyses' && !this.isAnalysisValid(data.timestamp)) ||
                        (storeName === 'cache' && !this.isCacheValid(data.timestamp))
                    ) {
                        store.delete(cursor.primaryKey);
                    }
                    cursor.continue();
                }
            };
        }
    }
}

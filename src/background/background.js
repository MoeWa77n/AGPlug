// AGB-Analyzer Background Script
import { AGBAnalyzer } from './analyzer.js';

class BackgroundService {
    constructor() {
        this.analyzer = new AGBAnalyzer();
        this.cache = new Map();
        this.init();
    }

    init() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'ANALYZE_AGB') {
                this.handleAGBAnalysis(message.payload, sender.tab.id);
            }
        });
    }

    async handleAGBAnalysis(payload, tabId) {
        const { url, text } = payload;

        // Prüfe Cache
        if (this.cache.has(url)) {
            this.sendAnalysisResult(tabId, this.cache.get(url));
            return;
        }

        try {
            const result = await this.analyzer.analyzeText(text);
            this.cache.set(url, result);
            this.sendAnalysisResult(tabId, result);
            this.updateIcon(result.rating);
        } catch (error) {
            console.error('Fehler bei der AGB-Analyse:', error);
            this.sendAnalysisResult(tabId, {
                rating: 'red',
                details: {
                    error: 'Analyse fehlgeschlagen'
                }
            });
        }
    }

    sendAnalysisResult(tabId, result) {
        chrome.tabs.sendMessage(tabId, {
            type: 'ANALYSIS_RESULT',
            payload: result
        });
    }

    updateIcon(rating) {
        const iconPath = `assets/icons/icon48_${rating}.png`;
        chrome.action.setIcon({ path: iconPath });
    }
}

// Starte den Background Service
const backgroundService = new BackgroundService();

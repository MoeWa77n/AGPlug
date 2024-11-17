// AGB-Analyzer Content Script
class AGBDetector {
    constructor() {
        this.observer = null;
        this.agbPatterns = [
            /AGB|Allgemeine Geschäftsbedingungen|Terms and Conditions/i,
            /Nutzungsbedingungen|Terms of Use/i,
            /Datenschutz|Privacy Policy/i
        ];
        this.init();
    }

    init() {
        this.setupMutationObserver();
        this.scanPage();
    }

    setupMutationObserver() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    this.scanPage();
                }
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    scanPage() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (this.isAGBLink(link)) {
                this.processAGBLink(link);
            }
        });
    }

    isAGBLink(link) {
        const text = link.textContent.toLowerCase();
        const href = link.href.toLowerCase();
        return this.agbPatterns.some(pattern => 
            pattern.test(text) || pattern.test(href)
        );
    }

    async processAGBLink(link) {
        try {
            const response = await fetch(link.href);
            const text = await response.text();
            
            // Sende den AGB-Text zur Analyse an das Background Script
            chrome.runtime.sendMessage({
                type: 'ANALYZE_AGB',
                payload: {
                    url: link.href,
                    text: text
                }
            });
        } catch (error) {
            console.error('Fehler beim Verarbeiten des AGB-Links:', error);
        }
    }
}

// Starte den AGB-Detector
const detector = new AGBDetector();

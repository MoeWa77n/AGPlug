// AGB-Analyzer Popup Script
class PopupUI {
    constructor() {
        this.elements = {
            status: document.getElementById('status'),
            result: document.getElementById('result'),
            noAgb: document.getElementById('no-agb'),
            error: document.getElementById('error'),
            ratingIndicator: document.getElementById('rating-indicator'),
            ratingText: document.getElementById('rating-text'),
            detailsList: document.getElementById('details-list'),
            analyzeBtn: document.getElementById('analyze-btn'),
            scores: {
                dsgvo: document.getElementById('dsgvo-score'),
                consumer: document.getElementById('consumer-score'),
                transparency: document.getElementById('transparency-score'),
                fairness: document.getElementById('fairness-score')
            }
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkCurrentTab();
    }

    setupEventListeners() {
        this.elements.analyzeBtn.addEventListener('click', () => this.startAnalysis());
        
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'ANALYSIS_RESULT') {
                this.displayResults(message.payload);
            }
        });
    }

    async checkCurrentTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            chrome.tabs.sendMessage(tab.id, { type: 'CHECK_AGB' }, (response) => {
                if (response && response.hasAgb) {
                    this.elements.analyzeBtn.disabled = false;
                } else {
                    this.showNoAgb();
                }
            });
        }
    }

    startAnalysis() {
        this.updateStatus('Analysiere...', 'processing');
        this.elements.analyzeBtn.disabled = true;
        
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'START_ANALYSIS' });
        });
    }

    displayResults(results) {
        this.hideAll();
        this.elements.result.classList.remove('hidden');
        
        // Update Rating Indicator
        this.elements.ratingIndicator.className = 'rating-indicator';
        this.elements.ratingIndicator.classList.add(`rating-${results.rating}`);
        
        // Update Rating Text
        const ratingTexts = {
            green: 'Sehr gut - Diese AGBs sind verbraucherfreundlich',
            yellow: 'Akzeptabel - Einige Punkte sollten beachtet werden',
            red: 'Vorsicht - Diese AGBs enthalten kritische Punkte'
        };
        this.elements.ratingText.textContent = ratingTexts[results.rating];

        // Update Score Bars
        this.updateScoreBars(results.scores);

        // Update Details
        this.updateDetails(results.details);

        this.elements.analyzeBtn.disabled = false;
        this.updateStatus('Analyse abgeschlossen', 'success');
    }

    updateScoreBars(scores) {
        Object.entries(scores).forEach(([category, score]) => {
            const element = this.elements.scores[category];
            if (element) {
                element.style.width = `${score * 100}%`;
                element.style.background = this.getScoreColor(score);
            }
        });
    }

    updateDetails(details) {
        this.elements.detailsList.innerHTML = '';
        Object.entries(details).forEach(([category, text]) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${this.getCategoryName(category)}</span>
                <span>${text}</span>
            `;
            this.elements.detailsList.appendChild(li);
        });
    }

    getCategoryName(category) {
        const names = {
            dsgvo: 'DSGVO-Compliance',
            verbraucherrechte: 'Verbraucherrechte',
            transparenz: 'Transparenz',
            fairness: 'Fairness'
        };
        return names[category] || category;
    }

    getScoreColor(score) {
        if (score >= 0.8) return 'var(--color-success)';
        if (score >= 0.6) return 'var(--color-warning)';
        return 'var(--color-danger)';
    }

    updateStatus(text, state) {
        this.elements.status.querySelector('.status-text').textContent = text;
        this.elements.status.querySelector('.status-icon').style.background = 
            state === 'success' ? 'var(--color-success)' :
            state === 'error' ? 'var(--color-danger)' :
            'var(--color-warning)';
    }

    showNoAgb() {
        this.hideAll();
        this.elements.noAgb.classList.remove('hidden');
        this.elements.analyzeBtn.disabled = true;
    }

    showError() {
        this.hideAll();
        this.elements.error.classList.remove('hidden');
        this.elements.analyzeBtn.disabled = false;
    }

    hideAll() {
        this.elements.result.classList.add('hidden');
        this.elements.noAgb.classList.add('hidden');
        this.elements.error.classList.add('hidden');
    }
}

// Initialisiere die Popup UI
document.addEventListener('DOMContentLoaded', () => {
    new PopupUI();
});

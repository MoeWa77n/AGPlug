// AGB-Analyzer Kern-Komponente
export class AGBAnalyzer {
    constructor() {
        this.weights = {
            dsgvo: 0.3,
            verbraucherrechte: 0.25,
            transparenz: 0.25,
            fairness: 0.2
        };
        this.model = null;
        this.initModel();
    }

    async initModel() {
        try {
            // Lade das TensorFlow.js Modell
            this.model = await tf.loadLayersModel('models/agb_classifier/model.json');
        } catch (error) {
            console.error('Fehler beim Laden des Modells:', error);
        }
    }

    async analyzeText(text) {
        const scores = await this.calculateScores(text);
        const rating = this.calculateRating(scores);
        const details = this.generateDetails(scores);

        return {
            rating,
            scores,
            details
        };
    }

    async calculateScores(text) {
        const scores = {
            dsgvo: await this.analyzeDSGVO(text),
            verbraucherrechte: await this.analyzeVerbraucherrechte(text),
            transparenz: await this.analyzeTransparenz(text),
            fairness: await this.analyzeFairness(text)
        };

        return scores;
    }

    calculateRating(scores) {
        const weightedScore = Object.entries(scores).reduce((total, [category, score]) => {
            return total + (score * this.weights[category]);
        }, 0);

        if (weightedScore >= 0.8) return 'green';
        if (weightedScore >= 0.6) return 'yellow';
        return 'red';
    }

    async analyzeDSGVO(text) {
        const patterns = {
            datenschutz: /datenschutz|dsgvo|personenbezogene daten/i,
            rechtsgrundlage: /rechtsgrundlage|art\. 6|einwilligung/i,
            betroffenenrechte: /auskunft|berichtigung|löschung|widerspruch/i,
            aufbewahrung: /speicherdauer|aufbewahrungsfrist/i
        };

        return this.patternAnalysis(text, patterns);
    }

    async analyzeVerbraucherrechte(text) {
        const patterns = {
            widerruf: /widerruf|widerrufsrecht|14 tage/i,
            gewährleistung: /gewährleistung|mängel|garantie/i,
            rückgabe: /rückgabe|rücksendekosten|retoure/i
        };

        return this.patternAnalysis(text, patterns);
    }

    async analyzeTransparenz(text) {
        const patterns = {
            verständlichkeit: /klar|deutlich|verständlich/i,
            struktur: /gliederung|übersicht|aufbau/i,
            vollständigkeit: /vollständig|umfassend|detailliert/i
        };

        return this.patternAnalysis(text, patterns);
    }

    async analyzeFairness(text) {
        const patterns = {
            ausgewogenheit: /angemessen|fair|ausgeglichen/i,
            kosten: /kosten|gebühren|preis/i,
            haftung: /haftung|schadenersatz|beschränkung/i
        };

        return this.patternAnalysis(text, patterns);
    }

    patternAnalysis(text, patterns) {
        const matches = Object.values(patterns).map(pattern => 
            (text.match(pattern) || []).length
        );

        const maxMatches = Math.max(...matches);
        return maxMatches > 0 ? Math.min(matches.reduce((a, b) => a + b) / (Object.keys(patterns).length * 2), 1) : 0;
    }

    generateDetails(scores) {
        return {
            dsgvo: this.getDetailText(scores.dsgvo),
            verbraucherrechte: this.getDetailText(scores.verbraucherrechte),
            transparenz: this.getDetailText(scores.transparenz),
            fairness: this.getDetailText(scores.fairness)
        };
    }

    getDetailText(score) {
        if (score >= 0.8) return 'Sehr gut';
        if (score >= 0.6) return 'Akzeptabel';
        return 'Verbesserungsbedürftig';
    }
}

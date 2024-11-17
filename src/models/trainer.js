// AGB-Analyzer Modell-Training
import { AGBModel } from './model.js';

export class ModelTrainer {
    constructor() {
        this.model = new AGBModel();
        this.trainingData = {
            texts: [],
            labels: []
        };
    }

    async loadTrainingData() {
        // Beispiel-Trainingsdaten (in der Praxis würden diese aus einer Datenbank oder API kommen)
        const data = [
            {
                text: "Wir erheben und verarbeiten Ihre personenbezogenen Daten gemäß DSGVO. Sie haben jederzeit das Recht auf Auskunft, Berichtigung und Löschung.",
                labels: [1, 0.8, 0.9, 0.8] // [DSGVO, Verbraucherrechte, Transparenz, Fairness]
            },
            {
                text: "Sie können den Vertrag innerhalb von 14 Tagen ohne Angabe von Gründen widerrufen. Die Kosten der Rücksendung tragen wir.",
                labels: [0.6, 1, 0.9, 0.9]
            },
            {
                text: "Diese AGB sind klar strukturiert und in einfacher Sprache verfasst. Alle wichtigen Informationen sind hervorgehoben.",
                labels: [0.7, 0.8, 1, 0.9]
            },
            {
                text: "Wir schließen jegliche Haftung aus, auch bei grober Fahrlässigkeit. Änderungen der AGB können jederzeit ohne Ankündigung erfolgen.",
                labels: [0.5, 0.3, 0.4, 0.2]
            }
            // Weitere Trainingsdaten hier...
        ];

        this.trainingData.texts = data.map(item => item.text);
        this.trainingData.labels = data.map(item => item.labels);
    }

    async trainModel() {
        try {
            await this.model.initialize();
            await this.loadTrainingData();
            
            console.log('Starte Training...');
            const history = await this.model.train(this.trainingData);
            
            console.log('Training abgeschlossen');
            console.log('Finale Metriken:', history.history);
            
            // Speichere das trainierte Modell
            await this.model.save();
            
            return history;
        } catch (error) {
            console.error('Fehler beim Training:', error);
            throw error;
        }
    }

    async evaluateModel(testText) {
        try {
            const prediction = await this.model.predict(testText);
            console.log('Vorhersage für Text:', testText);
            console.log('Ergebnisse:', prediction);
            return prediction;
        } catch (error) {
            console.error('Fehler bei der Evaluation:', error);
            throw error;
        }
    }
}

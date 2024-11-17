// AGB-Analyzer ML-Modell
import * as tf from '@tensorflow/tfjs';
import { UniversalSentenceEncoder } from '@tensorflow-models/universal-sentence-encoder';

export class AGBModel {
    constructor() {
        this.encoder = null;
        this.classifier = null;
        this.initialized = false;
    }

    async initialize() {
        try {
            // Lade Universal Sentence Encoder
            this.encoder = await UniversalSentenceEncoder.load();
            
            // Erstelle und kompiliere das Klassifikationsmodell
            this.classifier = tf.sequential({
                layers: [
                    tf.layers.dense({
                        inputShape: [512],
                        units: 256,
                        activation: 'relu'
                    }),
                    tf.layers.dropout({ rate: 0.2 }),
                    tf.layers.dense({
                        units: 128,
                        activation: 'relu'
                    }),
                    tf.layers.dropout({ rate: 0.2 }),
                    tf.layers.dense({
                        units: 4, // 4 Kategorien: DSGVO, Verbraucherrechte, Transparenz, Fairness
                        activation: 'sigmoid'
                    })
                ]
            });

            this.classifier.compile({
                optimizer: tf.train.adam(0.001),
                loss: 'binaryCrossentropy',
                metrics: ['accuracy']
            });

            this.initialized = true;
            console.log('ML-Modell erfolgreich initialisiert');
        } catch (error) {
            console.error('Fehler bei der Modell-Initialisierung:', error);
            throw error;
        }
    }

    async encode(text) {
        if (!this.initialized) {
            await this.initialize();
        }
        return await this.encoder.embed(text);
    }

    async predict(text) {
        if (!this.initialized) {
            await this.initialize();
        }

        // Text in Embeddings umwandeln
        const embeddings = await this.encode(text);
        
        // Vorhersage durchführen
        const predictions = this.classifier.predict(embeddings);
        
        // Konvertiere Tensor zu Array
        const scores = await predictions.data();
        
        return {
            dsgvo: scores[0],
            verbraucherrechte: scores[1],
            transparenz: scores[2],
            fairness: scores[3]
        };
    }

    async train(dataset) {
        if (!this.initialized) {
            await this.initialize();
        }

        const { texts, labels } = dataset;
        
        // Konvertiere Texte zu Embeddings
        const embeddings = await Promise.all(
            texts.map(text => this.encode(text))
        );

        // Training durchführen
        const history = await this.classifier.fit(
            tf.stack(embeddings),
            tf.tensor2d(labels),
            {
                epochs: 10,
                batchSize: 32,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
                    }
                }
            }
        );

        return history;
    }

    async save() {
        if (!this.initialized) {
            throw new Error('Modell nicht initialisiert');
        }

        await this.classifier.save('indexeddb://agb-classifier');
        console.log('Modell erfolgreich gespeichert');
    }

    async load() {
        try {
            this.classifier = await tf.loadLayersModel('indexeddb://agb-classifier');
            this.initialized = true;
            console.log('Modell erfolgreich geladen');
        } catch (error) {
            console.error('Fehler beim Laden des Modells:', error);
            throw error;
        }
    }
}

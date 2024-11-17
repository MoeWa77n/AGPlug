// AGB-Analyzer Test Suite
import { AGBModel } from '../src/models/model.js';
import { ModelTrainer } from '../src/models/trainer.js';
import { Database } from '../src/db/database.js';

export class TestSuite {
    constructor() {
        this.model = new AGBModel();
        this.trainer = new ModelTrainer();
        this.db = new Database();
        this.testCases = [];
    }

    async initialize() {
        await this.db.initialize();
        await this.model.initialize();
        this.setupTestCases();
    }

    setupTestCases() {
        this.testCases = [
            {
                name: 'DSGVO-Compliance Test',
                text: `
                    Wir verarbeiten Ihre personenbezogenen Daten gemäß der DSGVO.
                    Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Datenübertragbarkeit.
                    Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO.
                `,
                expectedScores: {
                    dsgvo: 0.9,
                    verbraucherrechte: 0.7,
                    transparenz: 0.8,
                    fairness: 0.8
                }
            },
            {
                name: 'Verbraucherrechte Test',
                text: `
                    Sie haben ein 14-tägiges Widerrufsrecht ohne Angabe von Gründen.
                    Die Kosten der Rücksendung übernehmen wir.
                    Im Gewährleistungsfall haben Sie Anspruch auf Nachbesserung oder Ersatzlieferung.
                `,
                expectedScores: {
                    dsgvo: 0.5,
                    verbraucherrechte: 0.9,
                    transparenz: 0.8,
                    fairness: 0.9
                }
            },
            {
                name: 'Transparenz Test',
                text: `
                    Diese AGB sind in klarer und verständlicher Sprache verfasst.
                    Alle wichtigen Informationen sind übersichtlich gegliedert.
                    Änderungen werden rechtzeitig angekündigt und transparent kommuniziert.
                `,
                expectedScores: {
                    dsgvo: 0.6,
                    verbraucherrechte: 0.7,
                    transparenz: 0.9,
                    fairness: 0.8
                }
            },
            {
                name: 'Fairness Test',
                text: `
                    Die Rechte und Pflichten sind ausgewogen verteilt.
                    Keine versteckten Kosten oder überraschenden Klauseln.
                    Faire Kündigungsbedingungen mit angemessenen Fristen.
                `,
                expectedScores: {
                    dsgvo: 0.6,
                    verbraucherrechte: 0.8,
                    transparenz: 0.8,
                    fairness: 0.9
                }
            }
        ];
    }

    async runTests() {
        console.log('Starte Test-Suite...\n');
        const results = [];

        for (const testCase of this.testCases) {
            console.log(`Führe Test aus: ${testCase.name}`);
            
            try {
                const prediction = await this.model.predict(testCase.text);
                const result = this.evaluateTest(testCase, prediction);
                results.push(result);
                
                console.log('Ergebnis:', result);
                console.log('-------------------\n');
            } catch (error) {
                console.error(`Fehler in Test ${testCase.name}:`, error);
                results.push({
                    name: testCase.name,
                    success: false,
                    error: error.message
                });
            }
        }

        this.printSummary(results);
        return results;
    }

    evaluateTest(testCase, prediction) {
        const toleranceThreshold = 0.15;
        const scores = {
            dsgvo: Math.abs(prediction.dsgvo - testCase.expectedScores.dsgvo) <= toleranceThreshold,
            verbraucherrechte: Math.abs(prediction.verbraucherrechte - testCase.expectedScores.verbraucherrechte) <= toleranceThreshold,
            transparenz: Math.abs(prediction.transparenz - testCase.expectedScores.transparenz) <= toleranceThreshold,
            fairness: Math.abs(prediction.fairness - testCase.expectedScores.fairness) <= toleranceThreshold
        };

        const success = Object.values(scores).every(score => score);

        return {
            name: testCase.name,
            success,
            expected: testCase.expectedScores,
            actual: prediction,
            details: scores
        };
    }

    printSummary(results) {
        const total = results.length;
        const successful = results.filter(r => r.success).length;
        const failed = total - successful;

        console.log('\nTest-Zusammenfassung:');
        console.log('-------------------');
        console.log(`Gesamt: ${total}`);
        console.log(`Erfolgreich: ${successful}`);
        console.log(`Fehlgeschlagen: ${failed}`);
        console.log(`Erfolgsrate: ${((successful / total) * 100).toFixed(2)}%`);
    }

    async testDatabaseOperations() {
        console.log('\nTeste Datenbankoperationen...');
        
        try {
            // Test: Analyse speichern und laden
            const testUrl = 'https://test.com/agb';
            const testAnalysis = {
                rating: 'green',
                scores: {
                    dsgvo: 0.9,
                    verbraucherrechte: 0.8,
                    transparenz: 0.85,
                    fairness: 0.9
                }
            };

            await this.db.saveAnalysis(testUrl, testAnalysis);
            const loadedAnalysis = await this.db.getAnalysis(testUrl);
            
            console.log('Datenbanktest erfolgreich');
            return true;
        } catch (error) {
            console.error('Datenbanktest fehlgeschlagen:', error);
            return false;
        }
    }
}

// Führe Tests aus, wenn direkt ausgeführt
if (typeof require !== 'undefined' && require.main === module) {
    const testSuite = new TestSuite();
    testSuite.initialize().then(() => {
        testSuite.runTests().then(() => {
            testSuite.testDatabaseOperations();
        });
    });
}

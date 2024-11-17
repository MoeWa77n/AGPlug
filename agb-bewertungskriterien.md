# Detaillierte Bewertungskriterien für AGB-Analyse

## 1. DSGVO-Compliance (30%)

### 1.1 Datenschutzerklärung (10%)
```javascript
const checkPrivacyPolicy = (text) => {
    const criteria = {
        exists: {
            weight: 0.4,
            check: (text) => /datenschutzerklärung|datenschutzhinweise/i.test(text),
            requirement: "Separate Datenschutzerklärung vorhanden"
        },
        accessible: {
            weight: 0.3,
            check: (text) => /(?:direkt|leicht|einfach)\s+(?:zugänglich|erreichbar|auffindbar)/i.test(text),
            requirement: "Leicht zugänglich und auffindbar"
        },
        upToDate: {
            weight: 0.3,
            check: (text) => {
                const dateMatch = text.match(/stand:?\s*(\d{2}[\./]\d{2}[\./]\d{4})/i);
                if (dateMatch) {
                    const updateDate = new Date(dateMatch[1]);
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                    return updateDate > oneYearAgo;
                }
                return false;
            },
            requirement: "Aktueller Stand (nicht älter als 1 Jahr)"
        }
    };
    // Bewertungslogik
};
```

### 1.2 Datenverarbeitungszwecke (8%)
```javascript
const checkDataProcessingPurposes = (text) => {
    const requiredPurposes = {
        collection: {
            weight: 0.25,
            patterns: [
                /erheben.*personenbezogene.*daten/i,
                /erfassen.*daten/i
            ],
            example: "Wir erheben personenbezogene Daten, wenn Sie..."
        },
        usage: {
            weight: 0.25,
            patterns: [
                /verwenden.*daten.*für/i,
                /nutzen.*informationen.*zu/i
            ],
            example: "Ihre Daten werden verwendet für..."
        },
        storage: {
            weight: 0.25,
            patterns: [
                /speichern.*daten/i,
                /aufbewahren.*informationen/i
            ],
            example: "Ihre Daten werden gespeichert..."
        },
        deletion: {
            weight: 0.25,
            patterns: [
                /löschen.*daten/i,
                /vernichten.*informationen/i
            ],
            example: "Ihre Daten werden gelöscht, wenn..."
        }
    };
    // Bewertungslogik
};
```

### 1.3 Rechtsgrundlagen (7%)
```javascript
const checkLegalBasis = (text) => {
    const legalBases = {
        consent: {
            weight: 0.3,
            patterns: [
                /einwilligung/i,
                /zustimmung/i
            ],
            example: "Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung"
        },
        contract: {
            weight: 0.3,
            patterns: [
                /vertragsdurchführung/i,
                /vertragserfüllung/i
            ],
            example: "...zur Erfüllung des Vertrags erforderlich"
        },
        legitimateInterest: {
            weight: 0.2,
            patterns: [
                /berechtigtes interesse/i,
                /legitimes interesse/i
            ],
            example: "...aufgrund unseres berechtigten Interesses an..."
        },
        legalObligation: {
            weight: 0.2,
            patterns: [
                /gesetzliche.*verpflichtung/i,
                /rechtliche.*pflicht/i
            ],
            example: "...aufgrund gesetzlicher Verpflichtungen..."
        }
    };
    // Bewertungslogik
};
```

### 1.4 Aufbewahrungsfristen (5%)
```javascript
const checkRetentionPeriods = (text) => {
    const retentionCriteria = {
        specified: {
            weight: 0.4,
            patterns: [
                /daten werden (?:für|über).*(?:jahr|monat|woche)/i,
                /speicherdauer/i
            ],
            example: "Ihre Daten werden für 3 Jahre gespeichert"
        },
        justified: {
            weight: 0.3,
            patterns: [
                /aufbewahren.*weil/i,
                /speichern.*grund/i
            ],
            example: "Die Speicherung erfolgt aufgrund gesetzlicher Aufbewahrungsfristen"
        },
        deletionProcess: {
            weight: 0.3,
            patterns: [
                /nach ablauf.*gelöscht/i,
                /automatisch.*gelöscht/i
            ],
            example: "Nach Ablauf der Frist werden die Daten automatisch gelöscht"
        }
    };
    // Bewertungslogik
};
```

## 2. Verbraucherrechte (25%)

### 2.1 Widerrufsrecht (10%)
```javascript
const checkWithdrawalRight = (text) => {
    const withdrawalCriteria = {
        clear: {
            weight: 0.3,
            patterns: [
                /widerrufsrecht|widerruf/i,
                /14 tage/i
            ],
            example: "Sie haben das Recht, binnen 14 Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen"
        },
        process: {
            weight: 0.4,
            patterns: [
                /widerruf.*mitteilung/i,
                /widerrufen.*durch/i
            ],
            example: "Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung informieren"
        },
        consequences: {
            weight: 0.3,
            patterns: [
                /rückzahlung.*nach.*widerruf/i,
                /erstatten.*kosten/i
            ],
            example: "Im Falle eines Widerrufs erstatten wir Ihnen alle Zahlungen"
        }
    };
    // Bewertungslogik
};
```

### 2.2 Gewährleistung (8%)
```javascript
const checkWarranty = (text) => {
    const warrantyCriteria = {
        duration: {
            weight: 0.3,
            patterns: [
                /gewährleistung.*(?:2 jahre|24 monate)/i,
                /gesetzliche.*gewährleistungsfrist/i
            ],
            example: "Es gilt die gesetzliche Gewährleistungsfrist von 2 Jahren"
        },
        process: {
            weight: 0.4,
            patterns: [
                /mängel.*anzeigen/i,
                /reklamation.*geltend/i
            ],
            example: "Mängel können Sie uns wie folgt anzeigen..."
        },
        rights: {
            weight: 0.3,
            patterns: [
                /nachbesserung|ersatzlieferung/i,
                /minderung|rücktritt/i
            ],
            example: "Sie haben das Recht auf Nachbesserung oder Ersatzlieferung"
        }
    };
    // Bewertungslogik
};
```

### 2.3 Datenzugangsrechte (7%)
```javascript
const checkDataAccessRights = (text) => {
    const accessCriteria = {
        information: {
            weight: 0.4,
            patterns: [
                /auskunft.*gespeicherte.*daten/i,
                /information.*verarbeitung/i
            ],
            example: "Sie haben das Recht auf Auskunft über Ihre gespeicherten Daten"
        },
        correction: {
            weight: 0.3,
            patterns: [
                /berichtigung.*daten/i,
                /korrektur.*angaben/i
            ],
            example: "Sie können die Berichtigung unrichtiger Daten verlangen"
        },
        portability: {
            weight: 0.3,
            patterns: [
                /datenübertragbarkeit/i,
                /herausgabe.*daten/i
            ],
            example: "Sie haben das Recht auf Datenübertragbarkeit"
        }
    };
    // Bewertungslogik
};
```

## 3. Transparenz (25%)

### 3.1 Verständlichkeit (10%)
```javascript
const checkReadability = (text) => {
    return {
        fleschScore: calculateFleschScore(text), // Flesch-Reading-Ease für Deutsch
        sentenceLength: analyzeSentenceLength(text),
        technicalTerms: countTechnicalTerms(text),
        examples: checkForExamples(text)
    };
};

const readabilityCriteria = {
    good: {
        fleschScore: > 60,
        avgSentenceLength: < 20,
        technicalTermsRatio: < 0.1,
        hasExamples: true
    },
    medium: {
        fleschScore: > 40,
        avgSentenceLength: < 25,
        technicalTermsRatio: < 0.15,
        hasExamples: true
    },
    poor: {
        fleschScore: <= 40,
        avgSentenceLength: >= 25,
        technicalTermsRatio: >= 0.15,
        hasExamples: false
    }
};
```

### 3.2 Strukturierung (8%)
```javascript
const checkStructure = (text) => {
    const structureCriteria = {
        sections: {
            weight: 0.4,
            check: (text) => {
                return {
                    hasHeadings: /^\s*\d+\.\s+[\w\s]+|^\s*[A-Z]+\.\s+[\w\s]+/gm.test(text),
                    hasSubsections: /^\s*\d+\.\d+\.\s+[\w\s]+/gm.test(text),
                    hasParagraphs: text.split(/\n\s*\n/).length > 5
                };
            }
        },
        navigation: {
            weight: 0.3,
            check: (text) => {
                return {
                    hasTableOfContents: /inhaltsverzeichnis|übersicht/i.test(text),
                    hasAnchors: /#[\w-]+/i.test(text)
                };
            }
        },
        formatting: {
            weight: 0.3,
            check: (text) => {
                return {
                    hasEmphasis: /\*\*[\w\s]+\*\*|__[\w\s]+__/g.test(text),
                    hasList: /^\s*[-*•]\s+/gm.test(text)
                };
            }
        }
    };
    // Bewertungslogik
};
```

### 3.3 Vollständigkeit (7%)
```javascript
const checkCompleteness = (text) => {
    const requiredSections = {
        contact: {
            weight: 0.2,
            patterns: [
                /kontakt|impressum/i,
                /(?:tel|fax|email):/i
            ],
            example: "Sie erreichen uns unter..."
        },
        prices: {
            weight: 0.2,
            patterns: [
                /preise|kosten/i,
                /€|eur|euro/i
            ],
            example: "Die Preise verstehen sich inklusive MwSt."
        },
        delivery: {
            weight: 0.2,
            patterns: [
                /liefer|versand/i,
                /zustellung/i
            ],
            example: "Die Lieferung erfolgt innerhalb von..."
        },
        payment: {
            weight: 0.2,
            patterns: [
                /zahlung|bezahlung/i,
                /rechnung|lastschrift/i
            ],
            example: "Folgende Zahlungsarten werden akzeptiert..."
        },
        jurisdiction: {
            weight: 0.2,
            patterns: [
                /gerichtsstand/i,
                /anwendbares.*recht/i
            ],
            example: "Gerichtsstand ist..."
        }
    };
    // Bewertungslogik
};
```

## 4. Fairness (20%)

### 4.1 Klauselprüfung (10%)
```javascript
const checkUnfairClauses = (text) => {
    const unfairClauses = {
        liability: {
            weight: 0.3,
            patterns: [
                /haftung.*ausgeschlossen/i,
                /keine.*haftung/i
            ],
            isFair: false,
            example: "Die Haftung wird vollständig ausgeschlossen"
        },
        termination: {
            weight: 0.2,
            patterns: [
                /kündigung.*ausgeschlossen/i,
                /bindung.*unbefristet/i
            ],
            isFair: false,
            example: "Eine Kündigung ist ausgeschlossen"
        },
        priceChange: {
            weight: 0.2,
            patterns: [
                /preis.*jederzeit/i,
                /änderung.*ohne.*ankündigung/i
            ],
            isFair: false,
            example: "Preise können jederzeit ohne Ankündigung geändert werden"
        },
        dataUsage: {
            weight: 0.3,
            patterns: [
                /daten.*unbeschränkt/i,
                /weitergabe.*dritten/i
            ],
            isFair: false,
            example: "Wir können Ihre Daten unbeschränkt an Dritte weitergeben"
        }
    };
    // Bewertungslogik
};
```

## 5. Bewertungssynthese

```javascript
class AGBScorer {
    constructor() {
        this.weights = {
            dsgvo: 0.3,
            rights: 0.25,
            transparency: 0.25,
            fairness: 0.2
        };
    }

    calculateTrafficLight(scores) {
        const weightedScore = 
            scores.dsgvo * this.weights.dsgvo +
            scores.rights * this.weights.rights +
            scores.transparency * this.weights.transparency +
            scores.fairness * this.weights.fairness;

        return {
            color: weightedScore >= 0.8 ? 'green' :
                   weightedScore >= 0.6 ? 'yellow' : 'red',
            score: weightedScore,
            details: {
                dsgvo: scores.dsgvo,
                rights: scores.rights,
                transparency: scores.transparency,
                fairness: scores.fairness
            },
            recommendations: this.generateRecommendations(scores)
        };
    }

    generateRecommendations(scores) {
        // Generiert spezifische Verbesserungsvorschläge basierend auf den Scores
        const recommendations = [];
        if (scores.dsgvo < 
# ML-Modell-Architektur für AGB-Analyse

## 1. Modell-Übersicht

### 1.1 Architektur-Design
```javascript
class AGBAnalyzer {
    constructor() {
        this.encoder = new UniversalSentenceEncoder();
        this.classifier = new AGBClassifier();
        this.patterns = new PatternMatcher();
    }
}
```

### 1.2 Komponenten
- **Text Encoder**: Universal Sentence Encoder (USE) Light
- **Klassifikationsmodell**: Custom BERT-Tiny
- **Pattern Matcher**: Regelbasiertes System
- **Scoring Engine**: Gewichteter Ensemble-Ansatz

## 2. Text Encoder

### 2.1 Universal Sentence Encoder Light
```javascript
// Konfiguration des USE-Light Models
const useConfig = {
    modelUrl: './models/use_light',
    vocabulary: {
        size: 20000,
        specialTokens: {
            PAD: 0,
            START: 1,
            END: 2,
            UNK: 3
        }
    },
    embeddingDim: 128
};
```

### 2.2 Preprocessing
```javascript
const preprocessText = (text) => {
    return {
        // Textbereinigung
        cleanText: text.replace(/[^\w\s]/g, ' ')
                      .toLowerCase()
                      .trim(),
        
        // Segmentierung in relevante Abschnitte
        segments: {
            privacy: extractPrivacySection(text),
            terms: extractTermsSection(text),
            rights: extractRightsSection(text)
        },
        
        // Extraktion von Schlüsselphrasen
        keyPhrases: extractKeyPhrases(text)
    };
};
```

## 3. Klassifikationsmodell

### 3.1 BERT-Tiny Architektur
```javascript
class AGBClassifier {
    constructor() {
        this.config = {
            vocabSize: 20000,
            hiddenSize: 128,
            numLayers: 2,
            numHeads: 2,
            intermediateSize: 512,
            maxLength: 512
        };
        
        this.categories = [
            'dsgvo_compliant',
            'consumer_friendly',
            'transparent',
            'fair_terms'
        ];
    }
}
```

### 3.2 Klassifikations-Kategorien
1. DSGVO-Compliance
   ```javascript
   const dsgvoFeatures = {
       dataProcessing: {
           purpose: checkPurposeStatement(),
           legalBasis: checkLegalBasis(),
           retention: checkRetentionPeriods()
       },
       rights: {
           access: checkAccessRights(),
           deletion: checkDeletionRights(),
           portability: checkPortabilityRights()
       }
   };
   ```

2. Verbraucherfreundlichkeit
   ```javascript
   const consumerFeatures = {
       withdrawal: checkWithdrawalRights(),
       return: checkReturnPolicy(),
       warranty: checkWarrantyTerms(),
       pricing: checkPricingTransparency()
   };
   ```

### 3.3 Modell-Training
```javascript
class ModelTrainer {
    constructor() {
        this.trainingConfig = {
            epochs: 10,
            batchSize: 32,
            learningRate: 2e-5,
            warmupSteps: 1000,
            evaluationSteps: 100
        };
    }

    async trainModel(dataset) {
        // Implementierung des Training-Loops
        const model = await tf.loadLayersModel('./models/bert_tiny');
        
        await model.fit(dataset.trainData, {
            epochs: this.trainingConfig.epochs,
            batchSize: this.trainingConfig.batchSize,
            validationData: dataset.validData,
            callbacks: this.getCallbacks()
        });
        
        return model;
    }
}
```

## 4. Pattern Matcher

### 4.1 Regelbasierte Analyse
```javascript
class PatternMatcher {
    constructor() {
        this.patterns = {
            dsgvo: [
                /personenbezogene(?:\s+)daten/i,
                /datenverarbeitung/i,
                /einwilligung/i
            ],
            rights: [
                /widerrufsrecht/i,
                /rückgaberecht/i,
                /gewährleistung/i
            ],
            suspicious: [
                /unwiderruflich/i,
                /ohne(?:\s+)einschränkung/i,
                /keine(?:\s+)haftung/i
            ]
        };
    }

    async analyzeText(text) {
        return {
            dsgvoMatches: this.findPatternMatches(text, this.patterns.dsgvo),
            rightsMatches: this.findPatternMatches(text, this.patterns.rights),
            suspiciousMatches: this.findPatternMatches(text, this.patterns.suspicious)
        };
    }
}
```

## 5. Scoring Engine

### 5.1 Ensemble-Bewertung
```javascript
class ScoringEngine {
    constructor() {
        this.weights = {
            classifierScore: 0.4,
            patternScore: 0.3,
            structureScore: 0.3
        };
    }

    async calculateFinalScore(results) {
        const classifierScore = await this.getClassifierScore(results.classification);
        const patternScore = await this.getPatternScore(results.patterns);
        const structureScore = await this.getStructureScore(results.structure);

        return {
            finalScore: (
                classifierScore * this.weights.classifierScore +
                patternScore * this.weights.patternScore +
                structureScore * this.weights.structureScore
            ),
            details: {
                classifier: classifierScore,
                patterns: patternScore,
                structure: structureScore
            }
        };
    }
}
```

## 6. Optimierungen und Performance

### 6.1 Modell-Quantisierung
```javascript
const quantizeModel = async (model) => {
    const quantizedModel = await tf.quantization.quantize(model, {
        bitsPerWeight: 8,
        bitsPerActivation: 8
    });
    
    return quantizedModel;
};
```

### 6.2 Caching-Strategien
```javascript
class ModelCache {
    constructor() {
        this.cache = new Map();
        this.maxSize = 100; // Max number of cached results
    }

    async getCachedResult(url) {
        if (this.cache.has(url)) {
            const cached = this.cache.get(url);
            if (this.isStillValid(cached)) {
                return cached.result;
            }
        }
        return null;
    }
}
```

## 7. Fehlererkennung und Qualitätssicherung

### 7.1 Konfidenz-Scoring
```javascript
const calculateConfidence = (predictions) => {
    return {
        score: predictions.reduce((acc, pred) => acc + pred.confidence, 0) / predictions.length,
        reliable: predictions.every(pred => pred.confidence > 0.7)
    };
};
```

### 7.2 Qualitätsprüfung
```javascript
class QualityChecker {
    async validateAnalysis(results) {
        const checks = {
            completeness: this.checkCompleteness(results),
            consistency: this.checkConsistency(results),
            confidence: this.checkConfidence(results)
        };

        return {
            isValid: Object.values(checks).every(check => check.passed),
            details: checks
        };
    }
}
```

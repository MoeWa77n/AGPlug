# Technische Spezifikation: AGB-Analyse Browser-Plugin

## 1. Architektur-Übersicht

### 1.1 Komponenten
- Browser-Extension (Frontend)
- Lokale Analyse-Engine (Backend)
- Lokale SQLite Datenbank für Zwischenspeicherung
- Eingebettetes Machine Learning Modell

### 1.2 Technologie-Stack
- Frontend: JavaScript/TypeScript, HTML, CSS
- Backend: JavaScript/WebAssembly
- ML-Model: TensorFlow.js (lokal)
- Datenbank: SQLite (lokal im Browser)

## 2. Detaillierte Komponenten-Spezifikation

### 2.1 Content Script (content.js)
```javascript
// Hauptfunktionen:
- DOM-Überwachung für AGB/Datenschutz-Links
- Text-Extraktion aus relevanten Seiten
- Kommunikation mit Background Script
```

### 2.2 Background Script (background.js)
```javascript
// Hauptfunktionen:
- Koordination der Analyse
- Verwaltung der lokalen Datenbank
- ML-Model Management
```

### 2.3 Analyse-Engine
- Implementierung einer lightweight Variante von RAG (Retrieval Augmented Generation)
- Lokales Embedding-Modell für Textanalyse
- Vortrainierte Klassifikations-Patterns für typische AGB-Probleme

### 2.4 Bewertungslogik

#### Kriterienkatalog (Gewichtung in Prozent):
1. DSGVO-Compliance (30%)
   - Datenschutzerklärung vorhanden
   - Zweck der Datenverarbeitung
   - Rechtsgrundlagen
   - Aufbewahrungsfristen

2. Verbraucherrechte (25%)
   - Widerrufsrecht
   - Rückgaberecht
   - Gewährleistung

3. Transparenz (25%)
   - Verständlichkeit
   - Strukturierung
   - Vollständigkeit

4. Fairness (20%)
   - Keine unverhältnismäßigen Klauseln
   - Ausgewogene Rechte/Pflichten
   - Keine versteckten Kosten

#### Bewertungssystem
```javascript
const calculateRating = (criteria) => {
    let totalScore = 0;
    // Gewichtete Bewertung der Kriterien
    totalScore += criteria.dsgvo * 0.3;
    totalScore += criteria.consumerRights * 0.25;
    totalScore += criteria.transparency * 0.25;
    totalScore += criteria.fairness * 0.2;

    // Traffic Light Zuordnung
    if (totalScore >= 0.8) return 'green';
    if (totalScore >= 0.6) return 'yellow';
    return 'red';
};
```

## 3. Datenfluss und Privatsphäre

### 3.1 Lokale Verarbeitung
- Alle Analysen erfolgen lokal im Browser
- Keine externe Serveranbindung erforderlich
- Temporäre Datenspeicherung nur im lokalen IndexedDB/SQLite

### 3.2 Datenschutzmaßnahmen
```javascript
// Implementierung von:
- Verschlüsselung der lokalen Daten
- Automatische Löschung nach Analyse
- Opt-out Möglichkeit
- Transparente Logging-Funktion
```

## 4. Benutzeroberfläche

### 4.1 Browser-Icon
- Dynamisches Icon basierend auf Status
- Tooltip mit Kurzinfo

### 4.2 Popup-Interface
```html
<div class="rating-display">
    <!-- Traffic Light Anzeige -->
    <div class="traffic-light ${rating}"></div>
    
    <!-- Detaillierte Bewertung -->
    <div class="details">
        <h3>Bewertungsdetails</h3>
        <ul>
            <li>DSGVO-Compliance: ${dsgvoScore}</li>
            <li>Verbraucherrechte: ${rightsScore}</li>
            <li>Transparenz: ${transparencyScore}</li>
            <li>Fairness: ${fairnessScore}</li>
        </ul>
    </div>
    
    <!-- Aktionen -->
    <div class="actions">
        <button onclick="showFullReport()">Vollständiger Bericht</button>
        <button onclick="disableAnalysis()">Deaktivieren</button>
    </div>
</div>
```

## 5. Implementierungsreihenfolge

1. Basis-Extension-Struktur
2. Text-Extraktion und Parsing
3. Analyse-Engine Integration
4. UI-Implementierung
5. Lokale Datenspeicherung
6. Testing und Optimierung

## 6. Rechtliche Absicherung

### 6.1 Disclaimer
- Kennzeichnung als Hilfestellung
- Keine rechtliche Beratung
- Haftungsausschluss

### 6.2 DSGVO-Compliance
- Privacy by Design
- Dokumentation der Datenverarbeitung
- Transparente Nutzerinformation


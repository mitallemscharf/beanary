# Projektdokumentation — Beanery

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
        1. [Competitive Analysis](#311-competitive-analysis)
    2. [Sketch](#32-sketch)
    3. [Decide](#33-decide)
    4. [Prototype](#34-prototype)
    5. [Validate](#35-validate)
4. [Erweiterungen](#4-erweiterungen)
5. [Projektorganisation](#5-projektorganisation)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang](#7-anhang)

---

## 1. Ausgangslage

- **Problem:** Ambitionierte Hobby-Baristas und Prosumer-Kaffeeliebhaber haben kein dediziertes, ästhetisch anspruchsvolles Tool, um ihre Espresso-Extraktionen systematisch zu erfassen, zu analysieren und zu verbessern. Notizen werden auf Zetteln oder in Spreadsheets gemacht — ohne Visualisierung und Mustererkennung.
- **Ziele:**
  - Präzises Erfassen aller Extraktionsvariablen (Dose, Yield, Zeit, Temperatur, Mahlgrad)
  - Visualisierung des Brühverhältnisses (Live Brew Ratio) und Geschmacksprofils
  - Chronologische Übersicht aller Shots (Extraction Journal)
  - Verwaltung der eigenen Bohnensammlung (Bean Library) mit Sweet-Spot-Parametern
  - Dashboard mit Statistiken und Verlaufsanalyse
- **Primäre Zielgruppe:** «Prosumer» Kaffeeliebhaber — jemand, der eine Siebträgermaschine besitzt, nach Qualität strebt und datengetrieben seinen perfekten Espresso sucht.
- **Weitere Stakeholder:** Röstereien (Roastery Portal), Community-Mitglieder.

---

## 2. Lösungsidee

- **Kernfunktionalität:**
  1. **Shot Logger** — Formularbasierte Eingabe aller Extraktionsvariablen mit Live-Visualisierung des Brühverhältnisses (SVG Gauge) und interaktivem Flavor Wheel. Speichert Daten persistent via MongoDB.
  2. **Extraction Journal** — Chronologische Listenansicht aller gespeicherten Shots, gruppiert nach Datum, mit Filterfunktion und CSV-Export.
  3. **Dashboard** — KPIs (Total Shots, Avg Rating, Best Bean, Active Bags), interaktives Balkendiagramm der Extraktionshistorie, Sensory-Flavour-Card und Rituals-Liste.
  4. **Bean Library** — Card-Grid mit Bohnen-Sammlung, Sweet-Spot-Parametern, Freshness-Berechnung und Live-Suche.
  5. **Landing Page** — Editoriale Home Page mit Bento-Grid Feature-Übersicht.

- **Annahmen:** Alle Daten werden server-seitig in MongoDB Atlas gespeichert. User-Daten sind vollständig isoliert.
- **Abgrenzung:** Kein Rösterei-Portal im aktuellen Scope.

---

## 3. Vorgehen & Artefakte

### 3.1 Understand & Define

- **Zielgruppenverständnis:** Prosumer-Barista mit Siebträgermaschine, Waage und Mühle. Wertschätzt Präzision, Ästhetik und wissenschaftlichen Ansatz. Frustriert von unstrukturierten Notizen.
- **Wesentliche Erkenntnisse:**
  - Die wichtigsten Variablen: Dose (g), Yield (g), Zeit (s), Temperatur (°C), Mahlgrad
  - Das Brühverhältnis (Dose:Yield) ist die zentrale Qualitätskennzahl
  - Sensorische Notizen (Geschmacksprofil) sind schwer zu standardisieren
  - Ästhetik und Hochwertigkeitsgefühl sind für die Zielgruppe entscheidend

### 3.1.1 Competitive Analysis

Im Rahmen der Understand-Phase wurden bestehende Lösungen analysiert um Lücken und Differenzierungspotenzial zu identifizieren.

| App | Platform | Stärken | Schwächen |
|-----|----------|---------|-----------|
| Brewlog | iOS native | Einfaches Logging, Timer | Kein Web-Zugang, kein Dashboard |
| Espresso Journal | iOS native | Detaillierte Parameter | Komplexe UI, teuer |
| Coffee Diary | Android | Günstig, einfach | Kein Brew-Ratio-Rechner |
| Notion/Excel | Web | Flexibel | Kein spezifisches Kaffee-UX |
| mycoffee (GitHub) | Web (MERN) | Open Source | Kein Auth, kein Design |

**Erkenntnisse:**
- Alle nativen Apps sind auf iOS/Android beschränkt — keine plattformübergreifende Web-App
- Keine App bietet automatische Freshness-Berechnung
- Kein Tool kombiniert Shot-Logging mit Brew-Ratio-Empfehlungen
- Design-Qualität der bestehenden Apps ist durchschnittlich

**Differenzierung Beanery:**
- Web-App — funktioniert auf allen Geräten ohne Installation
- Premium Design (Google Stitch + eigenes Design-System)
- Automatische Freshness-Berechnung aus Röstdatum
- Dialing-In Empfehlungen basierend auf eigenen Shot-Daten
- User-spezifische Datenisolation mit Auth-System
- PWA — trotzdem auf Homescreen installierbar

### 3.2 Sketch

- **Variantenüberblick:** Drei Konzeptrichtungen: (A) wissenschaftlich/nüchtern, (B) editorial/minimalistisch, (C) community-orientiert. Variante B traf die Zielgruppe am besten.
- **Skizzen:** Wireframes für alle fünf Screens (Home, Shot Logger, History, Dashboard, Library) in Stitch.
- **Unterschiede:** Variante A war zu funktional ohne emotionalen Appeal; Variante C zu komplex für den Prototyp-Scope.

### 3.3 Decide

- **Gewählte Variante & Begründung:** Variante B — «Editorial Minimalism mit Tactile Accents». Entscheidungskriterien: Markenfit (Premium-Gefühl), Usability (klare Hierarchie), technische Machbarkeit.
- **End-to-End-Ablauf:**
  1. Nutzer landet auf Home Page → motiviert durch cineastische Fotografie und klare Value Proposition
  2. Login/Register → persönliches Laboratory
  3. Loggt neuen Shot via Shot Logger (Sidebar oder CTA-Button)
  4. Überprüft History im Extraction Journal
  5. Verwaltet Bohnen in der Bean Library

### 3.4 Prototype

#### 3.4.1 Entwurf (Design)

**Designentscheidungen:**
- **Farbpalette:** Warm Paper-White (#FBF9F4) als Background, Crema Gold (#C5A059) als Akzent, Dunkelbraun (#1B1C19) für Text
- **Typografie:** Libre Caslon Text (Serif) für Headlines, Hanken Grotesk (Sans-Serif) für Body
- **Theme:** Light Theme mit Dark Mode Toggle — wirkt professioneller für eine Schulabgabe
- **Bildsprache:** Schwarzweiss-Fotos von Kaffeebohnen und Espresso — konsistent und premium

#### 3.4.2 Umsetzung (Technik)

**Technologie-Stack:**
- **Frontend:** SvelteKit (TypeScript)
- **Backend:** SvelteKit API Routes (+server.ts)
- **Datenbank:** MongoDB Atlas mit Mongoose
- **Authentication:** JWT mit bcrypt
- **Deployment:** Netlify mit adapter-netlify
- **Versionsverwaltung:** Git & GitHub

**Tooling:**
- IDE: Visual Studio Code
- AI-Coding: Claude Code (Anthropic) als VS Code Extension
- Design: Google Stitch + Figma
- Datenbankmanagement: MongoDB Compass + MongoDB Atlas

**Datenmodelle:**
- **User:** name, email, password (bcrypt-hashed), role (admin/user), createdAt
- **Bean:** name, roastery, origin, roastDate, tags, dose, yield, time, status, userId, createdAt
- **Shot:** bean, dose, grindSize, time, yield, temp, rating, notes, process, roast, userId, createdAt

**Deployment:** https://beanery-lenny.netlify.app

**Besondere Entscheidungen:**
- adapter-netlify statt adapter-auto — notwendig damit API-Routes als Serverless Functions deployed werden
- localStorage wurde initial verwendet, dann vollständig durch MongoDB ersetzt
- Git-Branch feature/authentication für das Auth-System, dann in main gemergt

---

### 3.5 Validate

**URL der getesteten Version:** https://beanery-lenny.netlify.app (Stand 20. Mai 2026)

**Ziele der Prüfung:**
- Können Nutzer ohne Erklärung eine neue Bohne erfassen?
- Können Nutzer ohne Erklärung einen Shot loggen?
- Ist das Dashboard verständlich und die Daten klar lesbar?

**Vorgehen:** Moderiert, on-site, ZHAW Winterthur, 20. Mai 2026

**Stichprobe:** 2 Mitstudierende der Klasse TZBISa (Metehan Altay, Subraj Singh)

**Aufgaben/Szenarien:**

Aufgabe 1: «Sie haben kürzlich neue Kaffeebohnen aus Panama erhalten. Sie möchten diese in der App erfassen. Bohnenname: Kotowa Arabica, Röster: Boquete Coffee Traders, Herkunft: Panama.»

Aufgabe 2: «Sie haben heute Morgen einen Espresso gebrüht: 18g Kaffeemehl, 36g Ausbeute, 28 Sekunden, 93°C. Sie möchten diesen Shot festhalten und mit 4 Sternen bewerten.»

Aufgabe 3: «Sie möchten herausfinden, welche Bohne bisher die besten Bewertungen erhalten hat.»

---

#### Feedback Grid

**Feedback Grid — Metehan Altay**

| ✅ Was hat gut funktioniert? | ❌ Was hat nicht funktioniert? |
|---|---|
| Farbpalette sehr ansprechend | Edit-Button bei Bohnen nicht klickbar |
| Navigation zwischen Seiten klar | Grind Size Pfeile laggen |
| Bean Library übersichtlich | Kein Login/Register Fenster |
| Shot History gut strukturiert | Keine Logout Funktion |

| 💡 Neue Ideen | ❓ Was war unklar? |
|---|---|
| Login/Register als Einstieg | Bedeutung von "Precision 98%" |
| Onboarding für Anfänger | Unterschied Journal vs History |

**Feedback Grid — Subraj Singh**

| ✅ Was hat gut funktioniert? | ❌ Was hat nicht funktioniert? |
|---|---|
| Farbpalette passt sehr gut | Support Funktion nicht vorhanden |
| Dashboard übersichtlich | Keine Logout Funktion |
| Shot History klar gestaltet | Kein Login/Register Fenster |
| Bean Library Auswahl gross | |
| Einstellungsseite einfach | |

| 💡 Neue Ideen | ❓ Was war unklar? |
|---|---|
| Anmeldefenster vor App-Zugriff | Zu viele Optionen im Shot Logger |
| Abmeldefunktion hinzufügen | Fachbegriffe (Dose, Yield, TDS) |

---

#### Visuelle Issue Map

| Arbeitsschritt | Fragestellung | Metehan Altay | Subraj Singh |
|---|---|---|---|
| **Login/Einstieg** | Ist der Einstieg klar? | ❌ Kein Login-Fenster (Schweregrad 3) | ❌ Kein Login-Fenster (Schweregrad 3) |
| **Shot Logger** | Sind alle Felder verständlich? | ⚠️ Grind Size Lag (Schweregrad 2) | ⚠️ Zu komplex für Einsteiger (Schweregrad 2) |
| **Bean Library** | Kann man Bohnen bearbeiten? | ❌ Edit-Button defekt (Schweregrad 3) | ✅ Kein Problem |
| **Navigation** | Ist die Navigation klar? | ✅ Kein Problem | ⚠️ Support-Link tot (Schweregrad 1) |
| **Account** | Gibt es Logout? | ❌ Kein Logout (Schweregrad 3) | ❌ Kein Logout (Schweregrad 3) |

**Schweregrad-Legende:**
- 0 = Kein Problem
- 1 = Kosmetisch
- 2 = Kleines Problem
- 3 = Grosses Problem — hohe Priorität
- 4 = Katastrophe

---

#### Umgesetzte Verbesserungen

| Issue | Schweregrad | Status | Umsetzung |
|---|---|---|---|
| Kein Login/Register | 3 | ✅ Behoben | Vollständiges Auth-System mit JWT |
| Kein Logout | 3 | ✅ Behoben | Logout Button in Sidebar |
| Edit-Button defekt | 3 | ✅ Behoben | Slide-in Drawer mit vorausgefülltem Formular |
| Grind Size Lag | 2 | ✅ Behoben | Performance-Optimierung |
| Shot Logger zu komplex | 2 | ✅ Behoben | Adaptives UI für Beginner |
| Support-Link tot | 1 | ✅ Behoben | Support-Seite implementiert |

**Zusammenfassung:** Die App wurde grundsätzlich sehr positiv aufgenommen. Grösste Issues: fehlendes Auth-System und nicht funktionierende Edit-Buttons. Für Nicht-Kaffee-Experten waren einige Fachbegriffe unklar. Alle Issues mit Schweregrad ≥ 1 wurden umgesetzt.

---

## 4. Erweiterungen

### 4.1 User Authentication mit Rollen (Admin/User)

- **Beschreibung & Nutzen:** Vollständiges Auth-System mit JWT, bcrypt, Login/Register/Logout. Jeder User sieht nur eigene Daten. Admin sieht alle Daten.
- **Wo umgesetzt:** Frontend: /login, /register. Backend: /api/auth/*. DB: User-Model, userId auf Bean+Shot. Middleware: hooks.server.ts
- **Referenz:** Kap. 3.4.2
- **Aus Evaluation abgeleitet?:** Ja — Issues mit höchster Priorität aus Evaluation.

### 4.2 Admin Panel

- **Beschreibung & Nutzen:** Exklusiver Bereich /admin. Total Users/Beans/Shots, User-Tabelle, Recent Activity. Admin kann User und Shots löschen.
- **Wo umgesetzt:** Frontend: /admin. Backend: /api/admin/stats, DELETE-Endpoints.
- **Referenz:** Kap. 4.1
- **Aus Evaluation abgeleitet?:** Indirekt.

### 4.3 Live Extraction Timer

- **Beschreibung & Nutzen:** START/STOP/RESET Timer im Shot Logger. Zeit wird automatisch eingetragen beim Stoppen. MM:SS-Anzeige mit Pulse-Animation während der Extraktion.
- **Wo umgesetzt:** Frontend: Timer-Card im Shot Logger, `setInterval` mit `onDestroy`-Cleanup.
- **Referenz:** Shot Logger Screenshot
- **Aus Evaluation abgeleitet?:** Nein — aus Nutzerbedürfnis.

### 4.4 Interaktives Flavor Wheel

- **Beschreibung & Nutzen:** SVG-Rad mit 8 Kategorien (Fruity, Floral, Sweet, Nutty, Chocolatey, Roasted, Spicy, Sour). Klick auf Segment öffnet Sub-Flavors als wählbare Pills. Gewählte Flavors werden automatisch in die Shot-Notizen übernommen.
- **Wo umgesetzt:** Frontend: SVG mit polaren Koordinaten im Shot Logger.
- **Aus Evaluation abgeleitet?:** Nein.

### 4.5 Automatische Freshness-Berechnung

- **Beschreibung & Nutzen:** Status (TOO FRESH / FRESH / PEAK / PAST PEAK / OLD) automatisch aus Röstdatum. Logik: 0–7d: TOO FRESH, 8–21d: FRESH, 22–35d: PEAK, 36–60d: PAST PEAK, 60+d: OLD.
- **Wo umgesetzt:** Frontend: Bean-Cards und Detail-Drawer. Berechnung in `getFreshness()` in beans-Store.
- **Referenz:** Bean Library Screenshots
- **Aus Evaluation abgeleitet?:** Nein.

### 4.6 Brew Ratio Recommendation Engine

- **Beschreibung & Nutzen:** Nach 3+ Shots pro Bohne zeigt die App eine Empfehlung für optimale Parameter basierend auf den besten Shots (Top-3 nach Rating).
- **Wo umgesetzt:** Frontend: Recommendation-Card im Bean-Drawer. Aggregation nach Rating in `getRecommendation()`.
- **Referenz:** Bean Library Detail
- **Aus Evaluation abgeleitet?:** Nein.

### 4.7 Dark Mode Toggle

- **Beschreibung & Nutzen:** Light/Dark Mode umschaltbar. Präferenz in localStorage gespeichert. CSS Custom Properties schalten auf warme Dunkelbraun-Palette.
- **Wo umgesetzt:** Frontend: Toggle in Sidebar und Settings → Appearance. Store: `src/lib/stores/theme.ts`.
- **Aus Evaluation abgeleitet?:** Nein.

### 4.8 Mobile Responsive Design

- **Beschreibung & Nutzen:** Vollständige Mobile-Optimierung (375px). Sidebar wird auf Mobile zu einer Bottom Navigation mit 5 Tabs. Touch-Targets mindestens 48px.
- **Wo umgesetzt:** Frontend: Tailwind Responsive Prefixes (`md:`, `sm:`), Bottom Navigation Komponente im App-Layout.
- **Aus Evaluation abgeleitet?:** Nein.

### 4.9 Export CSV

- **Beschreibung & Nutzen:** Shot History als CSV exportierbar mit allen Feldern (Bean, Dose, Yield, Time, Temp, Rating, Date, Notes).
- **Wo umgesetzt:** Frontend: Export-Button in History und Settings → Data.
- **Aus Evaluation abgeleitet?:** Nein.

---

## 5. Projektorganisation

- **Repository:** https://github.com/mitallemscharf/beanery
- **Deployment:** https://beanery-lenny.netlify.app
- **Figma:** https://www.figma.com/design/tw5wstCGf1QVRyN42YP6GH/Beanary-App
- **Commits:** Präfix feat/fix/docs/backup mit sprechenden Messages
- **Branches:** main (Produktion), feature/authentication (gemergt)
- **Collaborators:** mmeisterhans, bkuehnis

---

## 6. KI-Deklaration

### 6.1 KI-Tools

| Tool | Zweck |
|------|-------|
| Claude Code (VS Code Extension) | Gesamter SvelteKit-Code, API-Routes, MongoDB, Auth-System, alle Features |
| Claude.ai (claude.ai) | Projektplanung, Prompt-Erstellung, Feedback-Analyse, README |
| Google Stitch | UI/Design-Generierung als HTML/CSS-Grundlage |
| Figma | Initiales Mockup und Design-System |

**Eigene Leistung:** Projektidee, Konzept, alle Prompts, Design-Entscheidungen, Evaluation, Dokumentation. KI-Output stets kritisch geprüft und bei Fehlern korrigiert.

### 6.2 Prompt-Vorgehen

Workflow: «Vibe Design → AI Coding»
1. Google Stitch mit Referenz-Screenshots geprompted für UI-Grundlage
2. Claude Code erhielt Stitch-Export als Kontext, Features schrittweise implementiert
3. Bugs direkt mit Fehlermeldungen und Erwartungsverhalten an Claude Code zurückgegeben
4. Bei kritischen Änderungen zuerst Backup-Commit angefordert

### 6.3 Reflexion

KI-Tools haben die Entwicklungsgeschwindigkeit erheblich erhöht. Grenzen: In einem Fall verwendete Claude Code localStorage statt MongoDB — ein fundamentaler Fehler der durch kritische Prüfung erkannt wurde. KI-Ausgaben wurden nie blind übernommen — Verständnis des Codes war stets Voraussetzung.

---

## 7. Anhang

- **Bilder:** Pexels.com, Unsplash.com (kostenlos, lizenzfrei)
- **Icons:** Material Symbols (Google)
- **Fonts:** Libre Caslon Text, Hanken Grotesk (Google Fonts)
- **Testpersonen:** Metehan Altay, Subraj Singh (TZBISa, 20. Mai 2026)
- **Design-Inspiration:** Sweetgreen App (mobbin.com), MUBI Go App (mobbin.com)

**Quellen & Lizenzen:**
- Google Fonts (Libre Caslon Text, Hanken Grotesk, JetBrains Mono) — SIL Open Font License
- Material Symbols — Apache 2.0 License
- Unsplash / Pexels (Bildmaterial) — kostenlose Nutzung für Demos
- SvelteKit — MIT License
- Tailwind CSS — MIT License
- Mongoose — MIT License
- bcrypt — MIT License

**Entwicklungsstart:**

```bash
cd beanery-app
npm install
npm run dev
```

App läuft auf `http://localhost:5173`

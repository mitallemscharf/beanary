# Projektdokumentation – Beanary

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
    2. [Sketch](#32-sketch)
    3. [Decide](#33-decide)
    4. [Prototype](#34-prototype)
    5. [Validate](#35-validate)
4. [Erweiterungen](#4-erweiterungen)
5. [Projektorganisation](#5-projektorganisation)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang](#7-anhang)

> **Hinweis:** Massgeblich sind die im **Unterricht** und auf **Moodle** kommunizierten Anforderungen.

<!-- WICHTIG: DIE KAPITELSTRUKTUR DARF NICHT VERÄNDERT WERDEN! -->

<!-- Diese Vorlage ist für eine README.md im Repository gedacht. Abschnitte mit [Optional] können weggelassen werden, wenn in den Übungen nichts anderes verlangt wird. -->

## 1. Ausgangslage

- **Problem:** Home-Baristas haben keine einfache, mobile-taugliche Möglichkeit, ihre Espresso-Shots systematisch zu dokumentieren. Notizbücher sind unpraktisch, allgemeine Notiz-Apps bieten keine Kaffee-spezifischen Felder und kein automatisches Auswerten der Daten. Dadurch ist es schwierig, den optimalen Mahlgrad, die ideale Dosis oder den besten Kaffeebohneneinsatz («Sweet Spot») gezielt zu reproduzieren.
- **Ziele:**
  - Schnelles, unkompliziertes Erfassen von Espresso-Shots direkt am Gerät (Mobile-first)
  - Strukturiertes Verwalten von Kaffeebohnen (Röster, Herkunft, Röstdatum)
  - Automatische Berechnung und farbkodierte Darstellung der Brew-Ratio (Yield ÷ Dosis)
  - Erkennen des besten Shots pro Bohne («Sweet Spot»)
  - Überblick über Fortschritte über Zeit (Dashboard mit Metriken und Bewertungsverlauf)
- **Primäre Zielgruppe:** Home-Baristas mit Interesse an Qualität und Reproduzierbarkeit ihrer Espresso-Extraktion – von Hobbyisten bis zu ambitionierten Enthusiasten.

## 2. Lösungsidee

- **Kernfunktionalität:**
  1. **Shot loggen** (Hauptworkflow): Bohne auswählen → Dose, Yield, Mahlgrad, Extraktionszeit, Temperatur eingeben → Bewertung (1–5 Sterne) und Geschmackstags setzen → Speichern mit automatischer Brew-Ratio-Berechnung
  2. **Bohnen verwalten**: Neue Bohnen anlegen (Name, Röster, Herkunft, Röstdatum, Röstgrad, Tags), Detailansicht mit allen Shots und Sweet Spot
  3. **History**: Chronologische Übersicht aller Shots, filterbar nach Bohne, mit Best-Shot-Badge
  4. **Dashboard**: Metriken (Shots total, Ø Bewertung, beste Bohne, aktive Bohnen), Bewertungsverlauf als SVG-Balken-Chart, letzte 3 Shots
- **Abgrenzung:** Keine Nutzerauthentifizierung (Single-User-App), keine Geräteverwaltung, kein Rezeptsystem.

## 3. Vorgehen & Artefakte

### 3.1 Understand & Define

- **Zielgruppenverständnis:** Home-Baristas arbeiten in der Küche, oft mit nassen oder beschäftigten Händen. Das Gerät liegt in der Nähe der Espressomaschine. Daraus folgt: Mobile-first, grosse Touch-Targets, minimale Tipparbeit, sofortiges Feedback.
- **Wesentliche Erkenntnisse:**
  - Der kritische Moment ist direkt während oder nach der Extraktion — die App muss extrem schnell zu bedienen sein
  - Brew-Ratio (Yield ÷ Dosis) ist die wichtigste Kenngrösse für Extraktionsqualität (Zielbereich 1:1,8–2,2)
  - Röstdatum ist entscheidend für Frische — Bohnen sollten 7–30 Tage nach Röstung verwendet werden
  - Nutzer wollen nicht nur erfassen, sondern auch aus vergangenen Shots lernen

### 3.2 Sketch

- **Variantenüberblick:** Drei Navigationskonzepte skizziert: Top-Tab-Bar, Sidebar (Desktop-orientiert) und Bottom Navigation (Mobile-native). Dazu zwei Farbschemata: helles Beige-Töne-Design vs. dunkles Kaffee-Theme.
- **Skizzen:** Im Rahmen der vorherigen Übung erstellte Mockups mit folgenden Varianten:
  - **Variante A:** Helles Design, Top Navigation — vertraut, aber weniger mobil-ergonomisch
  - **Variante B:** Dunkles Kaffee-Theme, Bottom Navigation — immersiver, thumb-friendly, passend zur Atmosphäre

### 3.3 Decide

- **Gewählte Variante & Begründung:** Variante B (dunkles Theme, Bottom Navigation). Bottom Navigation ermöglicht einhändige Bedienung; das dunkle Kaffee-Farbschema (tiefes Braun/Crema) wirkt stimmig und professionell. Die 4 Haupt-Tabs (Home, Bohnen, Shot loggen, History) decken alle primären Workflows ab.
- **End-to-End-Ablauf (User Journey):**
  1. Neue Bohne anlegen unter `/beans/new` (Name, Röster, Röstdatum, Tags)
  2. Auf `/log` Bohne auswählen und Shot-Parameter erfassen
  3. Brew-Ratio wird live angezeigt (grün = optimal, gelb = akzeptabel, rot = ausserhalb)
  4. Nach Speichern erscheint Toast-Bestätigung, Formular wird zurückgesetzt
  5. Shot erscheint in `/history` und auf `/beans/[id]` mit Sweet-Spot-Hervorhebung
  6. Dashboard (`/`) zeigt aggregierte Metriken und Bewertungsverlauf
- **Mockup:** Im Rahmen der vorherigen Übung erstellt (dunkles Kaffee-Theme, Mobile-Screens für alle 6 Routen).

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)

- **Informationsarchitektur:**

  ```
  / (Dashboard)
  ├── /beans (Bohnenübersicht)
  │   ├── /beans/new (Bohne anlegen)
  │   └── /beans/[id] (Bohnendetail + Shots + Sweet Spot)
  ├── /log (Shot loggen)
  └── /history (Shot-History mit Filter)
  ```

  Navigation via fixierter Bottom-Nav-Bar mit 4 Tabs (Home, Bohnen, Shot loggen, History). Aktiver Tab farblich hervorgehoben.

- **User Interface Design:**
  - **Dashboard (`/`):** Begrüssung, 4 Metrikkarten (Shots total, Ø Bewertung, beste Bohne, aktive Bohnen), SVG-Balken-Chart der letzten Shots, Schnellzugriff auf letzte 3 Shots
  - **Bohnenübersicht (`/beans`):** Cards mit Röster, Frische-Badge, Geschmackstags, Shot-Anzahl und Ø Bewertung
  - **Shot loggen (`/log`):** Stufenformular — Bohne → Dosis/Yield mit Live-Brew-Ratio → Mahlgrad/Zeit → Temperatur → Sternebewertung → Geschmackstags → Notizen
  - **Bohnendetail (`/beans/[id]`):** Sweet-Spot-Karte (bester Shot), alle Shots in Listenform
  - **History (`/history`):** Datumsgruppen, Best-Shot-Badge, Dropdown-Filter nach Bohne
  - **Fehlerseite (`+error.svelte`):** Statuscodes, Fehlermeldung, Link zur Startseite

- **Designentscheidungen:**
  - Farbpalette: `--bg: #0f0c0a` (fast schwarz), `--crema: #E8C99A` (Crema-Beige), `--coffee: #8B5A2B` (Kaffeebraun) — auf Kaffee-Atmosphäre abgestimmt
  - Schriften: Cormorant Garamond (Display/Zahlen, elegant) + DM Sans (Body, lesbar auf kleinen Screens)
  - Brew-Ratio-Farbkodierung: grün (1,8–2,2 = Specialty-Coffee-Standard), gelb (akzeptabel), rot (ausserhalb)
  - Frische-Badge: grün (≤ 14 Tage seit Röstung), gelb (15–30 Tage), rot (> 30 Tage)

#### 3.4.2. Umsetzung (Technik)

- **Technologie-Stack:**
  - **Frontend/Backend:** SvelteKit 2 mit Svelte 5 (Runes-Mode: `$state`, `$derived`, `$derived.by()`, `$props`, `$bindable`)
  - **Datenbank:** MongoDB Atlas (Free Tier) mit Mongoose 9
  - **Deployment:** Netlify mit `@sveltejs/adapter-netlify`
  - **Sprache:** JavaScript (kein TypeScript)

- **Tooling:**
  - IDE: VS Code mit Svelte-Extension
  - Versionsverwaltung: Git / GitHub (`mitallemscharf/beanary`)
  - Build-Tool: Vite 8
  - KI-Unterstützung: Claude Code (Anthropic, Claude Sonnet 4.6) — siehe Kap. 6

- **Struktur & Komponenten:**

  | Komponente | Funktion |
  |---|---|
  | `BottomNav.svelte` | Fixierte Navigation, aktiver Tab via `$app/state` |
  | `BeanCard.svelte` | Bohnen-Karte mit FreshnessIndicator und Stats |
  | `ShotCard.svelte` | Shot-Karte mit Bewertung, Parametern, Tags |
  | `RatingStars.svelte` | Klickbare/readonly Sternebewertung (1–5) |
  | `BrewRatioIndicator.svelte` | Live-Ratio mit farbkodiertem Feedback |
  | `FreshnessIndicator.svelte` | Frische-Badge (Tage seit Röstdatum) |
  | `FlavorTags.svelte` | Auswählbare Geschmacks-Pills |
  | `Toast.svelte` | Globale Erfolgs-/Fehlermeldungen (3 Sekunden) |

  Globaler Toast-State in `src/lib/stores/toast.svelte.js` als Svelte-5-`$state`-Modul.

- **Daten & Schnittstellen:**
  - **MongoDB-Collections:** `beans` und `shots` (mit `beanId`-Referenz auf Bean)
  - **Bean-Schema:** `name`, `roaster`, `origin`, `roastDate`, `roastLevel`, `flavorTags[]`, `notes`, `createdAt`
  - **Shot-Schema:** `beanId`, `dose`, `grindSize`, `extractionTime`, `yieldG`, `temperature`, `rating`, `brewRatio` (auto), `flavorTags[]`, `notes`, `createdAt`
  - **Datenabruf:** Ausschliesslich via SvelteKit `load()`-Funktionen (Server-Side Rendering)
  - **Datenspeicherung:** Via SvelteKit Form Actions (POST) — kein separates REST-API-Layer
  - **DB-Verbindung:** Singleton-Pattern mit `global._mongoose`-Cache (verhindert zu viele Verbindungen bei Dev-HMR)
  - **Umgebungsvariable:** `MONGODB_URI` via `$env/dynamic/private` (sicher, nie an Client übermittelt)

- **Deployment:** Netlify — URL gemäss Netlify-Dashboard (automatisches Deployment via GitHub-Verknüpfung)

- **Besondere Entscheidungen:**
  - Kein separates API-Layer: SvelteKit Form Actions ermöglichen sichere serverseitige Verarbeitung ohne REST-Endpunkte
  - Brew-Ratio server-seitig berechnet (nicht im Client), um Manipulationen zu verhindern
  - Kein TypeScript für maximale Einfachheit im Prototyping-Kontext
  - SVG-Chart ohne externe Bibliothek (inline SVG), um Abhängigkeiten minimal zu halten

### 3.5 Validate

- **URL der getesteten Version:** Netlify-Deployment (siehe Netlify-Dashboard)
- **Ziele der Prüfung:** Überprüfen ob der Haupt-Workflow (Shot loggen von Start bis Bestätigung) ohne Anleitung durchführbar ist und ob Brew-Ratio und Sweet Spot intuitiv verständlich sind.
- **Vorgehen:** Informeller Selbsttest aller 6 Routen auf mobilem Gerät (iPhone, Safari) und Desktop (Chrome). End-to-End-Test aller Workflows.
- **Stichprobe:** Entwickler + 1 weitere Person (Home-Barista, keine technischen Vorkenntnisse)
- **Aufgaben/Szenarien:**
  1. Lege eine neue Kaffeebohne an (Röster, Herkunft, Röstdatum)
  2. Logge einen Shot für diese Bohne (alle Pflichtfelder, Sternebewertung setzen)
  3. Finde den besten Shot («Sweet Spot») für die angelegte Bohne
  4. Filtere die History nach deiner Bohne
- **Kennzahlen & Beobachtungen:**
  - Aufgaben 1–3: Ohne Hilfe abgeschlossen (< 2 min pro Aufgabe)
  - Brew-Ratio-Farbkodierung: sofort als positiv/negativ verstanden
  - «Sterne antippen»-Puls-Animation wurde als hilfreicher Hinweis wahrgenommen
- **Zusammenfassung der Resultate:** Der Hauptworkflow funktioniert flüssig und ist ohne Erklärung verständlich. Brew-Ratio-Anzeige und Sweet Spot sind intuitiv nutzbar. Verbesserungspotenzial bei sehr kleinen Screens (< 350 px Breite).
- **Abgeleitete Verbesserungen:** Responsive-Anpassungen für sehr kleine Geräte; mögliche Erweiterung um Shot-Bearbeitung und -Löschen.

## 4. Erweiterungen

### 4.1 SVG-Balken-Chart (Bewertungsverlauf)
- **Beschreibung & Nutzen:** Das Dashboard zeigt die letzten 10 Shots als farbkodierten Balken-Chart. Grüne Balken = gute Bewertung (≥ 4), gelb = mittel (3), rot = schwach (< 3). Nutzer erkennen schnell Trends in ihrer Extraktionsqualität.
- **Wo umgesetzt:**
  - **Frontend:** Inline SVG in `src/routes/+page.svelte` (keine externe Chart-Bibliothek)
  - **Backend:** `src/routes/+page.server.js` — `chartData`-Array aus MongoDB (Rating + Datum)
- **Referenz:** Dashboard-Screen (`/`), Abschnitt «Bewertungsverlauf»
- **Aus Evaluation abgeleitet?:** Nein, von Anfang an geplant

### 4.2 Brew-Ratio-Indikator (Echtzeit, farbkodiert)
- **Beschreibung & Nutzen:** Zeigt beim Shot-Logging live die aktuelle Brew-Ratio (Yield ÷ Dosis) mit farblichem Feedback: grün (1,8–2,2 = Specialty-Coffee-Standard), gelb (akzeptabel), rot (ausserhalb). Baristas erhalten sofortiges Qualitätsfeedback noch vor dem Speichern.
- **Wo umgesetzt:**
  - **Frontend:** `src/lib/components/BrewRatioIndicator.svelte` mit reaktiver Farblogik via `$derived.by()`
  - **Backend:** Brew-Ratio wird zusätzlich server-seitig in der Form Action berechnet und gespeichert
- **Referenz:** `/log`, Abschnitt «Brew-Ratio (Yield ÷ Dosis)»
- **Aus Evaluation abgeleitet?:** Nein, Domain-Anforderung von Anfang an

### 4.3 Frische-Indikator (FreshnessIndicator)
- **Beschreibung & Nutzen:** Zeigt auf Bohnenkarten und der Detailansicht an, wie viele Tage seit dem Röstdatum vergangen sind. Badge-Farbe: grün ≤ 14 Tage, gelb 15–30, rot > 30. Schnelle Einschätzung der Bohnenqualität auf einen Blick.
- **Wo umgesetzt:**
  - **Frontend:** `src/lib/components/FreshnessIndicator.svelte`, eingebunden in `BeanCard.svelte` und `/beans/[id]/+page.svelte`
- **Referenz:** Bohnenübersicht (`/beans`) und Bohnendetail
- **Aus Evaluation abgeleitet?:** Nein, von Anfang an geplant

### 4.4 History-Filter nach Bohne
- **Beschreibung & Nutzen:** Auf der History-Seite können Shots per Dropdown nach Bohne gefiltert werden. Nützlich wenn Nutzer nur Shots einer bestimmten Bohne analysieren wollen.
- **Wo umgesetzt:**
  - **Frontend:** Dropdown in `src/routes/history/+page.svelte`, Navigation via `goto()` mit `?bean=id`-Parameter
  - **Backend:** `src/routes/history/+page.server.js` — MongoDB-Query mit optionalem `beanId`-Filter
- **Referenz:** History-Seite (`/history`), Dropdown oben
- **Aus Evaluation abgeleitet?:** Nein, geplante Erweiterung

### 4.5 Sweet Spot — Bester Shot pro Bohne
- **Beschreibung & Nutzen:** Auf der Bohnendetailseite wird der am höchsten bewertete Shot als «Sweet Spot» hervorgehoben (goldene Umrandung). Nutzer sehen sofort, welche Parameter die beste Extraktion ergaben, und können diese reproduzieren.
- **Wo umgesetzt:**
  - **Frontend:** `src/routes/beans/[id]/+page.svelte` — separate Sweet-Spot-Karte
  - **Backend:** `src/routes/beans/[id]/+page.server.js` — `shots.reduce()` für höchstbewerteten Shot
- **Referenz:** Bohnendetail (`/beans/[id]`), Abschnitt «Sweet Spot»
- **Aus Evaluation abgeleitet?:** Nein, von Anfang an als Kern-Feature geplant

### 4.6 Dashboard-Metriken (MongoDB-Aggregation)
- **Beschreibung & Nutzen:** Das Dashboard berechnet via MongoDB-Aggregation: Shots total, Durchschnittsbewertung, beste Bohne (höchste Ø-Bewertung), Anzahl aktiver Bohnen (mind. 1 Shot in letzten 30 Tagen).
- **Wo umgesetzt:**
  - **Backend:** `src/routes/+page.server.js` mit `Shot.aggregate()`, `Shot.distinct()`, `Bean.findById()`
- **Referenz:** Dashboard (`/`), Metrikkarten
- **Aus Evaluation abgeleitet?:** Nein, geplante Erweiterung

### 4.7 Server-seitige Formularvalidierung mit Fehlermeldungen
- **Beschreibung & Nutzen:** Alle Pflichtfelder werden server-seitig validiert (Dose, Yield, Mahlgrad, Zeit, Rating 1–5, gültige Bohnen-ID). Fehlermeldungen erscheinen als roter Error-Banner direkt auf der Seite. Verhindert ungültige Daten in der Datenbank.
- **Wo umgesetzt:**
  - **Backend:** Form Actions in `src/routes/log/+page.server.js` und `src/routes/beans/new/+page.server.js` mit `fail()` von SvelteKit
  - **Frontend:** `{#if form?.error}` Error-Banner in den jeweiligen Seiten
- **Referenz:** `/log` und `/beans/new` bei ungültigen Eingaben
- **Aus Evaluation abgeleitet?:** Nein, von Anfang an implementiert

### 4.8 Toast-Feedback-System
- **Beschreibung & Nutzen:** Nach erfolgreichen Aktionen erscheint eine nicht-blocking Toast-Meldung für 3 Sekunden («Shot gespeichert! ☕»). Gibt Nutzern sofortiges Feedback ohne Navigation zu unterbrechen.
- **Wo umgesetzt:**
  - **Frontend:** `src/lib/components/Toast.svelte` + `src/lib/stores/toast.svelte.js` (globaler `$state`-Store)
  - Eingebunden in `src/routes/+layout.svelte` — auf allen Seiten verfügbar
- **Referenz:** Erscheint nach jedem erfolgreichen Speichern (Shot oder Bohne)
- **Aus Evaluation abgeleitet?:** Nein, UX-Anforderung von Anfang an

## 5. Projektorganisation

- **Repository & Struktur:**
  - URL: [https://github.com/mitallemscharf/beanary](https://github.com/mitallemscharf/beanary)
  - Struktur: SvelteKit-Standard mit `src/routes/` (Seiten + Server-Logik), `src/lib/components/` (8 Komponenten), `src/lib/server/` (DB + Mongoose-Modelle), `src/lib/stores/` (globaler State)

- **Commit-Praxis:** Conventional Commits mit sprechenden Nachrichten (z. B. `feat: add shot logging form with brew ratio`, `fix: rename yield→yieldG to avoid JS reserved word conflicts`). Commits nach jedem abgeschlossenen Feature-Block.

## 6. KI-Deklaration

### 6.1 KI-Tools

- **Eingesetzte Tools:** Claude Code (Anthropic) — Modell: Claude Sonnet 4.6; verwendet als interaktiver Terminal-Assistent direkt in der Entwicklungsumgebung (VS Code)
- **Zweck & Umfang:** Claude Code wurde für die gesamte Code-Generierung eingesetzt: SvelteKit-Routen und Komponenten, Mongoose-Modelle und Datenbanklogik, CSS (Farbpalette, Layout, Animationen), Fehlerbehandlung, Deployment-Konfiguration (netlify.toml). Der Grossteil des produktiven Codes entstand mit KI-Unterstützung.
- **Eigene Leistung (Abgrenzung):** Eigenständig erarbeitet wurden: Konzeptentwicklung und Problemdefinition, Feature-Auswahl und Priorisierung, Designentscheidungen (Farbschema, Navigation, UX-Flows), Anforderungsspezifikation in natürlicher Sprache, Qualitätssicherung durch manuelles Testen, Bugidentifikation und gezielte Fehlerübermittlung an Claude Code.

### 6.2 Prompt-Vorgehen

Grundlegendes Vorgehen: Zu Beginn wurde eine detaillierte Anforderungsspezifikation erstellt (Routen, Komponenten-Props, Datenmodell, Farbpalette, Commit-Strategie), die Claude Code als Grundlage für einen vollständigen Implementierungsplan nutzte. Anschliessend wurde die Implementierung schrittweise angestossen — ein Feature-Block pro Iteration — mit regelmässigen manuellen Tests und gezielten Korrekturen bei auftretenden Fehlern.

Beispiele für Prompts:
- Initiale Spezifikation: vollständige App-Beschreibung mit Farbpalette, Routen, Komponenten-Props, Mongoose-Schemas, Commit-Strategie
- Bugfix-Kommunikation: Fehlermeldung direkt aus der App kopieren («Shot konnte nicht gespeichert werden. Bitte erneut versuchen.»)
- UX-Anpassung: «Schriftfarbe ein wenig heller bitte, es ist sonst zu dunkel»
- Deployment: Netlify-Fehlermeldungen aus dem Build-Log weitergegeben zur Diagnose

### 6.3 Reflexion

**Nutzen:** Claude Code ermöglichte eine erheblich schnellere Entwicklung als ohne KI-Unterstützung. Komplexe Patterns (Svelte 5 Runes, SvelteKit Form Actions, MongoDB-Aggregation) wurden korrekt und konsistent umgesetzt, ohne dass tiefes Vorwissen in jedem Bereich notwendig war.

**Grenzen:** Deployment-spezifische Probleme (Netlify-Konfiguration, esbuild-Bundling, CDN-Caching) waren schwieriger zu debuggen, da Claude Code keinen Zugriff auf die Live-Umgebung hat. Fehlermeldungen mussten manuell aus dem Netlify-Dashboard kopiert und als Kontext übergeben werden.

**Risiken & Qualitätssicherung:** KI-generierter Code wurde durch regelmässiges manuelles Testen aller Workflows auf echten Geräten (Mobile + Desktop) validiert. Gefundene Bugs (z. B. reserviertes Keyword `yield` als Mongoose-Feldname) wurden gezielt kommuniziert und behoben. Gesamtarchitektur und alle inhaltlichen Entscheidungen lagen in eigener Verantwortung.

## 7. Anhang

- **Technologie-Dokumentation:**
  - [SvelteKit Docs](https://svelte.dev/docs/kit)
  - [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)
  - [Mongoose Docs](https://mongoosejs.com/docs/)
  - [@sveltejs/adapter-netlify](https://svelte.dev/docs/kit/adapter-netlify)
  - [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Farbpalette:** Kaffee-inspiriertes Dark-Theme — Hintergrund `#0f0c0a`, Crema `#E8C99A`, Coffee `#8B5A2B`, Text `#F5EEE6`
- **Schriften:** Cormorant Garamond + DM Sans (beide Google Fonts)

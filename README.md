# Projektdokumentation — Beanery

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
  1. **Shot Logger** — Formularbasierte Eingabe aller Extraktionsvariablen mit Live-Visualisierung des Brühverhältnisses (SVG Gauge) und Geschmacksprofil-Radar. Speichert Daten persistent via localStorage.
  2. **Extraction Journal** — Chronologische Listenansicht aller gespeicherten Shots, gruppiert nach Datum, mit Filterfunktion und CSV-Export.
  3. **Dashboard** — KPIs (Total Shots, Avg Rating, Best Bean, Active Bags), interaktives Balkendiagramm der Extraktionshistorie, Sensory-Flavour-Card und Rituals-Liste.
  4. **Bean Library** — Card-Grid mit Bohnen-Sammlung, Sweet-Spot-Parametern, Favourite-Toggle und Live-Suche.
  5. **Landing Page** — Editoriale Home Page mit Bento-Grid Feature-Übersicht und Newsletter-Signup.

- **Annahmen:** Alle Daten werden client-seitig im Browser (localStorage) gespeichert. Keine Backend-Anbindung im Prototyp.
- **Abgrenzung:** Keine User-Authentifizierung, kein Cloud-Sync, kein Rösterei-Portal im aktuellen Scope.

---

## 3. Vorgehen & Artefakte

### 3.1 Understand & Define

- **Zielgruppenverständnis:** Prosumer-Barista mit Siebträgermaschine, Waage und Mühle. Wertschätzt Präzision, Ästhetik und wissenschaftlichen Ansatz. Frustriert von unstrukturierten Notizen.
- **Wesentliche Erkenntnisse:**
  - Die wichtigsten Variablen: Dose (g), Yield (g), Zeit (s), Temperatur (°C), Mahlgrad
  - Das Brühverhältnis (Dose:Yield) ist die zentrale Qualitätskennzahl
  - Sensorische Notizen (Geschmacksprofil) sind schwer zu standardisieren
  - Ästhetik und Hochwertigkeitsgefühl sind für die Zielgruppe entscheidend

### 3.2 Sketch

- **Variantenüberblick:** Drei Konzeptrichtungen: (A) wissenschaftlich/nüchtern, (B) editorial/minimalistisch, (C) community-orientiert. Variante B traf die Zielgruppe am besten.
- **Skizzen:** Wireframes für alle fünf Screens (Home, Shot Logger, History, Dashboard, Library) in Stitch.
- **Unterschiede:** Variante A war zu funktional ohne emotionalen Appeal; Variante C zu komplex für den Prototyp-Scope.

### 3.3 Decide

- **Gewählte Variante & Begründung:** Variante B — «Editorial Minimalism mit Tactile Accents». Entscheidungskriterien: Markenfit (Premium-Gefühl), Usability (klare Hierarchie), technische Machbarkeit.
- **End-to-End-Ablauf:**
  1. Nutzer landet auf Home Page → motiviert durch cineastische Fotografie und klare Value Proposition
  2. Navigiert via «Enter the Laboratory» zum Dashboard
  3. Loggt neuen Shot via Shot Logger (Sidebar oder CTA-Button)
  4. Überprüft History im Extraction Journal
  5. Verwaltet Bohnen in der Bean Library
- **Mockup:** In Stitch erstellt. Alle fünf Screens als vollständige interaktive HTML-Prototypen mit Tailwind-Config und Brand-Assets definiert (siehe `/stitch_artisan_coffee_tracker_ui/`).

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)

- **Informationsarchitektur:**
  - `/` — Landing / Home Page (eigenständiges Layout, keine Sidebar)
  - `/(app)/dashboard` — Precision Analysis Dashboard
  - `/(app)/shot-logger` — Shot Logger mit Live-Analyse
  - `/(app)/history` — Extraction Journal
  - `/(app)/library` — Bean Library

- **User Interface Design:**
  - **Top App Bar:** Sticky, `backdrop-blur-md bg-surface/90`, 80px Höhe, Logo «BEANERY» in Crema-Gold (#C5A059), Navigation, Pill-Suche, Icons
  - **Sidebar (App-Seiten):** Fixed, 256px breit, Workspace-Badge, Nav-Items mit Active-State (dunkler Hintergrund + linker Goldbalken), «Start New Brew» CTA in Crema-Gold
  - **Home Hero:** Two-Column, Headline-XL mit Kursiv-Akzent, runder Bild-Container (aspect-square rounded-full), schwebende Stat-Card
  - **Bento Grid:** 12-Spalten CSS Grid (Shot Logger 8, Bean Library 4, Sweet Spot 4, Extraction Intelligence 8 mit Orbit-Animation)
  - **Shot Logger:** 7-Spalten Formular + 5-Spalten Analyse (Live SVG Gauge + Radar Chart)
  - **History:** Gruppierte Liste mit Crema-Gold Datumsköpfen, Grayscale-Thumbnails (hover → color)
  - **Dashboard:** Stats-Bento-Row, interaktives Balkendiagramm, dunkle Sensory-Card, Recent-Rituals-Liste
  - **Bean Library:** 3-Spalten Card Grid mit Grayscale→Farbe Hover, Sweet Spot Settings

- **Designentscheidungen:**
  - Crema Gold (#C5A059) als einzige Akzentfarbe — sparsam für maximale Wirkung
  - «Libre Caslon Text» Serif für Headlines (Editorial), «Hanken Grotesk» Sans für Body (Technisch)
  - Hover-Transitions: `-translate-y-1` Lift + `shadow-md`, 300–500ms Dauer
  - Grayscale-Bilder by default → hover: volle Farbe (700ms) — unterstreicht das Laborgefühl

#### 3.4.2. Umsetzung (Technik)

- **Technologie-Stack:**
  - Framework: SvelteKit 2.x mit Svelte 5 (Runes API: `$state`, `$derived`, `$props`)
  - Styling: Tailwind CSS 4.x mit `@theme`-basierter Konfiguration und `@layer utilities`
  - Fonts: Google Fonts CDN (Libre Caslon Text, Hanken Grotesk, JetBrains Mono)
  - Icons: Material Symbols Outlined via Google Fonts CDN
  - State: Svelte Writable Stores mit localStorage-Persistenz

- **Tooling:** VS Code, Claude Code (AI-Assistent), Stitch (UI-Design), Vite 8, npm

- **Struktur & Komponenten:**
  ```
  src/
    app.html                        — Dokument-Grundgerüst, Google Fonts CDN
    routes/
      layout.css                    — Tailwind v4 @theme + @layer utilities + globale Stile
      +layout.svelte                — Root Layout (importiert CSS)
      +page.svelte                  — Home Landing Page
      (app)/
        +layout.svelte              — App-Layout (Header + Sidebar + Mobile Bottom Nav)
        dashboard/+page.svelte      — Precision Analysis Dashboard
        shot-logger/+page.svelte    — Shot Logger mit SVG-Gauge + Radar
        history/+page.svelte        — Extraction Journal (gruppierte Liste)
        library/+page.svelte        — Bean Library (Card-Grid, Live-Suche)
    lib/
      stores/shots.ts               — Shot-Datenspeicher (Writable + localStorage)
      actions/reveal.ts             — Scroll-Reveal IntersectionObserver Action
  ```

- **Daten & Schnittstellen:**
  - Shot-Daten werden im Browser-`localStorage` unter Key `beanery-shots` als JSON gespeichert
  - Svelte Writable Store wird beim Start mit persistierten oder Default-Daten initialisiert
  - `shots.add()`, `shots.remove()`, `shots.reset()` als Store-Methoden
  - Keine externe API im aktuellen Scope

- **Deployment:** `npm run dev` (Port 5173), `npm run build` + `npm run preview` für Production-Build. Deploybar auf Vercel/Netlify via `@sveltejs/adapter-auto`.

- **Besondere Entscheidungen:**
  - Tailwind CSS v4 nutzt CSS-natives `@theme` statt `tailwind.config.js` — Farb-Opacity-Modifier (`bg-crema-gold/30`) funktionieren via CSS `color-mix()`
  - Svelte 5 Runes API ist zukunftssicherer als legacy reaktive Statements
  - Route Group `(app)` für gemeinsames Layout ohne URL-Auswirkung
  - Scroll-Reveal als Svelte Action — zero dependencies, wiederverwendbar mit Delay-Parameter
  - Grain-Textur via SVG Data URI — kein zusätzliches Asset-Loading nötig

### 3.5 Validate

- **URL der getesteten Version:** `http://localhost:5173` (lokaler Dev-Server)
- **Ziele der Prüfung:**
  - Ist der Shot Logger intuitiv bedienbar ohne Erklärung?
  - Findet der Nutzer die Navigation zwischen den Seiten?
  - Entspricht das Design dem erwarteten Premium-Gefühl?
- **Vorgehen:** Moderierte Usability-Tests, remote via Screen-Sharing
- **Stichprobe:** 3 Personen, Alter 25–35, alle Besitzer einer Siebträgermaschine, kein Vorwissen zur App
- **Aufgaben/Szenarien:**
  1. «Logge einen Espresso-Shot: 18g Dose, 36g Yield, 28 Sekunden, 93°C»
  2. «Finde den besten Shot in deiner Shot-History»
  3. «Suche in der Bean Library nach einer kolumbianischen Bohne»
- **Kennzahlen & Beobachtungen:**
  - Aufgabe 1: 3/3 erfolgreich, Ø 42s, alle notierten das Live-Gauge als «hilfreich»
  - Aufgabe 2: 3/3 erfolgreich, Ø 10s (Trophy-Icon wurde sofort erkannt)
  - Aufgabe 3: 3/3 erfolgreich, Ø 8s (Suchfeld gut auffindbar)
  - Qualitatives Feedback: «Sieht aus wie eine echte App», «Das Goldene ist sehr elegant», «Die Animationen machen es lebendig»
- **Zusammenfassung:** Alle Core-Flows funktionieren reibungslos. Das Premium-Design trifft die Zielgruppe exakt. Der Shot Logger überzeugt besonders durch das Live-Feedback-Panel.
- **Abgeleitete Verbesserungen:**
  1. (Hoch) FAB auf Mobile für «Add Bean» in der Library sichtbarer machen
  2. (Mittel) Onboarding-Tooltip beim ersten Besuch des Shot Loggers
  3. (Niedrig) Export-CSV-Funktion vollständig implementieren

---

## 4. Erweiterungen

### 4.1 Live Brew Ratio Visualizer

- **Beschreibung & Nutzen:** Der Shot Logger zeigt live das Brühverhältnis (Dose:Yield) als SVG-Kreisdiagramm. Ändert der Nutzer Dose oder Yield, aktualisiert sich der Arc sofort via `$derived`. Eliminiert manuelle Berechnung — der Barista sieht sofort, ob er sich im Ristretto-, Normale- oder Lungo-Bereich bewegt.
- **Wo umgesetzt:** `src/routes/(app)/shot-logger/+page.svelte` — SVG `<circle>` mit `stroke-dashoffset` via Svelte `$derived()`
- **Referenz:** Shot Logger Page, rechtes Analyse-Panel, «Live Brew Ratio»-Karte
- **Aus Evaluation abgeleitet?:** Nein — von Beginn an geplantes Kernfeature

### 4.2 Scroll Reveal Svelte Action

- **Beschreibung & Nutzen:** `use:reveal={delay}` ist eine wiederverwendbare Svelte Action, die Elemente beim Einrollen in den Viewport animiert (Opacity 0→1, translateY 20px→0, 850ms ease-out). Mit optionalem Delay-Parameter für gestaffelte Card-Animationen. Verbessert die wahrgenommene Qualität massiv.
- **Wo umgesetzt:** `src/lib/actions/reveal.ts` + CSS-Klassen `.reveal-el`/`.visible` in `layout.css`
- **Referenz:** Home Page (Hero + alle Bento-Cards), Dashboard, Shot Logger Header
- **Aus Evaluation abgeleitet?:** Nein — bewusste Designentscheidung für Premium-Feel

### 4.3 Grain Texture Overlay

- **Beschreibung & Nutzen:** Ein SVG-Data-URI mit `feTurbulence + fractalNoise` erzeugt eine subtile Grain-Textur auf 2.2% Opacity. Gibt der App eine physische, taktile Qualität — ähnlich wie Papier oder Filmphotografie — ohne echte Bild-Assets zu laden.
- **Wo umgesetzt:** CSS-Klasse `.grain-texture` in `layout.css`, Platzierung als `<div>` in App-Layout und inneren Pages
- **Referenz:** Dashboard und History Page (bei hellen Flächen sichtbar)
- **Aus Evaluation abgeleitet?:** Nein — vom Stitch-Design-System inspiriert («Tactile Accents»)

---

## 5. Projektorganisation

- **Repository & Struktur:** Lokales Verzeichnis `/beanery-app`, SvelteKit-Standardstruktur mit Route Groups `(app)` für gemeinsames App-Layout
- **Issue-Management:** Taskliste via Claude Code während der Implementierungsphase geführt
- **Commit-Praxis:** Semantische Commits — `feat:`, `style:`, `fix:`, `docs:`

---

## 6. KI-Deklaration

### 6.1 KI-Tools

- **Eingesetzte Tools:**
  - **Stitch** (Google AI Design Tool) — für Screen-Design, Prototypen und Design System
  - **Claude Code** (Anthropic, Modell: claude-sonnet-4-6) — für die vollständige technische Implementierung

- **Zweck & Umfang:** Stitch wurde für alle fünf UI-Screens und das vollständige Design System verwendet (Farb-Tokens, Typografie-Skala, Komponenten-Regeln, DESIGN.md). Claude Code übernahm die gesamte SvelteKit-Implementierung — Projektstruktur, alle `.svelte`-Dateien, CSS-Konfiguration, TypeScript-Stores und Svelte Actions.

- **Eigene Leistung (Abgrenzung):** Konzeptentwicklung und Produktvision (Welches Problem lösen wir?), Design-Direction (welcher Stil und warum?), Auswahl und Steuerung aller KI-Tools via Prompts, Usability-Tests Durchführung und Interpretation, finales Review jeder generierten Datei, Qualitätssicherung via Build-Check.

### 6.2 Prompt-Vorgehen

Die Zusammenarbeit mit Claude Code erfolgte in einer strukturierten Session. Zu Beginn wurden alle Stitch-Design-Files eingelesen (HTML-Prototypen, DESIGN.md, Screenshots). Der Haupt-Implementierungs-Prompt beschrieb das vollständige Design System mit exakten Hex-Werten, Typografie-Scale, Komponenten-Regeln und alle 5 Pages mit detaillierten Anforderungen.

Wichtige Prompt-Strategien:
- Exakte Design-Tokens vorgeben (nie «goldfarben», sondern `#C5A059`)
- Interaktionsdetails präzise beschreiben (Hover-Transitions mit ms-Angaben)
- Framework-Besonderheiten explizit ansprechen (Tailwind v4 `@theme`, Svelte 5 Runes)
- Technische Architektur vorgeben (Route Groups, Store-Struktur, Action-Pattern)

Prompts wurden schrittweise verfeinert, wenn das erste Resultat nicht stimmte (z.B. Tailwind v4 Scaffold-Probleme).

### 6.3 Reflexion

**Nutzen:** Claude Code ermöglichte eine drastische Produktivitätssteigerung in der Implementierungsphase. Alle 5 Pages mit vollständiger Interaktivität entstanden in einer Session — manuell wären es mehrere Tage Arbeit gewesen.

**Grenzen:** Tailwind CSS v4 ist neu und die KI hatte initial Schwierigkeiten mit dem veränderten Config-Format (`@theme` statt `tailwind.config.js`). Iteratives Prompting war nötig. Auch komplexe Svelte 5 Runes-Patterns erforderten Korrekturen.

**Risiken & Qualitätssicherung:** Jede generierte Datei wurde manuell geprüft. Der `npm run build`-Prozess diente als automatischer Korrektheitsbeweis. Bilder und externe Dienste wurden auf Verfügbarkeit geprüft.

---

## 7. Anhang

- **Stitch Design Files:** `/stitch_artisan_coffee_tracker_ui/` — 5 interaktive HTML-Screens, DESIGN.md
- **Screenshots:** Jeder Screen-Ordner enthält `screen.png` des Stitch-Designs

**Quellen & Lizenzen:**
- Google Fonts (Libre Caslon Text, Hanken Grotesk, JetBrains Mono) — SIL Open Font License
- Material Symbols — Apache 2.0 License
- Unsplash (Bildmaterial für Prototyp) — Unsplash License (kostenlose Nutzung für Demos)
- SvelteKit — MIT License
- Tailwind CSS — MIT License
- @tailwindcss/forms — MIT License

**Entwicklungsstart:**

```bash
cd beanery-app
npm install
npm run dev
```

App läuft auf `http://localhost:5173`

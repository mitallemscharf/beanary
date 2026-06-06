# Projektdokumentation — Beanery

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
        1. [Wettbewerbsanalyse](#311-wettbewerbsanalyse)
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

#### 3.1.1 Wettbewerbsanalyse

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

#### 3.1.2 User Stories

Die folgenden User Stories wurden nach dem INVEST-Prinzip (Independent, Negotiable, Valuable, Estimable, Small, Testable) formuliert.

---

**US-01: Shot erfassen**
Als Home-Barista möchte ich einen Espresso-Shot mit allen Parametern erfassen, damit ich meinen Sweet Spot reproduzieren kann.

Akzeptanzkriterien:
- [ ] Bohne aus Library auswählbar
- [ ] Dose, Yield, Zeit, Temperatur, Mahlgrad erfassbar
- [ ] Brew Ratio wird live berechnet
- [ ] Shot wird in MongoDB gespeichert
- [ ] Shot erscheint sofort in History

---

**US-02: Bohne verwalten**
Als Home-Barista möchte ich meine Kaffeebohnen erfassen und verwalten, damit ich den Überblick über meine Sammlung behalte.

Akzeptanzkriterien:
- [ ] Bohne mit Name, Röster, Herkunft, Röstdatum erfassbar
- [ ] Freshness wird automatisch berechnet
- [ ] Bohne in Shot Logger verfügbar nach Erstellung
- [ ] Bohne editierbar und löschbar

---

**US-03: Fortschritt verfolgen**
Als Home-Barista möchte ich meine Shot-Statistiken auf dem Dashboard sehen, damit ich meinen Fortschritt über Zeit verfolgen kann.

Akzeptanzkriterien:
- [ ] Total Shots angezeigt
- [ ] Durchschnittsbewertung berechnet
- [ ] Rating History Chart sichtbar
- [ ] Beste Bohne identifiziert

---

**US-04: Anfänger-Unterstützung**
Als Kaffee-Einsteiger möchte ich beim Dialing-In Unterstützung erhalten, damit ich die Fachbegriffe verstehe und mich nicht überfordert fühle.

Akzeptanzkriterien:
- [ ] Skill Level wählbar bei Registration
- [ ] Beginner sieht vereinfachten Shot Logger
- [ ] Tooltips erklären Fachbegriffe
- [ ] Brewing Guides verfügbar
- [ ] Glossar mit 27 Begriffen durchsuchbar

---

**US-05: Account & Datensicherheit**
Als Nutzer möchte ich einen eigenen Account haben, damit nur ich meine Daten sehe und verwalten kann.

Akzeptanzkriterien:
- [ ] Registrierung mit Email + Passwort möglich
- [ ] Login/Logout funktioniert
- [ ] Jeder User sieht nur eigene Beans und Shots
- [ ] Passwort ist gehasht (bcrypt)
- [ ] Admin sieht alle Daten

---

### 3.2 Sketch

**Methode: Crazy 8s**

Im Rahmen der Sketch-Phase wurde die Crazy-8s-Methode angewendet, um 8 verschiedene Varianten des zentralen Features «Shot Logger» in kurzer Zeit zu skizzieren.

**Variantenüberblick:**

| Nr. | Variante | Beschreibung |
|-----|----------|--------------|
| 1 | Einfaches Formular | Alle Felder untereinander, klassische Eingabe |
| 2 | Slider-basiert | Parameter per Schieberegler einstellen |
| 3 | Schnell-Eingabe | Nur 3 Pflichtfelder, Rest ausklappbar |
| 4 | Timer-First | Timer starten, dann Parameter eingeben |
| 5 | Bohne zuerst (Auto-Fill) | Bohne wählen, Formular füllt sich mit letzten Werten |
| 6 | Karten-Ansicht (Swipe) | Jeder Parameter auf eigener Karte |
| 7 | Bewertung zuerst | Shot bewerten, dann Details optional |
| 8 | Vergleichs-Modus | Letzter Shot angezeigt, nur Änderungen eingeben |

**Skizzen:** [crazy8s.pdf](crazy8s.pdf)

**Peer Dot-Voting:** In der Kleinklasse TZBISa vom 20. Mai 2026 wurden die Varianten mit Mitstudierenden besprochen. Favoriten: Variante 4 (Timer-First) und Variante 5 (Bohne zuerst/Auto-Fill).

**Wesentliche Unterschiede zwischen den Varianten:**
- Variante 1-3: Fokus auf schnelle Dateneingabe
- Variante 4-5: Fokus auf natürlichen Workflow (erst brauen, dann dokumentieren)
- Variante 6-7: Fokus auf minimale Eingabe
- Variante 8: Fokus auf iterative Verbesserung

### 3.3 Decide

- **Gewählte Variante & Begründung:** Variante B — «Editorial Minimalism mit Tactile Accents». Entscheidungskriterien: Markenfit (Premium-Gefühl), Usability (klare Hierarchie), technische Machbarkeit.
- **Mockup:** https://www.figma.com/design/tw5wstCGf1QVRyN42YP6GH/Beanary-App
- **End-to-End-Ablauf:**
  1. Nutzer landet auf Home Page → motiviert durch cineastische Fotografie und klare Value Proposition
  2. Login/Register → persönliches Laboratory
  3. Loggt neuen Shot via Shot Logger (Sidebar oder CTA-Button)
  4. Überprüft History im Extraction Journal
  5. Verwaltet Bohnen in der Bean Library

#### 3.3.1 User Flow Diagramm

Der folgende Flowchart zeigt den vollständigen Ablauf des Shot Loggers — vom Öffnen der Seite bis zur Weiterleitung zur Shot History.

```mermaid
flowchart TD
    A[User öffnet Shot Logger] --> B{Bohnen vorhanden?}
    B -- Nein --> C[Zur Bean Library]
    C --> D[Neue Bohne erfassen]
    D --> A
    B -- Ja --> E[Bohne auswählen]
    E --> F[Parameter eingeben\nDose, Yield, Zeit, Temp]
    F --> G[Extraction Timer starten]
    G --> H[Shot ziehen]
    H --> I[Timer stoppen\nZeit wird automatisch eingetragen]
    I --> J[Bewertung 1-5 Sterne]
    J --> K[Flavor Tags auswählen]
    K --> L[Notizen eingeben optional]
    L --> M[Shot speichern]
    M --> N{Validierung OK?}
    N -- Nein --> O[Fehlermeldung anzeigen]
    O --> F
    N -- Ja --> P[Shot in MongoDB speichern]
    P --> Q[XP vergeben]
    Q --> R{Badge verdient?}
    R -- Ja --> S[Badge Toast anzeigen]
    R -- Nein --> T[Erfolgsmeldung anzeigen]
    S --> T
    T --> U[Weiterleitung zu Shot History]
```

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)

**Informationsarchitektur:**

```
/ (Landing Page — öffentlich)
├── /login
├── /register
├── /guides          (öffentlich)
├── /glossar         (öffentlich)
└── /(app)           (geschützt — Login erforderlich)
    ├── /dashboard
    ├── /shot-logger
    ├── /history
    ├── /library
    ├── /profile
    ├── /leaderboard
    ├── /settings
    └── /admin       (nur Admin)
```

Navigation: Desktop — fixe Sidebar mit Logo, Hauptnavigation, Nutzer-Bereich. Mobile — ausgeblendete Sidebar, Bottom Navigation Bar mit 5 Tabs.

**Designentscheidungen:**
- **Farbpalette:** Warm Paper-White (#FBF9F4) als Background, Crema Gold (#C5A059) als Akzent, Dunkelbraun (#1B1C19) für Text
- **Typografie:** Libre Caslon Text (Serif) für Headlines, Hanken Grotesk (Sans-Serif) für Body
- **Theme:** Light Theme mit Dark Mode Toggle — wirkt professioneller für eine Schulabgabe
- **Bildsprache:** Schwarzweiss-Fotos von Kaffeebohnen und Espresso — konsistent und premium

---

**Screenshots — Alle Hauptseiten**

![Startseite](screenshots/01-landing.png)
*Landing Page — Hero-Sektion «The Art of Extraction» mit CTA-Button und Feature-Übersicht*

![Login](screenshots/02-login.png)
*Login-Seite — Anmeldung mit E-Mail und Passwort*

![Registrierung](screenshots/03-register-1.png)
*Registrierung Schritt 1 — Account-Daten erfassen*

![Skill Level](screenshots/04-register-2.png)
*Registrierung Schritt 2 — Skill Level Auswahl (Beginner / Home Barista / Expert)*

![Dashboard](screenshots/05-dashboard.png)
*Dashboard «Morning Ritual» — Metrikkarten, Rating History Chart und Recent Rituals*

![Bohnen-Bibliothek](screenshots/06-bean-library.png)
*Bean Library — Karten-Layout mit automatischen FRESH/PEAK/PAST PEAK Freshness-Badges*

![Bohne hinzufügen](screenshots/07-bean-add.png)
*Neue Bohne erfassen — Slide-in Formular mit allen Bohnen-Parametern*

![Bohnen-Detail](screenshots/08-bean-detail.png)
*Bohnen-Detailansicht — Sweet Spot Empfehlung basierend auf den besten Shots*

![Shot-Logger](screenshots/09-shot-logger.png)
*Shot Logger — Parameter erfassen mit Live Brew-Ratio Berechnung (RISTRETTO/NORMALE/LUNGO)*

![Extraction Timer](screenshots/10-shot-timer.png)
*Shot Logger — Live Extraction Timer während des Kaffeebezugs*

![Shot History](screenshots/11-shot-history.png)
*Shot History — Chronologische Liste mit Filter, Export CSV und Export PDF*

![Shot Detail](screenshots/12-shot-expanded.png)
*Shot History Detail — Ausgeklappte Ansicht mit allen gespeicherten Parametern*

![Profil](screenshots/13-profile.png)
*Profil-Seite — XP-Fortschrittsbalken, Level-Anzeige und verdiente Achievement-Badges*

![Leaderboard](screenshots/14-leaderboard.png)
*Leaderboard — Rangliste der aktivsten Nutzer nach XP*

![Brewing Guides](screenshots/15-guides.png)
*Brewing Guides — Schritt-für-Schritt Anleitungen für 6 verschiedene Brew-Methoden*

![Glossar](screenshots/16-glossar.png)
*Glossar — 27 durchsuchbare Kaffee-Fachbegriffe mit Definitionen und Tipps*

![Einstellungen](screenshots/17-settings.png)
*Einstellungen — Profil, Passwort ändern, Maschinen-Typ und Extraktions-Defaults*

![Admin-Panel](screenshots/18-admin.png)
*Admin Panel — Vollständige Benutzerübersicht mit Total Users, Beans und Shots*

![Mobile](screenshots/19-mobile.png)
*Mobile Ansicht — Vollständig responsives Design des Shot Loggers auf Smartphone-Viewport (390px)*

---

#### 3.4.2. Umsetzung (Technik)

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
- **User:** name, email, password (bcrypt-hashed), role (admin/user), skillLevel, machineType, goals, xp, level, badges, notifications, defaultDose/Yield/Temp/Grind, createdAt
- **Bean:** name, roastery, origin, roastLevel (Light/Medium/Medium-Dark/Dark), roastDate, tags, dose, yield, time, status, userId, createdAt
- **Shot:** beanId (ref Bean), bean, dose, grindSize, time, yield, brewRatio, temp, rating, flavorTags, notes, process, roast, userId, createdAt

**Deployment:** https://beanery-lenny.netlify.app

**Struktur & Komponenten:**

```
src/
├── routes/
│   ├── +page.svelte              # Landing Page
│   ├── login/                    # Auth-Seiten
│   ├── register/
│   ├── guides/ & glossar/        # Öffentliche Inhalte
│   ├── (app)/                    # Geschützte App-Seiten
│   │   ├── +layout.svelte        # Sidebar + Bottom Nav
│   │   ├── dashboard/
│   │   ├── shot-logger/
│   │   ├── history/
│   │   ├── library/
│   │   ├── profile/
│   │   ├── leaderboard/
│   │   ├── settings/
│   │   └── admin/
│   └── api/                      # Serverless API Routes
│       ├── auth/                 # Login / Register / Logout
│       ├── beans/                # CRUD Bohnen
│       ├── shots/                # CRUD Shots
│       ├── users/                # Profil / Passwort
│       ├── leaderboard/
│       └── admin/                # Admin Stats
├── lib/
│   ├── server/
│   │   ├── auth.ts               # JWT sign/verify
│   │   ├── db.ts                 # MongoDB connect
│   │   ├── gamification.ts       # XP + Badges
│   │   └── models/               # User, Bean, Shot (Mongoose)
│   ├── stores/                   # Svelte Runes Stores
│   └── actions/                  # reveal.ts (scroll animation)
└── hooks.server.ts               # Auth Guard + Routing
```

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

Folgende Erweiterungen wurden über den Mindestumfang hinaus implementiert und sind nachfolgend nach dem vorgegebenen Schema dokumentiert.

### 4.1 User Authentication mit Rollen (Admin/User)

- **Beschreibung & Nutzen:** Vollständiges Auth-System mit JWT (HttpOnly Cookie), bcrypt-Passwort-Hashing, Login/Register/Logout. Jeder User sieht ausschliesslich eigene Beans und Shots. Admin sieht alle Daten aller Nutzer. Schützt alle App-Routen über einen Server-seitigen Auth-Guard.
- **Wo umgesetzt:** Frontend: `/login`, `/register`. Backend: `/api/auth/*` (login, register, logout, seed). Datenbank: User-Model mit gehashtem Passwort, `userId` als Fremdschlüssel auf Bean und Shot. Middleware: `hooks.server.ts` (Auth-Guard, Redirect-Logik).
- **Referenz:** Screenshots 02-login.png, 03-register-1.png; Kap. 3.4.2
- **Aus Evaluation abgeleitet?:** Ja — «Kein Login/Register» und «Kein Logout» waren die Issues mit Schweregrad 3 aus der Evaluation beider Testpersonen.

### 4.2 Admin Panel

- **Beschreibung & Nutzen:** Exklusiver, rollengeschützter Bereich `/admin`. Zeigt Systemstatistiken (Total Users, Beans, Shots), vollständige Nutzertabelle mit Aktivitätsdaten (Bean-Anzahl, Shot-Anzahl, Registrierungsdatum) sowie Recent Activity Feed. Admin kann Nutzer und deren Daten löschen.
- **Wo umgesetzt:** Frontend: `/admin/+page.svelte`. Backend: `/api/admin/stats` (GET aggregierte Statistiken, DELETE Reset-Endpoint). Route-Schutz: `hooks.server.ts` prüft `user.role === 'admin'`.
- **Referenz:** Screenshot 18-admin.png
- **Aus Evaluation abgeleitet?:** Indirekt — Evaluation ergab Bedarf an Benutzerverwaltung; Admin Panel ermöglicht Datenpflege und Systemüberwachung.

### 4.3 Live Extraction Timer

- **Beschreibung & Nutzen:** START/STOP/RESET-Timer direkt im Shot Logger. Zeit wird beim Stoppen automatisch in das Zeitfeld eingetragen. MM:SS-Anzeige mit Pulse-Animation während aktiver Extraktion. Ermöglicht präzises Timing ohne externe Stoppuhr.
- **Wo umgesetzt:** Frontend: Timer-Card-Komponente im Shot Logger (`/shot-logger/+page.svelte`), `setInterval` mit `onDestroy`-Cleanup für Memory-Leak-Vermeidung.
- **Referenz:** Screenshot 10-shot-timer.png
- **Aus Evaluation abgeleitet?:** Nein — aus natürlichem Barista-Workflow abgeleitet (erst brauen, dann dokumentieren).

### 4.4 Interaktives Flavor Wheel

- **Beschreibung & Nutzen:** SVG-Rad mit 8 Hauptkategorien (Fruity, Floral, Sweet, Nutty, Chocolatey, Roasted, Spicy, Sour). Klick auf ein Segment öffnet Sub-Flavors als auswählbare Pills. Gewählte Geschmacksnoten werden als `flavorTags` automatisch dem Shot zugeordnet und im Shot-Detail angezeigt.
- **Wo umgesetzt:** Frontend: SVG-Komponente mit polaren Koordinaten im Shot Logger. Zustand: `flavorTags`-Array im Shot-Formular, gespeichert via `/api/shots` POST.
- **Referenz:** Screenshot 09-shot-logger.png
- **Aus Evaluation abgeleitet?:** Nein — ergänzt die sensorische Dokumentation und standardisiert Geschmacksbeschreibungen.

### 4.5 Automatische Freshness-Berechnung

- **Beschreibung & Nutzen:** Freshness-Status (TOO FRESH / FRESH / PEAK / PAST PEAK / OLD) wird automatisch aus dem Röstdatum der Bohne berechnet und als farbiges Badge auf jeder Bean-Card angezeigt. Logik: 0–7d: TOO FRESH, 8–21d: FRESH, 22–35d: PEAK, 36–60d: PAST PEAK, >60d: OLD.
- **Wo umgesetzt:** Frontend: Bean-Cards in `/library` und Bean-Detail-Drawer. Berechnung in `getFreshness()` im Beans-Store (`src/lib/stores/beans.ts`). Keine Backend-Logik nötig.
- **Referenz:** Screenshot 06-bean-library.png, Screenshot 08-bean-detail.png
- **Aus Evaluation abgeleitet?:** Nein — löst ein konkretes Problem der Zielgruppe: Bohnen verlieren nach dem Rösten über Zeit an Qualität.

### 4.6 Brew Ratio Recommendation Engine

- **Beschreibung & Nutzen:** Nach mindestens 3 gespeicherten Shots pro Bohne aggregiert die App die Top-3-Shots (nach Rating) und zeigt eine Empfehlung für optimale Dose, Yield, Zeit und Temperatur im Bean-Detail-Drawer an. Hilft beim schnellen Dialing-In auf eine neue Bohne.
- **Wo umgesetzt:** Frontend: Recommendation-Card im Bean-Drawer (`/library`). Aggregations-Logik in `getRecommendation()` im Beans-Store, sortiert nach Rating.
- **Referenz:** Screenshot 08-bean-detail.png
- **Aus Evaluation abgeleitet?:** Nein — Data-Driven Insight aus gespeicherten Shot-Daten; adressiert das Kernziel «Dialing-In».

### 4.7 Dark Mode Toggle

- **Beschreibung & Nutzen:** Light/Dark Mode jederzeit umschaltbar via Toggle in der Sidebar und unter Settings → Appearance. Präferenz wird in `localStorage` gespeichert und beim nächsten Besuch wiederhergestellt. Dark Mode wechselt auf eine warme Dunkelbraun-Palette mit reduzierten Kontrasten.
- **Wo umgesetzt:** Frontend: Toggle-Button im App-Layout und Settings-Seite. Store: `src/lib/stores/theme.ts` mit `$effect` für `html.dark`-Klasse. CSS: `@theme` Custom Properties mit Dark-Mode-Overrides in `app.css`.
- **Referenz:** Screenshot 17-settings.png
- **Aus Evaluation abgeleitet?:** Nein — Usability-Best-Practice für Prosumer-Apps die auch abends genutzt werden.

### 4.8 Mobile Responsive Design

- **Beschreibung & Nutzen:** Vollständige Mobile-Optimierung ab 375px Viewport-Breite. Die Desktop-Sidebar wird auf Mobile durch eine fixe Bottom Navigation Bar mit 5 Tabs ersetzt. Alle Touch-Targets sind mindestens 48×48px. Formulare, Karten und Diagramme passen sich dem schmalen Viewport an.
- **Wo umgesetzt:** Frontend: Tailwind Responsive Prefixes (`md:`, `sm:`), Bottom Navigation Komponente im App-Layout (`/(app)/+layout.svelte`), `safe-area-inset` für iPhone Notch/Home Indicator.
- **Referenz:** Screenshot 19-mobile.png
- **Aus Evaluation abgeleitet?:** Nein — Anforderung für alle Geräte ohne Installation (PWA-Ergänzung).

### 4.9 Export CSV

- **Beschreibung & Nutzen:** Die vollständige Shot History ist als CSV-Datei exportierbar. Enthält alle Felder: Bean, Dose, Yield, Time, Temperature, Rating, Brew Ratio, Flavor Tags, Notes, Date. Ermöglicht externe Analyse z.B. in Excel oder Numbers.
- **Wo umgesetzt:** Frontend: Export-Button in `/history` und Settings → Data. Client-seitige Generierung via `Blob` und temporärem `<a download>`-Link — kein Server-Roundtrip.
- **Referenz:** Screenshot 11-shot-history.png, Screenshot 17-settings.png
- **Aus Evaluation abgeleitet?:** Nein — Power-User-Feature für datengetriebene Baristas.

### 4.10 Export PDF

- **Beschreibung & Nutzen:** Shot History alternativ als formatiertes PDF exportierbar. Das PDF enthält alle Shot-Parameter in tabellarischer Form mit Beanery-Branding. Geeignet für Ausdrucke oder Archivierung.
- **Wo umgesetzt:** Frontend: Export PDF-Button in `/history`. Client-seitige Generierung via dynamisch geladenem `jsPDF` (Lazy Import zur Vermeidung von SSR-Fehlern). Identischer Datensatz wie CSV-Export.
- **Referenz:** Screenshot 11-shot-history.png
- **Aus Evaluation abgeleitet?:** Nein — ergänzt den CSV-Export um ein druckfähiges Format.

### 4.11 Shot Comparison

- **Beschreibung & Nutzen:** In der Shot History können zwei Shots selektiert und direkt verglichen werden. Ein Modal zeigt beide Shots nebeneinander, hebt abweichende Felder in Crema-Gold hervor und zeigt einen «Winner»-Banner für den höher bewerteten Shot. Beschleunigt das Erkennen von Optimierungspotenzialen.
- **Wo umgesetzt:** Frontend: Checkbox-Selektion auf Shot-Cards in `/history`, Vergleichs-Modal als Overlay-Komponente. Diff-Logik in `compareRows()` im `+page.svelte` der History-Seite.
- **Referenz:** Screenshot 12-shot-expanded.png
- **Aus Evaluation abgeleitet?:** Nein — aus dem iterativen Verbesserungsansatz des Dialing-In Prozesses abgeleitet.

### 4.12 Bean QR Code Generator

- **Beschreibung & Nutzen:** Für jede Bohne kann ein QR-Code generiert werden, der die Sweet-Spot-Parameter (Dose, Yield, Zeit, Mahlgrad) als JSON-Payload encodiert. Der QR-Code kann ausgedruckt und direkt auf die Kaffeebehältnis-Dose geklebt werden.
- **Wo umgesetzt:** Frontend: QR-Code-Button im Bean-Detail-Drawer (`/library`). Generierung via `qrcode`-Library (Canvas API). Download als PNG-Datei.
- **Referenz:** Screenshot 08-bean-detail.png
- **Aus Evaluation abgeleitet?:** Nein — Convenience-Feature für Baristas mit mehreren Bohnen im Einsatz.

### 4.13 PWA — Progressive Web App

- **Beschreibung & Nutzen:** Beanery ist als PWA installierbar — auf dem iPhone-Homescreen und Android-Launcher wie eine native App. Ermöglicht Offline-Fähigkeit des Shells, eigenes App-Icon und Splash Screen ohne App-Store-Installation.
- **Wo umgesetzt:** Frontend: `static/manifest.webmanifest` (Name, Icons, Theme Color, Display Mode `standalone`), PWA-Meta-Tags in `app.html` (`apple-mobile-web-app-capable`, `theme-color`). Icons: 180×180 (Apple Touch), 192×192, 512×512 PNG.
- **Referenz:** Screenshot 19-mobile.png; `static/manifest.webmanifest`
- **Aus Evaluation abgeleitet?:** Nein — ergänzt das Mobile Responsive Design; Beanery wird plattformübergreifend wie eine native App nutzbar.

### 4.14 Gamification — XP, Badges, Level-System

- **Beschreibung & Nutzen:** Nutzer sammeln Erfahrungspunkte (XP) für Aktionen: Shot loggen (+10 XP), Shot bewerten (+5 XP), Notizen hinzufügen (+5 XP), Bohne hinzufügen (+10 XP). XP schalten Level frei (Novice → Apprentice → Skilled → Expert → Master). Badges (first_drop, getting_started, speed_runner, early_bird, night_owl) werden für besondere Leistungen vergeben und als Toasts angezeigt.
- **Wo umgesetzt:** Backend: `src/lib/server/gamification.ts` — `awardXP()` und `BADGES`-Logik. JWT wird nach jedem Shot-Log mit aktuellem XP/Level aktualisiert, sodass die Sidebar immer den aktuellen Stand zeigt. Frontend: XP-Fortschrittsbalken und Badge-Grid auf `/profile`, Badge-Toast-Overlay im App-Layout.
- **Referenz:** Screenshot 13-profile.png
- **Aus Evaluation abgeleitet?:** Nein — erhöht Langzeitmotivation und Wiederkehr-Rate der Nutzer.

### 4.15 Leaderboard

- **Beschreibung & Nutzen:** Rangliste aller registrierten Nutzer sortiert nach Gesamt-XP. Zeigt Rang, Name, Level-Badge, XP-Anzahl und Anzahl geloggter Shots. Der eigene Eintrag ist farblich hervorgehoben. Fördert Community-Aspekte und sportlichen Wettkampf.
- **Wo umgesetzt:** Frontend: `/leaderboard/+page.svelte`. Backend: `/api/leaderboard` (GET) — aggregiert alle User nach XP sortiert aus MongoDB.
- **Referenz:** Screenshot 14-leaderboard.png
- **Aus Evaluation abgeleitet?:** Nein — Community-Feature für Klassen- und Gruppenkontext.

### 4.16 Profil-Seite

- **Beschreibung & Nutzen:** Persönliche Profilseite mit Name, Avatar-Initial, Skill Level, XP-Fortschrittsbalken zum nächsten Level, aktuellem Level-Badge und allen verdienten Achievement-Badges. Gibt dem Nutzer einen Überblick über seinen Lernfortschritt.
- **Wo umgesetzt:** Frontend: `/profile/+page.svelte` mit Server-Load-Funktion. Backend: Nutzerdaten aus JWT + `/api/users/profile` für XP/Badges. Keine separate Datenbank-Abfrage nötig — XP ist im JWT-Token gespeichert.
- **Referenz:** Screenshot 13-profile.png
- **Aus Evaluation abgeleitet?:** Nein — natürliche Ergänzung des Gamification-Systems (Kap. 4.14).

### 4.17 Brewing Guides

- **Beschreibung & Nutzen:** Öffentlich zugängliche Schritt-für-Schritt-Anleitungen für 6 Brew-Methoden: Espresso, V60, Chemex, AeroPress, French Press, Moka Pot. Jede Anleitung enthält Parameter-Empfehlungen (Ratio, Temperatur, Zeit) und illustrierte Schritte. Senkt die Einstiegshürde für neue Nutzer.
- **Wo umgesetzt:** Frontend: `/guides/+page.svelte` — statische Inhalte, ohne Backend. Route ist öffentlich (kein Login erforderlich), sodass die Guides auch als Marketing-Inhalt dienen.
- **Referenz:** Screenshot 15-guides.png
- **Aus Evaluation abgeleitet?:** Ja — Testperson Subraj Singh fand Fachbegriffe «unklar»; Guides adressieren diesen Onboarding-Gap direkt.

### 4.18 Glossar (27 Begriffe)

- **Beschreibung & Nutzen:** Durchsuchbares Glossar mit 27 Kaffee-Fachbegriffen und ihren Definitionen (z.B. Dose, Yield, TDS, Extraction, Channeling, Bloom). Live-Suchfilter filtert Begriffe in Echtzeit. Öffentlich zugänglich ohne Login.
- **Wo umgesetzt:** Frontend: `/glossar/+page.svelte` — statische Begriffsdaten mit `$derived`-Filter auf Suchfeld-Input. Route ist öffentlich (kein Auth erforderlich).
- **Referenz:** Screenshot 16-glossar.png
- **Aus Evaluation abgeleitet?:** Ja — beide Testpersonen notierten Fachbegriffe als unklar (Schweregrad 2); Glossar behebt diesen Issue direkt.

### 4.19 4-Step Onboarding Registrierung

- **Beschreibung & Nutzen:** Registrierungsprozess in 4 geführten Schritten: (1) Account-Daten (Name, Email, Passwort), (2) Erfahrungslevel (Beginner / Home Barista / Expert), (3) Maschinentyp (8 Optionen: Espresso Semi/Auto, V60, AeroPress etc.), (4) Persönliche Ziele (optional, Mehrfachauswahl). Schritt-Indikator zeigt Fortschritt. Daten werden in einem einzigen API-Call gespeichert.
- **Wo umgesetzt:** Frontend: `/register/+page.svelte` — `step`-State mit 4 konditionalen Render-Blöcken, Validierung pro Schritt. Backend: `/api/auth/register` speichert `skillLevel`, `machineType`, `goals` direkt im User-Dokument.
- **Referenz:** Screenshots 03-register-1.png, 04-register-2.png
- **Aus Evaluation abgeleitet?:** Ja — «Kein Onboarding für Anfänger» wurde als Idee von Metehan Altay eingebracht; 4-Step-Prozess personalisiert die App ab dem ersten Moment.

### 4.20 Adaptives UI (Beginner / Expert Modus)

- **Beschreibung & Nutzen:** Der Shot Logger und andere Bereiche passen sich dem beim Onboarding gewählten Skill Level an. Beginner sehen vereinfachte Ansichten mit weniger Feldern und erklärenden Tooltips für Fachbegriffe (Dose, Yield, TDS). Expert-Nutzer sehen alle Felder und erweiterte Parameter. Das Skill Level ist in Settings jederzeit änderbar.
- **Wo umgesetzt:** Frontend: Konditionale Render-Blöcke in `/shot-logger/+page.svelte` basierend auf `locals.user.skillLevel`. Tooltips via Tailwind `group`/`title`-Attribut. Settings: `/settings/+page.svelte` erlaubt nachträgliche Änderung des Skill Levels via `/api/users/profile` PATCH.
- **Referenz:** Screenshot 09-shot-logger.png, Screenshot 17-settings.png
- **Aus Evaluation abgeleitet?:** Ja — «Shot Logger zu komplex für Einsteiger» (Schweregrad 2) wurde von Subraj Singh gemeldet; adaptives UI ist die direkte Umsetzung.

---

## 5. Projektorganisation

- **Repository:** https://github.com/mitallemscharf/beanery
- **Deployment:** https://beanery-lenny.netlify.app
- **Figma:** https://www.figma.com/design/tw5wstCGf1QVRyN42YP6GH/Beanery-App
- **Commits:** Präfix feat/fix/docs/backup mit sprechenden Messages
- **Branches:** main (Produktion), feature/authentication (gemergt)
- **Collaborators:** mmeisterhans, bkuehnis
- **GitHub Issues:** 13 Issues erstellt (#1–#13), kategorisiert mit Labels (feat, fix, docs)
- **Milestones:** v1.0 — Minimum Requirements, v2.0 — Extensions & Bonus Features

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

## 7. Anhang [Optional]

### Quellen & Ressourcen

**Bilder & Medien:**
| Quelle | Lizenz | Verwendung |
|--------|--------|------------|
| Pexels.com | Kostenlos, lizenzfrei (Pexels Lizenz) | Kaffeebilder auf Landing Page und Bean Cards |
| Unsplash.com | Kostenlos, lizenzfrei (Unsplash Lizenz) | Bohnenbilder in der Bean Library |

**Schriften:**
| Font | Quelle | Lizenz |
|------|--------|--------|
| Libre Caslon Text | Google Fonts | SIL Open Font License |
| Hanken Grotesk | Google Fonts | SIL Open Font License |

**Icons:**
| Icon Set | Quelle | Lizenz |
|----------|--------|--------|
| Material Symbols | Google Fonts | Apache License 2.0 |

**Libraries & Tools:**
| Tool/Library | Verwendung | Lizenz |
|-------------|------------|--------|
| SvelteKit | Frontend Framework | MIT |
| MongoDB / Mongoose | Datenbank | Apache 2.0 / MIT |
| bcrypt | Passwort-Hashing | MIT |
| jsonwebtoken | JWT Authentication | MIT |
| Playwright | Automatische Screenshots | Apache 2.0 |

**KI-Tools (siehe auch Kapitel 6):**
| Tool | Verwendung |
|------|------------|
| Claude Code (Anthropic) | Gesamte App-Entwicklung |
| Claude.ai (Anthropic) | Planung, Prompts, README |
| Google Stitch | UI/Design-Generierung |

**Design-Inspiration:**
| Quelle | URL |
|--------|-----|
| Sweetgreen App | mobbin.com/apps/sweetgreen-ios |
| MUBI Go App | mobbin.com/apps/mubi-go-ios |

**Testpersonen Evaluation:**
- Metehan Altay — Mitstudierender TZBISa, ZHAW
- Subraj Singh — Mitstudierender TZBISa, ZHAW
- Datum: 20. Mai 2026, ZHAW Winterthur

**Links:**
- GitHub Repository: https://github.com/mitallemscharf/beanery
- Netlify Deployment: https://beanery-lenny.netlify.app
- Figma Mockup: https://www.figma.com/design/tw5wstCGf1QVRyN42YP6GH/Beanery-App
- Crazy 8s Skizzen: [crazy8s.pdf](crazy8s.pdf)

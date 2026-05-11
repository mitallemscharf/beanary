<div class="landing">

  <!-- ── HERO ── -->
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="hero-eyebrow">Willkommen bei</p>
      <h1 class="hero-title">Beanary</h1>
      <p class="hero-subtitle">Dein persönliches Espresso-Tagebuch</p>
      <a href="/dashboard" class="hero-cta">App öffnen →</a>
    </div>
    <div class="hero-scroll-hint">↓</div>
  </section>

  <!-- ── EDITORIAL SPLIT ── -->
  <section class="editorial">
    <div class="editorial-photo">
      <img src="/hero-bag-to-cup.webp" alt="Vom Bohnen zum Espresso" />
    </div>
    <div class="editorial-text">
      <p class="editorial-overline">Das Konzept</p>
      <h2 class="editorial-heading">Vom Bohnen<br/>zum<br/>perfekten Shot.</h2>
      <p class="editorial-body">Beanary begleitet dich auf deiner Reise — von der ersten Bohne bis zum Sweet Spot. Jeder Shot zählt.</p>
    </div>
  </section>

  <!-- ── FEATURES ── -->
  <section class="features">
    <p class="features-label">Was dich erwartet</p>

    <div class="feature-card">
      <span class="feature-num">01</span>
      <div class="feature-text">
        <h3 class="feature-title">Shots loggen</h3>
        <p class="feature-desc">Erfasse jeden Espresso mit Dosis, Yield, Mahlgrad, Zeit und Bewertung. Die Brew-Ratio wird automatisch berechnet.</p>
      </div>
    </div>

    <div class="feature-card">
      <span class="feature-num">02</span>
      <div class="feature-text">
        <h3 class="feature-title">Bohnen verwalten</h3>
        <p class="feature-desc">Behalte den Überblick über alle deine Kaffeebohnen — von der Herkunft bis zum Frischegrad nach dem Röstdatum.</p>
      </div>
    </div>

    <div class="feature-card">
      <span class="feature-num">03</span>
      <div class="feature-text">
        <h3 class="feature-title">Sweet Spot finden</h3>
        <p class="feature-desc">Entdecke deine besten Einstellungen für jeden Blend. Der Sweet Spot zeigt dir den höchstbewerteten Shot je Bohne.</p>
      </div>
    </div>

    <a href="/dashboard" class="features-cta">Jetzt starten →</a>
  </section>

  <!-- ── GRIND PHOTO ── -->
  <section class="grind-section">
    <img src="/hero-grind.webp" alt="Mahlgrad" class="grind-photo" />
    <div class="grind-overlay">
      <p class="grind-text">"Präzision im Mahlgrad.<br/>Perfektion im Cup."</p>
    </div>
  </section>

</div>

<style>
  .landing {
    min-height: 100dvh;
    background: var(--espresso);
  }

  /* ── HERO ── */
  .hero {
    position: relative;
    min-height: 72dvh;
    background-image: url('/hero-portafilters.webp');
    background-size: cover;
    background-position: center top;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      160deg,
      rgba(15, 10, 5, 0.08) 0%,
      rgba(15, 10, 5, 0.55) 55%,
      rgba(15, 10, 5, 0.92) 100%
    );
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding: var(--space-xl) var(--space-sm) var(--space-xl);
    width: 100%;
    margin-top: auto;
  }

  .hero-eyebrow {
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(250, 248, 245, 0.5);
    margin-bottom: 10px;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(64px, 20vw, 88px);
    font-weight: 600;
    color: #FAF8F5;
    line-height: 0.88;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }

  .hero-subtitle {
    font-size: 1rem;
    color: rgba(250, 248, 245, 0.65);
    font-style: italic;
    margin-bottom: var(--space-xl);
    line-height: 1.5;
  }

  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--coffee);
    color: #FAF8F5;
    font-size: 0.95rem;
    font-weight: 500;
    padding: 15px 30px;
    border-radius: var(--radius-lg);
    letter-spacing: 0.03em;
    transition: all 0.25s ease;
    text-decoration: none;
  }

  .hero-cta:hover {
    background: var(--coffee-light);
    transform: translateY(-3px);
    box-shadow: 0 14px 36px rgba(139, 90, 43, 0.5);
  }

  .hero-scroll-hint {
    position: relative;
    z-index: 1;
    color: rgba(250, 248, 245, 0.3);
    font-size: 1.2rem;
    padding: var(--space-sm);
    animation: float 2.5s ease-in-out infinite;
    align-self: center;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(6px); }
  }

  /* ── EDITORIAL SPLIT ── */
  .editorial {
    background: var(--bg);
    display: grid;
    grid-template-columns: 1fr;
  }

  .editorial-photo {
    height: 280px;
    overflow: hidden;
  }

  .editorial-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    display: block;
    transition: transform 0.6s ease;
  }

  .editorial-photo:hover img {
    transform: scale(1.03);
  }

  .editorial-text {
    padding: var(--space-xl) var(--space-sm);
    border-bottom: 1px solid var(--border);
  }

  .editorial-overline {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--coffee);
    margin-bottom: var(--space-sm);
  }

  .editorial-heading {
    font-family: var(--font-display);
    font-size: 2.6rem;
    font-weight: 500;
    color: var(--text);
    line-height: 1.05;
    letter-spacing: -0.01em;
    margin-bottom: var(--space-md);
  }

  .editorial-body {
    font-size: 0.9rem;
    color: var(--text2);
    line-height: 1.65;
    max-width: 36ch;
  }

  /* ── FEATURES ── */
  .features {
    background: var(--espresso);
    padding: var(--space-xl) var(--space-sm);
    padding-bottom: var(--space-xl);
  }

  .features-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(250, 248, 245, 0.3);
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .feature-card {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    padding: var(--space-md) 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
    transition: all 0.2s ease;
  }

  .feature-card:last-of-type {
    border-bottom: none;
  }

  .feature-num {
    font-family: var(--font-display);
    font-size: 2.2rem;
    color: rgba(196, 135, 74, 0.35);
    font-weight: 400;
    line-height: 1;
    flex-shrink: 0;
    width: 48px;
    padding-top: 2px;
    transition: color 0.2s;
  }

  .feature-card:hover .feature-num {
    color: var(--coffee-light);
  }

  .feature-title {
    font-family: var(--font-display);
    font-size: 1.4rem;
    color: #FAF8F5;
    font-weight: 500;
    margin-bottom: 8px;
    letter-spacing: 0.01em;
  }

  .feature-desc {
    font-size: 0.85rem;
    color: rgba(250, 248, 245, 0.5);
    line-height: 1.6;
  }

  .features-cta {
    display: block;
    text-align: center;
    background: var(--coffee);
    color: #FAF8F5;
    font-size: 0.95rem;
    font-weight: 500;
    padding: 16px;
    border-radius: var(--radius);
    margin-top: var(--space-xl);
    transition: all 0.25s ease;
    text-decoration: none;
    letter-spacing: 0.02em;
  }

  .features-cta:hover {
    background: var(--coffee-light);
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(139, 90, 43, 0.4);
  }

  /* ── GRIND PHOTO ── */
  .grind-section {
    position: relative;
    height: 260px;
    overflow: hidden;
  }

  .grind-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 40%;
    display: block;
  }

  .grind-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(15, 10, 5, 0.75) 0%, rgba(15, 10, 5, 0.2) 100%);
    display: flex;
    align-items: center;
    padding: var(--space-md) var(--space-sm);
  }

  .grind-text {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 400;
    font-style: italic;
    color: rgba(250, 248, 245, 0.9);
    line-height: 1.45;
    max-width: 22ch;
  }
</style>

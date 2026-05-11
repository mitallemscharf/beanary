<div class="landing">

  <!-- ── VOLLBILD HERO ── -->
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="hero-eyebrow">Willkommen bei</p>
      <h1 class="hero-title">Beanary</h1>
      <p class="hero-subtitle">Dein persönliches Espresso-Tagebuch</p>
      <a href="/dashboard" class="hero-cta">App öffnen →</a>
    </div>
  </section>

  <!-- ── FEATURE CARDS ── -->
  <section class="features">
    <p class="features-label">Was dich erwartet</p>

    <div class="feature-card">
      <div class="feature-icon">☕</div>
      <div class="feature-text">
        <h3 class="feature-title">Shots loggen</h3>
        <p class="feature-desc">Erfasse jeden Espresso mit Dosis, Yield, Mahlgrad, Zeit und Bewertung. Die Brew-Ratio wird automatisch berechnet.</p>
      </div>
    </div>

    <div class="feature-card">
      <div class="feature-icon">🫘</div>
      <div class="feature-text">
        <h3 class="feature-title">Bohnen verwalten</h3>
        <p class="feature-desc">Behalte den Überblick über alle deine Kaffeebohnen — von der Herkunft bis zum Frischegrad nach dem Röstdatum.</p>
      </div>
    </div>

    <div class="feature-card">
      <div class="feature-icon">⭐</div>
      <div class="feature-text">
        <h3 class="feature-title">Sweet Spot finden</h3>
        <p class="feature-desc">Entdecke deine besten Einstellungen für jeden Blend. Der Sweet Spot zeigt dir den höchstbewerteten Shot je Bohne.</p>
      </div>
    </div>

    <a href="/dashboard" class="features-cta">Jetzt starten</a>
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
    min-height: 68dvh;
    background-image: url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600');
    background-size: cover;
    background-position: center;
    display: flex;
    align-items: flex-end;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(15, 10, 5, 0.15) 0%,
      rgba(15, 10, 5, 0.45) 45%,
      rgba(15, 10, 5, 0.88) 100%
    );
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding: var(--space-xl) var(--space-sm) var(--space-xl);
    width: 100%;
  }

  .hero-eyebrow {
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(250, 248, 245, 0.55);
    margin-bottom: 8px;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: 72px;
    font-weight: 600;
    color: #FAF8F5;
    line-height: 0.9;
    letter-spacing: -0.02em;
    margin-bottom: 14px;
  }

  .hero-subtitle {
    font-size: 1rem;
    color: rgba(250, 248, 245, 0.7);
    font-style: italic;
    margin-bottom: var(--space-xl);
    line-height: 1.4;
  }

  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--coffee);
    color: #FAF8F5;
    font-size: 1rem;
    font-weight: 500;
    padding: 16px 32px;
    border-radius: var(--radius-lg);
    letter-spacing: 0.02em;
    transition: all 0.25s ease;
    text-decoration: none;
  }

  .hero-cta:hover {
    background: var(--coffee-light);
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(139, 90, 43, 0.45);
  }

  /* ── FEATURES ── */
  .features {
    background: var(--espresso);
    padding: var(--space-xl) var(--space-sm);
    padding-bottom: calc(var(--space-xl) + var(--space-lg));
  }

  .features-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: rgba(250, 248, 245, 0.35);
    margin-bottom: var(--space-lg);
  }

  .feature-card {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius);
    padding: var(--space-md);
    margin-bottom: var(--space-sm);
    transition: all 0.25s ease;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    border-color: rgba(196, 135, 74, 0.35);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  }

  .feature-icon {
    font-size: 2rem;
    line-height: 1;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.07);
    border-radius: var(--radius-sm);
  }

  .feature-title {
    font-family: var(--font-display);
    font-size: 1.2rem;
    color: #FAF8F5;
    font-weight: 500;
    margin-bottom: 6px;
  }

  .feature-desc {
    font-size: 0.85rem;
    color: rgba(250, 248, 245, 0.55);
    line-height: 1.55;
  }

  .features-cta {
    display: block;
    text-align: center;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(250, 248, 245, 0.8);
    font-size: 0.9rem;
    font-weight: 500;
    padding: 14px;
    border-radius: var(--radius);
    margin-top: var(--space-lg);
    transition: all 0.25s ease;
    text-decoration: none;
  }

  .features-cta:hover {
    background: var(--coffee);
    border-color: var(--coffee);
    color: #FAF8F5;
    transform: translateY(-2px);
  }
</style>

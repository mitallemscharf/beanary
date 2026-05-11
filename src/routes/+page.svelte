<div class="landing">

  <!-- ── HERO ── -->
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="hero-eyebrow">Das Kaffee-Tagebuch</p>
      <h1 class="hero-wordmark">Beanary</h1>
      <p class="hero-headline">Finde deinen<br/>perfekten Shot.</p>
      <p class="hero-subline">Erfasse jeden Espresso mit Präzision.<br/>Erkenne, was wirklich funktioniert.</p>
      <a href="/dashboard" class="hero-cta">
        <span>App öffnen</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </a>
    </div>
    <div class="hero-scroll" aria-hidden="true">
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
        <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3"/>
        <circle cx="8" cy="7" r="2.5" fill="currentColor" fill-opacity="0.4" class="scroll-dot"/>
      </svg>
    </div>
  </section>

  <!-- ── FEATURES ── -->
  <section class="features">
    <p class="features-eyebrow">Was Beanary kann</p>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
        </div>
        <div class="feature-body">
          <h3 class="feature-title">Shot Logger</h3>
          <p class="feature-desc">Dosis, Yield, Mahlgrad, Extraktionszeit — alle Parameter auf einen Blick. Nie wieder die beste Einstellung vergessen.</p>
        </div>
      </div>

      <div class="feature-card">
        <div class="feature-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-30 12 12)"/><path d="M12 6.5 Q9.5 12 12 17.5"/></svg>
        </div>
        <div class="feature-body">
          <h3 class="feature-title">Bohnen-Bibliothek</h3>
          <p class="feature-desc">Röster, Herkunft, Röstdatum und Frische-Indikator. Sieh sofort, welche Bohnen aktuell im optimalen Fenster sind.</p>
        </div>
      </div>

      <div class="feature-card">
        <div class="feature-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="feature-body">
          <h3 class="feature-title">Sweet Spot Finder</h3>
          <p class="feature-desc">Beanary erkennt automatisch den höchstbewerteten Shot pro Bohne — dein persönlicher Sweet Spot, immer griffbereit.</p>
        </div>
      </div>
    </div>

    <a href="/dashboard" class="features-cta">Jetzt starten →</a>
  </section>

</div>

<style>
  .landing {
    min-height: 100dvh;
    background: var(--bg);
  }

  /* ── HERO ── */
  .hero {
    position: relative;
    min-height: 100dvh;
    background-image: url('/hero-portafilters.webp');
    background-size: cover;
    background-position: center 40%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(11, 9, 7, 0.25) 0%,
      rgba(11, 9, 7, 0.55) 45%,
      rgba(11, 9, 7, 0.96) 100%
    );
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding: 0 var(--space-sm) var(--space-xl);
    animation: fadeIn 0.9s ease both;
  }

  .hero-eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--coffee-light);
    margin-bottom: var(--space-sm);
    opacity: 0.8;
    animation: fadeIn 0.6s ease both;
  }

  .hero-wordmark {
    font-family: var(--font-display);
    font-size: 80px;
    font-weight: 500;
    color: var(--crema);
    line-height: 0.88;
    letter-spacing: -0.03em;
    margin-bottom: var(--space-md);
    animation: fadeIn 0.7s 0.05s ease both;
  }

  .hero-headline {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 400;
    font-style: italic;
    color: rgba(232, 201, 154, 0.65);
    line-height: 1.3;
    letter-spacing: 0.005em;
    margin-bottom: var(--space-md);
    animation: fadeIn 0.7s 0.1s ease both;
  }

  .hero-subline {
    font-size: 0.875rem;
    color: var(--text2);
    line-height: 1.65;
    margin-bottom: var(--space-xl);
    max-width: 32ch;
    animation: fadeIn 0.7s 0.15s ease both;
  }

  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--coffee);
    color: var(--crema);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    padding: 15px 28px;
    border-radius: var(--radius);
    letter-spacing: 0.03em;
    transition: all 0.25s ease;
    text-decoration: none;
    animation: fadeIn 0.7s 0.2s ease both;
  }

  .hero-cta:hover {
    background: var(--coffee-light);
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(139, 90, 43, 0.5);
  }

  .hero-scroll {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    padding: var(--space-sm);
    color: var(--crema);
  }

  .scroll-dot {
    animation: scrollBob 2.5s ease-in-out infinite;
  }

  @keyframes scrollBob {
    0%, 100% { transform: translateY(0); opacity: 0.4; }
    50% { transform: translateY(6px); opacity: 0.8; }
  }

  /* ── FEATURES ── */
  .features {
    background: var(--bg);
    padding: var(--space-xl) var(--space-sm);
    padding-bottom: calc(var(--space-xl) + var(--space-lg));
  }

  .features-eyebrow {
    font-family: var(--font-mono);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--text3);
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--border);
  }

  .features-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: var(--space-lg);
  }

  .feature-card {
    display: flex;
    align-items: flex-start;
    gap: var(--space-md);
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-md);
    transition: all 0.25s ease;
  }

  .feature-card:hover {
    transform: translateX(4px);
    border-color: rgba(139, 90, 43, 0.3);
    background: var(--bg3);
  }

  .feature-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(139, 90, 43, 0.1);
    border: 1px solid rgba(139, 90, 43, 0.18);
    border-radius: var(--radius-sm);
    color: var(--coffee-light);
  }

  .feature-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    color: var(--crema);
    font-weight: 500;
    margin-bottom: 6px;
    letter-spacing: 0;
    line-height: 1.2;
  }

  .feature-desc {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.6;
  }

  .features-cta {
    display: block;
    text-align: center;
    background: transparent;
    border: 1px solid var(--border2);
    color: var(--coffee-light);
    font-family: var(--font-body);
    font-size: 14px;
    font-weight: 500;
    padding: 15px;
    border-radius: var(--radius);
    margin-top: var(--space-lg);
    transition: all 0.25s ease;
    text-decoration: none;
    letter-spacing: 0.04em;
  }

  .features-cta:hover {
    background: var(--coffee);
    border-color: var(--coffee);
    color: var(--crema);
    box-shadow: 0 8px 24px rgba(139, 90, 43, 0.35);
  }
</style>

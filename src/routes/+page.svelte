<div class="landing">

  <!-- ── HERO ── -->
  <section class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="hero-eyebrow">Das Kaffee·Tagebuch</p>
      <h1 class="hero-wordmark">Beanary</h1>
      <p class="hero-headline">Finde deinen<br/><em>perfekten Shot.</em></p>
      <p class="hero-subline">Erfasse jeden Espresso mit Präzision.<br/>Erkenne, was wirklich funktioniert.</p>
      <a href="/dashboard" class="hero-cta">
        <span>App öffnen</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
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

    <div class="features-heading">
      <span class="features-heading__label">Was Beanary kann</span>
    </div>

    <div class="features-list">

      <div class="feature-item">
        <div class="feature-item__num">01</div>
        <div class="feature-item__body">
          <div class="feature-item__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
          </div>
          <h3 class="feature-item__title">Shot Logger</h3>
          <p class="feature-item__desc">Dosis, Yield, Mahlgrad, Extraktionszeit — alle Parameter auf einen Blick. Nie wieder die beste Einstellung vergessen.</p>
        </div>
      </div>

      <div class="feature-item">
        <div class="feature-item__num">02</div>
        <div class="feature-item__body">
          <div class="feature-item__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-30 12 12)"/><path d="M12 6.5 Q9.5 12 12 17.5"/></svg>
          </div>
          <h3 class="feature-item__title">Bohnen-Bibliothek</h3>
          <p class="feature-item__desc">Röster, Herkunft, Röstdatum und Frische-Indikator. Sieh sofort, welche Bohnen im optimalen Fenster sind.</p>
        </div>
      </div>

      <div class="feature-item feature-item--last">
        <div class="feature-item__num">03</div>
        <div class="feature-item__body">
          <div class="feature-item__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h3 class="feature-item__title">Sweet Spot Finder</h3>
          <p class="feature-item__desc">Beanary erkennt automatisch den höchstbewerteten Shot pro Bohne — dein persönlicher Sweet Spot, immer griffbereit.</p>
        </div>
      </div>

    </div>

    <a href="/dashboard" class="features-cta">
      Jetzt starten
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>

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
      rgba(11, 9, 7, 0.2) 0%,
      rgba(11, 9, 7, 0.45) 40%,
      rgba(11, 9, 7, 0.97) 100%
    );
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding: 0 var(--space-sm) var(--space-xl);
    animation: slideUp 0.9s ease both;
  }

  .hero-eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--coffee-light);
    margin-bottom: var(--space-md);
    opacity: 0.75;
    animation: fadeIn 0.6s 0.1s ease both;
  }

  .hero-wordmark {
    font-family: var(--font-display);
    font-size: clamp(72px, 22vw, 108px);
    font-weight: 500;
    color: var(--ink);
    line-height: 0.88;
    letter-spacing: -0.03em;
    margin-bottom: var(--space-md);
    animation: slideUp 0.7s 0.05s ease both;
  }

  .hero-headline {
    font-family: var(--font-display);
    font-size: clamp(1.5rem, 6vw, 2rem);
    font-weight: 400;
    color: rgba(232, 201, 154, 0.7);
    line-height: 1.25;
    letter-spacing: 0.01em;
    margin-bottom: var(--space-md);
    animation: fadeIn 0.7s 0.1s ease both;
  }

  .hero-headline em {
    font-style: italic;
    color: var(--crema);
  }

  .hero-subline {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.7;
    margin-bottom: var(--space-xl);
    max-width: 30ch;
    animation: fadeIn 0.7s 0.15s ease both;
  }

  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    background: var(--coffee);
    color: var(--crema);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    padding: 15px 28px;
    border-radius: var(--radius);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: all 0.25s ease;
    animation: fadeIn 0.7s 0.2s ease both;
  }

  .hero-cta:hover {
    background: var(--coffee-light);
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(139, 90, 43, 0.5);
  }

  .hero-scroll {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    padding: var(--space-sm);
    color: var(--crema);
    opacity: 0.5;
  }

  .scroll-dot {
    animation: scrollBob 2.5s ease-in-out infinite;
  }

  @keyframes scrollBob {
    0%, 100% { transform: translateY(0); opacity: 0.4; }
    50% { transform: translateY(6px); opacity: 0.85; }
  }

  /* ── FEATURES ── */
  .features {
    background: var(--bg);
    padding: var(--space-xl) var(--space-sm);
    padding-bottom: calc(var(--space-xl) + var(--space-lg));
  }

  /* Section heading with rule */
  .features-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: var(--space-xl);
    padding-bottom: 0;
  }

  .features-heading::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--rule);
  }

  .features-heading__label {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    color: var(--text3);
    white-space: nowrap;
  }

  /* Numbered feature items */
  .features-list {
    display: flex;
    flex-direction: column;
  }

  .feature-item {
    display: flex;
    gap: 20px;
    padding: var(--space-lg) 0;
    border-bottom: 1px solid var(--border);
    transition: opacity 0.2s;
  }

  .feature-item--last {
    border-bottom: none;
  }

  .feature-item__num {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 400;
    color: var(--text3);
    letter-spacing: 0.08em;
    padding-top: 2px;
    flex-shrink: 0;
    width: 22px;
  }

  .feature-item__body {
    flex: 1;
    min-width: 0;
  }

  .feature-item__icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(139, 90, 43, 0.1);
    border: 1px solid rgba(139, 90, 43, 0.2);
    border-radius: var(--radius-sm);
    color: var(--coffee-light);
    margin-bottom: 14px;
    flex-shrink: 0;
  }

  .feature-item__title {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 500;
    color: var(--ink);
    letter-spacing: -0.01em;
    line-height: 1.2;
    margin-bottom: 8px;
  }

  .feature-item__desc {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.65;
  }

  .features-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-top: var(--space-xl);
    background: transparent;
    border: 1px solid var(--border2);
    color: var(--crema);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    padding: 14px 24px;
    border-radius: var(--radius);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: all 0.25s ease;
  }

  .features-cta:hover {
    background: var(--coffee);
    border-color: var(--coffee);
    color: var(--crema);
    box-shadow: 0 8px 28px rgba(139, 90, 43, 0.35);
    gap: 14px;
  }
</style>

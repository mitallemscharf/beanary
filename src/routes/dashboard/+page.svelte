<script>
  import RatingStars from '$lib/components/RatingStars.svelte';

  let { data } = $props();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 17 ? 'Guten Tag' : 'Guten Abend';

  const chartW = 320;
  const chartH = 88;
  const barW = 24;
  const maxRating = 5;

  function barHeight(r) { return (r / maxRating) * chartH; }
  function barColor(r) {
    if (r >= 4) return '#6BAE7F';
    if (r === 3) return '#EF9F27';
    return '#8B3A3A';
  }

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('de-CH', { day: '2-digit', month: 'short' });
  }
</script>

<div class="dashboard">

  <!-- ── HERO ── -->
  <section class="hero-section">
    <div class="hero-text">
      <p class="greeting">{greeting}</p>
      <h1 class="hero-title">Beanary</h1>
      <p class="hero-tagline">Dein persönliches Kaffee-Tagebuch</p>
    </div>
    <div class="hero-photo-wrap">
      <img src="/hero-bag-to-cup.webp" alt="" class="hero-photo" />
      <div class="hero-photo-overlay"></div>
      <div class="hero-photo-caption">
        <span class="caption-mono">Heute · {new Date().toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      </div>
    </div>
  </section>

  <!-- ── CONTENT ── -->
  <section class="content-section">

    <!-- Status Grid -->
    <div class="metrics-grid">
      <div class="metric-tile">
        <div class="metric-tile__header">
          <span class="metric-tile__icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
          </span>
          <span class="metric-tile__label">Shots total</span>
        </div>
        <span class="metric-tile__value">{data.totalShots}</span>
      </div>

      <div class="metric-tile">
        <div class="metric-tile__header">
          <span class="metric-tile__icon metric-tile__icon--amber">★</span>
          <span class="metric-tile__label">Ø Bewertung</span>
        </div>
        <span class="metric-tile__value">{data.avgRating > 0 ? data.avgRating.toFixed(1) : '—'}</span>
      </div>

      <div class="metric-tile metric-tile--wide">
        <div class="metric-tile__header">
          <span class="metric-tile__icon metric-tile__icon--green">◎</span>
          <span class="metric-tile__label">Beste Bohne</span>
        </div>
        <span class="metric-tile__value metric-tile__value--sm">{data.bestBeanName ?? '—'}</span>
      </div>

      <div class="metric-tile">
        <div class="metric-tile__header">
          <span class="metric-tile__icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-30 12 12)"/><path d="M12 6.5 Q9.5 12 12 17.5"/></svg>
          </span>
          <span class="metric-tile__label">Aktive Bohnen</span>
        </div>
        <span class="metric-tile__value">{data.activeBeans}</span>
      </div>
    </div>

    <!-- Rating Chart -->
    {#if data.chartData.length > 0}
      <div class="section-block">
        <h2 class="section-title">Verlauf</h2>
        <div class="chart-wrap">
          <svg viewBox="0 0 {chartW} {chartH + 22}" width="100%" preserveAspectRatio="xMinYMin meet">
            <defs>
              {#each data.chartData as bar, i}
                <linearGradient id="g{i}" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color={barColor(bar.rating)} stop-opacity="0.9"/>
                  <stop offset="100%" stop-color={barColor(bar.rating)} stop-opacity="0.2"/>
                </linearGradient>
              {/each}
            </defs>
            {#each [1,2,3,4,5] as lvl}
              {@const gy = chartH - (lvl / maxRating) * chartH}
              <line x1="0" y1={gy} x2={chartW} y2={gy} stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
            {/each}
            {#each data.chartData as bar, i}
              {@const x = i * (barW + 7) + 4}
              {@const h = barHeight(bar.rating)}
              {@const y = chartH - h}
              <rect x={x} y={y} width={barW} height={h} rx="3" fill="url(#g{i})" />
              <text x={x + barW / 2} y={chartH + 16} text-anchor="middle" font-size="7.5"
                fill="rgba(240,232,220,0.3)" font-family="IBM Plex Mono, monospace">{bar.date}</text>
            {/each}
          </svg>
        </div>
      </div>
    {/if}

    <!-- Recent Shots -->
    {#if data.lastShots.length > 0}
      <div class="section-block">
        <div class="section-header">
          <h2 class="section-title">Zuletzt geloggt</h2>
          <a href="/history" class="see-all">Alle →</a>
        </div>
        <div class="recent-list">
          {#each data.lastShots as shot (shot._id)}
            <a href="/beans/{shot.beanId}" class="recent-shot">
              <div class="recent-shot__top">
                <span class="recent-bean">{shot.beanName}</span>
                <span class="recent-date">{formatDate(shot.createdAt)}</span>
              </div>
              <div class="recent-shot__mid">
                <RatingStars rating={shot.rating} readonly />
                {#if shot.brewRatio}
                  <span class="recent-ratio">1:{shot.brewRatio}</span>
                {/if}
              </div>
              <div class="recent-params">
                <span>{shot.dose}g → {shot.yieldG}g</span>
                <span class="param-sep">·</span>
                <span>{shot.extractionTime}s</span>
                <span class="param-sep">·</span>
                <span>#{shot.grindSize}</span>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {:else}
      <div class="empty-state">
        <p style="font-size:2rem">☕</p>
        <p>Noch keine Shots erfasst.</p>
        <a href="/log" class="btn btn-primary" style="margin-top:var(--space-md)">Ersten Shot loggen</a>
      </div>
    {/if}

  </section>
</div>

<style>
  .dashboard {
    min-height: 100dvh;
    padding-bottom: calc(var(--nav-height) + var(--space-sm));
    animation: fadeIn 0.4s ease both;
  }

  /* ── HERO ── */
  .hero-section {
    padding: calc(var(--space-lg) + var(--space-sm)) var(--space-sm) 0;
  }

  .greeting {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 10px;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: 52px;
    font-weight: 500;
    color: var(--crema);
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 6px;
  }

  .hero-tagline {
    font-size: 13px;
    color: var(--text2);
    font-style: italic;
    line-height: 1.5;
    margin-bottom: var(--space-lg);
  }

  .hero-photo-wrap {
    position: relative;
    margin: 0 calc(-1 * var(--space-sm));
    height: 210px;
    overflow: hidden;
    border-radius: 0;
  }

  .hero-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 35%;
    display: block;
  }

  .hero-photo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(11, 9, 7, 0.15) 0%,
      rgba(11, 9, 7, 0.5) 100%
    );
  }

  .hero-photo-caption {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: var(--space-xs) var(--space-sm);
    background: linear-gradient(transparent, rgba(11, 9, 7, 0.7));
  }

  .caption-mono {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(232, 201, 154, 0.45);
  }

  /* ── CONTENT ── */
  .content-section {
    padding: var(--space-lg) var(--space-sm) var(--space-lg);
  }

  /* ── METRICS ── */
  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: var(--space-lg);
  }

  .metric-tile--wide {
    grid-column: span 2;
  }

  .metric-tile {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .metric-tile:hover {
    border-color: var(--border2);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  }

  .metric-tile__header {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .metric-tile__icon {
    font-size: 13px;
    color: var(--text3);
    line-height: 1;
    display: flex;
    align-items: center;
  }

  .metric-tile__icon--amber { color: var(--amber); }
  .metric-tile__icon--green { color: var(--green-light); }

  .metric-tile__label {
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text3);
  }

  .metric-tile__value {
    font-family: var(--font-mono);
    font-size: 34px;
    font-weight: 500;
    color: var(--crema);
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .metric-tile__value--sm {
    font-family: var(--font-display);
    font-size: 20px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 1.2;
  }

  /* ── SECTIONS ── */
  .section-block { margin-bottom: var(--space-lg); }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-sm);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 500;
    color: var(--crema);
    line-height: 1.2;
  }

  .see-all {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text3);
    transition: color 0.15s;
    letter-spacing: 0.04em;
  }

  .see-all:hover { color: var(--coffee-light); }

  /* ── CHART ── */
  .chart-wrap {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-sm);
    overflow-x: auto;
    margin-bottom: var(--space-lg);
  }

  /* ── RECENT SHOTS ── */
  .recent-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .recent-shot {
    display: block;
    text-decoration: none;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 16px;
    transition: all 0.2s ease;
  }

  .recent-shot:hover {
    border-color: var(--border2);
    transform: translateX(3px);
  }

  .recent-shot__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .recent-bean {
    font-size: 13px;
    font-weight: 500;
    color: var(--coffee-light);
  }

  .recent-date {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text3);
  }

  .recent-shot__mid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .recent-ratio {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--coffee-light);
    font-weight: 400;
  }

  .recent-params {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text3);
  }

  .param-sep {
    color: var(--border2);
  }
</style>

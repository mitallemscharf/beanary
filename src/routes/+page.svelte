<script>
  import RatingStars from '$lib/components/RatingStars.svelte';

  let { data } = $props();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 17 ? 'Guten Tag' : 'Guten Abend';

  const chartW = 320;
  const chartH = 90;
  const barW = 26;
  const maxRating = 5;

  function barHeight(r) { return (r / maxRating) * chartH; }
  function barColor(r) {
    if (r >= 4) return '#5A9A6B';
    if (r === 3) return '#C08010';
    return '#9B4040';
  }

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('de-CH', { day: '2-digit', month: 'short' });
  }
</script>

<!-- Light cream top + dark espresso bottom, no default .page padding -->
<div class="dashboard" style="animation: fadeIn 0.3s ease both;">

  <!-- ── CREAM EDITORIAL HERO ── -->
  <section class="hero-section">
    <p class="greeting">{greeting}</p>
    <h1 class="hero-title">Beanary</h1>
    <p class="hero-tagline">Dein persönliches Kaffee-Tagebuch</p>

    <div class="hero-photo-wrap">
      <img
        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
        alt="Kaffee"
        class="hero-photo"
      />
      <div class="hero-photo-caption">
        <span>Heute · {new Date().toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
      </div>
    </div>
  </section>

  <!-- ── DARK ESPRESSO SECTION ── -->
  <section class="espresso-section">

    <!-- Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <span class="metric-icon">☕</span>
        <span class="metric-value">{data.totalShots}</span>
        <span class="metric-label">Shots total</span>
      </div>
      <div class="metric-card">
        <span class="metric-icon" style="color:#C08010">★</span>
        <span class="metric-value">{data.avgRating > 0 ? data.avgRating.toFixed(1) : '—'}</span>
        <span class="metric-label">Ø Bewertung</span>
      </div>
      <div class="metric-card">
        <span class="metric-icon">♛</span>
        <span class="metric-value metric-value--sm">{data.bestBeanName ?? '—'}</span>
        <span class="metric-label">Beste Bohne</span>
      </div>
      <div class="metric-card">
        <span class="metric-icon" style="color:#5A9A6B">◎</span>
        <span class="metric-value">{data.activeBeans}</span>
        <span class="metric-label">Aktive Bohnen</span>
      </div>
    </div>

    <!-- Chart -->
    {#if data.chartData.length > 0}
      <div class="chart-block">
        <h2 class="espresso-title">Bewertungsverlauf</h2>
        <div class="chart-wrap">
          <svg viewBox="0 0 {chartW} {chartH + 24}" width="100%">
            <defs>
              {#each data.chartData as bar, i}
                <linearGradient id="g{i}" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color={barColor(bar.rating)} />
                  <stop offset="100%" stop-color={barColor(bar.rating)} stop-opacity="0.4" />
                </linearGradient>
              {/each}
            </defs>
            {#each [1,2,3,4,5] as lvl}
              {@const gy = chartH - (lvl / maxRating) * chartH}
              <line x1="0" y1={gy} x2={chartW} y2={gy} stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
            {/each}
            {#each data.chartData as bar, i}
              {@const x = i * (barW + 8) + 4}
              {@const h = barHeight(bar.rating)}
              {@const y = chartH - h}
              <rect x={x} y={y} width={barW} height={h} rx="5" fill="url(#g{i})" />
              <text x={x + barW / 2} y={chartH + 17} text-anchor="middle" font-size="8"
                fill="rgba(250,248,245,0.45)" font-family="var(--font-body)">{bar.date}</text>
            {/each}
          </svg>
        </div>
      </div>
    {/if}

    <!-- Recent shots -->
    {#if data.lastShots.length > 0}
      <div class="recent-block">
        <div class="espresso-header">
          <h2 class="espresso-title">Zuletzt geloggt</h2>
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
                {#if shot.brewRatio}<span class="recent-ratio">1:{shot.brewRatio}</span>{/if}
              </div>
              <div class="recent-params">
                <span>{shot.dose}g → {shot.yieldG}g</span>
                <span>{shot.extractionTime}s</span>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {:else}
      <div class="empty-espresso">
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
  }

  /* ── CREAM HERO ── */
  .hero-section {
    background: var(--bg);
    padding: var(--space-lg) var(--space-sm) var(--space-xl);
    padding-top: calc(var(--space-lg) + var(--space-sm));
  }

  .greeting {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 6px;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: 56px;
    font-weight: 600;
    color: var(--text);
    line-height: 0.95;
    letter-spacing: -0.01em;
  }

  .hero-tagline {
    font-size: 0.9rem;
    color: var(--text2);
    margin-top: 10px;
    font-style: italic;
  }

  .hero-photo-wrap {
    position: relative;
    margin-top: var(--space-lg);
    border-radius: var(--radius-lg);
    overflow: hidden;
    height: 220px;
  }

  .hero-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .hero-photo-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(30, 20, 16, 0.7));
    padding: var(--space-sm);
    font-size: 0.7rem;
    color: rgba(250, 248, 245, 0.8);
    letter-spacing: 0.04em;
  }

  /* ── ESPRESSO SECTION ── */
  .espresso-section {
    background: var(--espresso);
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    padding: var(--space-xl) var(--space-sm) var(--space-lg);
    margin-top: -20px;
  }

  /* Metrics */
  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 2rem;
  }

  .metric-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius);
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .metric-icon {
    font-size: 1rem;
    color: var(--coffee-light);
    line-height: 1;
    margin-bottom: 2px;
  }

  .metric-value {
    font-family: var(--font-display);
    font-size: 2.2rem;
    color: var(--crema-light);
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .metric-value--sm {
    font-size: 1.1rem;
    white-space: normal;
    line-height: 1.2;
  }

  .metric-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(250, 248, 245, 0.45);
  }

  /* Chart */
  .chart-block {
    margin-bottom: 2rem;
  }

  .espresso-title {
    font-family: var(--font-display);
    font-size: 1.4rem;
    color: var(--crema-light);
    margin-bottom: var(--space-sm);
  }

  .chart-wrap {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius);
    padding: var(--space-sm);
    overflow-x: auto;
  }

  /* Recent */
  .recent-block { margin-bottom: 2rem; }

  .espresso-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-sm);
  }

  .see-all {
    font-size: 0.8rem;
    color: rgba(250, 248, 245, 0.5);
    transition: color 0.15s;
  }
  .see-all:hover { color: var(--coffee-light); }

  .recent-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .recent-shot {
    display: block;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: var(--radius);
    padding: var(--space-md);
    transition: border-color 0.15s, transform 0.15s;
  }

  .recent-shot:hover {
    border-color: rgba(196, 135, 74, 0.35);
    transform: translateY(-2px);
  }

  .recent-shot__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xs);
  }

  .recent-bean {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--coffee-light);
  }

  .recent-date { font-size: 0.7rem; color: rgba(250,248,245,0.4); }

  .recent-shot__mid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xs);
  }

  .recent-ratio { font-size: 0.8rem; color: var(--coffee-light); font-weight: 500; }

  .recent-params {
    display: flex;
    gap: var(--space-sm);
    font-size: 0.75rem;
    color: rgba(250, 248, 245, 0.45);
  }

  .empty-espresso {
    text-align: center;
    padding: var(--space-xl) var(--space-sm);
    color: rgba(250,248,245,0.5);
  }
</style>

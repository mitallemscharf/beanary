<script>
  import RatingStars from '$lib/components/RatingStars.svelte';

  let { data } = $props();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 17 ? 'Guten Tag' : 'Guten Abend';

  const chartW = 320;
  const chartH = 100;
  const barW = 26;
  const maxRating = 5;

  function barHeight(rating) {
    return (rating / maxRating) * chartH;
  }

  function barColorTop(rating) {
    if (rating >= 4) return '#6BAE7F';
    if (rating === 3) return '#EF9F27';
    return '#c47a7a';
  }

  function barColorBot(rating) {
    if (rating >= 4) return '#4A7C59';
    if (rating === 3) return '#a06b10';
    return '#8B3A3A';
  }

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('de-CH', { day: '2-digit', month: 'short' });
  }
</script>

<div class="page dashboard">
  <!-- Hero -->
  <div class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <p class="greeting">{greeting}</p>
      <h1 class="hero-title">Beanary</h1>
      <p class="hero-tagline">Dein persönliches Kaffee-Tagebuch</p>
    </div>
  </div>

  <!-- Metric Cards (overlap hero) -->
  <div class="metrics-grid">
    <div class="metric-card">
      <span class="metric-icon">☕</span>
      <span class="metric-value">{data.totalShots}</span>
      <span class="metric-label">Shots total</span>
    </div>
    <div class="metric-card">
      <span class="metric-icon" style="color:var(--amber)">★</span>
      <span class="metric-value">{data.avgRating > 0 ? data.avgRating.toFixed(1) : '—'}</span>
      <span class="metric-label">Ø Bewertung</span>
    </div>
    <div class="metric-card">
      <span class="metric-icon">♛</span>
      <span class="metric-value metric-value--sm">{data.bestBeanName ?? '—'}</span>
      <span class="metric-label">Beste Bohne</span>
    </div>
    <div class="metric-card">
      <span class="metric-icon" style="color:var(--green-light)">◎</span>
      <span class="metric-value">{data.activeBeans}</span>
      <span class="metric-label">Aktive Bohnen</span>
    </div>
  </div>

  <!-- Chart -->
  {#if data.chartData.length > 0}
    <section class="chart-section">
      <h2 class="section-title">Bewertungsverlauf</h2>
      <div class="chart-wrap">
        <svg
          viewBox="0 0 {chartW} {chartH + 28}"
          width="100%"
          aria-label="Bewertungsverlauf der letzten Shots"
        >
          <defs>
            {#each data.chartData as bar, i}
              <linearGradient id="grad{i}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color={barColorTop(bar.rating)} />
                <stop offset="100%" stop-color={barColorBot(bar.rating)} stop-opacity="0.6" />
              </linearGradient>
            {/each}
          </defs>
          {#each [1,2,3,4,5] as level}
            {@const gy = chartH - (level / maxRating) * chartH}
            <line x1="0" y1={gy} x2={chartW} y2={gy} stroke="rgba(255,255,255,0.05)" stroke-width="1" />
          {/each}
          {#each data.chartData as bar, i}
            {@const x = i * (barW + 8) + 4}
            {@const h = barHeight(bar.rating)}
            {@const y = chartH - h}
            <rect x={x} y={y} width={barW} height={h} rx="5" fill="url(#grad{i})" />
            <text
              x={x + barW / 2} y={chartH + 18}
              text-anchor="middle" font-size="8"
              fill="var(--text3)" font-family="var(--font-body)"
            >{bar.date}</text>
          {/each}
        </svg>
      </div>
    </section>
  {/if}

  <!-- Last 3 Shots -->
  {#if data.lastShots.length > 0}
    <section class="recent-section">
      <div class="section-header">
        <h2 class="section-title">Zuletzt geloggt</h2>
        <a href="/history" class="see-all">Alle ansehen →</a>
      </div>
      <div class="recent-list">
        {#each data.lastShots as shot (shot._id)}
          <a href="/beans/{shot.beanId}" class="recent-shot card">
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
              <span>{shot.extractionTime}s</span>
            </div>
          </a>
        {/each}
      </div>
    </section>
  {:else}
    <div class="empty-state" style="margin-top:var(--space-xl)">
      <p style="font-size:3rem">☕</p>
      <p>Noch keine Shots erfasst.</p>
      <a href="/log" class="btn btn-primary" style="margin-top:var(--space-md)">Ersten Shot loggen</a>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    padding-top: 0;
    padding-inline: 0;
  }

  /* ── Hero ── */
  .hero {
    position: relative;
    height: 300px;
    background-image: url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200');
    background-size: cover;
    background-position: center 55%;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(15, 12, 10, 0.2) 0%,
      rgba(15, 12, 10, 0.55) 50%,
      rgba(15, 12, 10, 0.85) 100%
    );
  }

  .hero-content {
    position: relative;
    z-index: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 var(--space-sm) var(--space-xl);
  }

  .greeting {
    font-size: 0.8rem;
    color: rgba(245, 230, 204, 0.65);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: 48px;
    font-weight: 500;
    color: var(--crema);
    line-height: 1;
    letter-spacing: 0.02em;
  }

  .hero-tagline {
    font-size: 0.875rem;
    color: var(--text2);
    margin-top: 6px;
  }

  /* ── Metrics (overlap hero) ── */
  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
    padding-inline: var(--space-sm);
    margin-top: -44px;
    position: relative;
    z-index: 10;
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
    color: var(--crema);
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
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text3);
  }

  /* ── Chart ── */
  .chart-section {
    padding-inline: var(--space-sm);
    margin-bottom: 2rem;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 1.3rem;
    color: var(--crema);
    margin-bottom: var(--space-sm);
  }

  .chart-wrap {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-sm) var(--space-sm) var(--space-xs);
    overflow-x: auto;
  }

  /* ── Recent ── */
  .recent-section {
    padding-inline: var(--space-sm);
    margin-bottom: 2rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-sm);
  }

  .see-all {
    font-size: 0.8rem;
    color: var(--text2);
    transition: color 0.15s;
  }
  .see-all:hover { color: var(--coffee-light); }

  .recent-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .recent-shot {
    display: block;
    text-decoration: none;
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

  .recent-date {
    font-size: 0.7rem;
    color: var(--text3);
  }

  .recent-shot__mid {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xs);
  }

  .recent-ratio {
    font-size: 0.8rem;
    color: var(--coffee-light);
    font-weight: 500;
  }

  .recent-params {
    display: flex;
    gap: var(--space-sm);
    font-size: 0.75rem;
    color: var(--text2);
  }
</style>

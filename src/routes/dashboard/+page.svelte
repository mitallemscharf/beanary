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

  <!-- ── HEADER ── -->
  <section class="dash-header">
    <p class="dash-eyebrow">{greeting} · {new Date().toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
    <h1 class="dash-wordmark">Beanary</h1>
    <div class="dash-rule"></div>
  </section>

  <!-- ── PHOTO STRIP ── -->
  <div class="photo-strip">
    <img src="/hero-bag-to-cup.webp" alt="" class="photo-strip__img" />
    <div class="photo-strip__overlay"></div>
  </div>

  <!-- ── CONTENT ── -->
  <section class="content">

    <!-- Metrics -->
    <div class="ruled-header" style="margin-top: var(--space-lg)">
      <span class="ruled-header__label">Übersicht</span>
    </div>

    <div class="metrics-grid">
      <div class="metric-tile">
        <span class="metric-tile__value">{data.totalShots}</span>
        <div class="metric-tile__footer">
          <span class="metric-tile__icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
          </span>
          <span class="metric-tile__label">Shots total</span>
        </div>
      </div>

      <div class="metric-tile">
        <span class="metric-tile__value metric-tile__value--amber">{data.avgRating > 0 ? data.avgRating.toFixed(1) : '—'}</span>
        <div class="metric-tile__footer">
          <span class="metric-tile__icon metric-tile__icon--amber">★</span>
          <span class="metric-tile__label">Ø Bewertung</span>
        </div>
      </div>

      <div class="metric-tile metric-tile--wide">
        <span class="metric-tile__value metric-tile__value--name">{data.bestBeanName ?? '—'}</span>
        <div class="metric-tile__footer">
          <span class="metric-tile__icon metric-tile__icon--gold">◎</span>
          <span class="metric-tile__label">Beste Bohne</span>
        </div>
      </div>

      <div class="metric-tile metric-tile--half">
        <span class="metric-tile__value">{data.activeBeans}</span>
        <div class="metric-tile__footer">
          <span class="metric-tile__icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-30 12 12)"/><path d="M12 6.5 Q9.5 12 12 17.5"/></svg>
          </span>
          <span class="metric-tile__label">Bohnen aktiv</span>
        </div>
      </div>
    </div>

    <!-- Rating Chart -->
    {#if data.chartData.length > 0}
      <div class="ruled-header">
        <span class="ruled-header__label">Verlauf</span>
      </div>
      <div class="chart-wrap">
        <svg viewBox="0 0 {chartW} {chartH + 22}" width="100%" preserveAspectRatio="xMinYMin meet">
          <defs>
            {#each data.chartData as bar, i}
              <linearGradient id="g{i}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color={barColor(bar.rating)} stop-opacity="0.85"/>
                <stop offset="100%" stop-color={barColor(bar.rating)} stop-opacity="0.15"/>
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
            <rect x={x} y={y} width={barW} height={h} rx="2" fill="url(#g{i})" />
            <text x={x + barW / 2} y={chartH + 16} text-anchor="middle" font-size="7"
              fill="rgba(240,232,220,0.28)" font-family="IBM Plex Mono, monospace">{bar.date}</text>
          {/each}
        </svg>
      </div>
    {/if}

    <!-- Recent Shots -->
    {#if data.lastShots.length > 0}
      <div class="ruled-header">
        <span class="ruled-header__label">Zuletzt geloggt</span>
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
              <span class="param-dot">·</span>
              <span>{shot.extractionTime}s</span>
              <span class="param-dot">·</span>
              <span>#{shot.grindSize}</span>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <p style="font-size:2rem; margin-bottom: var(--space-sm)">☕</p>
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
    animation: fadeIn 0.35s ease both;
  }

  /* ── HEADER ── */
  .dash-header {
    padding: calc(var(--space-lg) + var(--space-sm)) var(--space-sm) var(--space-md);
  }

  .dash-eyebrow {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 10px;
  }

  .dash-wordmark {
    font-family: var(--font-display);
    font-size: 58px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1;
    letter-spacing: -1.5px;
    margin-bottom: var(--space-md);
  }

  .dash-rule {
    height: 1px;
    background: var(--rule);
  }

  /* ── PHOTO STRIP ── */
  .photo-strip {
    position: relative;
    height: 160px;
    overflow: hidden;
  }

  .photo-strip__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 35%;
    display: block;
  }

  .photo-strip__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(11, 9, 7, 0.3) 0%,
      rgba(11, 9, 7, 0.0) 50%,
      rgba(11, 9, 7, 0.65) 100%
    );
  }

  /* ── CONTENT ── */
  .content {
    padding: 0 var(--space-sm) var(--space-lg);
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
    padding: 20px 18px 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--space-sm);
    min-height: 96px;
    transition: border-color 0.2s, transform 0.2s;
  }

  .metric-tile:hover {
    border-color: var(--border2);
    transform: translateY(-2px);
  }

  .metric-tile__value {
    font-family: var(--font-mono);
    font-size: 38px;
    font-weight: 400;
    color: var(--ink);
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .metric-tile__value--amber { color: var(--amber); }
  .metric-tile__value--gold  { color: var(--gold-light); }

  .metric-tile__value--name {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 500;
    letter-spacing: -0.01em;
    line-height: 1.2;
    color: var(--crema);
  }

  .metric-tile__footer {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .metric-tile__icon {
    font-size: 11px;
    color: var(--text3);
    display: flex;
    align-items: center;
  }

  .metric-tile__icon--amber { color: var(--amber); }
  .metric-tile__icon--gold  { color: var(--gold-light); }

  .metric-tile__label {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text3);
  }

  /* ── CHART ── */
  .chart-wrap {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-sm) var(--space-sm) 4px;
    overflow-x: auto;
    margin-bottom: var(--space-lg);
  }

  /* ── see-all link sits INSIDE ruled-header ── */
  .ruled-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: var(--space-lg);
  }

  .ruled-header::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--rule);
  }

  .ruled-header__label {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--text3);
    white-space: nowrap;
  }

  .see-all {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
    white-space: nowrap;
    order: 3;
    transition: color 0.15s;
    letter-spacing: 0.04em;
  }

  .see-all:hover { color: var(--coffee-light); }

  /* ── RECENT SHOTS ── */
  .recent-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
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
    background: var(--bg3);
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
    font-size: 10px;
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
    font-size: 11px;
    color: var(--coffee-light);
  }

  .recent-params {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text3);
  }

  .param-dot { color: var(--border2); }
</style>

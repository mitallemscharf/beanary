<script>
  import RatingStars from '$lib/components/RatingStars.svelte';

  let { data } = $props();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 17 ? 'Guten Tag' : 'Guten Abend';

  // SVG chart dimensions
  const chartW = 320;
  const chartH = 80;
  const barW = 24;
  const maxRating = 5;

  function barHeight(rating) {
    return (rating / maxRating) * chartH;
  }

  function barColor(rating) {
    if (rating >= 4) return 'var(--green)';
    if (rating === 3) return 'var(--amber)';
    return 'var(--red)';
  }

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('de-CH', { day: '2-digit', month: 'short' });
  }
</script>

<div class="page">
  <!-- Header -->
  <div class="page-header">
    <p class="greeting">{greeting},</p>
    <h1 class="logo">Beanary</h1>
    <p class="page-subtitle">Dein Kaffee-Tagebuch</p>
  </div>

  <!-- Metric Cards -->
  <div class="metrics-grid">
    <div class="metric-card">
      <span class="metric-value">{data.totalShots}</span>
      <span class="metric-label">Shots total</span>
    </div>
    <div class="metric-card">
      <span class="metric-value">
        {data.avgRating > 0 ? data.avgRating.toFixed(1) : '—'}
        {#if data.avgRating > 0}<span class="metric-unit">★</span>{/if}
      </span>
      <span class="metric-label">Ø Bewertung</span>
    </div>
    <div class="metric-card">
      <span class="metric-value metric-value--sm">{data.bestBeanName ?? '—'}</span>
      <span class="metric-label">Beste Bohne</span>
    </div>
    <div class="metric-card">
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
          viewBox="0 0 {chartW} {chartH + 24}"
          width="100%"
          aria-label="Bewertungsverlauf der letzten Shots"
        >
          {#each data.chartData as bar, i}
            {@const x = i * (barW + 8) + 4}
            {@const h = barHeight(bar.rating)}
            {@const y = chartH - h}
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx="4"
              fill={barColor(bar.rating)}
              opacity="0.85"
            />
            <text
              x={x + barW / 2}
              y={chartH + 16}
              text-anchor="middle"
              font-size="8"
              fill="var(--text3)"
              font-family="var(--font-body)"
            >{bar.date}</text>
          {/each}
        </svg>
      </div>
    </section>
  {/if}

  <!-- Last 3 Shots -->
  {#if data.lastShots.length > 0}
    <section class="recent-section">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-sm);">
        <h2 class="section-title">Zuletzt geloggt</h2>
        <a href="/history" style="font-size:0.8rem; color:var(--text2);">Alle ansehen →</a>
      </div>
      <div class="recent-list">
        {#each data.lastShots as shot (shot._id)}
          <a href="/beans/{shot.beanId}" class="recent-shot card">
            <div class="recent-shot__top">
              <span class="recent-bean">{shot.beanName}</span>
              <span class="recent-date">{formatDate(shot.createdAt)}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:var(--space-xs);">
              <RatingStars rating={shot.rating} readonly />
              {#if shot.brewRatio}
                <span class="recent-ratio">1:{shot.brewRatio}</span>
              {/if}
            </div>
            <div class="recent-params">
              <span>{shot.dose}g → {shot.yield}g</span>
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
  .greeting {
    font-size: 0.875rem;
    color: var(--text3);
    margin-bottom: 2px;
  }

  .logo {
    font-family: var(--font-display);
    font-size: 2.8rem;
    font-weight: 500;
    color: var(--crema);
    line-height: 1;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
    margin-bottom: var(--space-lg);
  }

  .metric-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-md);
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  .metric-value {
    font-family: var(--font-display);
    font-size: 2rem;
    color: var(--crema);
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .metric-value--sm {
    font-size: 1.1rem;
    white-space: normal;
    overflow: visible;
    line-height: 1.2;
  }

  .metric-unit {
    font-size: 1.2rem;
    color: var(--amber);
  }

  .metric-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text3);
  }

  .chart-section {
    margin-bottom: var(--space-lg);
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 1.2rem;
    color: var(--crema);
    margin-bottom: var(--space-sm);
  }

  .chart-wrap {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-sm);
    overflow-x: auto;
  }

  .recent-section {
    margin-bottom: var(--space-lg);
  }

  .recent-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .recent-shot {
    display: block;
    text-decoration: none;
    transition: border-color 0.15s;
  }

  .recent-shot:hover {
    border-color: rgba(196, 135, 74, 0.3);
  }

  .recent-shot__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .recent-bean {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--coffee-light);
  }

  .recent-date {
    font-size: 0.7rem;
    color: var(--text3);
  }

  .recent-ratio {
    font-size: 0.8rem;
    color: var(--coffee-light);
    font-weight: 500;
  }

  .recent-params {
    margin-top: var(--space-xs);
    display: flex;
    gap: var(--space-sm);
    font-size: 0.75rem;
    color: var(--text2);
  }
</style>

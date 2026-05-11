<script>
  import FreshnessIndicator from '$lib/components/FreshnessIndicator.svelte';
  import RatingStars from '$lib/components/RatingStars.svelte';
  import FlavorTags from '$lib/components/FlavorTags.svelte';
  import BrewRatioIndicator from '$lib/components/BrewRatioIndicator.svelte';

  let { data } = $props();

  const { bean, shots, sweetSpot } = $derived(data);

  const roastLevelLabel = { hell: 'Hell', medium: 'Medium', dunkel: 'Dunkel' };

  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('de-CH', { day: '2-digit', month: 'short', year: 'numeric' });
  }
</script>

<div class="bean-detail">

  <!-- Photo Hero -->
  <div class="bean-hero">
    <img src="/hero-grind.webp" alt="" class="bean-hero__img" />
    <div class="bean-hero__overlay"></div>
    <div class="bean-hero__top">
      <a href="/beans" class="back-btn" aria-label="Zurück">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      </a>
      <FreshnessIndicator roastDate={bean.roastDate} />
    </div>
    <div class="bean-hero__bottom">
      <p class="bean-hero__roaster">{bean.roaster}</p>
      <h1 class="bean-hero__name">{bean.name}</h1>
    </div>
  </div>

  <div class="bean-content">

    <!-- Info grid -->
    <div class="info-section">
      <div class="ruled-header">
        <span class="ruled-header__label">Details</span>
      </div>
      <div class="info-grid">
        {#if bean.origin}
          <div class="info-item">
            <span class="info-label">Herkunft</span>
            <span class="info-value">{bean.origin}</span>
          </div>
        {/if}
        {#if bean.roastDate}
          <div class="info-item">
            <span class="info-label">Röstdatum</span>
            <span class="info-value">{formatDate(bean.roastDate)}</span>
          </div>
        {/if}
        {#if bean.roastLevel}
          <div class="info-item">
            <span class="info-label">Röstgrad</span>
            <span class="info-value">{roastLevelLabel[bean.roastLevel] ?? bean.roastLevel}</span>
          </div>
        {/if}
        <div class="info-item">
          <span class="info-label">Shots</span>
          <span class="info-value">{shots.length}</span>
        </div>
      </div>
      {#if bean.flavorTags?.length}
        <div style="margin-top: var(--space-sm)">
          <FlavorTags selected={bean.flavorTags} readonly />
        </div>
      {/if}
      {#if bean.notes}
        <p class="bean-notes">{bean.notes}</p>
      {/if}
    </div>

    <!-- Sweet Spot -->
    {#if sweetSpot}
      <section class="sweet-section">
        <div class="ruled-header">
          <span class="ruled-header__label">Sweet Spot</span>
        </div>
        <div class="sweet-card">
          <div class="sweet-badge">Bester Shot</div>
          <div class="sweet-params">
            <div class="sweet-param">
              <span class="sweet-param__value">{sweetSpot.dose}g</span>
              <span class="sweet-param__label">Dosis</span>
            </div>
            <div class="sweet-divider"></div>
            <div class="sweet-param">
              <span class="sweet-param__value">{sweetSpot.yieldG}g</span>
              <span class="sweet-param__label">Yield</span>
            </div>
            <div class="sweet-divider"></div>
            <div class="sweet-param">
              <span class="sweet-param__value">{sweetSpot.extractionTime}s</span>
              <span class="sweet-param__label">Zeit</span>
            </div>
            <div class="sweet-divider"></div>
            <div class="sweet-param">
              <span class="sweet-param__value">{sweetSpot.grindSize}</span>
              <span class="sweet-param__label">Mahlgrad</span>
            </div>
          </div>
          <div class="sweet-footer">
            <RatingStars rating={sweetSpot.rating} readonly />
            <BrewRatioIndicator dose={sweetSpot.dose} yieldG={sweetSpot.yieldG} />
          </div>
        </div>
      </section>
    {/if}

    <!-- Shots -->
    <section class="shots-section">
      <div class="ruled-header">
        <span class="ruled-header__label">Shots ({shots.length})</span>
        <a href="/log" class="log-link">+ Shot loggen</a>
      </div>

      {#if shots.length === 0}
        <div class="empty-state">
          <p>Noch keine Shots für diese Bohne.</p>
        </div>
      {:else}
        <div class="shots-list">
          {#each shots as shot (shot._id)}
            <div class="shot-row">
              <div class="shot-row__top">
                <RatingStars rating={shot.rating} readonly />
                <span class="shot-date">{formatDate(shot.createdAt)}</span>
              </div>
              <div class="shot-params">
                <span>{shot.dose}g → {shot.yieldG}g</span>
                <span class="param-dot">·</span>
                <span>{shot.extractionTime}s</span>
                <span class="param-dot">·</span>
                <span>#{shot.grindSize}</span>
                {#if shot.brewRatio}
                  <span class="param-dot">·</span>
                  <span class="ratio-text">1:{shot.brewRatio}</span>
                {/if}
              </div>
              {#if shot.flavorTags?.length}
                <div style="margin-top: 8px">
                  <FlavorTags selected={shot.flavorTags} readonly />
                </div>
              {/if}
              {#if shot.notes}
                <p class="shot-notes">{shot.notes}</p>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </section>

  </div>
</div>

<style>
  .bean-detail {
    min-height: 100dvh;
    padding-bottom: calc(var(--nav-height) + var(--space-sm));
    animation: fadeIn 0.35s ease both;
  }

  /* ── Hero ── */
  .bean-hero {
    position: relative;
    height: 260px;
    overflow: hidden;
  }

  .bean-hero__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .bean-hero__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(15, 10, 5, 0.35) 0%,
      rgba(15, 10, 5, 0.15) 45%,
      rgba(15, 10, 5, 0.85) 100%
    );
  }

  .bean-hero__top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-sm);
  }

  .bean-hero__bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-sm) var(--space-sm) var(--space-lg);
  }

  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    background: rgba(15, 10, 5, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(250, 248, 245, 0.9);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: background 0.15s;
  }

  .back-btn:hover {
    background: rgba(15, 10, 5, 0.8);
  }

  .bean-hero__roaster {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: rgba(250, 248, 245, 0.5);
    margin-bottom: 4px;
  }

  .bean-hero__name {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 7vw, 2.5rem);
    font-weight: 500;
    color: var(--ink);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  /* ── Content ── */
  .bean-content {
    padding: var(--space-lg) var(--space-sm) 0;
  }

  /* ── Ruled header (scoped override) ── */
  .ruled-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: var(--space-md);
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

  /* ── Info section ── */
  .info-section {
    margin-bottom: var(--space-lg);
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 16px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .info-label {
    font-family: var(--font-mono);
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text3);
  }

  .info-value {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text);
  }

  .bean-notes {
    margin-top: var(--space-sm);
    font-size: 13px;
    color: var(--text2);
    font-style: italic;
    line-height: 1.6;
  }

  /* ── Sweet Spot ── */
  .sweet-section {
    margin-bottom: var(--space-lg);
  }

  .sweet-card {
    background: rgba(196, 135, 74, 0.06);
    border: 1px solid rgba(196, 135, 74, 0.2);
    border-radius: var(--radius);
    padding: 18px 16px 16px;
  }

  .sweet-badge {
    display: inline-flex;
    align-items: center;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--gold-light);
    background: rgba(196, 135, 74, 0.1);
    border: 1px solid rgba(196, 135, 74, 0.2);
    border-radius: var(--radius-full);
    padding: 2px 10px;
    margin-bottom: var(--space-sm);
  }

  .sweet-params {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: var(--space-sm);
  }

  .sweet-param {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    flex: 1;
  }

  .sweet-param__value {
    font-family: var(--font-mono);
    font-size: 18px;
    color: var(--crema);
    font-weight: 400;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .sweet-param__label {
    font-family: var(--font-mono);
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text3);
  }

  .sweet-divider {
    width: 1px;
    height: 28px;
    background: rgba(196, 135, 74, 0.15);
    flex-shrink: 0;
  }

  .sweet-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-sm);
    border-top: 1px solid rgba(196, 135, 74, 0.1);
  }

  /* ── Shots ── */
  .shots-section {
    margin-bottom: var(--space-xl);
  }

  .log-link {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--coffee-light);
    letter-spacing: 0.06em;
    order: 3;
    transition: color 0.15s;
  }

  .log-link:hover { color: var(--crema); }

  .shots-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .shot-row {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 14px 16px;
    transition: border-color 0.2s;
  }

  .shot-row:hover {
    border-color: var(--border2);
  }

  .shot-row__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .shot-date {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text3);
  }

  .shot-params {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text2);
    flex-wrap: wrap;
  }

  .param-dot { color: var(--border2); }

  .ratio-text {
    color: var(--coffee-light);
  }

  .shot-notes {
    margin-top: 8px;
    font-size: 12px;
    color: var(--text2);
    font-style: italic;
    line-height: 1.5;
  }
</style>

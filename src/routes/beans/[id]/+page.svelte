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

<div class="page">
  <div class="page-header" style="display:flex; align-items:center; gap:var(--space-sm);">
    <a href="/beans" class="back-btn" aria-label="Zurück">←</a>
    <div style="flex:1; min-width:0;">
      <h1 class="page-title">{bean.name}</h1>
      <p class="page-subtitle">{bean.roaster}</p>
    </div>
    <FreshnessIndicator roastDate={bean.roastDate} />
  </div>

  <!-- Bean Info -->
  <div class="card bean-info">
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
      <div style="margin-top:var(--space-sm)">
        <FlavorTags selected={bean.flavorTags} readonly />
      </div>
    {/if}
    {#if bean.notes}
      <p class="bean-notes">{bean.notes}</p>
    {/if}
  </div>

  <!-- Sweet Spot -->
  {#if sweetSpot}
    <section class="sweet-spot-section">
      <h2 class="section-title">⭐ Sweet Spot</h2>
      <div class="card sweet-spot-card">
        <div class="sweet-spot-row">
          <div class="sweet-param">
            <span class="param-label">Dosis</span>
            <span class="param-value">{sweetSpot.dose}g</span>
          </div>
          <div class="sweet-param">
            <span class="param-label">Yield</span>
            <span class="param-value">{sweetSpot.yieldG}g</span>
          </div>
          <div class="sweet-param">
            <span class="param-label">Zeit</span>
            <span class="param-value">{sweetSpot.extractionTime}s</span>
          </div>
          <div class="sweet-param">
            <span class="param-label">Mahlgrad</span>
            <span class="param-value">{sweetSpot.grindSize}</span>
          </div>
        </div>
        <div style="margin-top:var(--space-sm); display:flex; align-items:center; justify-content:space-between;">
          <RatingStars rating={sweetSpot.rating} readonly />
          <BrewRatioIndicator dose={sweetSpot.dose} yieldG={sweetSpot.yieldG} />
        </div>
      </div>
    </section>
  {/if}

  <!-- Shots -->
  <section>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-sm);">
      <h2 class="section-title">Shots ({shots.length})</h2>
      <a href="/log" class="btn btn-secondary" style="font-size:0.8rem; padding:0.4rem 0.75rem;">+ Shot</a>
    </div>

    {#if shots.length === 0}
      <div class="empty-state">
        <p>Noch keine Shots für diese Bohne.</p>
      </div>
    {:else}
      <div class="shots-list">
        {#each shots as shot (shot._id)}
          <div class="shot-row card">
            <div class="shot-row__top">
              <RatingStars rating={shot.rating} readonly />
              <span class="shot-date">{formatDate(shot.createdAt)}</span>
            </div>
            <div class="shot-params">
              <span>{shot.dose}g → {shot.yieldG}g</span>
              <span>{shot.extractionTime}s</span>
              <span>#{shot.grindSize}</span>
              {#if shot.brewRatio}
                <span class="ratio-text">1:{shot.brewRatio}</span>
              {/if}
            </div>
            {#if shot.flavorTags?.length}
              <div style="margin-top:var(--space-xs)">
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

<style>
  .back-btn {
    font-size: 1.4rem;
    color: var(--text2);
    line-height: 1;
    padding: var(--space-xs);
    flex-shrink: 0;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .info-label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text3);
  }

  .info-value {
    font-size: 0.95rem;
    color: var(--text);
    font-weight: 500;
  }

  .bean-info {
    margin-bottom: var(--space-lg);
  }

  .bean-notes {
    margin-top: var(--space-sm);
    font-size: 0.875rem;
    color: var(--text2);
    font-style: italic;
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 1.2rem;
    color: var(--crema);
    margin-bottom: var(--space-sm);
  }

  .sweet-spot-section {
    margin-bottom: var(--space-lg);
  }

  .sweet-spot-card {
    border-color: rgba(239, 159, 39, 0.25);
    background: rgba(239, 159, 39, 0.05);
  }

  .sweet-spot-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-xs);
  }

  .sweet-param {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: center;
  }

  .param-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text3);
  }

  .param-value {
    font-family: var(--font-display);
    font-size: 1.2rem;
    color: var(--crema);
  }

  .shots-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }

  .shot-row__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xs);
  }

  .shot-date {
    font-size: 0.75rem;
    color: var(--text3);
  }

  .shot-params {
    display: flex;
    gap: var(--space-sm);
    font-size: 0.8rem;
    color: var(--text2);
    flex-wrap: wrap;
  }

  .ratio-text {
    color: var(--coffee-light);
    font-weight: 500;
  }

  .shot-notes {
    margin-top: var(--space-xs);
    font-size: 0.8rem;
    color: var(--text2);
    font-style: italic;
  }
</style>

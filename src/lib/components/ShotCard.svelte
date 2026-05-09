<script>
  import RatingStars from './RatingStars.svelte';
  import FlavorTags from './FlavorTags.svelte';

  let { shot, beanName = '', isBest = false } = $props();

  const dotColor = $derived(() => {
    if (shot.rating >= 4) return 'green';
    if (shot.rating === 3) return 'amber';
    return 'red';
  });

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('de-CH', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }
</script>

<div class="shot-card card">
  <div class="shot-card__header">
    <div style="display:flex; align-items:center; gap:var(--space-xs);">
      <span class="dot dot--{dotColor()}"></span>
      {#if beanName}
        <span class="bean-name">{beanName}</span>
      {/if}
      {#if isBest}
        <span class="best-badge">Best Shot</span>
      {/if}
    </div>
    <span class="shot-time">{formatDate(shot.createdAt)}</span>
  </div>

  <div class="shot-card__rating">
    <RatingStars rating={shot.rating} readonly />
  </div>

  <div class="shot-params">
    <div class="param">
      <span class="param-label">Dosis</span>
      <span class="param-value">{shot.dose}g</span>
    </div>
    <div class="param">
      <span class="param-label">Yield</span>
      <span class="param-value">{shot.yield}g</span>
    </div>
    <div class="param">
      <span class="param-label">Zeit</span>
      <span class="param-value">{shot.extractionTime}s</span>
    </div>
    <div class="param">
      <span class="param-label">Mahlgrad</span>
      <span class="param-value">{shot.grindSize}</span>
    </div>
    {#if shot.brewRatio}
      <div class="param">
        <span class="param-label">Ratio</span>
        <span class="param-value ratio">1:{shot.brewRatio}</span>
      </div>
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

<style>
  .shot-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xs);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .dot--green  { background: var(--green-light); }
  .dot--amber  { background: var(--amber); }
  .dot--red    { background: #c47a7a; }

  .bean-name {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--coffee-light);
  }

  .best-badge {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    background: rgba(239, 159, 39, 0.2);
    color: var(--amber);
    border: 1px solid rgba(239, 159, 39, 0.35);
    border-radius: 999px;
    padding: 0.1rem 0.5rem;
  }

  .shot-time {
    font-size: 0.7rem;
    color: var(--text3);
  }

  .shot-card__rating {
    margin-bottom: var(--space-xs);
  }

  .shot-params {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-sm);
  }

  .param {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .param-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--text3);
  }

  .param-value {
    font-size: 0.875rem;
    color: var(--text);
    font-weight: 500;
  }

  .ratio { color: var(--coffee-light); }

  .shot-notes {
    margin-top: var(--space-xs);
    font-size: 0.8rem;
    color: var(--text2);
    font-style: italic;
  }
</style>

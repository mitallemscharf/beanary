<script>
  import RatingStars from './RatingStars.svelte';
  import FlavorTags from './FlavorTags.svelte';

  let { shot, beanName = '', isBest = false } = $props();

  const accentClass = $derived.by(() => {
    if (shot.rating >= 4) return 'accent--green';
    if (shot.rating === 3) return 'accent--amber';
    return 'accent--red';
  });

  function formatDate(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('de-CH', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit'
    });
  }
</script>

<div class="shot-card card {accentClass}">
  <div class="shot-card__header">
    <div class="shot-card__left">
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
      <span class="param-label">Dose</span>
      <span class="param-value">{shot.dose}g</span>
    </div>
    <div class="param-sep">→</div>
    <div class="param">
      <span class="param-label">Yield</span>
      <span class="param-value">{shot.yieldG}g</span>
    </div>
    <div class="param-divider"></div>
    <div class="param">
      <span class="param-label">Zeit</span>
      <span class="param-value">{shot.extractionTime}s</span>
    </div>
    <div class="param-divider"></div>
    <div class="param">
      <span class="param-label">Mahlgrad</span>
      <span class="param-value">{shot.grindSize}</span>
    </div>
    {#if shot.brewRatio}
      <div class="param-divider"></div>
      <div class="param">
        <span class="param-label">Ratio</span>
        <span class="param-value param-value--ratio">1:{shot.brewRatio}</span>
      </div>
    {/if}
  </div>

  {#if shot.flavorTags?.length}
    <div class="shot-tags">
      <FlavorTags selected={shot.flavorTags} readonly />
    </div>
  {/if}

  {#if shot.notes}
    <p class="shot-notes">{shot.notes}</p>
  {/if}
</div>

<style>
  .shot-card {
    border-left-width: 3px;
    border-left-style: solid;
    transition: all 0.2s ease;
  }

  .shot-card:hover {
    transform: translateX(2px);
  }

  .accent--green { border-left-color: var(--green-light); }
  .accent--amber { border-left-color: var(--amber); }
  .accent--red   { border-left-color: #c47a7a; }

  .shot-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-xs);
    gap: var(--space-xs);
  }

  .shot-card__left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    min-width: 0;
  }

  .bean-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--coffee-light);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .best-badge {
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: rgba(74, 124, 89, 0.2);
    color: var(--green-light);
    border-radius: var(--radius-full);
    padding: 3px 8px;
    flex-shrink: 0;
  }

  .shot-time {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text3);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .shot-card__rating {
    margin-bottom: 10px;
  }

  .shot-params {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    row-gap: 8px;
  }

  .param {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .param-sep {
    font-size: 12px;
    color: var(--text3);
    align-self: flex-end;
    padding-bottom: 2px;
  }

  .param-divider {
    width: 1px;
    height: 24px;
    background: var(--border);
    align-self: center;
  }

  .param-label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text3);
    font-weight: 500;
  }

  .param-value {
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text);
    font-weight: 400;
    line-height: 1.2;
  }

  .param-value--ratio { color: var(--coffee-light); }

  .shot-tags { margin-top: var(--space-xs); }

  .shot-notes {
    margin-top: var(--space-xs);
    font-size: 12px;
    color: var(--text2);
    font-style: italic;
    line-height: 1.5;
    border-top: 1px solid var(--border);
    padding-top: var(--space-xs);
  }
</style>

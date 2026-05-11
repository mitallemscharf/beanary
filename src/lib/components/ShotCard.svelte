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

<div class="shot-card {accentClass}">
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
    <span class="param-arrow">→</span>
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
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border);
    border-left-width: 2px;
    border-left-style: solid;
    border-radius: var(--radius);
    padding: 16px;
    transition: border-color 0.2s, transform 0.2s;
  }

  .shot-card:hover {
    transform: translateX(2px);
    border-top-color: var(--border2);
    border-right-color: var(--border2);
    border-bottom-color: var(--border2);
  }

  .accent--green { border-left-color: var(--green-light); }
  .accent--amber { border-left-color: var(--amber); }
  .accent--red   { border-left-color: #c47a7a; }

  .shot-card__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
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
    font-family: var(--font-mono);
    font-size: 8px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    background: rgba(74, 124, 89, 0.18);
    color: var(--green-light);
    border: 1px solid rgba(74, 124, 89, 0.28);
    border-radius: var(--radius-full);
    padding: 2px 8px;
    flex-shrink: 0;
  }

  .shot-time {
    font-family: var(--font-mono);
    font-size: 10px;
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

  .param-arrow {
    font-size: 11px;
    color: var(--text3);
    align-self: flex-end;
    padding-bottom: 2px;
    letter-spacing: 0;
  }

  .param-divider {
    width: 1px;
    height: 22px;
    background: var(--border);
    align-self: center;
  }

  .param-label {
    font-family: var(--font-mono);
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text3);
  }

  .param-value {
    font-family: var(--font-mono);
    font-size: 14px;
    color: var(--text);
    line-height: 1.2;
  }

  .param-value--ratio { color: var(--coffee-light); }

  .shot-tags { margin-top: 10px; }

  .shot-notes {
    margin-top: 10px;
    font-size: 12px;
    color: var(--text2);
    font-style: italic;
    line-height: 1.5;
    border-top: 1px solid var(--border);
    padding-top: 8px;
  }
</style>

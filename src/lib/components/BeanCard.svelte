<script>
  import FreshnessIndicator from './FreshnessIndicator.svelte';

  let { bean } = $props();
</script>

<a href="/beans/{bean._id}" class="bean-card">
  <div class="bean-card__top">
    <div>
      <h3 class="bean-card__name">{bean.name}</h3>
      <p class="bean-card__roaster">{bean.roaster}</p>
    </div>
    <FreshnessIndicator roastDate={bean.roastDate} />
  </div>

  {#if bean.flavorTags?.length}
    <div class="bean-card__tags">
      {#each bean.flavorTags as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
  {/if}

  <div class="bean-card__footer">
    <span class="stat">
      <span class="stat__value">{bean.shotCount ?? 0}</span>
      <span class="stat__label">Shots</span>
    </span>
    {#if bean.roastLevel}
      <span class="roast-badge">{bean.roastLevel}</span>
    {/if}
    {#if bean.avgRating}
      <span class="stat">
        <span class="stat__value">★ {bean.avgRating.toFixed(1)}</span>
        <span class="stat__label">Ø Bewertung</span>
      </span>
    {/if}
  </div>
</a>

<style>
  .bean-card {
    display: block;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-md);
    transition: border-color 0.15s, transform 0.1s;
    text-decoration: none;
  }

  .bean-card:hover {
    border-color: rgba(196, 135, 74, 0.3);
    transform: translateY(-1px);
  }

  .bean-card__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-sm);
  }

  .bean-card__name {
    font-family: var(--font-display);
    font-size: 1.3rem;
    color: var(--crema);
    font-weight: 500;
  }

  .bean-card__roaster {
    font-size: 0.8rem;
    color: var(--text2);
    margin-top: 2px;
  }

  .bean-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-bottom: var(--space-sm);
  }

  .tag {
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--text2);
  }

  .bean-card__footer {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    border-top: 1px solid var(--border);
    padding-top: var(--space-sm);
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .stat__value {
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--text);
  }

  .stat__label {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text3);
  }

  .roast-badge {
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
    background: rgba(139, 90, 43, 0.15);
    border: 1px solid rgba(139, 90, 43, 0.3);
    border-radius: 999px;
    color: var(--coffee-light);
    text-transform: capitalize;
  }
</style>

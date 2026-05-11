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
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-md);
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    text-decoration: none;
    background-color: var(--bg2);
    background-image: url('https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=60');
    background-size: cover;
    background-position: center;
  }

  .bean-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(18, 14, 10, 0.91);
    transition: background 0.2s;
    z-index: 0;
  }

  .bean-card:hover {
    border-color: rgba(196, 135, 74, 0.35);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.4);
  }

  .bean-card:hover::before {
    background: rgba(18, 14, 10, 0.86);
  }

  .bean-card__top,
  .bean-card__tags,
  .bean-card__footer {
    position: relative;
    z-index: 1;
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

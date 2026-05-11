<script>
  import FreshnessIndicator from './FreshnessIndicator.svelte';

  let { bean } = $props();
</script>

<a href="/beans/{bean._id}" class="bean-card">
  <div class="bean-card__image">
    <div class="bean-card__image-gradient"></div>
    {#if bean.roastLevel}
      <span class="roast-pill">{bean.roastLevel}</span>
    {/if}
  </div>

  <div class="bean-card__body">
    <div class="bean-card__top">
      <div class="bean-card__names">
        <h3 class="bean-card__name">{bean.name}</h3>
        <p class="bean-card__roaster">{bean.roaster}</p>
      </div>
      <FreshnessIndicator roastDate={bean.roastDate} />
    </div>

    {#if bean.flavorTags?.length}
      <div class="bean-card__tags">
        {#each bean.flavorTags.slice(0, 3) as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}

    <div class="bean-card__footer">
      <div class="stat">
        <span class="stat__value">{bean.shotCount ?? 0}</span>
        <span class="stat__label">Shots</span>
      </div>
      {#if bean.avgRating}
        <div class="stat">
          <span class="stat__value stat__value--amber">★ {bean.avgRating.toFixed(1)}</span>
          <span class="stat__label">Ø</span>
        </div>
      {/if}
    </div>
  </div>
</a>

<style>
  .bean-card {
    display: block;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    text-decoration: none;
    transition: all 0.25s ease;
  }

  .bean-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
    border-color: var(--border2);
  }

  .bean-card__image {
    height: 130px;
    background-image: url('/bean-card-bg.webp');
    background-size: cover;
    background-position: center;
    position: relative;
  }

  .bean-card__image-gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 30%, var(--bg2) 100%);
  }

  .roast-pill {
    position: absolute;
    top: 10px;
    right: 10px;
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 3px 8px;
    background: rgba(15, 12, 10, 0.7);
    border: 1px solid var(--border2);
    border-radius: var(--radius-full);
    color: var(--coffee-light);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .bean-card__body {
    padding: 14px 16px 16px;
  }

  .bean-card__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
    gap: var(--space-xs);
  }

  .bean-card__names { flex: 1; min-width: 0; }

  .bean-card__name {
    font-family: var(--font-display);
    font-size: 20px;
    color: var(--crema);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bean-card__roaster {
    font-size: 12px;
    color: var(--text3);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bean-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-bottom: 10px;
  }

  .tag {
    font-size: 10px;
    padding: 3px 8px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    color: var(--text3);
    font-weight: 400;
    line-height: 1.4;
  }

  .bean-card__footer {
    display: flex;
    align-items: center;
    gap: var(--space-md);
    border-top: 1px solid var(--border);
    padding-top: 10px;
  }

  .stat {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .stat__value {
    font-family: var(--font-mono);
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    line-height: 1;
  }

  .stat__value--amber { color: var(--amber); }

  .stat__label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text3);
    font-weight: 500;
  }
</style>

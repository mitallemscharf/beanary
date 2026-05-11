<script>
  import FreshnessIndicator from './FreshnessIndicator.svelte';

  let { bean } = $props();
</script>

<a href="/beans/{bean._id}" class="bean-card">
  <div class="bean-card__image">
    <div class="bean-card__gradient"></div>
    {#if bean.roastLevel}
      <span class="roast-pill">{bean.roastLevel}</span>
    {/if}
  </div>

  <div class="bean-card__body">
    <div class="bean-card__freshness">
      <FreshnessIndicator roastDate={bean.roastDate} />
    </div>

    <h3 class="bean-card__name">{bean.name}</h3>
    <p class="bean-card__roaster">{bean.roaster}</p>

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
    transform: translateY(-5px);
    box-shadow: 0 20px 48px rgba(0, 0, 0, 0.55);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .bean-card__image {
    height: 110px;
    background-image: url('/bean-card-bg.webp');
    background-size: cover;
    background-position: center;
    position: relative;
  }

  .bean-card__gradient {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(11, 9, 7, 0.1) 0%,
      rgba(26, 21, 16, 0.85) 100%
    );
  }

  .roast-pill {
    position: absolute;
    bottom: 10px;
    left: 12px;
    font-family: var(--font-mono);
    font-size: 8px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 3px 8px;
    background: rgba(15, 12, 10, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--radius-full);
    color: var(--text3);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .bean-card__body {
    padding: 12px 14px 14px;
  }

  .bean-card__freshness {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
  }

  .bean-card__name {
    font-family: var(--font-display);
    font-size: 1.25rem;
    color: var(--ink);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -0.01em;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bean-card__roaster {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text3);
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bean-card__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 10px;
  }

  .tag {
    font-family: var(--font-mono);
    font-size: 9px;
    padding: 2px 7px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    color: var(--text3);
    line-height: 1.4;
    letter-spacing: 0.04em;
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
    font-size: 15px;
    font-weight: 400;
    color: var(--text);
    line-height: 1;
  }

  .stat__value--amber { color: var(--amber); }

  .stat__label {
    font-family: var(--font-mono);
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text3);
  }
</style>

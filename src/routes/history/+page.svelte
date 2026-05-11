<script>
  import ShotCard from '$lib/components/ShotCard.svelte';
  import { goto } from '$app/navigation';

  let { data } = $props();

  const bestShotSet = $derived(new Set(data.bestShotIds));

  const grouped = $derived.by(() => {
    const groups = new Map();
    for (const shot of data.shots) {
      const key = new Date(shot.createdAt).toLocaleDateString('de-CH', {
        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
      });
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(shot);
    }
    return [...groups.entries()];
  });

  function onFilterChange(e) {
    const val = e.target.value;
    goto(val ? `?bean=${val}` : '/history', { keepFocus: true });
  }
</script>

<div class="page">
  <div class="page-header">
    <h1 class="page-title">History</h1>
    <p class="page-subtitle"><span class="mono">{data.shots.length}</span> Shot{data.shots.length !== 1 ? 's' : ''} erfasst</p>
  </div>

  <!-- Filter -->
  <div class="filter-row">
    <div class="filter-wrap">
      <svg class="filter-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
      <select onchange={onFilterChange} value={data.beanFilter} class="filter-select">
        <option value="">Alle Bohnen</option>
        {#each data.beans as bean}
          <option value={bean._id}>{bean.name}</option>
        {/each}
      </select>
    </div>
  </div>

  {#if data.shots.length === 0}
    <div class="empty-state">
      <p style="font-size:2rem; margin-bottom: var(--space-sm)">📋</p>
      <p>Noch keine Shots erfasst.</p>
      <a href="/log" class="btn btn-primary" style="margin-top:var(--space-md)">Ersten Shot loggen</a>
    </div>
  {:else}
    {#each grouped as [date, shots]}
      <section class="date-group">
        <div class="date-header">
          <span class="date-label">{date}</span>
          <span class="date-count">{shots.length}</span>
        </div>
        <div class="shots-list">
          {#each shots as shot (shot._id)}
            <ShotCard
              {shot}
              beanName={data.beanMap[shot.beanId] ?? ''}
              isBest={bestShotSet.has(shot._id)}
            />
          {/each}
        </div>
      </section>
    {/each}
  {/if}
</div>

<style>
  .page-subtitle .mono {
    font-family: var(--font-mono);
  }

  .filter-row {
    margin-bottom: var(--space-lg);
  }

  .filter-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .filter-icon {
    position: absolute;
    left: 14px;
    color: var(--text3);
    pointer-events: none;
    z-index: 1;
  }

  .filter-select {
    padding-left: 36px;
  }

  .date-group {
    margin-bottom: var(--space-xl);
  }

  .date-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: var(--space-sm);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--border);
  }

  .date-header::after {
    content: '';
    flex: 1;
    height: 1px;
    /* already handled by border-bottom on parent, just spacer */
    display: none;
  }

  .date-label {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--text3);
    line-height: 1.4;
  }

  .date-count {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--text3);
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    padding: 1px 7px;
    letter-spacing: 0.04em;
    opacity: 0.7;
  }

  .shots-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>

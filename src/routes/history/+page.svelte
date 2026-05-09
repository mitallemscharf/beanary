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
    <p class="page-subtitle">{data.shots.length} Shot{data.shots.length !== 1 ? 's' : ''}</p>
  </div>

  <!-- Filter -->
  <div class="filter-row">
    <select onchange={onFilterChange} value={data.beanFilter}>
      <option value="">Alle Bohnen</option>
      {#each data.beans as bean}
        <option value={bean._id}>{bean.name}</option>
      {/each}
    </select>
  </div>

  {#if data.shots.length === 0}
    <div class="empty-state">
      <p style="font-size:2rem">📋</p>
      <p>Noch keine Shots erfasst.</p>
      <a href="/log" class="btn btn-primary" style="margin-top:var(--space-md)">Ersten Shot loggen</a>
    </div>
  {:else}
    {#each grouped as [date, shots]}
      <section class="date-group">
        <h2 class="date-label">{date}</h2>
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
  .filter-row {
    margin-bottom: var(--space-lg);
  }

  .date-group {
    margin-bottom: var(--space-lg);
  }

  .date-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text3);
    margin-bottom: var(--space-sm);
    padding-bottom: var(--space-xs);
    border-bottom: 1px solid var(--border);
  }

  .shots-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }
</style>

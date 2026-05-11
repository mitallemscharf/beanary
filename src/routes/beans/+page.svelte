<script>
  import BeanCard from '$lib/components/BeanCard.svelte';

  let { data } = $props();
</script>

<div class="page">
  <div class="page-header beans-header">
    <div>
      <h1 class="page-title">Bohnen</h1>
      <p class="page-subtitle">{data.beans.length} erfasst</p>
    </div>
    <a href="/beans/new" class="btn btn-primary add-btn">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Neue Bohne
    </a>
  </div>

  {#if data.beans.length === 0}
    <div class="empty-state">
      <p style="font-size:2rem">🫘</p>
      <p>Noch keine Bohnen erfasst.</p>
      <a href="/beans/new" class="btn btn-primary" style="margin-top: var(--space-md)">Erste Bohne hinzufügen</a>
    </div>
  {:else}
    <div class="beans-grid">
      {#each data.beans as bean (bean._id)}
        <BeanCard {bean} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .beans-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .add-btn {
    height: 40px;
    padding: 0 16px;
    font-size: 13px;
    gap: 6px;
    flex-shrink: 0;
  }

  .beans-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
</style>

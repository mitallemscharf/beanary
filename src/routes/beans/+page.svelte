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
    <a href="/beans/new" class="add-btn">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Neue Bohne
    </a>
  </div>

  {#if data.beans.length === 0}
    <div class="empty-state">
      <p style="font-size:2rem; margin-bottom: var(--space-sm)">🫘</p>
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 16px;
    background: var(--coffee);
    color: var(--on-coffee);
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 500;
    border-radius: var(--radius);
    letter-spacing: 0.02em;
    transition: background 0.2s, box-shadow 0.2s;
    flex-shrink: 0;
  }

  .add-btn:hover {
    background: var(--coffee-light);
    box-shadow: 0 6px 20px rgba(139, 90, 43, 0.4);
  }

  .beans-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
</style>

<script>
  import BeanCard from '$lib/components/BeanCard.svelte';

  let { data } = $props();
</script>

<div class="page">
  <div class="page-header" style="display:flex; justify-content:space-between; align-items:center;">
    <div>
      <h1 class="page-title">Bohnen</h1>
      <p class="page-subtitle">{data.beans.length} erfasst</p>
    </div>
    <a href="/beans/new" class="btn btn-primary">+ Neue Bohne</a>
  </div>

  {#if data.beans.length === 0}
    <div class="empty-state">
      <p style="font-size:2rem">☕</p>
      <p>Noch keine Bohnen erfasst.</p>
      <a href="/beans/new" class="btn btn-primary" style="margin-top: var(--space-md)">Erste Bohne hinzufügen</a>
    </div>
  {:else}
    <div class="beans-list">
      {#each data.beans as bean (bean._id)}
        <BeanCard {bean} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .beans-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
  }
</style>

<script>
  const ALL_TAGS = ['Süss', 'Sauer', 'Bitter', 'Ausgewogen', 'Vollmundig', 'Fruchtig', 'Schokoladig', 'Nussig'];

  let { selected = $bindable([]), readonly = false, tags = ALL_TAGS } = $props();

  function toggle(tag) {
    if (readonly) return;
    if (selected.includes(tag)) {
      selected = selected.filter(t => t !== tag);
    } else {
      selected = [...selected, tag];
    }
  }
</script>

<div class="flavor-tags">
  {#each tags as tag}
    <button
      type="button"
      class="tag"
      class:active={selected.includes(tag)}
      onclick={() => toggle(tag)}
      disabled={readonly}
    >
      {tag}
    </button>
  {/each}
</div>

<style>
  .flavor-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
  }

  .tag {
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 400;
    border: 1px solid var(--border);
    color: var(--text2);
    background: var(--bg3);
    transition: all 0.15s;
  }

  .tag.active {
    background: rgba(139, 90, 43, 0.25);
    border-color: var(--coffee);
    color: var(--crema);
  }

  .tag:not(:disabled):hover {
    border-color: var(--coffee-light);
    color: var(--text);
  }

  .tag:disabled {
    cursor: default;
  }
</style>

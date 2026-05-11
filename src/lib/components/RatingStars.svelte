<script>
  let { rating = $bindable(0), readonly = false } = $props();
</script>

<div class="stars" class:readonly>
  {#each [1, 2, 3, 4, 5] as star}
    <button
      type="button"
      class="star"
      class:filled={star <= rating}
      onclick={() => { if (!readonly) rating = star; }}
      aria-label="Bewertung {star} von 5"
      disabled={readonly}
    >
      ★
    </button>
  {/each}
</div>

<style>
  .stars {
    display: flex;
    gap: 4px;
  }

  .star {
    font-size: 36px;
    color: var(--text3);
    transition: color 0.12s, transform 0.12s;
    line-height: 1;
    padding: 0 3px;
  }

  .star.filled {
    color: var(--amber);
  }

  .stars:not(.readonly) .star:hover {
    color: var(--coffee-light);
    transform: scale(1.15);
  }

  .stars:not(.readonly) .star:active {
    transform: scale(0.95);
  }

  .stars.readonly .star {
    cursor: default;
    font-size: 1.1rem;
    padding: 0 1px;
  }
</style>

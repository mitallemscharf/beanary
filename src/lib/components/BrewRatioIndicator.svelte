<script>
  let { dose = 0, yieldG = 0 } = $props();

  const ratio = $derived(dose > 0 && yieldG > 0 ? yieldG / dose : null);

  const status = $derived.by(() => {
    if (!ratio) return 'neutral';
    if (ratio >= 1.8 && ratio <= 2.2) return 'green';
    if ((ratio >= 1.5 && ratio < 1.8) || (ratio > 2.2 && ratio <= 2.5)) return 'amber';
    return 'red';
  });

  const label = $derived.by(() => {
    if (!ratio) return '—';
    return ratio.toFixed(2);
  });

  const hint = $derived.by(() => {
    if (!ratio) return 'Dosis und Yield eingeben';
    if (status === 'green') return 'Optimal';
    if (status === 'amber') return 'Akzeptabel';
    return 'Ausserhalb';
  });
</script>

<div class="ratio-indicator ratio--{status}">
  <span class="ratio-value">{label}</span>
  <span class="ratio-hint">{hint}</span>
</div>

<style>
  .ratio-indicator {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--bg3);
    transition: background 0.2s, border-color 0.2s;
  }

  .ratio-value {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 500;
  }

  .ratio-hint {
    font-size: 0.75rem;
    color: var(--text2);
  }

  .ratio--green {
    border-color: rgba(74, 124, 89, 0.4);
    background: rgba(74, 124, 89, 0.1);
  }
  .ratio--green .ratio-value { color: var(--green-light); }

  .ratio--amber {
    border-color: rgba(239, 159, 39, 0.4);
    background: rgba(239, 159, 39, 0.08);
  }
  .ratio--amber .ratio-value { color: var(--amber); }

  .ratio--red {
    border-color: rgba(139, 58, 58, 0.4);
    background: rgba(139, 58, 58, 0.1);
  }
  .ratio--red .ratio-value { color: #c47a7a; }

  .ratio--neutral .ratio-value { color: var(--text3); }
</style>

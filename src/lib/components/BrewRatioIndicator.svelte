<script>
  let { dose = 0, yieldG = 0 } = $props();

  const ratio = $derived(dose > 0 && yieldG > 0 ? yieldG / dose : null);

  const status = $derived.by(() => {
    if (!ratio) return 'neutral';
    if (ratio >= 1.8 && ratio <= 2.2) return 'green';
    if ((ratio >= 1.5 && ratio < 1.8) || (ratio > 2.2 && ratio <= 2.5)) return 'amber';
    return 'red';
  });

  const label = $derived(ratio ? ratio.toFixed(2) : '—');

  const hint = $derived.by(() => {
    if (!ratio) return 'Dosis und Yield eingeben';
    if (status === 'green') return 'Optimal';
    if (status === 'amber') return 'Akzeptabel';
    return 'Ausserhalb';
  });

  // Ratio 1.0–3.0 mapped to 0–100%
  const barPct = $derived(ratio ? Math.min(100, Math.max(0, (ratio - 1) / 2 * 100)) : 0);
</script>

<div class="ratio-wrap ratio--{status}">
  <div class="ratio-header">
    <span class="ratio-tag">Brew Ratio</span>
    {#if ratio}
      <span class="ratio-badge ratio-badge--{status}">{hint}</span>
    {/if}
  </div>

  <div class="ratio-value">1 : {label}</div>

  {#if ratio}
    <div class="ratio-track">
      <div class="ratio-fill" style="width: {barPct}%"></div>
      <div class="ratio-zone"></div>
    </div>
    <div class="ratio-scale">
      <span>1.0</span>
      <span>1.5</span>
      <span style="color:var(--green-light)">1.8</span>
      <span style="color:var(--green-light)">2.2</span>
      <span>3.0</span>
    </div>
  {:else}
    <p class="ratio-hint">{hint}</p>
  {/if}
</div>

<style>
  .ratio-wrap {
    padding: var(--space-md) var(--space-md);
    border-radius: var(--radius);
    border: 1px solid var(--border);
    background: var(--bg3);
    transition: background 0.25s, border-color 0.25s;
  }

  .ratio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xs);
  }

  .ratio-tag {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text3);
  }

  .ratio-badge {
    font-size: 0.65rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 500;
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
  }

  .ratio-badge--green {
    background: rgba(74, 124, 89, 0.2);
    color: var(--green-light);
  }

  .ratio-badge--amber {
    background: rgba(239, 159, 39, 0.15);
    color: var(--amber);
  }

  .ratio-badge--red {
    background: rgba(139, 58, 58, 0.2);
    color: #c47a7a;
  }

  .ratio-value {
    font-family: var(--font-display);
    font-size: 3rem;
    font-weight: 500;
    line-height: 1;
    margin-bottom: var(--space-sm);
    transition: color 0.25s;
    text-align: center;
  }

  .ratio-track {
    position: relative;
    height: 7px;
    background: var(--surface);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 5px;
  }

  /* Green sweet-spot zone: 1.8–2.2 on a 1.0–3.0 scale = 40%–60% */
  .ratio-zone {
    position: absolute;
    left: 40%;
    width: 20%;
    top: 0;
    height: 100%;
    background: rgba(74, 124, 89, 0.3);
    pointer-events: none;
  }

  .ratio-fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    border-radius: 4px;
    transition: width 0.35s ease;
  }

  .ratio-scale {
    display: flex;
    justify-content: space-between;
    font-size: 0.6rem;
    color: var(--text3);
  }

  .ratio-hint {
    font-size: 0.8rem;
    color: var(--text3);
    margin-top: var(--space-xs);
  }

  /* Status variants */
  .ratio--green {
    border-color: rgba(74, 124, 89, 0.45);
    background: rgba(74, 124, 89, 0.07);
  }
  .ratio--green .ratio-value  { color: var(--green-light); }
  .ratio--green .ratio-fill   { background: var(--green-light); }

  .ratio--amber {
    border-color: rgba(239, 159, 39, 0.4);
    background: rgba(239, 159, 39, 0.06);
  }
  .ratio--amber .ratio-value  { color: var(--amber); }
  .ratio--amber .ratio-fill   { background: var(--amber); }

  .ratio--red {
    border-color: rgba(139, 58, 58, 0.4);
    background: rgba(139, 58, 58, 0.07);
  }
  .ratio--red .ratio-value    { color: #c47a7a; }
  .ratio--red .ratio-fill     { background: #c47a7a; }

  .ratio--neutral .ratio-value { color: var(--text3); }
</style>

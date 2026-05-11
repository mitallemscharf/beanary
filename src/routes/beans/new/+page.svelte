<script>
  import FlavorTags from '$lib/components/FlavorTags.svelte';
  import { enhance } from '$app/forms';

  let { form } = $props();

  let selectedTags = $state([]);
  let submitting = $state(false);
</script>

<div class="page">

  <div class="page-header new-header">
    <a href="/beans" class="back-btn" aria-label="Zurück">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
    </a>
    <div>
      <h1 class="page-title">Neue Bohne</h1>
      <p class="page-subtitle">Kaffeebohne erfassen</p>
    </div>
  </div>

  <div class="form-rule"></div>

  {#if form?.error}
    <div class="error-banner">{form.error}</div>
  {/if}

  <form
    method="POST"
    use:enhance={() => {
      submitting = true;
      return async ({ update }) => {
        submitting = false;
        await update();
      };
    }}
  >

    <div class="form-group">
      <div class="section-num-row">
        <span class="section-num">01</span>
        <span class="section-num-label">Grunddaten</span>
      </div>
      <div class="field">
        <label for="name">Name *</label>
        <input type="text" id="name" name="name" placeholder="z.B. Ethiopia Yirgacheffe" required />
      </div>
      <div class="field">
        <label for="roaster">Röster *</label>
        <input type="text" id="roaster" name="roaster" placeholder="z.B. Stoll Coffee" required />
      </div>
      <div class="field">
        <label for="origin">Herkunft</label>
        <input type="text" id="origin" name="origin" placeholder="z.B. Äthiopien, Sidamo" />
      </div>
    </div>

    <div class="form-group">
      <div class="section-num-row">
        <span class="section-num">02</span>
        <span class="section-num-label">Röstung</span>
      </div>
      <div class="row-2">
        <div class="field">
          <label for="roastDate">Röstdatum</label>
          <input type="date" id="roastDate" name="roastDate" />
        </div>
        <div class="field">
          <label for="roastLevel">Röstgrad</label>
          <select id="roastLevel" name="roastLevel">
            <option value="hell">Hell</option>
            <option value="medium" selected>Medium</option>
            <option value="dunkel">Dunkel</option>
          </select>
        </div>
      </div>
    </div>

    <div class="form-group">
      <div class="section-num-row">
        <span class="section-num">03</span>
        <span class="section-num-label">Geschmack & Notizen</span>
      </div>
      <div class="field">
        <label>Geschmackstags</label>
        <FlavorTags bind:selected={selectedTags} />
        {#each selectedTags as tag}
          <input type="hidden" name="flavorTags" value={tag} />
        {/each}
      </div>
      <div class="field">
        <label for="notes">Notizen</label>
        <textarea id="notes" name="notes" rows="3" placeholder="Herstellernotizen, erste Eindrücke…"></textarea>
      </div>
    </div>

    <button type="submit" class="btn btn-primary btn-full submit-btn" disabled={submitting}>
      {submitting ? 'Wird gespeichert…' : 'Bohne speichern'}
    </button>
  </form>
</div>

<style>
  .new-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
  }

  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: var(--radius-sm);
    color: var(--text2);
    background: var(--bg2);
    border: 1px solid var(--border);
    flex-shrink: 0;
    transition: color 0.15s, border-color 0.15s;
  }

  .back-btn:hover {
    color: var(--crema);
    border-color: var(--border2);
  }

  .form-rule {
    height: 1px;
    background: var(--rule);
    margin-bottom: var(--space-lg);
  }

  .form-group {
    padding: var(--space-md) 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0;
  }

  .form-group:last-of-type {
    border-bottom: none;
  }

  .section-num-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: var(--space-md);
  }

  .section-num {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    color: var(--text3);
    letter-spacing: 0.08em;
    flex-shrink: 0;
  }

  .section-num-label {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--coffee-light);
  }

  .row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
  }

  .error-banner {
    background: rgba(139, 58, 58, 0.12);
    border: 1px solid rgba(139, 58, 58, 0.3);
    color: #c47a7a;
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: 13px;
    margin-bottom: var(--space-md);
  }

  .submit-btn {
    height: 52px;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: var(--space-lg);
    margin-bottom: var(--space-lg);
  }
</style>

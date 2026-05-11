<script>
  import { enhance } from '$app/forms';
  import RatingStars from '$lib/components/RatingStars.svelte';
  import BrewRatioIndicator from '$lib/components/BrewRatioIndicator.svelte';
  import FlavorTags from '$lib/components/FlavorTags.svelte';
  import { showToast } from '$lib/stores/toast.svelte.js';

  let { data, form } = $props();

  let rating = $state(0);
  let selectedTags = $state([]);
  let dose = $state('');
  let yieldG = $state('');
  let submitting = $state(false);

  const doseParsed = $derived(parseFloat(dose) || 0);
  const yieldParsed = $derived(parseFloat(yieldG) || 0);

  const temperatures = [
    { value: '1', label: '●○○○', title: 'Niedrig' },
    { value: '2', label: '●●○○', title: 'Mittel' },
    { value: '3', label: '●●●○', title: 'Hoch' },
    { value: '4', label: '●●●●', title: 'Sehr hoch' }
  ];

  let selectedTemp = $state('2');

  function resetForm(formEl) {
    formEl.reset();
    rating = 0;
    selectedTags = [];
    dose = '';
    yieldG = '';
    selectedTemp = '2';
  }
</script>

<div class="page log-page">
  <div class="log-header">
    <div class="log-header__text">
      <p class="log-header__date">{new Date().toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      <h1 class="log-header__title">Shot loggen</h1>
    </div>
    <div class="log-header__icon" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity="0.3"><path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3"/></svg>
    </div>
  </div>

  {#if form?.error}
    <div class="error-banner">{form.error}</div>
  {/if}

  <form
    method="POST"
    use:enhance={({ formElement }) => {
      submitting = true;
      return async ({ result, update }) => {
        submitting = false;
        if (result.type === 'success') {
          showToast('Shot gespeichert! ☕');
          resetForm(formElement);
        } else {
          await update();
        }
      };
    }}
  >
    <!-- Bohne -->
    <div class="form-section">
      <p class="form-section__label">Bohne</p>
      <div class="field">
        {#if data.beans.length === 0}
          <div class="empty-hint">
            Noch keine Bohnen erfasst. <a href="/beans/new">Jetzt hinzufügen →</a>
          </div>
        {:else}
          <select name="beanId" id="beanId" required>
            <option value="" disabled selected>Bohne auswählen…</option>
            {#each data.beans as bean}
              <option value={bean._id}>{bean.name} — {bean.roaster}</option>
            {/each}
          </select>
        {/if}
      </div>
    </div>

    <!-- Extraktion -->
    <div class="form-section">
      <p class="form-section__label">Extraktion</p>
      <div class="row-2">
        <div class="field">
          <label for="dose">Dosis (g)</label>
          <input type="number" id="dose" name="dose" min="1" max="50" step="0.1" placeholder="18" required bind:value={dose} />
        </div>
        <div class="field">
          <label for="yieldG">Yield (g)</label>
          <input type="number" id="yieldG" name="yieldG" min="1" max="200" step="0.1" placeholder="36" required bind:value={yieldG} />
        </div>
      </div>
      <div class="field">
        <BrewRatioIndicator dose={doseParsed} yieldG={yieldParsed} />
      </div>
      <div class="row-2">
        <div class="field">
          <label for="grindSize">Mahlgrad</label>
          <input type="number" id="grindSize" name="grindSize" min="1" max="100" step="0.5" placeholder="12" required />
        </div>
        <div class="field">
          <label for="extractionTime">Zeit (s)</label>
          <input type="number" id="extractionTime" name="extractionTime" min="1" max="120" step="1" placeholder="27" required />
        </div>
      </div>
    </div>

    <!-- Temperatur -->
    <div class="form-section">
      <p class="form-section__label">Temperatur</p>
      <div class="field">
        <div class="temp-selector">
          {#each temperatures as t}
            <label class="temp-option" class:selected={selectedTemp === t.value} title={t.title}>
              <input type="radio" name="temperature" value={t.value} bind:group={selectedTemp} class="sr-only" />
              <span class="temp-dots">{t.label}</span>
              <span class="temp-label">{t.title}</span>
            </label>
          {/each}
        </div>
      </div>
    </div>

    <!-- Bewertung -->
    <div class="form-section">
      <p class="form-section__label">
        Bewertung
        {#if rating === 0}<span class="rating-hint">← antippen</span>{/if}
      </p>
      <div class="field">
        <div class="rating-wrap">
          <RatingStars bind:rating />
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>
    </div>

    <!-- Geschmack -->
    <div class="form-section">
      <p class="form-section__label">Geschmack</p>
      <div class="field">
        <FlavorTags bind:selected={selectedTags} />
        {#each selectedTags as tag}
          <input type="hidden" name="flavorTags" value={tag} />
        {/each}
      </div>
    </div>

    <!-- Notizen -->
    <div class="form-section">
      <p class="form-section__label">Notizen</p>
      <div class="field">
        <textarea id="notes" name="notes" rows="3" placeholder="Beobachtungen, Anpassungen für nächstes Mal…"></textarea>
      </div>
    </div>

    <button type="submit" class="btn btn-primary btn-full submit-btn" disabled={submitting || rating === 0}>
      {submitting ? 'Wird gespeichert…' : 'Shot speichern'}
    </button>
  </form>
</div>

<style>
  .log-page {
    padding-top: 0;
  }

  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xl) 0 var(--space-lg);
    margin-bottom: var(--space-md);
    border-bottom: 1px solid var(--border);
  }

  .log-header__date {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--text3);
    margin-bottom: 8px;
  }

  .log-header__title {
    font-family: var(--font-display);
    font-size: 44px;
    font-weight: 500;
    color: var(--crema);
    line-height: 1.1;
    letter-spacing: -1px;
  }

  /* ── Form Sections ── */
  .form-section {
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--border);
  }

  .form-section:last-of-type {
    border-bottom: none;
  }

  .form-section__label {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--coffee-light);
    margin-bottom: var(--space-sm);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
  }

  .error-banner {
    background: rgba(139, 58, 58, 0.15);
    border: 1px solid rgba(139, 58, 58, 0.35);
    color: #c47a7a;
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: 13px;
    margin-bottom: var(--space-md);
  }

  .empty-hint {
    font-size: 13px;
    color: var(--text2);
    padding: var(--space-xs) 0;
  }

  .empty-hint a { color: var(--coffee-light); }

  /* ── Temp Selector ── */
  .temp-selector {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .temp-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 6px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg2);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;
    color: var(--text3);
  }

  .temp-option.selected {
    border-color: rgba(139, 90, 43, 0.5);
    background: rgba(139, 90, 43, 0.12);
    color: var(--crema);
    box-shadow: 0 0 12px rgba(139, 90, 43, 0.15);
  }

  .temp-dots { font-size: 11px; letter-spacing: 1px; }

  .temp-label {
    font-family: var(--font-mono);
    font-size: 8px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: inherit;
  }

  /* ── Rating ── */
  .rating-hint {
    font-family: var(--font-body);
    font-size: 10px;
    color: var(--amber);
    text-transform: none;
    letter-spacing: 0;
    font-weight: 400;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .rating-wrap {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--space-md);
    display: flex;
    justify-content: center;
  }

  /* ── Submit ── */
  .submit-btn {
    height: 52px;
    font-size: 14px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: var(--space-md);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
</style>

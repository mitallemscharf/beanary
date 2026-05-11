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

  <!-- Header -->
  <div class="log-header">
    <p class="log-header__date">{new Date().toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
    <h1 class="log-header__title">Shot loggen</h1>
    <div class="log-header__rule"></div>
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

    <!-- 01 Bohne -->
    <div class="form-section">
      <div class="section-num-row">
        <span class="section-num">01</span>
        <span class="section-num-label">Bohne</span>
      </div>
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

    <!-- 02 Extraktion -->
    <div class="form-section">
      <div class="section-num-row">
        <span class="section-num">02</span>
        <span class="section-num-label">Extraktion</span>
      </div>
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

    <!-- 03 Temperatur -->
    <div class="form-section">
      <div class="section-num-row">
        <span class="section-num">03</span>
        <span class="section-num-label">Temperatur</span>
      </div>
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

    <!-- 04 Bewertung -->
    <div class="form-section">
      <div class="section-num-row">
        <span class="section-num">04</span>
        <span class="section-num-label">
          Bewertung
          {#if rating === 0}<span class="rating-hint">← antippen</span>{/if}
        </span>
      </div>
      <div class="field">
        <div class="rating-wrap">
          <RatingStars bind:rating />
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>
    </div>

    <!-- 05 Geschmack -->
    <div class="form-section">
      <div class="section-num-row">
        <span class="section-num">05</span>
        <span class="section-num-label">Geschmack</span>
      </div>
      <div class="field">
        <FlavorTags bind:selected={selectedTags} />
        {#each selectedTags as tag}
          <input type="hidden" name="flavorTags" value={tag} />
        {/each}
      </div>
    </div>

    <!-- 06 Notizen -->
    <div class="form-section form-section--last">
      <div class="section-num-row">
        <span class="section-num">06</span>
        <span class="section-num-label">Notizen</span>
      </div>
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
    padding: var(--space-xl) 0 var(--space-lg);
  }

  .log-header__date {
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--text3);
    margin-bottom: 10px;
  }

  .log-header__title {
    font-family: var(--font-display);
    font-size: 52px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.05;
    letter-spacing: -1.5px;
    margin-bottom: var(--space-md);
  }

  .log-header__rule {
    height: 1px;
    background: var(--rule);
  }

  /* ── Numbered form sections ── */
  .form-section {
    padding: var(--space-lg) 0;
    border-bottom: 1px solid var(--border);
  }

  .form-section--last {
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
    background: rgba(139, 58, 58, 0.12);
    border: 1px solid rgba(139, 58, 58, 0.3);
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
    gap: 5px;
    padding: 12px 6px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg2);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;
    color: var(--text3);
  }

  .temp-option.selected {
    border-color: rgba(139, 90, 43, 0.45);
    background: rgba(139, 90, 43, 0.1);
    color: var(--crema);
    box-shadow: 0 0 16px rgba(139, 90, 43, 0.12);
  }

  .temp-dots { font-size: 10px; letter-spacing: 1px; }

  .temp-label {
    font-family: var(--font-mono);
    font-size: 7px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
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
    animation: pulse 1.6s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
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
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: var(--space-md);
    margin-bottom: var(--space-lg);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
</style>

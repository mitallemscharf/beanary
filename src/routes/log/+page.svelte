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

<div class="page">
  <div class="page-header">
    <h1 class="page-title">Shot loggen</h1>
    <p class="page-subtitle">Espresso erfassen</p>
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
    <div class="field">
      <label for="beanId">Bohne *</label>
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

    <!-- Dosis & Yield -->
    <div class="row-2">
      <div class="field">
        <label for="dose">Dosis (g) *</label>
        <input
          type="number"
          id="dose"
          name="dose"
          min="1"
          max="50"
          step="0.1"
          placeholder="18"
          required
          bind:value={dose}
        />
      </div>
      <div class="field">
        <label for="yield">Yield (g) *</label>
        <input
          type="number"
          id="yield"
          name="yield"
          min="1"
          max="200"
          step="0.1"
          placeholder="36"
          required
          bind:value={yieldG}
        />
      </div>
    </div>

    <!-- Brew-Ratio Live -->
    <div class="field">
      <label>Brew-Ratio (Yield ÷ Dosis)</label>
      <BrewRatioIndicator dose={doseParsed} yieldG={yieldParsed} />
    </div>

    <!-- Mahlgrad & Zeit -->
    <div class="row-2">
      <div class="field">
        <label for="grindSize">Mahlgrad *</label>
        <input
          type="number"
          id="grindSize"
          name="grindSize"
          min="1"
          max="100"
          step="0.5"
          placeholder="12"
          required
        />
      </div>
      <div class="field">
        <label for="extractionTime">Zeit (s) *</label>
        <input
          type="number"
          id="extractionTime"
          name="extractionTime"
          min="1"
          max="120"
          step="1"
          placeholder="27"
          required
        />
      </div>
    </div>

    <!-- Temperatur -->
    <div class="field">
      <label>Temperatur (Heiss)</label>
      <div class="temp-selector">
        {#each temperatures as t}
          <label class="temp-option" class:selected={selectedTemp === t.value} title={t.title}>
            <input
              type="radio"
              name="temperature"
              value={t.value}
              bind:group={selectedTemp}
              class="sr-only"
            />
            <span>{t.label}</span>
            <span class="temp-label">{t.title}</span>
          </label>
        {/each}
      </div>
    </div>

    <!-- Bewertung -->
    <div class="field">
      <label>Bewertung *</label>
      <RatingStars bind:rating />
      <input type="hidden" name="rating" value={rating} />
    </div>

    <!-- Geschmackstags -->
    <div class="field">
      <label>Geschmack</label>
      <FlavorTags bind:selected={selectedTags} />
      {#each selectedTags as tag}
        <input type="hidden" name="flavorTags" value={tag} />
      {/each}
    </div>

    <!-- Notizen -->
    <div class="field">
      <label for="notes">Notizen</label>
      <textarea
        id="notes"
        name="notes"
        rows="3"
        placeholder="Beobachtungen, Anpassungen für nächstes Mal…"
      ></textarea>
    </div>

    <button
      type="submit"
      class="btn btn-primary btn-full"
      disabled={submitting || rating === 0}
    >
      {submitting ? 'Wird gespeichert…' : 'Shot speichern'}
    </button>
  </form>
</div>

<style>
  .row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-sm);
  }

  .error-banner {
    background: rgba(139, 58, 58, 0.2);
    border: 1px solid rgba(139, 58, 58, 0.4);
    color: #c47a7a;
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    margin-bottom: var(--space-md);
  }

  .empty-hint {
    font-size: 0.875rem;
    color: var(--text2);
    padding: var(--space-xs) 0;
  }

  .empty-hint a {
    color: var(--coffee-light);
  }

  .temp-selector {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-xs);
  }

  .temp-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: var(--space-xs);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg3);
    cursor: pointer;
    transition: all 0.15s;
    text-transform: none;
    letter-spacing: 0;
    font-size: 0.85rem;
    color: var(--text2);
  }

  .temp-option.selected {
    border-color: var(--coffee);
    background: rgba(139, 90, 43, 0.15);
    color: var(--crema);
  }

  .temp-label {
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text3);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
  }
</style>

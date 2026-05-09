<script>
  import FlavorTags from '$lib/components/FlavorTags.svelte';
  import { enhance } from '$app/forms';

  let { form } = $props();

  let selectedTags = $state([]);
  let submitting = $state(false);
</script>

<div class="page">
  <div class="page-header" style="display:flex; align-items:center; gap:var(--space-sm);">
    <a href="/beans" class="back-btn" aria-label="Zurück">←</a>
    <div>
      <h1 class="page-title">Neue Bohne</h1>
      <p class="page-subtitle">Kaffeebohne erfassen</p>
    </div>
  </div>

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

    <button type="submit" class="btn btn-primary btn-full" disabled={submitting}>
      {submitting ? 'Wird gespeichert…' : 'Bohne speichern'}
    </button>
  </form>
</div>

<style>
  .back-btn {
    font-size: 1.4rem;
    color: var(--text2);
    line-height: 1;
    padding: var(--space-xs);
  }

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
</style>

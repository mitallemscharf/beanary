<script>
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>Fehler – Beanary</title>
</svelte:head>

<div class="page error-page">
  <div class="error-content">
    <p class="error-code">{page.status}</p>
    <h1 class="page-title">{page.error?.message ?? 'Ein Fehler ist aufgetreten'}</h1>
    <a href="/" class="btn btn-secondary" style="margin-top:var(--space-lg)">Zurück zur Startseite</a>
  </div>
</div>

<style>
  .error-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60dvh;
  }

  .error-content {
    text-align: center;
  }

  .error-code {
    font-family: var(--font-display);
    font-size: 5rem;
    color: var(--text3);
    line-height: 1;
    margin-bottom: var(--space-sm);
  }
</style>

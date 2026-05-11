<script>
  import '../app.css';
  import { page } from '$app/state';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();

  const isLanding = $derived(page.url.pathname === '/');
</script>

<svelte:head>
  <title>Beanary</title>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

{#if !isLanding}
  <BottomNav />
{/if}
<Toast />

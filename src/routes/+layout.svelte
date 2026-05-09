<script>
  import '../app.css';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head>
  <title>Beanary</title>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<BottomNav />
<Toast />

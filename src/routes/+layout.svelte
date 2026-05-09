<script>
  import '../app.css';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import Toast from '$lib/components/Toast.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <title>Beanary</title>
</svelte:head>

{@render children()}

<BottomNav />
<Toast />

<script>
  let { roastDate } = $props();

  const info = $derived(() => {
    if (!roastDate) return { label: 'Kein Datum', color: 'neutral' };
    const days = Math.floor((Date.now() - new Date(roastDate).getTime()) / 86400000);
    if (days <= 14)  return { label: `${days}d frisch`, color: 'green' };
    if (days <= 30)  return { label: `${days}d alt`, color: 'amber' };
    return { label: `${days}d alt`, color: 'red' };
  });
</script>

<span class="badge badge-{info().color}">{info().label}</span>

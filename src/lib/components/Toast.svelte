<script>
  import { toast } from '$lib/stores/toast.svelte.js';
</script>

{#if toast.visible}
  <div class="toast toast--{toast.type}" role="alert">
    <span class="toast__icon">
      {#if toast.type === 'success'}✓{:else}✕{/if}
    </span>
    <span class="toast__message">{toast.message}</span>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: calc(var(--nav-height) + var(--space-md));
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    padding: var(--space-xs) var(--space-md);
    border-radius: var(--radius);
    font-size: 0.875rem;
    font-weight: 500;
    z-index: 100;
    white-space: nowrap;
    animation: slide-up 0.2s ease;
  }

  .toast--success {
    background: rgba(74, 124, 89, 0.95);
    color: #d4f0df;
  }

  .toast--error {
    background: rgba(139, 58, 58, 0.95);
    color: #f0d4d4;
  }

  .toast__icon {
    font-size: 1rem;
    font-weight: 700;
  }

  @keyframes slide-up {
    from { opacity: 0; transform: translateX(-50%) translateY(8px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
</style>

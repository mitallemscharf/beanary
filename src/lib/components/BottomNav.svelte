<script>
  import { page } from '$app/state';

  const tabs = [
    {
      href: '/',
      label: 'Home',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>`
    },
    {
      href: '/beans',
      label: 'Bohnen',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="12" cy="12" rx="9" ry="6" transform="rotate(-30 12 12)"/>
        <path d="M12 6 Q9 12 12 18" />
      </svg>`
    },
    {
      href: '/log',
      label: 'Shot loggen',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>`
    },
    {
      href: '/history',
      label: 'History',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>`
    }
  ];

  function isActive(href) {
    if (href === '/') return page.url.pathname === '/';
    return page.url.pathname.startsWith(href);
  }
</script>

<nav class="bottom-nav">
  {#each tabs as tab}
    <a
      href={tab.href}
      class="bottom-nav__tab"
      class:active={isActive(tab.href)}
      aria-label={tab.label}
    >
      <span class="bottom-nav__icon">{@html tab.icon}</span>
      <span class="bottom-nav__label">{tab.label}</span>
    </a>
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    background: var(--bg);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: stretch;
    z-index: 50;
    padding-bottom: env(safe-area-inset-bottom, 0);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .bottom-nav__tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    color: var(--text3);
    transition: color 0.15s;
    padding-block: var(--space-xs);
  }

  .bottom-nav__tab.active {
    color: var(--coffee);
  }

  .bottom-nav__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .bottom-nav__label {
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
</style>

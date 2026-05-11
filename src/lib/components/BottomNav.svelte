<script>
  import { page } from '$app/state';

  const tabs = [
    {
      href: '/dashboard',
      label: 'Home',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>`
    },
    {
      href: '/beans',
      label: 'Bohnen',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-30 12 12)"/>
        <path d="M12 6.5 Q9.5 12 12 17.5"/>
      </svg>`
    },
    {
      href: '/log',
      label: 'Shot',
      isCenter: true,
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>`
    },
    {
      href: '/history',
      label: 'History',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>`
    },
    {
      href: '/beans/new',
      label: 'Neu',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="12" cy="12" rx="9" ry="5.5" transform="rotate(-30 12 12)"/>
        <path d="M12 6.5 Q9.5 12 12 17.5"/>
        <line x1="19" y1="5" x2="19" y2="11"/>
        <line x1="16" y1="8" x2="22" y2="8"/>
      </svg>`
    }
  ];

  function isActive(href) {
    if (href === '/beans/new') return page.url.pathname === '/beans/new';
    if (href === '/beans') return page.url.pathname.startsWith('/beans') && !page.url.pathname.startsWith('/beans/new');
    return page.url.pathname.startsWith(href);
  }
</script>

<nav class="bottom-nav">
  {#each tabs as tab}
    {#if tab.isCenter}
      <a
        href={tab.href}
        class="bottom-nav__tab bottom-nav__tab--center"
        class:active={isActive(tab.href)}
        aria-label={tab.label}
      >
        <span class="center-btn">
          {@html tab.icon}
        </span>
        <span class="bottom-nav__label">{tab.label}</span>
      </a>
    {:else}
      <a
        href={tab.href}
        class="bottom-nav__tab"
        class:active={isActive(tab.href)}
        aria-label={tab.label}
      >
        <span class="bottom-nav__icon">{@html tab.icon}</span>
        <span class="bottom-nav__label">{tab.label}</span>
      </a>
    {/if}
  {/each}
</nav>

<style>
  .bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    background: rgba(11, 9, 7, 0.96);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    z-index: 50;
    padding: 0 4px;
    padding-bottom: max(8px, env(safe-area-inset-bottom, 8px));
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }

  .bottom-nav__tab {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: var(--text3);
    transition: color 0.2s;
    text-decoration: none;
    height: 100%;
  }

  .bottom-nav__tab.active {
    color: var(--crema);
  }

  .bottom-nav__tab.active .bottom-nav__icon {
    filter: drop-shadow(0 0 6px rgba(232, 201, 154, 0.45));
  }

  .bottom-nav__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease, filter 0.2s ease;
  }

  .bottom-nav__label {
    font-family: var(--font-body);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    line-height: 1;
  }

  /* ── Center FAB ── */
  .bottom-nav__tab--center {
    flex: 0 0 72px;
    position: relative;
    bottom: 10px;
    gap: 6px;
  }

  .center-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--coffee);
    color: var(--crema);
    box-shadow: 0 0 0 3px var(--bg), 0 8px 24px rgba(139, 90, 43, 0.55);
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
  }

  .bottom-nav__tab--center.active .center-btn {
    background: var(--coffee-light);
    box-shadow: 0 0 0 3px var(--bg), 0 8px 32px rgba(196, 135, 74, 0.65);
  }

  .bottom-nav__tab--center:active .center-btn {
    transform: scale(0.93);
  }

  .bottom-nav__tab--center .bottom-nav__label {
    color: var(--text3);
    font-size: 9px;
  }

  .bottom-nav__tab--center.active .bottom-nav__label {
    color: var(--coffee-light);
  }
</style>

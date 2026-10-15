<script>
  import { resolve } from '$app/paths';
  import { asInternalPath } from '$lib/utils/paths.js';
  import '../../app.css';
  import '$lib/v2/styles/v2.css';
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';
  import Sidebar from '$lib/v2/components/Sidebar.svelte';
  import AskScreen from '$lib/v2/components/AskScreen.svelte';
  import ProviderMark from '$lib/v2/components/assistant/ProviderMark.svelte';
  import CommandPalette from '$lib/v2/components/CommandPalette.svelte';
  import BrandMark from '$lib/v2/components/BrandMark.svelte';
  import UserMenu from '$lib/v2/components/UserMenu.svelte';
  import NotificationBell from '$lib/v2/components/NotificationBell.svelte';
  import { Search, Sun, Columns3, LifeBuoy, Receipt, Clock, Plus, Menu } from '@lucide/svelte';
  import { tx } from '$lib/i18n/translate.js';
  import { ALL_PERMISSIONS } from '$lib/access.js';

  /** @type {{ data: { counts: Record<string, number>, org: { name: string, terminology?: Record<string, string> | null }, is_organization_admin: boolean, permissions?: string[], role?: string, user?: { name?: string, email?: string }, screenAssistant?: { connected?: boolean, provider?: string, name?: string, model?: string, models?: { id: string, provider: string, name: string }[] } }, children: import('svelte').Snippet }} */
  let { data, children } = $props();

  let askOpen = $state(false);
  let askProvider = $derived(
    data.screenAssistant?.connected ? data.screenAssistant.provider || 'gemini' : ''
  );
  let askName = $derived(
    data.screenAssistant?.connected ? data.screenAssistant.name || 'Gemini' : tx('Assistant')
  );

  let permissions = $derived(data.permissions ?? ALL_PERMISSIONS);
  let canSearch = $derived(
    permissions.includes('sell') || permissions.includes('serve') || permissions.includes('bill')
  );

  let paletteOpen = $state(false);

  // The sidebar is hidden below 768px, and the tab bar only carries four of the
  // ~16 destinations. This drawer is how a phone reaches the rest of the nav.
  // Account, organisation and sign-out live in the avatar menu. It reuses the same
  // <Sidebar>, so the two can never drift apart. Closes itself on navigation.
  let menuOpen = $state(false);
  let navHidden = $state(false);
  afterNavigate(() => (menuOpen = false));

  function onMenu() {
    if (window.matchMedia('(max-width: 768px)').matches) menuOpen = true;
    else navHidden = !navHidden;
  }

  /** Focus the panel on open so Escape reaches it and keyboard users land inside. */
  function autofocus(/** @type {HTMLElement} */ node) {
    node.focus();
  }

  /**
   * The five things worth a thumb on a phone. Fewer than the sidebar on
   * purpose. A tab bar that scrolls is a menu wearing a tab bar's clothes.
   */
  const TABS = [
    { href: '/', label: 'Today', icon: Sun, exact: true, permission: 'sell' },
    { href: '/pipeline', label: 'Pipeline', icon: Columns3, permission: 'sell' },
    { href: '/tickets', label: 'Tickets', icon: LifeBuoy, permission: 'serve' },
    { href: '/invoices', label: 'Invoices', icon: Receipt, permission: 'bill' },
    { href: '/timesheet', label: 'Timesheet', icon: Clock, permission: 'daily_work' }
  ];

  let tabs = $derived(
    TABS.filter((tab) => permissions.includes(tab.permission)).filter(
      (tab) => tab.href !== '/timesheet' || !permissions.includes('sell')
    )
  );

  const isActive = (href, exact) =>
    exact ? page.url.pathname === href : page.url.pathname.startsWith(href);

  function onkeydown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && canSearch) {
      e.preventDefault();
      paletteOpen = !paletteOpen;
    } else if (e.key === 'Escape' && menuOpen) {
      menuOpen = false;
    }
  }
</script>

<svelte:head>
  <title>ConNexus</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<svelte:window {onkeydown} />

<div class="v2-root v2-app" class:is-nav-hidden={navHidden} class:ask-open={askOpen}>
  <div class="v2-workspace">
  <header class="v2-topbar">
    <button class="v2-icon-btn" type="button" onclick={onMenu} aria-label={tx('Open menu')} aria-expanded={menuOpen}>
      <Menu size={20} />
    </button>
    <a class="v2-brand" href={resolve('/')}>
      <BrandMark />
    </a>
    <div class="v2-topbar-end">
      <button
        class="ask-launch"
        type="button"
        aria-pressed={askOpen}
        aria-label={askOpen ? tx('Close assistant') : askName}
        onclick={() => (askOpen = !askOpen)}
      >
        <span class="ask-spark"><ProviderMark provider={askProvider} /></span>
        <span class="ask-name">{askName}</span>
      </button>
      {#if canSearch}
        <button class="v2-icon-btn" type="button" onclick={() => (paletteOpen = true)} aria-label={tx('Search')}>
          <Search size={18} />
        </button>
      {/if}
      {#if permissions.includes('serve')}
        <NotificationBell count={data.counts?.notifications ?? 0} />
      {/if}
      <UserMenu user={data.user} role={data.role} />
    </div>
  </header>
  <div class="v2-shell">
  <Sidebar
    counts={data.counts}
    org={data.org}
    role={data.role}
    {permissions}
    terminology={data.org.terminology}
    oncollapse={() => (navHidden = true)}
  />
  <div class="v2-main">
    {@render children()}

    <nav class="v2-tabbar" aria-label={tx('Sections')}>
      {#each tabs as tab (tab.href)}
        <a
          href={resolve(asInternalPath(tab.href))}
          aria-current={isActive(tab.href, tab.exact) ? 'page' : undefined}
        >
          <tab.icon />
          {tx(tab.label)}
        </a>
      {/each}
    </nav>
  </div>

  <!-- Both live inside .v2-root so they inherit the scoped tokens; both are
       position:fixed, so the shell's overflow:hidden does not clip them. -->
  {#if permissions.includes('sell')}
    <a class="v2-fab" href={resolve('/pipeline/new')} aria-label={tx('New deal')}><Plus size={21} /></a>
  {/if}

  <!-- Mobile navigation drawer. Only openable from the mobile top bar, so it
       never surfaces on desktop; a backdrop click, Escape, or navigating all
       close it. It renders the same <Sidebar> the desktop shows. -->
  {#if menuOpen}
    <div
      class="v2-drawer-scrim"
      role="presentation"
      onclick={(e) => {
        if (e.target === e.currentTarget) menuOpen = false;
      }}
    >
      <div
        class="v2-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={tx('Navigation')}
        tabindex="-1"
        use:autofocus
        onkeydown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            menuOpen = false;
          }
        }}
      >
        <Sidebar
          counts={data.counts}
          org={data.org}
          role={data.role}
          {permissions}
          terminology={data.org.terminology}
        />
      </div>
    </div>
  {/if}

  {#if canSearch}
    <CommandPalette open={paletteOpen} onclose={() => (paletteOpen = false)} />
  {/if}
  </div>
  </div>
  <AskScreen
    open={askOpen}
    assistant={data.screenAssistant}
    user={data.user}
    onclose={() => (askOpen = false)}
  />
</div>

<style>
  .ask-launch {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    max-width: 180px;
    min-width: 0;
    flex: 0 1 auto;
    padding: 0 12px 0 8px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--v2-ink);
    font: inherit;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
  }
  .ask-launch:hover,
  .ask-launch[aria-pressed='true'] {
    background: var(--v2-ember-soft);
  }
  .ask-spark {
    font-size: 18px;
    display: grid;
    flex: none;
  }
  .ask-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* Chrome's Ask Gemini panel resets to about 360px and leaves the page beside it. */
  .v2-app.ask-open {
    --v2-ask: min(360px, calc(100vw - 48px));
    padding-right: var(--v2-ask);
  }
</style>

<script>
  import { resolve } from '$app/paths';
  import { asInternalPath } from '$lib/utils/paths.js';
  import { page } from '$app/state';
  import {
    Sun,
    Columns3,
    Target,
    Building2,
    Users,
    CircleCheck,
    LifeBuoy,
    BookOpen,
    Receipt,
    Trophy,
    Clock,
    UserCog,
    CircleUser,
    CircleHelp,
    FileText,
    Bell,
    SlidersHorizontal,
    Search,
    LogOut
  } from '@lucide/svelte';
  import { t } from '$lib/terminology.js';
  import { tx } from '$lib/i18n/translate.js';
  import { ALL_PERMISSIONS } from '$lib/access.js';

  /**
   * One flat tree, grouped by what the person is doing rather than by which
   * Django app owns the model. Every label matches the route it lands on and
   * the page title it lands on; "Pipeline" goes to /v2/pipeline, which is
   * titled "Pipeline".
   *
   * v1 had /leads listed twice, as "Pipeline" and as "Leads", and a "Deals"
   * entry pointing at /opportunities while /deals 404'd.
   *
   * `permissions` is the list the API put on the token. It only decides which
   * destinations to *show*. Every hidden one is still enforced by the backend.
   * An item without a permission is personal (profile, help, sign out) and
   * stays for everyone.
   *
   * `termKey` marks the handful of entity destinations a vertical pack may
   * relabel (see `$lib/terminology.js`). The string in `label` below is only
   * ever the fallback an org with no pack, or no override for that key,
   * still renders; the derived `groups` below is what actually resolves it
   * against `terminology`. No other label branches on the org at all.
   *
   * @type {{
   *   counts?: Record<string, number>,
   *   org?: { name: string },
   *   permissions?: string[],
   *   terminology?: Record<string, string> | null,
   *   onsearch?: () => void
   * }}
   */
  let {
    counts = {},
    org = { name: 'BottleCRM' },
    permissions = ALL_PERMISSIONS,
    terminology = undefined,
    onsearch = () => {}
  } = $props();

  const GROUPS = [
    {
      label: 'Sell',
      items: [
        { href: '/', label: 'Today', icon: Sun, exact: true, permission: 'sell' },
        {
          href: '/pipeline',
          label: 'Pipeline',
          icon: Columns3,
          count: 'pipeline',
          termKey: 'opportunity.plural',
          permission: 'sell'
        },
        {
          href: '/leads',
          label: 'Leads',
          icon: Target,
          count: 'leads',
          termKey: 'lead.plural',
          permission: 'sell'
        },
        {
          href: '/accounts',
          label: 'Accounts',
          icon: Building2,
          termKey: 'account.plural',
          permission: 'sell'
        },
        {
          href: '/contacts',
          label: 'Contacts',
          icon: Users,
          termKey: 'contact.plural',
          permission: 'sell'
        },
        { href: '/goals', label: 'Goals', icon: Trophy, permission: 'sell' }
      ]
    },
    {
      label: 'Serve',
      items: [
        { href: '/tasks', label: 'Tasks', icon: CircleCheck, count: 'tasks', permission: 'serve' },
        // Approvals and Analytics live under Tickets as section tabs. They are
        // not separate destinations, so they do not get separate nav entries,
        // one level of navigation, and the tab strip carries the rest.
        { href: '/tickets', label: 'Tickets', icon: LifeBuoy, count: 'tickets', permission: 'serve' },
        { href: '/solutions', label: 'Knowledge base', icon: BookOpen, permission: 'serve' },
        { href: '/documents', label: 'Documents', icon: FileText, permission: 'serve' }
      ]
    },
    {
      label: 'Bill',
      items: [
        {
          href: '/invoices',
          label: 'Invoices',
          icon: Receipt,
          count: 'invoices',
          termKey: 'invoice.plural',
          permission: 'bill'
        },
        { href: '/timesheet', label: 'Timesheet', icon: Clock, permission: 'daily_work' }
      ]
    },
    {
      // Administration, kept apart from the work. Someone who never touches
      // these should not read past them four times a day.
      label: 'Run',
      items: [
        { href: '/team', label: 'Team and access', icon: UserCog, permission: 'team' },
        { href: '/settings', label: 'Settings', icon: SlidersHorizontal, permission: 'settings' }
      ]
    }
  ];

  // Drop admin-only items for members, resolve any relabelled entity through
  // the terminology map, then drop any group left with nothing.
  let groups = $derived(
    GROUPS.map((group) => ({
      ...group,
      label: tx(group.label),
      items: group.items
        .filter((item) => !item.permission || permissions.includes(item.permission))
        .map((item) => ({
          ...item,
          // A pack's own wording wins. The fallback is the translated label.
          label: item.termKey
            ? t(terminology, item.termKey, tx(item.label))
            : tx(item.label)
        }))
    })).filter((group) => group.items.length > 0)
  );

  const isActive = (href, exact) =>
    exact ? page.url.pathname === href : page.url.pathname.startsWith(href);
</script>

<nav class="v2-nav" aria-label={tx('Main')}>
  <div class="v2-org">
    <span class="v2-mark">{org.name.slice(0, 1)}</span>
    <b>{org.name}</b>
  </div>

  <!--
    No entry appears here without a route behind it. v1's "Deals" pointed at
    /opportunities while /deals 404'd; an Inbox link with nothing behind it
    would be the same mistake.
  -->
  {#each groups as group (group.label)}
    <div class="v2-nav-group v2-label">{group.label}</div>
    {#each group.items as item (item.href)}
      <a
        class="v2-link"
        href={resolve(asInternalPath(item.href))}
        aria-current={isActive(item.href, item.exact) ? 'page' : undefined}
      >
        <item.icon />
        {item.label}
        {#if item.count && counts[item.count]}
          <span class="v2-count">{counts[item.count]}</span>
        {/if}
      </a>
    {/each}
  {/each}

  <div class="v2-nav-foot">
    {#if permissions.includes('sell') || permissions.includes('serve') || permissions.includes('bill')}
      <button class="v2-link v2-nav-search" type="button" onclick={onsearch}>
        <Search />
        {tx('Search')}
        <span class="v2-count">⌘K</span>
      </button>
    {/if}
    <!-- Personal, not work: your own feed sits with your own profile rather
         than in Serve, where it would read as a queue the team shares. -->
    {#if permissions.includes('serve')}
      <a
        class="v2-link"
        href={resolve('/notifications')}
        aria-current={isActive('/notifications', false) ? 'page' : undefined}
      >
        <Bell />
        {tx('Notifications')}
        {#if counts.notifications}
          <span class="v2-count">{counts.notifications}</span>
        {/if}
      </a>
    {/if}
    <a class="v2-link" href={resolve('/profile')}>
      <CircleUser />
      {tx('Your profile')}
    </a>
    <a class="v2-link" href={resolve('/help')}>
      <CircleHelp />
      {tx('Help')}
    </a>
    <!-- Leaving the app. Last in the list, and a plain link. /logout is a
         server load that clears the auth cookies and redirects to /login, so a
         GET navigation is all it takes and no data-fetching component follows. -->
    <a class="v2-link" href={resolve('/logout')} data-sveltekit-reload>
      <LogOut />
      {tx('Sign out')}
    </a>
  </div>
</nav>

<style>
  /* Search opens an overlay rather than navigating, so it is a button. It
     borrows .v2-link for everything else. A control that sits in a list of
     links should not look like the odd one out. */
  .v2-nav-search {
    width: 100%;
    background: none;
    border: 0;
    font-family: inherit;
    font-size: inherit;
    text-align: left;
    cursor: pointer;
  }
</style>

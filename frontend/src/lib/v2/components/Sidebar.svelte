<script>
  import { resolve } from '$app/paths';
  import { asInternalPath } from '$lib/utils/paths.js';
  import { page } from '$app/state';
  import {
    Calendar,
    ChartColumn,
    Users,
    Building2,
    User,
    Target,
    SquareCheck,
    MessageSquare,
    BookOpen,
    FileText,
    Clock,
    ClipboardList,
    RefreshCw,
    Package,
    ChartNoAxesColumn,
    Copy,
    Settings,
    Bell,
    CircleHelp,
    LogOut,
    ChevronDown
  } from '@lucide/svelte';
  import { t } from '$lib/terminology.js';
  import { tx } from '$lib/i18n/translate.js';
  import { ALL_PERMISSIONS } from '$lib/access.js';
  import { ROLE_LABEL } from '$lib/v2/enums.js';

  /**
   * One flat tree, grouped by what the person is doing rather than by which
   * Django app owns the model. Every label matches the route it lands on.
   *
   * `permissions` only decides which destinations to show. The backend still
   * enforces every hidden one. An item without a permission is personal.
   *
   * `termKey` marks entity destinations a vertical pack may relabel.
   *
   * @type {{
   *   counts?: Record<string, number>,
   *   org?: { name: string },
   *   user?: { name?: string, email?: string },
   *   role?: string,
   *   permissions?: string[],
   *   terminology?: Record<string, string> | null
   * }}
   */
  let {
    counts = {},
    org = { name: 'ConNexus' },
    user = { name: '', email: '' },
    role = '',
    permissions = ALL_PERMISSIONS,
    terminology = undefined
  } = $props();

  const GROUPS = [
    {
      label: 'Sell',
      items: [
        { href: '/', label: 'Today', icon: Calendar, exact: true, permission: 'sell' },
        {
          href: '/pipeline',
          label: 'Pipeline',
          icon: ChartColumn,
          count: 'pipeline',
          termKey: 'opportunity.plural',
          permission: 'sell'
        },
        {
          href: '/leads',
          label: 'Leads',
          icon: Users,
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
          icon: User,
          termKey: 'contact.plural',
          permission: 'sell'
        },
        { href: '/goals', label: 'Goals', icon: Target, permission: 'sell' }
      ]
    },
    {
      label: 'Serve',
      items: [
        { href: '/tasks', label: 'Tasks', icon: SquareCheck, count: 'tasks', permission: 'serve' },
        { href: '/tickets', label: 'Tickets', icon: MessageSquare, count: 'tickets', permission: 'serve' },
        { href: '/solutions', label: 'Knowledge base', icon: BookOpen, permission: 'serve' },
        { href: '/documents', label: 'Documents', icon: FileText, permission: 'serve' },
        { href: '/timesheet', label: 'Timesheet', icon: Clock, permission: 'daily_work' }
      ]
    },
    {
      label: 'Bill',
      items: [
        {
          href: '/invoices',
          label: 'Invoices',
          icon: FileText,
          count: 'invoices',
          termKey: 'invoice.plural',
          permission: 'bill'
        },
        { href: '/invoices/estimates', label: 'Estimates', icon: ClipboardList, permission: 'bill' },
        { href: '/invoices/recurring', label: 'Recurring', icon: RefreshCw, permission: 'bill' },
        { href: '/invoices/products', label: 'Products', icon: Package, permission: 'bill' },
        { href: '/invoices/reports', label: 'Reports', icon: ChartNoAxesColumn, permission: 'bill' },
        {
          href: '/invoices/templates',
          label: 'Invoice templates',
          icon: Copy,
          permission: 'bill'
        }
      ]
    },
    {
      label: 'Run',
      items: [
        { href: '/team', label: 'People', icon: Users, permission: 'team' },
        { href: '/settings', label: 'Settings', icon: Settings, permission: 'settings' }
      ]
    }
  ];

  /** Parent items that must not stay lit when a more specific item is open. */
  const NESTED = {
    '/invoices': [
      '/invoices/estimates',
      '/invoices/recurring',
      '/invoices/products',
      '/invoices/reports',
      '/invoices/templates'
    ]
  };

  let groups = $derived(
    GROUPS.map((group) => ({
      ...group,
      label: tx(group.label),
      items: group.items
        .filter((item) => {
          if (!item.permission || permissions.includes(item.permission)) return true;
          // An administrator opens the team page to create employees, even
          // when the CEO did not grant the rest of team administration.
          return item.href === '/team' && (role === 'ADMIN' || role === 'CEO');
        })
        .map((item) => ({
          ...item,
          label: item.termKey ? t(terminology, item.termKey, tx(item.label)) : tx(item.label)
        }))
    })).filter((group) => group.items.length > 0)
  );

  let displayName = $derived(
    (user.name || '').trim() || (user.email || '').split('@')[0] || org.name
  );
  let initials = $derived.by(() => {
    const parts = displayName.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });
  let roleLabel = $derived(role && ROLE_LABEL[role] ? ROLE_LABEL[role] : '');

  const isActive = (href, exact) => {
    const path = page.url.pathname;
    if (exact || href === '/') return path === href;
    const nested = NESTED[href];
    if (nested?.some((item) => path === item || path.startsWith(`${item}/`))) return false;
    return path === href || path.startsWith(`${href}/`);
  };
</script>

<nav class="v2-nav" aria-label={tx('Main')}>
  <div class="v2-side-head">
    <a class="v2-org" href={resolve('/org')} aria-label={tx('Switch organisation')}>
      <b>{org.name}</b>
      <ChevronDown />
    </a>
    <div class="v2-who">
      <span class="v2-who-avatar" aria-hidden="true">{initials}</span>
      <div style="min-width:0">
        <b>{displayName}</b>
        {#if roleLabel}<span>{roleLabel}</span>{/if}
      </div>
    </div>
  </div>

  <div class="v2-nav-scroll">
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
  </div>

  <div class="v2-nav-foot">
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
    <a
      class="v2-link"
      href={resolve('/profile')}
      aria-current={isActive('/profile', false) ? 'page' : undefined}
    >
      <User />
      {tx('Your profile')}
    </a>
    <a
      class="v2-link"
      href={resolve('/help')}
      aria-current={isActive('/help', false) ? 'page' : undefined}
    >
      <CircleHelp />
      {tx('Help')}
    </a>
    <a class="v2-link v2-link-out" href={resolve('/logout')} data-sveltekit-reload>
      <LogOut />
      {tx('Sign out')}
    </a>
  </div>
</nav>

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
    ChevronDown,
    CircleHelp,
    PanelLeftClose
  } from '@lucide/svelte';
  import { t } from '$lib/terminology.js';
  import { tx } from '$lib/i18n/translate.js';
  import { ALL_PERMISSIONS } from '$lib/access.js';

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
   *   role?: string,
   *   permissions?: string[],
   *   terminology?: Record<string, string> | null,
   *   oncollapse?: () => void
   * }}
   */
  let {
    counts = {},
    org = { name: 'ConNexus' },
    role = '',
    permissions = ALL_PERMISSIONS,
    terminology = undefined,
    oncollapse = undefined
  } = $props();

  const GROUPS = [
    {
      id: 'Sell',
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
      id: 'Serve',
      label: 'Serve',
      items: [
        { href: '/tickets', label: 'Tickets', icon: MessageSquare, count: 'tickets', permission: 'serve' },
        { href: '/solutions', label: 'Knowledge base', icon: BookOpen, permission: 'serve' },
        { href: '/documents', label: 'Documents', icon: FileText, permission: 'serve' },
        { href: '/timesheet', label: 'Timesheet', icon: Clock, permission: 'daily_work' }
      ]
    },
    {
      id: 'Bill',
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
      id: 'Run',
      label: 'Run',
      items: [
        { href: '/team', label: 'Employees', icon: Users, permission: 'team' },
        { href: '/settings', label: 'Settings', icon: Settings, permission: 'settings' },
        { href: '/help', label: 'Help', icon: CircleHelp }
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

  /** Group ids the person has closed. Absent means "follow the open page". */
  let collapsed = $state(/** @type {Record<string, boolean>} */ ({}));

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

  const isActive = (href, exact) => {
    const path = page.url.pathname;
    if (exact || href === '/') return path === href;
    const nested = NESTED[href];
    if (nested?.some((item) => path === item || path.startsWith(`${item}/`))) return false;
    return path === href || path.startsWith(`${href}/`);
  };

  /** @param {string} id @param {{ href: string, exact?: boolean }[]} items */
  function groupIsOpen(id, items) {
    if (Object.prototype.hasOwnProperty.call(collapsed, id)) return !collapsed[id];
    return items.some((item) => isActive(item.href, item.exact));
  }

  /** @param {string} id @param {{ href: string, exact?: boolean }[]} items */
  function toggleGroup(id, items) {
    collapsed[id] = groupIsOpen(id, items);
  }

  // Open the section that owns a page when the person arrives there.
  // A later collapse of that same section stays closed until the path changes.
  let seenPath = '';
  $effect(() => {
    const path = page.url.pathname;
    if (path === seenPath) return;
    seenPath = path;
    for (const group of groups) {
      if (group.items.some((item) => isActive(item.href, item.exact))) {
        collapsed[group.id] = false;
      }
    }
  });
</script>

<nav class="v2-nav" aria-label={tx('Main')}>
  <div class="v2-side-head">
    <p class="v2-org-name">{org.name}</p>
  </div>

  <div class="v2-nav-scroll">
    {#each groups as group (group.id)}
      {@const open = groupIsOpen(group.id, group.items)}
      <button
        type="button"
        class="v2-nav-toggle"
        aria-expanded={open}
        aria-controls={`nav-${group.id}`}
        onclick={() => toggleGroup(group.id, group.items)}
      >
        {group.label}
        <ChevronDown />
      </button>
      {#if open}
        <div id={`nav-${group.id}`}>
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
        </div>
      {/if}
    {/each}
  </div>

  {#if oncollapse}
    <div class="v2-nav-foot">
      <button type="button" class="v2-nav-collapse" onclick={oncollapse}>
        <PanelLeftClose />
        {tx('Collapse sidebar')}
      </button>
    </div>
  {/if}
</nav>

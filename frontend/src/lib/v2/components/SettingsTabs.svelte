<script>
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import { asInternalPath } from '$lib/utils/paths.js';
  import { tx } from '$lib/i18n/translate.js';

  /** @type {{ role?: string }} */
  let { role = '' } = $props();

  /**
   * System configuration is three tabs. Product configuration (pipelines,
   * tickets, forms) stays one tab so those screens keep an index, and so
   * they are not mixed into the organization form or the AI keys.
   */
  const AREAS = [
    {
      id: 'general',
      href: '/settings',
      search: '',
      label: 'General',
      ceo: false,
      prefixes: ['/settings/organization', '/settings/migrate']
    },
    {
      id: 'ia',
      href: '/settings',
      search: '?area=ia',
      label: 'AI integrations',
      ceo: true,
      prefixes: ['/settings/assistants']
    },
    {
      id: 'security',
      href: '/settings',
      search: '?area=seguridad',
      label: 'Security and access',
      ceo: false,
      prefixes: ['/settings/api-tokens', '/settings/webhooks', '/settings/audit-log']
    },
    {
      id: 'operations',
      href: '/settings',
      search: '?area=operacion',
      label: 'Product',
      ceo: false,
      prefixes: [
        '/settings/business-hours',
        '/settings/lead-pipelines',
        '/settings/deal-pipelines',
        '/settings/tags',
        '/settings/custom-fields',
        '/settings/macros',
        '/settings/help-center',
        '/settings/web-forms',
        '/settings/routing',
        '/settings/escalation',
        '/settings/ticket-approvals',
        '/settings/reopen',
        '/settings/inbound-email'
      ]
    }
  ];

  let visible = $derived(AREAS.filter((area) => !area.ceo || role === 'CEO'));

  let current = $derived.by(() => {
    const path = page.url.pathname;
    const area = page.url.searchParams.get('area');
    if (path === '/settings' || path === '/settings/assistants') {
      if (area === 'ia' || path === '/settings/assistants') return 'ia';
      if (area === 'seguridad') return 'security';
      if (area === 'operacion') return 'operations';
      if (path === '/settings') return 'general';
    }
    const hit = visible.find((item) => item.prefixes.some((prefix) => path.startsWith(prefix)));
    return hit?.id ?? 'general';
  });
</script>

<nav class="v2-tabs" aria-label={tx('Settings')}>
  {#each visible as area (area.id)}
    <a
      href={resolve(asInternalPath(area.href)) + area.search}
      aria-current={current === area.id ? 'page' : undefined}
    >
      {tx(area.label)}
    </a>
  {/each}
</nav>

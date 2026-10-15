<script>
  /**
   * Employees: the list and the invite live on this screen.
   *
   * Role changes and deletes still go to the API. This page only decides
   * which rows to show and whether the drawer is open. Administrators are
   * created from Settings, under Security and access.
   */
  import { tx } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/sell.js';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import StatCard from '$lib/v2/components/StatCard.svelte';
  import NextAction from '$lib/v2/components/NextAction.svelte';
  import EmployeeTable from '$lib/v2/components/employees/EmployeeTable.svelte';
  import EmployeeDrawer from '$lib/v2/components/employees/EmployeeDrawer.svelte';
  import { count } from '$lib/v2/format.js';
  import { UserPlus } from '@lucide/svelte';
  import {
    directoryMetrics,
    filterMembers,
    paginate
  } from '$lib/v2/employee-directory.js';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();

  let query = $state('');
  let role = $state('ALL');
  let department = $state('ALL');
  let page = $state(1);
  let busy = $state(false);
  /** @type {'create' | 'edit' | null} */
  let drawer = $state(null);
  /** @type {any} */
  let editing = $state(null);
  let filterKey = $state('');

  let members = $derived([...(data.concealed ?? []), ...(data.active ?? []), ...(data.inactive ?? [])]);
  let metrics = $derived(directoryMetrics(members));
  let departments = $derived(
    [...new Set(members.flatMap((/** @type {any} */ member) => member.teams || []))].sort()
  );
  let filtered = $derived(filterMembers(members, { query, role, department }));
  let view = $derived(paginate(filtered, page));

  $effect(() => {
    const next = `${query}|${role}|${department}`;
    if (next === filterKey) return;
    filterKey = next;
    page = 1;
  });

  let canCreate = $derived(data.actor?.can_manage_employees === true || data.actor?.can_manage_administrators === true);

  /** @param {any} member */
  function canEdit(member) {
    if (member.is_you) return false;
    if (member.role === 'CEO' && data.actor?.role !== 'CEO') return false;
    if (data.actor?.can_manage_administrators) return true;
    return member.role === 'EMPLOYEE';
  }

  const working = () => {
    busy = true;
    return async (/** @type {any} */ { update, result }) => {
      await update();
      busy = false;
      if (result?.type === 'success' && (result?.data?.roleChanged || result?.data?.invited)) {
        drawer = null;
        editing = null;
      }
    };
  };
</script>

{#if data.forbidden}
  <PageHeader title={tx('Employees')} />
  <div class="v2-pad" style="padding-top:40px">
    <NextAction
      label={tx('Admins only')}
      text="Managing people, roles and access is limited to organization admins. Ask an admin on your team if you need someone added or a role changed."
    />
  </div>
{:else}
  <PageHeader title={tx('Employees')}>
    {#snippet sub()}
      {tx('Invite someone, or change the people already here, without leaving this list.')}
    {/snippet}
    {#snippet actions()}
      {#if canCreate}
        <button class="v2-btn v2-btn-primary" type="button" onclick={() => (drawer = 'create')}>
          <UserPlus />{tx('Invite / Create employee')}
        </button>
      {/if}
    {/snippet}
  </PageHeader>

  <div class="v2-pad" style="padding-top:16px;flex:none">
    <div class="v2-stats">
      <StatCard label={tx('Total employees')} value={count(metrics.total)} tone="ink" />
      <StatCard label={tx('Active')} value={count(metrics.active)} tone="moss" />
      <StatCard label={tx('Inactive')} value={count(metrics.inactive)} tone="slate" />
    </div>
  </div>

  <div class="v2-scroll">
    <div class="v2-pad" style="padding-bottom:32px">
      {#if form?.invited}
        <p class="ok">
          {form.reused
            ? tx('{username} already had an account. They sign in with the password they already use.', {
                username: form.invited
              })
            : tx('{username} can sign in with this username and the password you set.', {
                username: form.invited
              })}
        </p>
      {:else if form?.error}
        <div style="margin-bottom:16px">
          <NextAction label={tx('That did not work')} text={form.error} tone="rust" />
        </div>
      {/if}

      <EmployeeTable
        rows={view.rows}
        page={view.page}
        pages={view.pages}
        total={view.total}
        start={view.start}
        {query}
        {role}
        {department}
        roles={data.roles}
        {departments}
        {busy}
        lastAdminId={data.last_admin_id}
        {canEdit}
        onquery={(value) => (query = value)}
        onrole={(value) => (role = value)}
        ondepartment={(value) => (department = value)}
        onpage={(value) => (page = value)}
        onedit={(member) => {
          editing = member;
          drawer = 'edit';
        }}
        onstatus={working}
      />
    </div>
  </div>

  {#if drawer}
    <EmployeeDrawer
      mode={drawer}
      member={editing}
      roles={data.roles}
      canAssignRole={data.actor?.can_manage_administrators === true}
      lastAdminId={data.last_admin_id}
      {busy}
      error={drawer === 'create' ? form?.invite?.error || '' : form?.error || ''}
      onsubmit={working}
      onclose={() => {
        drawer = null;
        editing = null;
      }}
    />
  {/if}
{/if}

<style>
  .ok {
    color: var(--v2-moss);
    font-size: 13px;
    margin: 0 0 14px;
  }
</style>

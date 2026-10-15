<script>
  /**
   * The directory table. Filters and the page index live in the parent, so
   * opening the drawer does not throw away a search.
   */
  import { tx } from '$lib/i18n/translate.js';
  import Avatar from '$lib/v2/components/Avatar.svelte';
  import Pill from '$lib/v2/components/Pill.svelte';
  import ConfirmAction from '$lib/v2/components/ConfirmAction.svelte';
  import { ROLE_LABEL, ROLE_TONE } from '$lib/v2/enums.js';
  import { memberStatus } from '$lib/v2/employee-directory.js';
  import { enhance } from '$app/forms';

  /**
   * @type {{
   *   rows: any[],
   *   page: number,
   *   pages: number,
   *   total: number,
   *   start: number,
   *   query: string,
   *   role: string,
   *   department: string,
   *   roles: string[],
   *   departments: string[],
   *   busy?: boolean,
   *   lastAdminId?: string | null,
   *   canEdit: (member: any) => boolean,
   *   onquery: (value: string) => void,
   *   onrole: (value: string) => void,
   *   ondepartment: (value: string) => void,
   *   onpage: (page: number) => void,
   *   onedit: (member: any) => void,
   *   onstatus: import('@sveltejs/kit').SubmitFunction
   * }}
   */
  let {
    rows,
    page,
    pages,
    total,
    start,
    query,
    role,
    department,
    roles,
    departments,
    busy = false,
    lastAdminId = null,
    canEdit,
    onquery,
    onrole,
    ondepartment,
    onpage,
    onedit,
    onstatus
  } = $props();

  let menuFor = $state('');

  /** @param {any} member */
  function statusLabel(member) {
    const status = memberStatus(member);
    if (status === 'unknown') return null;
    if (status === 'pending') return tx('Pending');
    if (status === 'inactive') return tx('Inactive');
    return tx('Active');
  }
</script>

<div class="toolbar">
  <label class="grow">
    <span class="v2-label">{tx('Search')}</span>
    <input
      class="v2-input"
      type="search"
      value={query}
      placeholder={tx('Name or email')}
      oninput={(event) => onquery(/** @type {HTMLInputElement} */ (event.currentTarget).value)}
    />
  </label>
  <label>
    <span class="v2-label">{tx('Department')}</span>
    <select
      class="v2-input"
      value={department}
      onchange={(event) => ondepartment(/** @type {HTMLSelectElement} */ (event.currentTarget).value)}
    >
      <option value="ALL">{tx('All departments')}</option>
      <option value="NONE">{tx('No department')}</option>
      {#each departments as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
  </label>
  <label>
    <span class="v2-label">{tx('Role')}</span>
    <select
      class="v2-input"
      value={role}
      onchange={(event) => onrole(/** @type {HTMLSelectElement} */ (event.currentTarget).value)}
    >
      <option value="ALL">{tx('All roles')}</option>
      {#each roles as item (item)}
        <option value={item}>{ROLE_LABEL[item] ?? item}</option>
      {/each}
    </select>
  </label>
</div>

<div class="v2-table-wrap">
  <table class="v2-table">
    <thead>
      <tr>
        <th>{tx('Person')}</th>
        <th>{tx('Role')}</th>
        <th>{tx('Status')}</th>
        <th>{tx('Department')}</th>
        <th class="v2-r">{tx('Actions')}</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as member (member.id)}
        {@const status = memberStatus(member)}
        <tr style={status === 'inactive' ? 'opacity:.62' : ''}>
          <td>
            <span class="who">
              <Avatar name={member.name} size={27} />
              <span>
                <span class="v2-table-primary">
                  {member.name}{#if member.is_you}<span class="v2-sub"> {tx(', you')}</span>{/if}
                </span>
                <span class="v2-table-secondary" style="display:block">{member.email}</span>
              </span>
            </span>
          </td>
          <td>
            <Pill tone={status === 'inactive' ? 'slate' : ROLE_TONE[member.role]}>
              {ROLE_LABEL[member.role] ?? member.role}
            </Pill>
          </td>
          <td>
            {#if status === 'unknown'}
              <span class="v2-muted">—</span>
            {:else if status === 'active'}
              <Pill tone="moss">{statusLabel(member)}</Pill>
            {:else if status === 'pending'}
              <Pill tone="clay">{statusLabel(member)}</Pill>
            {:else}
              <Pill tone="slate">{statusLabel(member)}</Pill>
            {/if}
          </td>
          <td>
            {#if member.teams?.length}
              {member.teams.join(', ')}
            {:else}
              <span class="v2-muted">—</span>
            {/if}
          </td>
          <td class="v2-r">
            {#if !canEdit(member)}
              <span class="v2-muted">—</span>
            {:else}
              <button
                class="v2-btn v2-btn-sm"
                type="button"
                aria-expanded={menuFor === member.id}
                onclick={() => (menuFor = menuFor === member.id ? '' : member.id)}
              >
                {tx('Actions')}
              </button>
              {#if menuFor === member.id}
                <div class="menu">
                  <button class="v2-btn v2-btn-sm" type="button" onclick={() => onedit(member)}>
                    {tx('Edit')}
                  </button>
                  {#if status !== 'unknown'}
                    <form method="POST" action="?/setStatus" use:enhance={onstatus}>
                      <input type="hidden" name="userId" value={member.user_id} />
                      <input type="hidden" name="status" value={member.is_active ? 'Inactive' : 'Active'} />
                      <button
                        class="v2-btn v2-btn-sm"
                        disabled={busy || (member.is_active && member.user_id === lastAdminId)}
                      >
                        {member.is_active ? tx('Suspend') : tx('Reactivate')}
                      </button>
                    </form>
                  {/if}
                  {#if member.user_id !== lastAdminId}
                    <ConfirmAction
                      action="?/remove"
                      label="Delete"
                      confirmLabel="Delete"
                      explain="Removes this account from the organization."
                      hidden={{ userId: member.user_id }}
                    />
                  {/if}
                </div>
              {/if}
            {/if}
          </td>
        </tr>
      {:else}
        <tr>
          <td colspan="5" class="v2-muted">{tx('No one matches.')}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<div class="pager">
  <span class="v2-sub">
    {total
      ? tx('{from}–{to} of {total}', { from: start + 1, to: start + rows.length, total })
      : tx('0')}
  </span>
  <button class="v2-btn v2-btn-sm" type="button" disabled={page <= 1} onclick={() => onpage(page - 1)}>
    {tx('Previous')}
  </button>
  <button class="v2-btn v2-btn-sm" type="button" disabled={page >= pages} onclick={() => onpage(page + 1)}>
    {tx('Next')}
  </button>
</div>

<style>
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
    align-items: end;
  }
  .grow {
    flex: 1;
    min-width: 180px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .who {
    display: flex;
    gap: 9px;
    align-items: center;
  }
  .menu {
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: flex-end;
    margin-top: 8px;
  }
  .pager {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: flex-end;
    margin-top: 12px;
  }
</style>

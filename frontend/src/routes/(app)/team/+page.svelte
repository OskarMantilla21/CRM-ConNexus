<script>
  import { tx, choiceLabel } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/sell.js';
  import { resolve } from '$app/paths';
  /**
   * Who can get in, and how much they can do.
   *
   * ROLE IS DISPLAYED HERE, DECIDED ON THE SERVER.
   * `role` comes from the Profile the API returned. This page renders it and
   * offers to change it; the server decides whether the change is allowed. Two
   * rules the endpoint enforces and this page mirrors as hints only, nobody
   * changes their own role, and the org keeps at least one admin. Mirroring
   * them is a courtesy so a button does not 400; it is not the control. The
   * real enforcement is in common/views/user_views.py, because anyone can skip
   * this page entirely with curl, which is exactly how a member used to PATCH
   * themselves to admin before that path was closed.
   *
   * The row that matters most is the quiet one: a deactivated account with a
   * not-yet-revoked API token. Deactivating a login already stops that token at
   * the door; resolve_valid_pat rejects a token whose profile.is_active is
   * false, but it is dormant, not revoked, and would authenticate again the
   * moment the account is reactivated. That is why the count is here: an
   * offboarding to-do, not a live breach.
   */
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import StatCard from '$lib/v2/components/StatCard.svelte';
  import Pill from '$lib/v2/components/Pill.svelte';
  import Avatar from '$lib/v2/components/Avatar.svelte';
  import NextAction from '$lib/v2/components/NextAction.svelte';
  import { count, relativeDays } from '$lib/v2/format.js';
  import { ROLE_LABEL, ROLE_TONE } from '$lib/v2/enums.js';
  import { ALL_PERMISSIONS, EMPLOYEE_PERMISSIONS, PERMISSION_LABEL } from '$lib/access.js';
  import { enhance } from '$app/forms';
  import { UserPlus, KeyRound } from '@lucide/svelte';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();

  let inviting = $state(false);
  let busy = $state(false);
  let inviteRole = $state('EMPLOYEE');

  /** Opens the account form for one role. The same button again closes it. */
  function openInvite(/** @type {string} */ role) {
    if (inviting && inviteRole === role) {
      inviting = false;
      return;
    }
    inviteRole = role;
    inviting = true;
  }
  /** @type {Record<string, string>} */
  let roleDraft = $state({});

  let canCreateAdministrators = $derived(data.actor?.can_manage_administrators === true);

  /** The role the row is about to save. The select writes it; the server decides. */
  function shownRole(/** @type {any} */ m) {
    return roleDraft[m.user_id] ?? m.role;
  }

  /** Areas the role can be given. Employees get the short list. */
  function permissionKeys(/** @type {string} */ role) {
    if (role === 'EMPLOYEE') return EMPLOYEE_PERMISSIONS;
    if (role === 'ADMIN') return ALL_PERMISSIONS;
    return [];
  }

  /**
   * Which boxes start checked.
   *
   * A legacy administrator has no list, which means every area. An employee
   * with no list records the day's work only. Changing the select before
   * saving starts from that role's usual set.
   */
  function grantChecked(/** @type {any} */ m, /** @type {string} */ key) {
    const role = shownRole(m);
    if (role !== m.role) {
      if (role === 'EMPLOYEE') return key === 'daily_work';
      if (role === 'ADMIN') return key === 'sell' || key === 'serve' || key === 'daily_work';
      return false;
    }
    if (role === 'EMPLOYEE') {
      if (!Array.isArray(m.granted_permissions)) return key === 'daily_work';
      return m.granted_permissions.includes(key);
    }
    if (!Array.isArray(m.granted_permissions)) return true;
    return m.granted_permissions.includes(key);
  }

  /** A CEO edits anyone else. An administrator edits employees only, and never a CEO. */
  function canEditRow(/** @type {any} */ m) {
    if (m.is_you) return false;
    if (m.role === 'CEO' && data.actor?.role !== 'CEO') return false;
    if (canCreateAdministrators) return true;
    return m.role === 'EMPLOYEE';
  }

  /** A submit handler that flips `busy` while the action runs. */
  const working = () => {
    busy = true;
    return async (/** @type {any} */ { update }) => {
      await update();
      busy = false;
    };
  };

  /** The invite form both submits and, on success, closes itself. */
  const inviteSubmit = () => {
    busy = true;
    return async (/** @type {any} */ { update, result }) => {
      await update();
      busy = false;
      if (result?.type === 'success' && result?.data?.invited) inviting = false;
    };
  };
</script>

{#if data.forbidden}
  <PageHeader title={tx('People')} />
  <div class="v2-pad" style="padding-top:40px">
    <NextAction
      label={tx('Admins only')}
      text="Managing people, roles and access is limited to organization admins. Ask an admin on your team if you need someone added or a role changed."
    />
  </div>
{:else}
  <PageHeader title={tx('People')}>
    {#snippet sub()}
      <span class="v2-num">{count(data.totals.people)}</span> {tx('people ·')}
      <span class="v2-num">{count(data.totals.admins)}</span> {tx('admins')}
    {/snippet}
    {#snippet actions()}
      <span style="display:inline-flex;gap:8px;flex-wrap:wrap">
        {#if canCreateAdministrators}
          <button class="v2-btn v2-btn-primary" onclick={() => openInvite('ADMIN')}>
            <UserPlus />{tx('Create administrator')}
          </button>
        {/if}
        <button
          class={canCreateAdministrators ? 'v2-btn' : 'v2-btn v2-btn-primary'}
          onclick={() => openInvite('EMPLOYEE')}
        >
          <UserPlus />{tx('Create employee')}
        </button>
      </span>
    {/snippet}
  </PageHeader>

  <div class="v2-pad" style="padding-top:16px;flex:none">
    <div class="v2-stats">
      <StatCard label={tx('Active people')} value={count(data.totals.count)} tone="ink" />
      <StatCard
        label={tx('Admins')}
        value={count(data.totals.admins)}
        tone="clay"
        detail={tx(
          'The CEO chooses an administrator\'s permissions. An administrator chooses a few functions for each employee.'
        )}
      />
      <StatCard
        label={tx('Never signed in')}
        value={count(data.totals.never_signed_in)}
        tone={data.totals.never_signed_in ? 'clay' : 'slate'}
        detail={data.totals.never_signed_in ? tx('Invited, seat unclaimed') : tx('Everyone has signed in')}
      />
      <StatCard label={tx('Deactivated')} value={count(data.totals.deactivated)} tone="slate" />
    </div>
  </div>

  <div class="v2-scroll">
    <div class="v2-pad" style="padding-bottom:32px">
      {#if inviting}
        <form
          method="POST"
          action="?/invite"
          use:enhance={inviteSubmit}
          class="v2-card"
          style="padding:14px 15px;margin-bottom:18px;display:flex;flex-direction:column;gap:12px"
        >
          <b>
            {inviteRole === 'ADMIN' ? tx('Creating an administrator') : tx('Creating an employee')}
          </b>
          <input type="hidden" name="role" value={inviteRole} />
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end">
            <div style="flex:1;min-width:180px">
              <label class="v2-label" for="invite-name" style="display:block;margin-bottom:4px">
                {tx('Name')}
              </label>
              <input
                id="invite-name"
                name="name"
                type="text"
                required
                maxlength="255"
                autocomplete="name"
                class="v2-input"
                style="width:100%"
              />
            </div>
            <div style="flex:1;min-width:180px">
              <label class="v2-label" for="invite-username" style="display:block;margin-bottom:4px">
                {tx('Username')}
              </label>
              <input
                id="invite-username"
                name="username"
                type="text"
                required
                maxlength="254"
                autocomplete="off"
                class="v2-input"
                style="width:100%"
                placeholder="ana"
              />
            </div>
            <div style="flex:1;min-width:180px">
              <label class="v2-label" for="invite-password" style="display:block;margin-bottom:4px">
                {tx('Password')}
              </label>
              <input
                id="invite-password"
                name="password"
                type="password"
                required
                minlength="8"
                maxlength="256"
                autocomplete="new-password"
                class="v2-input"
                style="width:100%"
              />
            </div>
          </div>
          <p class="v2-sub" style="font-size:11.5px;margin:0">
            {tx(
              'They sign in with this username and the password. No @ is required. An employee does not create the account.'
            )}
          </p>
          {#if permissionKeys(inviteRole).length}
            {#key inviteRole}
              <div style="display:flex;gap:12px;flex-wrap:wrap">
                <span class="v2-label">{tx('Permissions')}</span>
                {#each permissionKeys(inviteRole) as key (key)}
                  <label style="display:inline-flex;gap:6px;align-items:center;font-size:13px">
                    <input
                      type="checkbox"
                      name="permissions"
                      value={key}
                      checked={inviteRole === 'EMPLOYEE'
                        ? key === 'daily_work'
                        : key === 'sell' || key === 'serve' || key === 'daily_work'}
                    />
                    {tx(PERMISSION_LABEL[key])}
                  </label>
                {/each}
                <span class="v2-sub" style="flex-basis:100%;font-size:11.5px">
                  {inviteRole === 'EMPLOYEE'
                    ? tx(
                        'An employee can record the day\'s work, handle tickets and tasks, or work on sales. They cannot open billing, settings, or the team.'
                      )
                    : tx('The CEO chooses what this administrator can open.')}
                </span>
              </div>
            {/key}
          {/if}
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <button class="v2-btn v2-btn-primary" disabled={busy}>{tx('Create profile')}</button>
            <button type="button" class="v2-btn" disabled={busy} onclick={() => (inviting = false)}>
              {tx('Cancel')}
            </button>
          </div>
          {#if form?.invite?.error}
            <p class="v2-sub" style="color:var(--v2-rust);font-size:12px;margin:0">
              {form.invite.error}
            </p>
          {/if}
        </form>
      {/if}

      {#if form?.invited}
        <p
          class="v2-sub"
          style="color:var(--v2-moss);font-size:12.5px;margin:0 0 16px;font-weight:550"
        >
          {form.reused
            ? tx(
                '{username} already had an account. They sign in with the password they already use.',
                { username: form.invited }
              )
            : tx('{username} can sign in with this username and the password you set.', {
                username: form.invited
              })}
        </p>
      {:else if form?.error}
        <div style="margin-bottom:16px">
          <NextAction label={tx('That did not work')} text={form.error} tone="rust" />
        </div>
      {/if}

      {#if data.totals.tokens_on_deactivated}
        <!--
          A dormant liability, not a live one. Deactivating a profile already
          stops its tokens at login (resolve_valid_pat checks profile.is_active),
          but it does not revoke the PersonalAccessToken rows. They would
          authenticate again if the account were reactivated. Worth clearing as
          part of offboarding, hence clay rather than rust.
        -->
        <div style="margin-bottom:20px">
          <NextAction
            label={tx('Loose end')}
            text={`${data.totals.tokens_on_deactivated} API ${data.totals.tokens_on_deactivated === 1 ? tx('token belongs') : tx('tokens belong')} to a deactivated account. Deactivating already stops them at login, but they are not revoked. Reactivating the account would bring them back. Revoke to close that off.`}
            action="Review tokens"
            href="/settings/api-tokens"
          />
        </div>
      {/if}

      <div class="v2-label" style="margin-bottom:10px">{tx('People')}</div>
      <div class="v2-table-wrap" style="margin-bottom:26px">
        <table class="v2-table">
          <thead>
            <tr>
              <th>{tx('Person')}</th>
              <th>{tx('Role')}</th>
              <th>{tx('Status')}</th>
              <th>{tx('Teams')}</th>
              <th data-m="hide">{tx('Tokens')}</th>
              <th class="v2-r">{tx('Last signed in')}</th>
              <th class="v2-r">{tx('Manage')}</th>
            </tr>
          </thead>
          <tbody>
            {#each [...(data.concealed ?? []), ...data.active, ...data.inactive] as m (m.id)}
              {@const isLastAdmin = m.user_id === data.last_admin_id}
              <tr style={m.activity_visible !== false && !m.is_active ? 'opacity:.62' : ''}>
                <td>
                  <span style="display:flex;gap:9px;align-items:center">
                    <Avatar name={m.name} size={27} />
                    <span style="min-width:0">
                      <span class="v2-table-primary">
                        {m.name}{#if m.is_you}<span class="v2-sub" style="font-weight:400"
                            >{tx(', you')}</span
                          >{/if}
                      </span>
                      <span class="v2-table-secondary" style="display:block">{m.email}</span>
                    </span>
                  </span>
                </td>
                <td data-m="tag">
                  <Pill
                    tone={m.activity_visible !== false && !m.is_active ? 'slate' : ROLE_TONE[m.role]}
                    >{ROLE_LABEL[m.role]}</Pill
                  >
                </td>
                <td>
                  {#if m.activity_visible === false}
                    <span class="v2-muted" title={tx('Only the CEO sees whether this account is active.')}
                      >—</span
                    >
                  {:else if m.is_active}
                    <Pill tone="moss">{tx('Active')}</Pill>
                  {:else}
                    <Pill tone="slate">{tx('Inactive')}</Pill>
                  {/if}
                </td>
                <td>
                  {#if m.teams.length}
                    {m.teams.join(', ')}
                  {:else}
                    <span class="v2-muted">—</span>
                  {/if}
                </td>
                <td data-m="hide">
                  {#if m.active_token_count}
                    <a
                      href={resolve('/settings/api-tokens')}
                      style="display:inline-flex;gap:5px;align-items:center;color:{m.is_active
                        ? 'inherit'
                        : 'var(--v2-clay)'};font-weight:{m.is_active ? 400 : 600}"
                    >
                      <KeyRound size={13} />
                      <span class="v2-num">{m.active_token_count}</span>
                    </a>
                  {:else}
                    <span class="v2-muted">—</span>
                  {/if}
                </td>
                <td class="v2-r">
                  {#if m.activity_visible === false}
                    <span class="v2-muted">—</span>
                  {:else if m.last_login}
                    {relativeDays(m.last_login)}
                  {:else}
                    <span style="color:var(--v2-clay);font-weight:600">{tx('never')}</span>
                  {/if}
                </td>
                <td class="v2-r">
                  {#if !canEditRow(m)}
                    <span class="v2-muted" style="font-size:11.5px">—</span>
                  {:else}
                    <span
                      style="display:inline-flex;gap:6px;justify-content:flex-end;flex-wrap:wrap"
                    >
                      <!-- The last person with every permission cannot be
                           demoted here. The server enforces that too. An
                           administrator can change an employee's functions
                           and cannot promote them. -->
                      <form
                        method="POST"
                        action="?/setRole"
                        use:enhance={working}
                        style="display:flex;flex-direction:column;gap:6px;align-items:flex-end"
                      >
                        <input type="hidden" name="userId" value={m.user_id} />
                        {#if canCreateAdministrators}
                          <span style="display:inline-flex;gap:6px;align-items:center">
                            <select
                              name="role"
                              class="v2-input"
                              style="width:150px"
                              disabled={busy || isLastAdmin}
                              onchange={(e) => (roleDraft[m.user_id] = e.currentTarget.value)}
                            >
                              {#each data.roles as role (role)}
                                <option value={role} selected={role === m.role}>
                                  {ROLE_LABEL[role] ?? role}
                                </option>
                              {/each}
                            </select>
                            <button class="v2-btn v2-btn-sm" disabled={busy || isLastAdmin}>
                              {tx('Save role')}
                            </button>
                          </span>
                        {:else}
                          <input type="hidden" name="role" value="EMPLOYEE" />
                          <button class="v2-btn v2-btn-sm" disabled={busy}>
                            {tx('Save permissions')}
                          </button>
                        {/if}
                        {#if permissionKeys(shownRole(m)).length}
                          <span
                            style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;max-width:280px"
                          >
                            {#each permissionKeys(shownRole(m)) as key (key)}
                              <label
                                style="display:inline-flex;gap:4px;align-items:center;font-size:11.5px"
                              >
                                <input
                                  type="checkbox"
                                  name="permissions"
                                  value={key}
                                  checked={grantChecked(m, key)}
                                  disabled={busy || isLastAdmin}
                                />
                                {tx(PERMISSION_LABEL[key])}
                              </label>
                            {/each}
                          </span>
                        {/if}
                      </form>
                      <!-- Activate / deactivate. The last active admin cannot
                           be deactivated; the server refuses it with a 400. -->
                      <form method="POST" action="?/setStatus" use:enhance={working}>
                        <input type="hidden" name="userId" value={m.user_id} />
                        <input
                          type="hidden"
                          name="status"
                          value={m.is_active ? 'Inactive' : 'Active'}
                        />
                        <button
                          class="v2-btn v2-btn-sm"
                          disabled={busy || (m.is_active && isLastAdmin)}
                          title={m.is_active && isLastAdmin
                            ? tx('The org must keep at least one active admin')
                            : ''}
                          style={m.is_active ? 'color:var(--v2-rust)' : ''}
                        >
                          {m.is_active ? tx('Deactivate') : tx('Reactivate')}
                        </button>
                      </form>
                    </span>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      {#if !data.teamsForbidden}
        <div class="v2-label" style="margin-bottom:10px">{tx('Teams')}</div>
        <div class="v2-card" style="overflow:hidden;margin-bottom:14px">
          {#each data.teams as t (t.id)}
            <div class="v2-setting">
              <div class="v2-setting-body">
                <b>{t.name}</b>
                <span class="v2-sub" style="font-size:11.5px">{t.description}</span>
              </div>
              <span class="v2-sub v2-num" style="font-size:12px">
                {t.member_count}
                {t.member_count === 1 ? tx('member') : tx('members')}
              </span>
            </div>
          {:else}
            <div class="v2-setting">
              <span class="v2-sub" style="font-size:12px">{tx('No teams yet.')}</span>
            </div>
          {/each}
        </div>
      {/if}

      <p class="v2-sub" style="font-size:11.5px">
        {tx(
          'A CEO creates administrators and employees here, and sees who is active. An administrator creates employees and sees who is active, except the CEO. An employee does not create accounts. They sign in with the username and password they were given.'
        )}
      </p>
    </div>
  </div>
{/if}

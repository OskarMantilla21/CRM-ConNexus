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
  import { enhance } from '$app/forms';
  import { UserPlus, KeyRound } from '@lucide/svelte';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();

  let inviting = $state(false);
  let busy = $state(false);

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
  <PageHeader title={tx('Team and access')} />
  <div class="v2-pad" style="padding-top:40px">
    <NextAction
      label={tx('Admins only')}
      text="Managing people, roles and access is limited to organization admins. Ask an admin on your team if you need someone added or a role changed."
    />
  </div>
{:else}
  <PageHeader title={tx('Team and access')}>
    {#snippet sub()}
      <span class="v2-num">{count(data.totals.count)}</span> {tx('people ·')}
      <span class="v2-num">{count(data.totals.admins)}</span> {tx('admins')}
    {/snippet}
    {#snippet actions()}
      <button class="v2-btn v2-btn-primary" onclick={() => (inviting = !inviting)}>
        <UserPlus />{tx('Invite')}
      </button>
    {/snippet}
  </PageHeader>

  <div class="v2-pad" style="padding-top:16px;flex:none">
    <div class="v2-stats">
      <StatCard label={tx('Active people')} value={count(data.totals.count)} tone="ink" />
      <StatCard
        label={tx('Admins')}
        value={count(data.totals.admins)}
        tone="clay"
        detail={tx('Can change roles and org settings')}
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
          style="padding:14px 15px;margin-bottom:18px;display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap"
        >
          <div style="flex:1;min-width:220px">
            <label class="v2-label" for="invite-email" style="display:block;margin-bottom:4px">
              Invite by email
            </label>
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              class="v2-input"
              style="width:100%"
              placeholder={tx('name@company.com')}
            />
          </div>
          <div>
            <label class="v2-label" for="invite-role" style="display:block;margin-bottom:4px">
              Role
            </label>
            <select id="invite-role" name="role" class="v2-input" style="width:130px">
              <option value="USER">{tx('Member')}</option>
              <option value="ADMIN">{tx('Admin')}</option>
            </select>
          </div>
          <button class="v2-btn v2-btn-primary" disabled={busy}>{tx('Send invite')}</button>
          <button type="button" class="v2-btn" disabled={busy} onclick={() => (inviting = false)}>
            Cancel
          </button>
          {#if form?.invite?.error}
            <p
              class="v2-sub"
              style="color:var(--v2-rust);font-size:12px;flex-basis:100%;margin:2px 0 0"
            >
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
          {form.invited} is a member now. They show below as “never” signed in until they log in with
          that email.
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
              <th>{tx('Teams')}</th>
              <th data-m="hide">{tx('Tokens')}</th>
              <th class="v2-r">{tx('Last signed in')}</th>
              <th class="v2-r">{tx('Manage')}</th>
            </tr>
          </thead>
          <tbody>
            {#each [...data.active, ...data.inactive] as m (m.id)}
              {@const isLastAdmin = m.user_id === data.last_admin_id}
              <tr style={m.is_active ? '' : 'opacity:.62'}>
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
                  <Pill tone={m.is_active ? ROLE_TONE[m.role] : 'slate'}>{ROLE_LABEL[m.role]}</Pill>
                  {#if !m.is_active}
                    <span class="v2-table-secondary" style="display:block">{tx('Deactivated')}</span>
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
                  {#if m.last_login}
                    {relativeDays(m.last_login)}
                  {:else}
                    <span style="color:var(--v2-clay);font-weight:600">{tx('never')}</span>
                  {/if}
                </td>
                <td class="v2-r">
                  {#if m.is_you}
                    <span class="v2-muted" style="font-size:11.5px">—</span>
                  {:else}
                    <span
                      style="display:inline-flex;gap:6px;justify-content:flex-end;flex-wrap:wrap"
                    >
                      <!-- Role toggle. Two roles, so one button naming the
                           destination is clearer than a picker. The last admin
                           cannot be demoted; the server enforces it too. -->
                      <form method="POST" action="?/setRole" use:enhance={working}>
                        <input type="hidden" name="userId" value={m.user_id} />
                        <input
                          type="hidden"
                          name="role"
                          value={m.role === 'ADMIN' ? 'USER' : 'ADMIN'}
                        />
                        <button
                          class="v2-btn v2-btn-sm"
                          disabled={busy || (m.role === 'ADMIN' && isLastAdmin)}
                          title={m.role === 'ADMIN' && isLastAdmin
                            ? tx('The org must keep at least one admin')
                            : ''}
                        >
                          {m.role === 'ADMIN' ? tx('Make member') : tx('Make admin')}
                        </button>
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
              {t.member_count === 1 ? 'member' : 'members'}
            </span>
          </div>
        {:else}
          <div class="v2-setting">
            <span class="v2-sub" style="font-size:12px">{tx('No teams yet.')}</span>
          </div>
        {/each}
      </div>

      <p class="v2-sub" style="font-size:11.5px">
        Roles are Admin and Member, the only two the API recognises. Admins can invite people,
        change roles and edit org settings; the server refuses to let anyone change their own role
        or deactivate the last admin. Editing team membership is not available here yet.
      </p>
    </div>
  </div>
{/if}

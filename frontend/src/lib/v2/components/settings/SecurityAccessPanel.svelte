<script>
  /**
   * Roles, the password rules the server already enforces, and the audit log.
   * Assigning an employee's functions happens on the employee screen. Creating
   * an administrator happens here, because that is an access decision.
   */
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { tx } from '$lib/i18n/translate.js';
  import Pill from '$lib/v2/components/Pill.svelte';
  import EmptyState from '$lib/v2/components/EmptyState.svelte';
  import PersonForm from '$lib/v2/components/PersonForm.svelte';
  import { auditActor, auditDetail } from '$lib/v2/audit-log.js';
  import { relativeTime } from '$lib/v2/format.js';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();

  let creating = $state(false);
  let busy = $state(false);

  const inviteSubmit = () => {
    busy = true;
    return async (/** @type {any} */ { update, result }) => {
      await update();
      busy = false;
      if (result?.type === 'success' && result?.data?.invited) creating = false;
    };
  };

  const ROLES = [
    {
      name: 'CEO',
      body: 'Can do everything, connects assistants, and creates administrators.'
    },
    {
      name: 'Admin',
      body: 'Opens the areas the CEO ticks. Creates employees, not other administrators.'
    },
    {
      name: 'Member',
      body: 'Works in the areas a member already had. Does not manage the team.'
    },
    {
      name: 'Employee',
      body: "Records the day's work, handles tickets and tasks, or works on sales. Cannot open billing, settings, or the team."
    }
  ];
</script>

<div class="v2-pad" style="padding-top:18px;padding-bottom:32px">
  <div class="v2-label" style="margin-bottom:10px">{tx('Roles')}</div>
  <div class="v2-card" style="overflow:hidden;margin-bottom:18px">
    {#each ROLES as role (role.name)}
      <div class="v2-setting">
        <div class="v2-setting-body">
          <b>{tx(role.name)}</b>
          <span class="v2-sub" style="font-size:11.5px">{tx(role.body)}</span>
        </div>
      </div>
    {/each}
  </div>

  {#if data.actor?.can_manage_administrators}
    {#if !creating}
      <button class="v2-btn v2-btn-primary" type="button" style="margin-bottom:18px" onclick={() => (creating = true)}>
        {tx('Create administrator')}
      </button>
    {:else}
      <PersonForm
        role="ADMIN"
        {busy}
        error={form?.invite?.error || ''}
        onsubmit={inviteSubmit}
        oncancel={() => (creating = false)}
      />
    {/if}
    {#if form?.invited}
      <p class="ok">
        {tx('{username} can sign in with this username and the password you set.', { username: form.invited })}
      </p>
    {/if}
  {/if}

  <div class="v2-label" style="margin:8px 0 10px">{tx('Password policy')}</div>
  <div class="v2-card" style="padding:14px 16px;margin-bottom:18px">
    <p class="v2-sub" style="margin:0 0 8px">
      {tx('These are the rules sign-in and new accounts already follow. This screen cannot loosen them.')}
    </p>
    <ul class="rules">
      <li>{tx('At least 8 characters.')}</li>
      <li>{tx('Not too similar to the name or the email.')}</li>
      <li>{tx('Not a commonly used password.')}</li>
      <li>{tx('Not entirely numeric.')}</li>
    </ul>
  </div>

  <div class="v2-label" style="margin-bottom:10px">{tx('API access')}</div>
  <div class="v2-card" style="overflow:hidden;margin-bottom:22px">
    <a class="v2-setting" href={resolve('/settings/api-tokens')}>
      <div class="v2-setting-body">
        <b>{tx('API tokens')}</b>
        <span class="v2-sub" style="font-size:11.5px">{tx('Personal access tokens for scripts, integrations and AI agents.')}</span>
      </div>
    </a>
    {#if data.can_edit}
      <a class="v2-setting" href={resolve('/settings/webhooks')}>
        <div class="v2-setting-body">
          <b>{tx('Webhooks')}</b>
          <span class="v2-sub" style="font-size:11.5px">{tx('Send record changes to Zapier, n8n, Slack or your own code.')}</span>
        </div>
      </a>
    {/if}
  </div>

  <div class="v2-label" style="margin-bottom:10px">{tx('Audit log')}</div>
  {#if !data.audit || data.audit.forbidden}
    <p class="v2-sub">{tx('The audit log records who signed in, from where, and what was refused, so only admins can read it.')}</p>
  {:else if !data.audit.entries?.length}
    <EmptyState
      title={tx('Nothing recorded yet')}
      body={tx('Sign-ins, org switches, refused requests, webhook pauses and API token or calendar feed changes appear here as they happen.')}
    />
  {:else}
    <div class="v2-table-wrap">
      <table class="v2-table">
        <thead>
          <tr>
            <th>{tx('Event')}</th>
            <th>{tx('Result')}</th>
            <th>{tx('Person')}</th>
            <th>{tx('When')}</th>
          </tr>
        </thead>
        <tbody>
          {#each data.audit.entries as entry (entry.id)}
            <tr>
              <td>
                <div class="v2-table-primary">
                  {entry.event_type === 'FILE_DELETED' ? tx('File or document deleted') : entry.event_label}
                </div>
                {#if auditDetail(entry)}
                  <div class="v2-table-secondary">{auditDetail(entry)}</div>
                {/if}
              </td>
              <td><Pill tone={entry.success ? 'moss' : 'rust'}>{entry.success ? tx('OK') : tx('Refused')}</Pill></td>
              <td>{auditActor(entry)}</td>
              <td class="v2-muted">{relativeTime(entry.created_at)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <p style="margin-top:12px">
      <a class="v2-btn v2-btn-sm" href={resolve('/settings/audit-log')}>{tx('Open the full audit log')}</a>
      <a class="v2-btn v2-btn-sm" href={resolve('/settings/audit-log?event_type=FILE_DELETED')} style="margin-left:8px">
        {tx('Deleted files and documents')}
      </a>
    </p>
  {/if}
</div>

<style>
  .rules {
    margin: 0;
    padding-left: 18px;
    font-size: 13px;
  }
  .ok {
    color: var(--v2-moss);
    font-size: 13px;
    margin: 0 0 16px;
  }
</style>

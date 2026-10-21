<script>
  import { resolve } from '$app/paths';
  import { enhance } from '$app/forms';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import SettingsCrumb from '$lib/v2/components/SettingsCrumb.svelte';
  import { tx } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/migrate.js';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();

  const LABELS = {
    account: 'Accounts',
    contact: 'Contacts',
    lead: 'Leads',
    opportunity: 'Deals',
    case: 'Tickets',
    task: 'Tasks',
    invoice: 'Invoices',
    estimate: 'Estimates',
    product: 'Products',
    tags: 'Tags'
  };

  let direction = $state('import');
  let orgId = $state('');
  let confirmName = $state('');
  let busy = $state(false);

  let organizations = $derived(data.organizations ?? []);
  let chosen = $derived(organizations.find((/** @type {{ id: string }} */ org) => org.id === orgId));

  const submit = () => {
    busy = true;
    return async (/** @type {any} */ { update }) => {
      await update();
      busy = false;
      confirmName = '';
    };
  };
</script>

<PageHeader title={tx('Move records')}>
  {#snippet crumb()}<SettingsCrumb />{/snippet}
  {#snippet sub()}
    {tx('Bring records in from another company, or send this company\'s records out.')}
  {/snippet}
</PageHeader>

<div class="v2-pad" style="padding-top:18px;padding-bottom:32px;max-width:720px">
  {#if data.forbidden}
    <p class="v2-sub">{tx("Only the CEO can move a company's records.")}</p>
  {:else if !organizations.length}
    <p class="v2-sub">
      {tx(
        'You are the CEO of this company only. To move records you also have to be the CEO of the other company.'
      )}
    </p>
  {:else}
    <p class="v2-sub" style="margin-bottom:14px;max-width:68ch">
      {tx(
        'Move every record from one company to another. Both companies stay. People, keys, tokens and webhooks stay where they are. A record assigned to someone who also belongs to the destination stays with that person.'
      )}
    </p>
    <p class="warn">
      {tx('This takes the records out of the company they leave. This screen cannot undo it.')}
    </p>

    {#if form?.moved}
      <p class="ok" role="status">
        {#if form.total}
          {tx('Moved {n} records.', { n: form.total })}
        {:else}
          {tx('There were no records to move.')}
        {/if}
      </p>
      {#if form.details?.length}
        <ul class="counts">
          {#each form.details as row (row.model)}
            <li>
              {tx(LABELS[row.model] || row.model)}
              <span class="v2-num">{row.count}</span>
            </li>
          {/each}
        </ul>
      {/if}
      {#if form.renamed}
        <p class="v2-sub">{tx('Renamed {n} so they would not clash with records already there.', { n: form.renamed })}</p>
      {/if}
      {#if form.reassigned}
        <p class="v2-sub">{tx('Reassigned {n}.', { n: form.reassigned })}</p>
      {/if}
      {#if form.unassigned}
        <p class="v2-sub">
          {tx('Removed {n} assignments because that person is not in the destination company.', {
            n: form.unassigned
          })}
        </p>
      {/if}
    {:else if form?.error}
      <p class="err" role="alert">{form.error}</p>
    {/if}

    <form class="v2-form" method="POST" action="?/move" use:enhance={submit}>
      <fieldset class="choices">
        <label>
          <input type="radio" name="direction" value="import" bind:group={direction} />
          {tx('Bring every record into this company')}
        </label>
        <label>
          <input type="radio" name="direction" value="export" bind:group={direction} />
          {tx('Send every record to another company')}
        </label>
      </fieldset>

      <div class="v2-field">
        <label for="other-org">{tx('Other company')}</label>
        <select id="other-org" name="org_id" class="v2-input" bind:value={orgId} required>
          <option value="">{tx('Choose a company')}</option>
          {#each organizations as org (org.id)}
            <option value={org.id}>{org.name}</option>
          {/each}
        </select>
      </div>

      <div class="v2-field">
        <label for="confirm-name">{tx('Company name')}</label>
        <input
          id="confirm-name"
          name="confirm_name"
          class="v2-input"
          bind:value={confirmName}
          autocomplete="off"
          required
          disabled={!chosen}
        />
        {#if chosen}
          <p class="v2-hint">{tx('Type {name} to confirm', { name: chosen.name })}</p>
        {/if}
      </div>

      <button class="v2-btn v2-btn-primary" type="submit" disabled={busy || !chosen}>
        {tx('Move the records')}
      </button>
    </form>
  {/if}

  <p class="v2-sub" style="margin-top:18px;font-size:12px">
    <a href={resolve('/settings')}>{tx('Settings')}</a>
  </p>
</div>

<style>
  .warn,
  .ok,
  .err {
    margin: 0 0 12px;
    font-size: 13px;
  }
  .warn,
  .err {
    color: var(--v2-rust);
  }
  .ok {
    color: var(--v2-moss);
  }
  .choices {
    border: 0;
    margin: 0 0 16px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .choices label {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    font-size: 14px;
  }
  .counts {
    margin: 0 0 12px;
    padding-left: 18px;
    font-size: 13px;
  }
</style>

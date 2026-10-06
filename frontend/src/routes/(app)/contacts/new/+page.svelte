<script>
  import { tx, choiceLabel } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/sell.js';
  import { resolve } from '$app/paths';
  /**
   * Adding a person.
   *
   * Deliberately shorter than the edit form. Everything optional is left off
   * until there is a record to hang it on: address, LinkedIn, notes and the
   * inactive flag are all on the edit page, and a new contact is by definition
   * somebody who still works there.
   *
   * `?account=<id>` preselects the company, so "add somebody at this account"
   * arrives with the account already chosen.
   */
  import { tick, untrack } from 'svelte';
  import { enhance } from '$app/forms';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import DuplicateNotice from '$lib/v2/components/DuplicateNotice.svelte';
  import { ChevronRight, TriangleAlert } from '@lucide/svelte';

  /** @type {{ data: any, form: any }} */
  let { data, form: result } = $props();

  // `untrack` so a re-render after a failed save does not throw away what the
  // person typed; `result.values` is the server's echo of the same fields.
  let form = $state(
    untrack(() => ({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      title: '',
      department: '',
      organization: '',
      account: data.defaults.account ?? '',
      assigned_to: '',
      do_not_call: false,
      ...(result?.values ?? {})
    }))
  );
  let touched = $state(/** @type {Record<string, boolean>} */ ({}));
  let submitted = $state(false);

  let errors = $derived.by(() => {
    /** @type {Record<string, string>} */
    const e = {};
    if (!form.first_name.trim()) e.first_name = tx('A person needs a first name.');
    if (!form.last_name.trim()) e.last_name = tx('A person needs a last name.');

    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      e.email = tx('That does not look like an email address.');

    // The exact regex from `flexible_phone_validator`. Extensions like "x123"
    // are rejected by the model, so they are caught at the field rather than
    // as an opaque whole-form refusal after the save.
    if (form.phone && !/^[\d\s\-()+.]{7,25}$/.test(form.phone))
      e.phone = tx('7 to 25 characters: digits, spaces, brackets, dots, dashes. No extensions.');

    return e;
  });

  let valid = $derived(Object.keys(errors).length === 0);
  const show = (/** @type {string} */ field) => (touched[field] || submitted) && errors[field];

  /** @type {import('./$types').SubmitFunction} */
  const check = async ({ cancel }) => {
    submitted = true;
    if (!valid) {
      cancel();
      await tick();
      /** @type {HTMLElement | null} */
      const first = document.querySelector('[aria-invalid="true"]');
      first?.focus();
    }
  };

  let chosenAccount = $derived(
    data.accounts.find((/** @type {any} */ a) => a.id === form.account) ?? null
  );
</script>

<PageHeader title={tx('New contact')} center>
  {#snippet crumb()}
    <a href={resolve('/contacts')}>{tx('Contacts')}</a>
    <ChevronRight size={12} />
    <span>{tx('New')}</span>
  {/snippet}
  {#snippet sub()}
    {tx('A person at an account. Everything optional can wait until they exist.')}
  {/snippet}
</PageHeader>

<div class="v2-scroll v2-pad" style="padding-top:18px">
  <form class="v2-form" method="POST" action="?/create" use:enhance={check} novalidate>
    {#if result?.error}
      <div
        class="v2-next"
        style="background:color-mix(in srgb, var(--v2-rust) 9%, transparent);border-color:color-mix(in srgb, var(--v2-rust) 28%, transparent);margin-bottom:18px"
        role="alert"
      >
        <TriangleAlert size={17} style="color:var(--v2-rust);flex:none" />
        <div class="v2-next-body">
          <div style="font-weight:600">{tx('The server refused this contact')}</div>
          <div class="v2-sub" style="margin-top:2px">{result.error}</div>
        </div>
      </div>
    {/if}

    {#if submitted && !valid}
      <div
        class="v2-next"
        style="background:color-mix(in srgb, var(--v2-rust) 9%, transparent);border-color:color-mix(in srgb, var(--v2-rust) 28%, transparent);margin-bottom:18px"
        role="alert"
      >
        <TriangleAlert size={17} style="color:var(--v2-rust);flex:none" />
        <div class="v2-next-body">
          <div style="font-weight:600">
            {Object.keys(errors).length === 1
              ? tx('1 field still needs you')
              : tx('{n} fields still need you', { n: Object.keys(errors).length })}
          </div>
          <div class="v2-sub" style="margin-top:2px">{tx('Nothing has been created.')}</div>
        </div>
      </div>
    {/if}

    <div class="pair">
      <div class="v2-field">
        <label for="f-first">{tx('First name')}</label>
        <input
          id="f-first"
          name="first_name"
          class="v2-input"
          bind:value={form.first_name}
          onblur={() => (touched.first_name = true)}
          aria-invalid={show('first_name') ? 'true' : undefined}
        />
        {#if show('first_name')}<p class="v2-error">{errors.first_name}</p>{/if}
      </div>
      <div class="v2-field">
        <label for="f-last">{tx('Last name')}</label>
        <input
          id="f-last"
          name="last_name"
          class="v2-input"
          bind:value={form.last_name}
          onblur={() => (touched.last_name = true)}
          aria-invalid={show('last_name') ? 'true' : undefined}
        />
        {#if show('last_name')}<p class="v2-error">{errors.last_name}</p>{/if}
      </div>
    </div>

    <div class="pair">
      <div class="v2-field">
        <label for="f-email">{tx('Email')}</label>
        <input
          id="f-email"
          name="email"
          class="v2-input"
          type="email"
          bind:value={form.email}
          onblur={() => (touched.email = true)}
          aria-invalid={show('email') ? 'true' : undefined}
        />
        {#if show('email')}
          <p class="v2-error">{errors.email}</p>
        {:else}
          <p class="v2-hint">{tx('Has to be unique in this organisation, ignoring capitals.')}</p>
        {/if}
      </div>
      <div class="v2-field">
        <label for="f-phone">{tx('Phone')}</label>
        <input
          id="f-phone"
          name="phone"
          class="v2-input"
          bind:value={form.phone}
          onblur={() => (touched.phone = true)}
          aria-invalid={show('phone') ? 'true' : undefined}
        />
        {#if show('phone')}<p class="v2-error">{errors.phone}</p>{/if}
      </div>
    </div>

    <div class="pair">
      <div class="v2-field">
        <label for="f-title">{tx('Job title')}</label>
        <input id="f-title" name="title" class="v2-input" bind:value={form.title} />
      </div>
      <div class="v2-field">
        <label for="f-dept">{tx('Department')}</label>
        <input id="f-dept" name="department" class="v2-input" bind:value={form.department} />
      </div>
    </div>

    <div class="pair">
      <div class="v2-field">
        <label for="f-account">{tx('Account')}</label>
        <select id="f-account" name="account" class="v2-input" bind:value={form.account}>
          <option value="">{tx('Not linked')}</option>
          {#each data.accounts as a (a.id)}
            <option value={a.id}>{a.name}</option>
          {/each}
        </select>
        {#if chosenAccount}
          <p class="v2-hint">{tx("Also adds them to {name}'s people.", { name: chosenAccount.name })}</p>
        {:else if data.account_total > data.accounts.length}
          <p class="v2-hint">
            {tx('Showing')} <span class="v2-num">{data.accounts.length}</span> {tx('of')}
            <span class="v2-num">{data.account_total}</span> {tx('accounts.')}
          </p>
        {:else}
          <p class="v2-hint">{tx('Can be left empty and set later.')}</p>
        {/if}
      </div>
      <div class="v2-field">
        <label for="f-owner">{tx('Owner')}</label>
        <select id="f-owner" name="assigned_to" class="v2-input" bind:value={form.assigned_to}>
          <option value="">{tx('Nobody')}</option>
          {#each data.owners as o (o.id)}
            <option value={o.id}>{o.name}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="v2-field">
      <label for="f-org">{tx('Company typed in')}</label>
      <input id="f-org" name="organization" class="v2-input" bind:value={form.organization} />
      <p class="v2-hint">
        {tx('Only needed when there is no account to link, an imported record, or a company nobody has created yet.')}
      </p>
    </div>

    <label class="flag">
      <input type="checkbox" name="do_not_call" bind:checked={form.do_not_call} />
      <span>
        <strong>{tx('Do not call')}</strong>
        <span class="v2-sub">{tx('Tick if they have already asked not to be phoned.')}</span>
      </span>
    </label>

    <DuplicateNotice
      module="contacts"
      values={{
        email: form.email,
        phone: form.phone,
        first_name: form.first_name,
        last_name: form.last_name
      }}
    />

    <div class="actions">
      <button class="v2-btn v2-btn-primary" type="submit">{tx('Create contact')}</button>
      <a class="v2-btn" href={resolve('/contacts')}>{tx('Cancel')}</a>
    </div>
  </form>
</div>

<style>
  .pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .flag {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    font-size: 13px;
    margin: 4px 0 18px;
  }
  .flag span {
    display: block;
  }
  .flag .v2-sub {
    display: block;
    font-size: 11.5px;
    margin-top: 2px;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-top: 22px;
    padding-bottom: 40px;
  }
  @media (max-width: 720px) {
    .pair {
      grid-template-columns: 1fr;
    }
  }
</style>

<script>
  import { tx } from '$lib/i18n/translate.js';
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
      account: data.defaults.account ?? '',
      assigned_to: '',
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

<PageHeader title={tx('New contact')} center width="calc(720px + 2 * var(--v2-pad))">
  {#snippet crumb()}
    <a href={resolve('/contacts')}>{tx('Contacts')}</a>
    <ChevronRight size={12} />
    <span>{tx('New')}</span>
  {/snippet}
  {#snippet sub()}
    {tx('Name, a way to reach them, and the company they belong to.')}
  {/snippet}
</PageHeader>

<div class="v2-scroll v2-pad" style="padding-top:18px">
  <form class="v2-form v2-create" method="POST" action="?/create" use:enhance={check} novalidate>
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

    <section class="v2-create-section">
      <h2>{tx('About the person')}</h2>
      <div class="v2-create-grid">
        <div class="v2-field">
          <label class="req" for="f-first">{tx('First name')}</label>
          <input
            id="f-first"
            name="first_name"
            class="v2-input"
            autocomplete="given-name"
            bind:value={form.first_name}
            onblur={() => (touched.first_name = true)}
            aria-invalid={show('first_name') ? 'true' : undefined}
          />
          {#if show('first_name')}<p class="v2-error">{errors.first_name}</p>{/if}
        </div>
        <div class="v2-field">
          <label class="req" for="f-last">{tx('Last name')}</label>
          <input
            id="f-last"
            name="last_name"
            class="v2-input"
            autocomplete="family-name"
            bind:value={form.last_name}
            onblur={() => (touched.last_name = true)}
            aria-invalid={show('last_name') ? 'true' : undefined}
          />
          {#if show('last_name')}<p class="v2-error">{errors.last_name}</p>{/if}
        </div>
        <div class="v2-field">
          <label for="f-email">{tx('Email')}</label>
          <input
            id="f-email"
            name="email"
            class="v2-input"
            type="email"
            autocomplete="email"
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
            type="tel"
            autocomplete="tel"
            bind:value={form.phone}
            onblur={() => (touched.phone = true)}
            aria-invalid={show('phone') ? 'true' : undefined}
          />
          {#if show('phone')}<p class="v2-error">{errors.phone}</p>{/if}
        </div>
        <div class="v2-field wide">
          <label for="f-title">{tx('Job title')}</label>
          <input id="f-title" name="title" class="v2-input" autocomplete="organization-title" bind:value={form.title} />
        </div>
      </div>
    </section>

    <section class="v2-create-section">
      <h2>{tx('The company')}</h2>
      <div class="v2-create-grid">
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
    </section>

    <DuplicateNotice
      module="contacts"
      values={{
        email: form.email,
        phone: form.phone,
        first_name: form.first_name,
        last_name: form.last_name
      }}
    />

    <div class="v2-create-foot">
      <a class="v2-btn" href={resolve('/contacts')}>{tx('Cancel')}</a>
      <button class="v2-btn v2-btn-primary" type="submit">{tx('Create contact')}</button>
    </div>
  </form>
</div>

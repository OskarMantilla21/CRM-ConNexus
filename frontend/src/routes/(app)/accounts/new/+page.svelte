<script>
  import { resolve } from '$app/paths';
  /**
   * A new account.
   *
   * Deliberately short. An account earns its detail from the deals, people and
   * invoices that accumulate against it, and a fourteen-field form standing
   * between somebody and recording a company they just spoke to is how CRMs
   * end up full of records named "asdf". Name is the only thing required;
   * everything else is on the edit page when it is actually known.
   *
   * `org` and `created_by` are not on the form and are not in the request.
   * `AccountsListView.post` derives both from `request.profile`, which comes
   * from the JWT. The only place identity can safely come from.
   */
  import { tick, untrack } from 'svelte';
  import { enhance } from '$app/forms';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import DuplicateNotice from '$lib/v2/components/DuplicateNotice.svelte';
  import { ChevronRight, TriangleAlert } from '@lucide/svelte';
  import { industryLabel } from '$lib/v2/enums.js';
  import { tx } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/sell.js';

  /** @type {{ data: any, form: any }} */
  let { data, form: result } = $props();

  /* What was typed survives a rejected submit, and `untrack` keeps a
     revalidation from wiping it back to the defaults underneath the cursor. */
  let form = $state(
    untrack(() => ({
      name: '',
      website: '',
      industry: data.defaults.industry,
      phone: '',
      city: '',
      country: data.defaults.country,
      assigned_to: '',
      ...(result?.values ?? {})
    }))
  );

  let touched = $state(/** @type {Record<string, boolean>} */ ({}));
  let submitted = $state(false);

  let errors = $derived.by(() => {
    /** @type {Record<string, string>} */
    const e = {};
    if (!form.name.trim()) e.name = tx('Give the account the name you would search for.');

    // The exact regex from `flexible_phone_validator`.
    if (form.phone && !/^[\d\s\-()+.]{7,25}$/.test(form.phone))
      e.phone = tx('7 to 25 characters: digits, spaces, brackets, dots, dashes. No extensions.');

    return e;
  });

  let valid = $derived(Object.keys(errors).length === 0);
  const show = (/** @type {string} */ field) => (touched[field] || submitted) && errors[field];

  /**
   * The name must be unique in the org, case-insensitively. That check needs
   * the database, so it happens on the server and arrives as `result.error`.
   * This only stops submissions that are wrong on their face.
   *
   * @type {import('./$types').SubmitFunction}
   */
  const check = async ({ cancel }) => {
    submitted = true;
    if (!valid) {
      cancel();
      await tick();
      /** @type {HTMLElement | null} */
      const first = document.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    return async ({ update }) => {
      await update({ reset: false });
    };
  };
</script>

<PageHeader title={tx('New account')} center width="calc(720px + 2 * var(--v2-pad))">
  {#snippet crumb()}
    <a href={resolve('/accounts')}>{tx('Accounts')}</a>
    <ChevronRight size={12} />
    <span>{tx('New')}</span>
  {/snippet}
  {#snippet sub()}
    {tx('The company name, a way to reach them, and who owns the account.')}
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
          <div style="font-weight:600">{tx('The server refused this')}</div>
          <div class="v2-sub" style="margin-top:2px">{result.error}</div>
        </div>
      </div>
    {/if}

    <section class="v2-create-section">
      <h2>{tx('The company')}</h2>
      <div class="v2-field">
        <label class="req" for="f-name">{tx('Account name')}</label>
        <input
          id="f-name"
          name="name"
          class="v2-input"
          autocomplete="organization"
          bind:value={form.name}
          onblur={() => (touched.name = true)}
          aria-invalid={show('name') ? 'true' : undefined}
        />
        {#if show('name')}
          <p class="v2-error">{errors.name}</p>
        {:else}
          <p class="v2-hint">{tx('Has to be unique in this organisation, ignoring capitals.')}</p>
        {/if}
      </div>
      <div class="v2-create-grid">
        <div class="v2-field">
          <label for="f-website">{tx('Website')}</label>
          <input id="f-website" name="website" class="v2-input" type="url" autocomplete="url" bind:value={form.website} />
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
          <label for="f-industry">{tx('Industry')}</label>
          <select id="f-industry" name="industry" class="v2-input" bind:value={form.industry}>
            <option value="">{tx('Not recorded')}</option>
            {#each data.industries as i (i.value)}
              <option value={i.value}>{industryLabel(i.value)}</option>
            {/each}
          </select>
        </div>
      </div>
    </section>

    <section class="v2-create-section">
      <h2>{tx('Where they are')}</h2>
      <div class="v2-create-grid">
        <div class="v2-field">
          <label for="f-city">{tx('City')}</label>
          <input id="f-city" name="city" class="v2-input" autocomplete="address-level2" bind:value={form.city} />
        </div>
        <div class="v2-field">
          <label for="f-country">{tx('Country')}</label>
          <select id="f-country" name="country" class="v2-input" bind:value={form.country}>
            <option value="">{tx('Not recorded')}</option>
            {#each data.countries as c (c.value)}
              <option value={c.value}>{c.label}</option>
            {/each}
          </select>
        </div>
      </div>
    </section>

    <section class="v2-create-section">
      <h2>{tx('Assignment')}</h2>
      <div class="v2-field">
        <label for="f-owner">{tx('Owner')}</label>
        <select id="f-owner" name="assigned_to" class="v2-input" bind:value={form.assigned_to}>
          <option value="">{tx('Nobody')}</option>
          {#each data.owners as o (o.id)}
            <option value={o.id}>{o.name}</option>
          {/each}
        </select>
      </div>
    </section>

    <DuplicateNotice
      module="accounts"
      values={{ name: form.name, phone: form.phone, website: form.website }}
    />

    <div class="v2-create-foot">
      <a class="v2-btn" href={resolve('/accounts')}>{tx('Cancel')}</a>
      <button class="v2-btn v2-btn-primary" type="submit">{tx('Create account')}</button>
    </div>
  </form>
</div>

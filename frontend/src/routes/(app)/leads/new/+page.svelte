<script>
  import { tx } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/sell.js';
  import { resolve } from '$app/paths';
  /**
   * Adding a lead.
   *
   * A brand-new org cannot add its first lead through the web UI without this
   * page. `/leads` has always rendered a "New lead" button; nothing was ever
   * behind it. See CLAUDE.md, "API Validation & Authorization": the checks
   * below are a courtesy that saves a round trip, not the rule. The
   * serializer runs again on everything that arrives, and a curl request or a
   * stale build reaches it without ever loading this file.
   *
   * Nothing here binds to `org`, `created_by`, or an assigned-by field. Those
   * are server-derived; `createLead` never reads them off the form, and the
   * action below only ever forwards keys named in `EDITABLE_FIELDS`.
   */
  import { tick, untrack } from 'svelte';
  import { enhance } from '$app/forms';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import DuplicateNotice from '$lib/v2/components/DuplicateNotice.svelte';
  import { LEAD_STATUSES, LEAD_STATUS_LABEL, LEAD_SOURCES, LEAD_SOURCE_LABEL } from '$lib/v2/enums.js';
  import { TriangleAlert } from '@lucide/svelte';

  /** @type {{ data: any, form: any }} */
  let { data, form: result } = $props();

  // Seeded from the load once, on purpose: a half-typed form must not be
  // wiped if the page data revalidates underneath it. untrack() says that
  // out loud rather than leaving it as an accident.
  let form = $state(
    untrack(() => ({
      first_name: '',
      last_name: '',
      company_name: '',
      email: '',
      phone: '',
      job_title: '',
      assigned_to: data.defaults.assigned_to,
      status: data.defaults.status,
      source: '',
      description: '',
      // A rejected submit comes back with what was typed. Retyping a dozen
      // fields because one collided is how people learn to distrust a create
      // page.
      ...(untrack(() => result?.values) ?? {})
    }))
  );

  let touched = $state(/** @type {Record<string, boolean>} */ ({}));
  let submitted = $state(false);

  // Disables the submit button while the create action is in flight, so a
  // double-click cannot fire two creates.
  let busy = $state(false);

  let errors = $derived.by(() => {
    /** @type {Record<string, string>} */
    const e = {};
    // Mirrors the edit form's own rule: a lead needs a name to be findable,
    // but not both halves of one. Neither half is required by the API
    // itself (Lead.first_name/last_name are both nullable), so this is a UX
    // floor, not the boundary; an empty lead would otherwise save silently
    // and be unfindable in the list a moment later.
    if (!form.first_name.trim() && !form.last_name.trim())
      e.last_name = tx('A lead needs a name to be findable. First or last will do.');

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = tx('That does not look like an email address.');

    // The exact regex from `flexible_phone_validator`. Extensions like "x123"
    // are rejected by the model, so they are caught here rather than as an
    // opaque whole-form refusal after the save.
    if (form.phone && !/^[\d\s\-()+.]{7,25}$/.test(form.phone))
      e.phone = tx('7 to 25 characters: digits, spaces, brackets, dots, dashes. No extensions.');

    return e;
  });

  let valid = $derived(Object.keys(errors).length === 0);
  const show = (/** @type {string} */ field) => (touched[field] || submitted) && errors[field];

  /**
   * On success the action redirects to the new lead, so there is no success
   * state to render here.
   *
   * @type {import('./$types').SubmitFunction}
   */
  const check = async ({ cancel }) => {
    submitted = true;
    if (!valid) {
      // Send focus to the first field that needs work rather than only
      // colouring it. await tick() matters: on the first submit the
      // aria-invalid attributes do not exist until Svelte flushes, so
      // querying now finds nothing.
      cancel();
      await tick();
      /** @type {HTMLElement | null} */
      const first = document.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    busy = true;
    return async (/** @type {any} */ { update }) => {
      await update();
      busy = false;
    };
  };
</script>

<PageHeader title={tx('New lead')} center width="calc(720px + 2 * var(--v2-pad))">
  {#snippet crumb()}
    <a href={resolve('/leads')}>{tx('Leads')}</a> ›
  {/snippet}
  {#snippet sub()}
    {tx('Name, a way to reach them, and the company they work at.')}
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
          <div style="font-weight:600">{tx('The server refused this lead')}</div>
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
          <div class="v2-sub" style="margin-top:2px">{tx('Nothing has been saved.')}</div>
        </div>
      </div>
    {/if}

    <section class="v2-create-section">
      <h2>{tx('About the person')}</h2>
      <div class="v2-create-grid">
        <div class="v2-field">
          <label for="f-first">{tx('First name')}</label>
          <input
            id="f-first"
            name="first_name"
            class="v2-input"
            autocomplete="given-name"
            bind:value={form.first_name}
            onblur={() => (touched.first_name = true)}
          />
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
            aria-describedby={show('last_name') ? 'e-last' : undefined}
          />
          {#if show('last_name')}<p class="v2-error" id="e-last">{errors.last_name}</p>{/if}
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
            aria-describedby={show('email') ? 'e-email' : undefined}
          />
          {#if show('email')}<p class="v2-error" id="e-email">{errors.email}</p>{/if}
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
            aria-describedby={show('phone') ? 'e-phone' : undefined}
          />
          {#if show('phone')}<p class="v2-error" id="e-phone">{errors.phone}</p>{/if}
        </div>
        <div class="v2-field wide">
          <label for="f-jobtitle">{tx('Job title')}</label>
          <input id="f-jobtitle" name="job_title" class="v2-input" autocomplete="organization-title" bind:value={form.job_title} />
        </div>
      </div>
    </section>

    <section class="v2-create-section">
      <h2>{tx('The company')}</h2>
      <div class="v2-field">
        <label for="f-company">{tx('Company')}</label>
        <input id="f-company" name="company_name" class="v2-input" autocomplete="organization" bind:value={form.company_name} />
      </div>
    </section>

    <section class="v2-create-section">
      <h2>{tx('Assignment')}</h2>
      <div class="v2-create-grid">
        <div class="v2-field">
          <label for="f-source">{tx('Source')}</label>
          <select id="f-source" name="source" class="v2-input" bind:value={form.source}>
            <option value="">{tx('Not specified')}</option>
            {#each LEAD_SOURCES as s (s)}
              <option value={s}>{LEAD_SOURCE_LABEL[s]}</option>
            {/each}
          </select>
        </div>
        <div class="v2-field">
          <label for="f-owner">{tx('Owner')}</label>
          <select id="f-owner" name="assigned_to" class="v2-input" bind:value={form.assigned_to}>
            <option value="">{tx('Unassigned')}</option>
            {#each data.owners as o (o.id)}
              <option value={o.id}>{o.name}</option>
            {/each}
          </select>
        </div>
        <div class="v2-field wide">
          <label for="f-status">{tx('Status')}</label>
          <select id="f-status" name="status" class="v2-input" bind:value={form.status}>
            {#each LEAD_STATUSES.filter((s) => s !== 'converted') as s (s)}
              <option value={s}>{LEAD_STATUS_LABEL[s]}</option>
            {/each}
          </select>
        </div>
        <div class="v2-field wide">
          <label for="f-notes">{tx('Notes')}</label>
          <textarea id="f-notes" name="description" class="v2-input" rows="3" bind:value={form.description}></textarea>
        </div>
      </div>
    </section>

    <DuplicateNotice
      module="leads"
      values={{
        email: form.email,
        phone: form.phone,
        first_name: form.first_name,
        last_name: form.last_name,
        company_name: form.company_name
      }}
    />

    <div class="v2-create-foot">
      <a class="v2-btn" href={resolve('/leads')}>{tx('Cancel')}</a>
      <button class="v2-btn v2-btn-primary" type="submit" disabled={busy}>{tx('Create lead')}</button>
    </div>
  </form>
</div>

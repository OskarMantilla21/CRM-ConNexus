<script>
  import { resolve } from '$app/paths';
  /**
   * Raising a ticket.
   *
   * Deliberately short. A ticket that has just been raised has no history, no
   * closing date and nothing linked to it, so the only questions are what
   * happened, how bad it is, and who it is for.
   *
   * `?account=<id>` preselects the company, so "raise a ticket for this
   * account" arrives with the account already chosen.
   */
  import { tick, untrack } from 'svelte';
  import { enhance } from '$app/forms';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import { ChevronRight, TriangleAlert } from '@lucide/svelte';
  import '$lib/i18n/pages/serve.js';
  import { tx } from '$lib/i18n/translate.js';

  /** @type {{ data: any, form: any }} */
  let { data, form: result } = $props();

  // `untrack` so a re-render after a failed save does not throw away what the
  // person typed; `result.values` is the server's echo of the same fields.
  let form = $state(
    untrack(() => ({
      name: '',
      status: data.defaults.status,
      priority: data.defaults.priority,
      case_type: data.defaults.case_type,
      description: '',
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
    const name = form.name.trim();
    if (!name) e.name = tx('A ticket needs a subject.');
    // `Case.name` is max_length=64, short for a subject line, but it is the
    // column, and a 65th character is a 400 from the serializer.
    else if (name.length > 64)
      e.name = tx('Subjects are capped at 64 characters (this is {n}).', { n: name.length });
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
</script>

<PageHeader title={tx('New ticket')} center width="calc(720px + 2 * var(--v2-pad))">
  {#snippet crumb()}
    <a href={resolve('/tickets')}>{tx('Tickets')}</a>
    <ChevronRight size={12} />
    <span>{tx('New')}</span>
  {/snippet}
  {#snippet sub()}
    {tx('What broke, how urgent it is, and who it is for.')}
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
          <div style="font-weight:600">{tx('The server refused this ticket')}</div>
          <div class="v2-sub" style="margin-top:2px">{result.error}</div>
        </div>
      </div>
    {/if}

    <section class="v2-create-section">
      <h2>{tx('The request')}</h2>
    <div class="v2-field">
      <label class="req" for="f-name">{tx('Subject')}</label>
      <input
        id="f-name"
        name="name"
        class="v2-input"
        bind:value={form.name}
        onblur={() => (touched.name = true)}
        aria-invalid={show('name') ? 'true' : undefined}
      />
      {#if show('name')}
        <p class="v2-error">{errors.name}</p>
      {:else}
        <!-- Worth saying up front, because it is an unusual rule for a
             helpdesk and the refusal is otherwise baffling: two tickets in one
             organisation cannot share a subject, ignoring capitals. -->
        <p class="v2-hint">{tx('Has to be unique in this organisation, ignoring capitals.')}</p>
      {/if}
    </div>

    <input type="hidden" name="status" value={form.status} />

    <div class="v2-create-grid">
      <div class="v2-field">
        <label for="f-priority">{tx('Priority')}</label>
        <select id="f-priority" name="priority" class="v2-input" bind:value={form.priority}>
          {#each data.priorities as p (p.value)}
            <option value={p.value}>{tx(p.label)}</option>
          {/each}
        </select>
      </div>
      <div class="v2-field">
        <label for="f-type">{tx('Type')}</label>
        <select id="f-type" name="case_type" class="v2-input" bind:value={form.case_type}>
          <option value="">{tx('Not set')}</option>
          {#each data.caseTypes as t (t.value)}
            <option value={t.value}>{tx(t.label)}</option>
          {/each}
        </select>
      </div>
    </div>
    </section>

    <section class="v2-create-section">
      <h2>{tx('Who it is for')}</h2>
      <div class="v2-create-grid">
      <div class="v2-field">
        <label for="f-account">{tx('Account')}</label>
        <select id="f-account" name="account" class="v2-input" bind:value={form.account}>
          <option value="">{tx('Not linked')}</option>
          {#each data.accounts as a (a.id)}
            <option value={a.id}>{a.name}</option>
          {/each}
        </select>
        <p class="v2-hint">{tx('Cannot be changed later. The API makes it read-only after creation.')}</p>
      </div>
      <div class="v2-field">
        <label for="f-owner">{tx('Assignee')}</label>
        <select id="f-owner" name="assigned_to" class="v2-input" bind:value={form.assigned_to}>
          <option value="">{tx('Nobody')}</option>
          {#each data.owners as o (o.id)}
            <option value={o.id}>{o.name}</option>
          {/each}
        </select>
      </div>
      <div class="v2-field wide">
        <label for="f-contacts">{tx('Contact')}</label>
        <select id="f-contacts" name="contacts" class="v2-input">
          <option value="">{tx('Not linked')}</option>
          {#each data.contacts as c (c.id)}
            <option value={c.id}>{c.name}</option>
          {/each}
        </select>
      </div>
      </div>
    </section>

    <section class="v2-create-section">
      <h2>{tx('What happened')}</h2>
      <div class="v2-field">
        <label for="f-desc">{tx('What happened')}</label>
        <textarea
          id="f-desc"
          name="description"
          class="v2-input"
          rows="4"
          bind:value={form.description}></textarea>
      </div>
    </section>

    <div class="v2-create-foot">
      <a class="v2-btn" href={resolve('/tickets')}>{tx('Cancel')}</a>
      <button class="v2-btn v2-btn-primary" type="submit">{tx('Raise ticket')}</button>
    </div>
  </form>
</div>

<script>
  import { tx } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/sell.js';
  import { resolve } from '$app/paths';
  import { untrack, tick } from 'svelte';
  import { enhance } from '$app/forms';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import { money } from '$lib/v2/format.js';
  import { TriangleAlert } from '@lucide/svelte';

  /** @type {{ data: any, form: any }} */
  let { data, form: result } = $props();

  /**
   * v1's create form asked for 28 fields before it would accept a deal, so
   * people typed placeholders into the ones they did not know yet and the
   * data was wrong from the first save. This asks for the five that a deal
   * genuinely cannot exist without, and puts the rest behind a disclosure
   * that is closed by default.
   *
   * VALIDATION IS A UX HINT HERE, NOT A RULE.
   * Everything below only decides what this page shows. The serializer has to
   * enforce the same constraints server-side: required fields, the amount
   * being positive, the account belonging to this org, because curl, the
   * mobile client and a stale build all reach the API without passing
   * through this file. See CLAUDE.md, "API Validation & Authorization".
   *
   * Note what is NOT on this form: org, created_by, assigned-by. Those are
   * server-derived. If they ever appear in a request body, the serializer
   * must reject them rather than trust them.
   */
  // Seeded from the load once, on purpose: a half-typed form must not be
  // wiped if the page data revalidates underneath it. untrack() says that
  // out loud rather than leaving it as an accident.
  let form = $state(
    untrack(() => ({
      name: '',
      account: '',
      amount: '',
      closed_on: '',
      pipeline: data.defaults.pipeline,
      stage: data.defaults.stage,
      assigned_to: data.defaults.assigned_to,
      // A rejected submit comes back with what was typed. Retyping eight
      // fields because the ninth collided is how people learn to distrust a
      // create page.
      ...(untrack(() => result?.values) ?? {})
    }))
  );

  /** @type {any[]} */
  const pipelines = untrack(() => data.pipelines);
  /* A new deal cannot start closed, so only the chosen pipeline's open
     stages are offered. */
  let openStages = $derived(
    (pipelines.find((p) => p.id === form.pipeline)?.stages ?? []).filter(
      (/** @type {any} */ s) => s.kind === 'open'
    )
  );

  /**
   * Picking another pipeline starts the deal on that pipeline's first open
   * stage; a code from the previous pipeline may not exist in this one.
   *
   * @param {string} pipelineId
   */
  function pipelineChanged(pipelineId) {
    const next = pipelines.find((p) => p.id === pipelineId)?.stages ?? [];
    form.stage = next.find((/** @type {any} */ s) => s.kind === 'open')?.code ?? '';
  }

  let touched = $state(/** @type {Record<string, boolean>} */ ({}));
  let submitted = $state(false);

  let errors = $derived.by(() => {
    /** @type {Record<string, string>} */
    const e = {};
    if (!form.name.trim()) e.name = tx('Give the deal a name you would recognise in a list.');
    if (!form.account) e.account = tx('Pick the account this deal belongs to.');

    const amount = Number(form.amount);
    if (form.amount === '') e.amount = tx('How much is it worth?');
    else if (!Number.isFinite(amount) || amount <= 0)
      e.amount = tx('Amount has to be a number greater than zero.');

    if (!form.closed_on) e.closed_on = tx('When do you expect this to close?');
    else if (new Date(form.closed_on).getTime() < Date.now() - 86400000)
      e.closed_on = tx('That date has passed. Pick the date you now expect.');

    return e;
  });

  let valid = $derived(Object.keys(errors).length === 0);
  const show = (field) => (touched[field] || submitted) && errors[field];

  /**
   * On success the action redirects to the new deal, so there is no success
   * state to render here. The next thing anyone does after creating a deal is
   * look at it.
   *
   * @type {import('./$types').SubmitFunction}
   */
  const check = async ({ cancel }) => {
    submitted = true;
    if (!valid) {
      // Send focus to the first field that needs work rather than only
      // colouring it. On a long form the error can be off screen.
      // await tick() matters: on the first submit the aria-invalid attributes
      // do not exist until Svelte flushes, so querying now finds nothing.
      cancel();
      await tick();
      /** @type {HTMLElement | null} */
      const first = document.querySelector('[aria-invalid="true"]');
      first?.focus();
    }
  };
</script>

<PageHeader title={tx('New deal')} center width="calc(720px + 2 * var(--v2-pad))">
  {#snippet crumb()}
    <a href={resolve('/pipeline')}>{tx('Pipeline')}</a> ›
  {/snippet}
  {#snippet sub()}
    {tx('Name, account, amount, and when you expect it to close.')}
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
          <div style="font-weight:600">{tx('The server refused this deal')}</div>
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
      <h2>{tx('The deal')}</h2>
    <div class="v2-field">
      <label class="req" for="f-name">{tx('Deal name')}</label>
      <input
        id="f-name"
        name="name"
        class="v2-input"
        bind:value={form.name}
        onblur={() => (touched.name = true)}
        aria-invalid={show('name') ? 'true' : undefined}
        aria-describedby={show('name') ? 'e-name' : undefined}
        placeholder={tx('Platform renewal')}
      />
      {#if show('name')}<p class="v2-error" id="e-name">{errors.name}</p>{/if}
    </div>

    <div class="v2-field">
      <label class="req" for="f-account">{tx('Account')}</label>
      <select
        id="f-account"
        name="account"
        class="v2-input"
        bind:value={form.account}
        onblur={() => (touched.account = true)}
        aria-invalid={show('account') ? 'true' : undefined}
        aria-describedby={show('account') ? 'e-account' : undefined}
      >
        <option value="">{tx('Choose an account…')}</option>
        {#each data.accounts as a (a.id)}
          <option value={a.id}>{a.name}</option>
        {/each}
      </select>
      {#if show('account')}<p class="v2-error" id="e-account">{errors.account}</p>{/if}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="v2-field">
        <label class="req" for="f-amount">{tx('Amount')}</label>
        <input
          id="f-amount"
          name="amount"
          class="v2-input v2-num"
          type="text"
          inputmode="decimal"
          bind:value={form.amount}
          onblur={() => (touched.amount = true)}
          aria-invalid={show('amount') ? 'true' : undefined}
          aria-describedby={show('amount') ? 'e-amount' : 'h-amount'}
          placeholder="42000"
        />
        {#if show('amount')}
          <p class="v2-error" id="e-amount">{errors.amount}</p>
        {:else}
          <p class="v2-hint" id="h-amount">
            {Number(form.amount) > 0
              ? money(Number(form.amount), data.org.currency)
              : data.org.currency}
          </p>
        {/if}
      </div>

      <div class="v2-field">
        <label class="req" for="f-close">{tx('Expected close')}</label>
        <input
          id="f-close"
          name="closed_on"
          class="v2-input"
          type="date"
          bind:value={form.closed_on}
          onblur={() => (touched.closed_on = true)}
          aria-invalid={show('closed_on') ? 'true' : undefined}
          aria-describedby={show('closed_on') ? 'e-close' : undefined}
        />
        {#if show('closed_on')}<p class="v2-error" id="e-close">{errors.closed_on}</p>{/if}
      </div>
    </div>

    {#if pipelines.length <= 1}
      <input type="hidden" name="pipeline" value={form.pipeline} />
    {:else}
      <div class="v2-field">
        <label for="f-pipeline">{tx('Pipeline')}</label>
        <select
          id="f-pipeline"
          name="pipeline"
          class="v2-input"
          bind:value={form.pipeline}
          onchange={(e) => pipelineChanged(e.currentTarget.value)}
        >
          {#each pipelines as p (p.id)}
            <option value={p.id}>{p.name}</option>
          {/each}
        </select>
      </div>
    {/if}

    <div class="v2-field">
      <label for="f-stage">{tx('Stage')}</label>
      <select id="f-stage" name="stage" class="v2-input" bind:value={form.stage}>
        {#each openStages as s (s.code)}
          <option value={s.code}>{s.label}</option>
        {/each}
      </select>
    </div>

    <div class="v2-create-grid">
      <div class="v2-field">
        <label for="f-owner">{tx('Owner')}</label>
        <select id="f-owner" name="assigned_to" class="v2-input" bind:value={form.assigned_to}>
          {#each data.owners as o (o.id)}
            <option value={o.id}>{o.name}</option>
          {/each}
        </select>
      </div>
    </div>
    </section>

    <div class="v2-create-foot">
      <a class="v2-btn" href={resolve('/pipeline')}>{tx('Cancel')}</a>
      <button class="v2-btn v2-btn-primary" type="submit">{tx('Create deal')}</button>
    </div>
  </form>
</div>

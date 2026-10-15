<script>
  import { resolve } from '$app/paths';
  /**
   * A new task.
   *
   * "Attached to" is one question, not four. The model allows exactly one
   * parent and now enforces it on every path, so a form with four separate
   * pickers would let somebody fill two and learn about the rule from a 400.
   * Pick the kind, then pick the record.
   */
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import { enhance } from '$app/forms';
  import { untrack } from 'svelte';
  import { ChevronRight } from '@lucide/svelte';
  import '$lib/i18n/pages/serve.js';
  import { tx, choiceLabel } from '$lib/i18n/translate.js';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();

  const KINDS = [
    { key: '', label: 'Nothing' },
    { key: 'account', label: 'An account' },
    { key: 'opportunity', label: 'A deal' },
    { key: 'case', label: 'A ticket' },
    { key: 'lead', label: 'A lead' }
  ];

  let values = $derived(form?.values ?? {});
  let kind = $state(untrack(() => form?.values?.parent_kind ?? ''));
  let options = $derived(kind ? (data.parents[kind] ?? []) : []);
</script>

<PageHeader title={tx('New task')} record center width="calc(720px + 2 * var(--v2-pad))">
  {#snippet crumb()}
    <a href={resolve('/tasks')}>{tx('Tasks')}</a>
    <ChevronRight size={12} />
    <span>{tx('New')}</span>
  {/snippet}
  {#snippet sub()}
    {tx('What to do, when, and which record it belongs to.')}
  {/snippet}
</PageHeader>

<div class="v2-scroll v2-pad" style="padding-top:18px">
  <form
    method="POST"
    action="?/create"
    use:enhance
    class="v2-form v2-create"
  >
    {#if form?.error}
      <p style="color:var(--v2-rust);font-size:12.5px;margin:0 0 14px" role="alert">{form.error}</p>
    {/if}

    <section class="v2-create-section">
      <h2>{tx('The request')}</h2>
    <label class="v2-field">
      <span class="v2-label req">{tx('Task')}</span>
      <input
        class="v2-input"
        name="title"
        required
        maxlength="200"
        value={values.title ?? ''}
        placeholder={tx('Send the security addendum to Northwind')}
      />
    </label>

    <div class="v2-create-grid">
      <label class="v2-field">
        <span class="v2-label">{tx('Priority')}</span>
        <select class="v2-input" name="priority" value={values.priority ?? 'Medium'}>
          <option value="Low">{choiceLabel('Low')}</option>
          <option value="Medium">{choiceLabel('Medium')}</option>
          <option value="High">{choiceLabel('High')}</option>
        </select>
      </label>
      <label class="v2-field">
        <span class="v2-label">{tx('Due date')}</span>
        <input class="v2-input" type="date" name="due_date" value={values.due_date ?? ''} />
      </label>
    </div>
    </section>

    <section class="v2-create-section">
      <h2>{tx('Who it is for')}</h2>
    <label class="v2-field">
      <span class="v2-label">{tx('Attached to')}</span>
      <select class="v2-input" name="parent_kind" bind:value={kind}>
        {#each KINDS as k (k.key)}
          <option value={k.key}>{tx(k.label)}</option>
        {/each}
      </select>
    </label>

    {#if kind}
      <label class="v2-field">
        <span class="v2-label">{tx('Which one')}</span>
        <select class="v2-input" name="parent_{kind}" required>
          <option value="">{tx('Choose…')}</option>
          {#each options as option (option.id)}
            <option value={option.id} selected={values[kind] === option.id}>{option.name}</option>
          {/each}
        </select>
        {#if options.length === 0}
          <span class="v2-sub" style="font-size:11.5px"
            >{tx('Nothing to pick. Either there are none, or that list did not load.')}</span
          >
        {/if}
      </label>
    {/if}

    <label class="v2-field">
      <span class="v2-label">{tx('Assign to')}</span>
      <select class="v2-input" name="assigned_to">
        <option value="">{tx('Nobody')}</option>
        {#each data.owners as person (person.id)}
          <option value={person.id}>{person.name}</option>
        {/each}
      </select>
    </label>
    </section>

    <section class="v2-create-section">
    <label class="v2-field">
      <span class="v2-label">{tx('Note')}</span>
      <textarea
        class="v2-input"
        name="description"
        rows="4"
        placeholder={tx('Context anyone picking this up would need.')}
        >{values.description ?? ''}</textarea
      >
    </label>
    </section>

    <div class="v2-create-foot">
      <a class="v2-btn" href={resolve('/tasks')}>{tx('Cancel')}</a>
      <button class="v2-btn v2-btn-primary" type="submit">{tx('Create task')}</button>
    </div>
  </form>
</div>

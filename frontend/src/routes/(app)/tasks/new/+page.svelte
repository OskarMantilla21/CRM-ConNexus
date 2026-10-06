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

<PageHeader title={tx('New task')} record center width="62ch">
  {#snippet crumb()}
    <a href={resolve('/tasks')}>{tx('Tasks')}</a>
    <ChevronRight size={12} />
    <span>{tx('New')}</span>
  {/snippet}
</PageHeader>

<div class="v2-scroll">
  <form
    method="POST"
    action="?/create"
    use:enhance
    class="v2-pad"
    style="padding-top:18px;padding-bottom:36px;max-width:62ch;margin-left:auto;margin-right:auto"
  >
    {#if form?.error}
      <p style="color:var(--v2-rust);font-size:12.5px;margin:0 0 14px" role="alert">{form.error}</p>
    {/if}

    <label class="v2-field">
      <span class="v2-label">{tx('Task')}</span>
      <input
        class="v2-input"
        name="title"
        required
        maxlength="200"
        value={values.title ?? ''}
        placeholder={tx('Send the security addendum to Northwind')}
      />
    </label>

    <div style="display:flex;gap:12px;flex-wrap:wrap">
      <label class="v2-field" style="flex:1;min-width:150px">
        <span class="v2-label">{tx('Priority')}</span>
        <select class="v2-input" name="priority" value={values.priority ?? 'Medium'}>
          <option value="Low">{choiceLabel('Low')}</option>
          <option value="Medium">{choiceLabel('Medium')}</option>
          <option value="High">{choiceLabel('High')}</option>
        </select>
      </label>
      <label class="v2-field" style="flex:1;min-width:150px">
        <span class="v2-label">{tx('Status')}</span>
        <select class="v2-input" name="status" value={values.status ?? 'New'}>
          <option value="New">{choiceLabel('New')}</option>
          <option value="In Progress">{choiceLabel('In Progress')}</option>
          <option value="Completed">{choiceLabel('Completed')}</option>
        </select>
      </label>
      <label class="v2-field" style="flex:1;min-width:150px">
        <span class="v2-label">{tx('Due')}</span>
        <input class="v2-input" type="date" name="due_date" value={values.due_date ?? ''} />
      </label>
    </div>
    <p class="v2-sub" style="font-size:11.5px;margin:-6px 0 16px">
      {tx(
        'A task with no due date never becomes overdue and never appears in "due this week". It is a real choice, not a blank you forgot.'
      )}
    </p>

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
      <select
        class="v2-input"
        name="assigned_to"
        multiple
        size={Math.min(data.owners.length || 1, 5)}
      >
        {#each data.owners as person (person.id)}
          <option value={person.id}>{person.name}</option>
        {/each}
      </select>
      <span class="v2-sub" style="font-size:11.5px">
        {tx(
          'Optional, and more than one is allowed. Leave it empty and the task is yours to pick up.'
        )}
      </span>
    </label>

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

    <div style="display:flex;gap:9px;margin-top:6px">
      <button class="v2-btn v2-btn-primary" type="submit">{tx('Create task')}</button>
      <a class="v2-btn" href={resolve('/tasks')}>{tx('Cancel')}</a>
    </div>
  </form>
</div>

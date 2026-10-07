<script>
  /**
   * Two leads, contacts or accounts side by side, to pick which one to keep.
   *
   * The rule the API applies is shown before it runs: the kept record's values
   * stay, its blank fields take the other's, and the other record is deleted
   * once its links, notes and files have moved. There is no undo, so the
   * confirmation is a box the person ticks, not a second click on the same
   * spot.
   *
   * Keeping one record means deleting the other, so a record can only be kept
   * when the other is one the person may delete (`can_delete`, from the API).
   * That is a hint to spare a refusal; the API decides.
   *
   * Stacked at phone width, side by side above 768px.
   */
  import { untrack } from 'svelte';
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import { mergeSideLabel } from '$lib/v2/merge-label.js';
  import { ChevronRight, TriangleAlert } from '@lucide/svelte';
  import { tx, choiceLabel } from '$lib/i18n/translate.js';

  /** @typedef {{ id: string, name: string, can_delete: boolean, fields: Array<{ label: string, value: string }> }} Side */
  /** @type {{ data: { module: 'leads' | 'contacts' | 'accounts', singular: string, current: Side, other: Side }, form: any }} */
  let { data, form } = $props();

  let { module, singular, current, other } = $derived(data);

  let keep = $state(
    untrack(() =>
      data.other.can_delete || !data.current.can_delete ? data.current.id : data.other.id
    )
  );
  let confirmed = $state(false);
  let busy = $state(false);

  let kept = $derived(keep === current.id ? current : other);
  let dropped = $derived(keep === current.id ? other : current);
  /** @param {Side} side */
  const keepable = (side) => (side.id === current.id ? other : current).can_delete;
  let possible = $derived(keepable(current) || keepable(other));
  /** How the copy names a record; see `mergeSideLabel`. @param {Side} side */
  const label = (side) => mergeSideLabel(side, current, other);
  /** Stored statuses stay lowercase; the catalog keys are the words a person reads. */
  const showField = (/** @type {string} */ name, /** @type {string} */ value) => {
    if (!value) return '—';
    if (name !== 'Status') return value;
    const key = value === 'in process' ? 'In process' : value.charAt(0).toUpperCase() + value.slice(1);
    return choiceLabel(key);
  };
  let result = $derived(
    kept.fields.map((field, i) => ({
      label: field.label,
      value: field.value || dropped.fields[i].value,
      filled: !field.value && Boolean(dropped.fields[i].value)
    }))
  );
</script>

<PageHeader title={tx('Merge {kind}s', { kind: tx(singular) })} center width="820px">
  {#snippet crumb()}
    <a href={resolve(`/${module}`)}>{tx(module[0].toUpperCase() + module.slice(1))}</a>
    <ChevronRight size={12} />
    <a href={resolve(`/${module}/${current.id}`)}>{current.name}</a>
    <ChevronRight size={12} />
    <span>{tx('Merge')}</span>
  {/snippet}
  {#snippet sub()}
    {tx('Pick the one to keep. The other is deleted once everything linked to it has moved over.')}
  {/snippet}
</PageHeader>

<div class="v2-scroll v2-pad" style="padding-top:18px">
  <form
    class="merge"
    method="POST"
    action="?/merge"
    use:enhance={() => {
      busy = true;
      return async ({ update }) => {
        await update();
        busy = false;
      };
    }}
  >
    <input type="hidden" name="other" value={other.id} />

    {#if form?.error}
      <div class="v2-next refusal" role="alert">
        <TriangleAlert size={17} style="color:var(--v2-rust);flex:none" />
        <div class="v2-next-body">
          <div style="font-weight:600">{tx('Nothing was merged')}</div>
          <div class="v2-sub" style="margin-top:2px">{tx(form.error)}</div>
        </div>
      </div>
    {/if}

    <fieldset class="sides">
      <legend class="v2-sr-only">{tx('Which {kind} to keep', { kind: tx(singular) })}</legend>
      {#each [current, other] as side (side.id)}
        <label class="v2-card side" class:chosen={keep === side.id} class:off={!keepable(side)}>
          <span class="pick">
            <input
              type="radio"
              name="keep"
              value={side.id}
              bind:group={keep}
              disabled={!keepable(side)}
            />
            <span style="font-weight:600">{tx('Keep {name}', { name: label(side) })}</span>
          </span>
          {#if !keepable(side)}
            <span class="v2-sub" style="font-size:11.5px">
              {tx(
                'Keeping this one would delete the other, which only an admin or its creator may do.'
              )}
            </span>
          {/if}
          <dl>
            {#each side.fields as field (field.label)}
              <dt>{tx(field.label)}</dt>
              <dd>{showField(field.label, field.value)}</dd>
            {/each}
          </dl>
        </label>
      {/each}
    </fieldset>

    {#if possible}
      <section class="v2-card after" aria-labelledby="after-title">
        <div id="after-title" class="v2-label" style="margin-bottom:6px">{tx('After the merge')}</div>
        <dl>
          {#each result as field (field.label)}
            <dt>{tx(field.label)}</dt>
            <dd>
              {showField(field.label, field.value)}
              {#if field.filled}<span class="v2-sub"> {tx('(from {name})', { name: label(dropped) })}</span>{/if}
            </dd>
          {/each}
        </dl>
        <p class="v2-sub" style="margin:8px 0 0;font-size:12px;line-height:1.55">
          {tx(
            "Notes, files, activity and every link to {dropped} move to {kept}. Tags are combined; owners stay {kept}'s unless it has none.",
            { dropped: label(dropped), kept: label(kept) }
          )}
        </p>
      </section>

      <label class="confirm">
        <input type="checkbox" name="confirm" bind:checked={confirmed} />
        <span>
          {tx('Delete {name} for good once it is merged. This cannot be undone.', {
            name: label(dropped)
          })}
        </span>
      </label>

      <div class="actions">
        <button class="v2-btn v2-btn-primary" type="submit" disabled={!confirmed || busy}>
          {tx('Merge into {name}', { name: label(kept) })}
        </button>
        <a class="v2-btn" href={resolve(`/${module}/${current.id}`)}>{tx('Cancel')}</a>
      </div>
    {:else}
      <p class="v2-sub" style="font-size:12.5px">
        {tx(
          'You cannot merge these two: keeping either would delete the other, and only an admin or the person who created a {kind} may delete it.',
          { kind: tx(singular) }
        )}
      </p>
      <div class="actions">
        <a class="v2-btn" href={resolve(`/${module}/${current.id}`)}>{tx('Back')}</a>
      </div>
    {/if}
  </form>
</div>

<style>
  .merge {
    max-width: 820px;
    margin: 0 auto;
    padding-bottom: 40px;
  }
  .refusal {
    background: color-mix(in srgb, var(--v2-rust) 9%, transparent);
    border-color: color-mix(in srgb, var(--v2-rust) 28%, transparent);
    margin-bottom: 18px;
  }
  .sides {
    border: 0;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .side {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 16px;
    cursor: pointer;
    min-width: 0;
  }
  .side.chosen {
    border-color: var(--v2-ink);
    box-shadow: inset 0 0 0 1px var(--v2-ink);
  }
  .side.off {
    cursor: default;
    opacity: 0.75;
  }
  .pick {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    font-size: 14px;
    overflow-wrap: anywhere;
  }
  .pick input {
    width: 20px;
    height: 20px;
    flex: none;
  }
  dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 5px 12px;
    margin: 0;
    font-size: 12.5px;
  }
  dt {
    color: var(--v2-slate);
  }
  dd {
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .after {
    margin-top: 14px;
    padding: 14px 16px;
  }
  .confirm {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    margin: 16px 0 4px;
    font-size: 13px;
    line-height: 1.5;
    min-height: 44px;
  }
  .confirm input {
    width: 20px;
    height: 20px;
    flex: none;
    margin-top: 1px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 16px;
  }
  .actions .v2-btn {
    min-height: 44px;
    max-width: 100%;
    white-space: normal;
    overflow-wrap: anywhere;
  }
  /* 769, so exactly one layout applies at 768: the app's phone rules run up
     to and including 768px. */
  @media (min-width: 769px) {
    .sides {
      grid-template-columns: 1fr 1fr;
    }
  }
</style>

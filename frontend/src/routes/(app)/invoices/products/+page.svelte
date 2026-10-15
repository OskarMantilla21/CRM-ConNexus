<script>
  import { resolve } from '$app/paths';
  /**
   * The catalogue line items are picked from. Short, boring, and the only page
   * in Bill that is a settings screen wearing a list's clothes, so it is
   * grouped by category rather than paginated, because you come here to find
   * one thing and change its price.
   *
   * Retired products stay. A product that appears on eighteen historic
   * invoices cannot be deleted without rewriting what those invoices say was
   * sold, so `is_active=false` takes it out of the picker and leaves the
   * record intact. The row says which, and how many invoices it is on.
   */
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import SectionTabs from '$lib/v2/components/SectionTabs.svelte';
  import Pill from '$lib/v2/components/Pill.svelte';
  import EmptyState from '$lib/v2/components/EmptyState.svelte';
  import DocThumb from '$lib/v2/components/DocThumb.svelte';
  import FilePreview from '$lib/v2/components/FilePreview.svelte';
  import { money, count } from '$lib/v2/format.js';
  import { tx } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/bill.js';
  import { Plus, Package, Pencil } from '@lucide/svelte';

  /** @type {{ data: any }} */
  let { data } = $props();

  /** @type {any} */
  let openProduct = $state(null);
  /** @type {HTMLElement | null} */
  let dialog = $state(null);
  /** @type {HTMLElement | null} */
  let returnFocus = null;

  function openPreview(/** @type {any} */ product, /** @type {Event} */ event) {
    returnFocus = /** @type {HTMLElement} */ (event.currentTarget);
    openProduct = product;
  }

  function closePreview() {
    openProduct = null;
    returnFocus?.focus();
    returnFocus = null;
  }

  $effect(() => {
    if (!openProduct) return;
    dialog?.focus();
    const onKey = (/** @type {KeyboardEvent} */ event) => {
      if (event.key === 'Escape') closePreview();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  let totals = $derived(data.totals);
  // The catalogue is org config: only an admin may add or change it. The API
  // enforces this. These gates just keep the page from offering a write it
  // would refuse. Reps still see every price, because they build line items.
  let canManage = $derived(data.can_manage);

  /**
   * Grouped for reading, not for counting. The totals still come from the API.
   * A plain object (not a Map) because this is a throwaway computation rebuilt
   * each render, never reactive state; string category keys keep first-seen
   * order, which is the order the list already arrives in.
   */
  let groups = $derived.by(() => {
    /** @type {Record<string, any[]>} */
    const byCategory = {};
    for (const p of data.products) {
      (byCategory[p.category] ??= []).push(p);
    }
    return Object.entries(byCategory).map(([category, items]) => ({ category, items }));
  });
</script>

<PageHeader title={tx('Products')}>
  {#snippet sub()}
    <span class="v2-num">{count(totals.active)}</span> {tx('sellable')} ·
    <span class="v2-num">{count(totals.count - totals.active)}</span> {tx('retired')}
  {/snippet}
  {#snippet actions()}
    {#if canManage}
      <a class="v2-btn v2-btn-primary" href={resolve('/invoices/products/new')}
        ><Plus />{tx('New product')}</a
      >
    {/if}
  {/snippet}
</PageHeader>

<SectionTabs set="invoices" />

<div class="v2-scroll">
  <div class="v2-pad" style="padding-top:18px;padding-bottom:32px">
    {#if data.products.length === 0}
      <EmptyState
        title={tx('Nothing in the catalogue')}
        body={tx('Add the things you sell and their list prices. Line items on invoices and estimates pick from here, so the price is right without anyone remembering it.')}
      >
        {#snippet icon()}<Package size={21} />{/snippet}
        {#snippet actions()}
          {#if canManage}
            <a class="v2-btn v2-btn-primary" href={resolve('/invoices/products/new')}>{tx('New product')}</a
            >
          {:else}
            <span class="v2-sub" style="font-size:12px">{tx('Ask an admin to add products.')}</span>
          {/if}
        {/snippet}
      </EmptyState>
    {:else}
      {#each groups as group (group.category)}
        <div class="v2-label" style="margin-bottom:9px">{group.category}</div>
        <div class="v2-card" style="overflow:hidden;margin-bottom:20px">
          {#each group.items as p (p.id)}
            <div class="v2-setting" style={p.is_active ? '' : 'opacity:.62'}>
              {#if p.image_preview || p.catalog_preview}
                <div
                  class="thumb-btn"
                  role="button"
                  tabindex="0"
                  aria-label={tx('Preview')}
                  onclick={(event) => openPreview(p, event)}
                  onkeydown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openPreview(p, event);
                    }
                  }}
                >
                  <DocThumb
                    src={p.image_preview || p.catalog_preview}
                    name={p.image_name || p.catalog_name}
                    title={p.name}
                  />
                </div>
              {/if}
              <div class="v2-setting-body">
                {#if p.image_preview || p.catalog_preview}
                  <button class="name" type="button" onclick={(event) => openPreview(p, event)}>
                    {p.name}
                  </button>
                {:else}
                  <b>{p.name}</b>
                {/if}
                <span class="v2-sub" style="font-size:11.5px">
                  {#if p.kind === 'catalog'}
                    {tx('Catalogue')}
                  {:else}
                    <span class="v2-num">{p.sku}</span>
                    · {tx('on')} <span class="v2-num">{p.used_on}</span>
                    {p.used_on === 1 ? tx('invoice') : tx('invoices')}
                  {/if}
                </span>
              </div>
              {#if p.kind === 'catalog'}
                <Pill tone="slate">{tx('Catalogue')}</Pill>
              {/if}
              {#if !p.is_active}
                <!-- Retired, not gone. Says why it is still listed. -->
                <Pill tone="slate">{tx('Retired')}</Pill>
              {/if}
              {#if p.kind !== 'catalog'}
                <span class="v2-num" style="font-weight:600;font-size:13px">
                  {money(p.price, p.currency)}
                </span>
              {/if}
              {#if canManage}
                <a
                  class="prod-edit"
                  href={resolve(`/invoices/products/${p.id}/edit`)}
                  title={tx('Edit {name}', { name: p.name })}
                >
                  <Pencil size={14} />
                </a>
              {/if}
            </div>
          {/each}
        </div>
      {/each}

      <p class="v2-sub" style="font-size:11.5px">
        {tx('Retired products stay listed because they appear on invoices already issued. Removing one would change what those invoices say was sold.')}
      </p>
    {/if}
  </div>
</div>

{#if openProduct}
  <div
    class="v2-scrim"
    role="presentation"
    onclick={(event) => {
      if (event.target === event.currentTarget) closePreview();
    }}
  >
    <div
      class="doc-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-preview-title"
      tabindex="-1"
      bind:this={dialog}
    >
      <header>
        <h2 id="product-preview-title">{openProduct.name}</h2>
        {#if openProduct.image_download}
          <a class="v2-btn" href={openProduct.image_download}>{tx('Download photo')}</a>
        {/if}
        {#if openProduct.catalog_download}
          <a class="v2-btn" href={openProduct.catalog_download}>{tx('Download PDF')}</a>
        {/if}
        <button class="v2-btn" type="button" onclick={closePreview}>{tx('Close')}</button>
      </header>
      {#if openProduct.image_preview}
        <FilePreview
          flush
          src={openProduct.image_preview}
          name={openProduct.image_name}
          title={openProduct.name}
        />
      {/if}
      {#if openProduct.catalog_preview}
        <FilePreview
          flush
          src={openProduct.catalog_preview}
          name={openProduct.catalog_name}
          title={openProduct.name}
        />
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Sits after the price on each catalogue row; only drawn for an admin. */
  .prod-edit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    margin-left: 2px;
    border-radius: 6px;
    color: var(--v2-slate);
    flex: none;
  }
  .prod-edit:hover {
    background: var(--v2-line-soft);
    color: var(--v2-ink);
  }
  .thumb-btn {
    flex: none;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    border-radius: 6px;
  }
  .thumb-btn:focus-visible {
    outline: 2px solid var(--v2-ember);
    outline-offset: 2px;
  }
  button.name {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    font-weight: 600;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
  }
  button.name:hover {
    text-decoration: underline;
  }
  .doc-dialog {
    width: min(760px, 100%);
    max-height: calc(100vh - 120px);
    overflow: auto;
    background: var(--v2-card);
    border: 1px solid var(--v2-line);
    border-radius: 14px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
  }
  .doc-dialog header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 14px;
    border-bottom: 1px solid var(--v2-line);
  }
  .doc-dialog h2 {
    margin: 0;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    font-weight: 650;
  }
</style>

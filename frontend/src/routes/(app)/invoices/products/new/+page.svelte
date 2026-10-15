<script>
  import { resolve } from '$app/paths';
  /**
   * A new catalogue entry: one product, or a PDF catalogue of the range.
   * Both can carry a photo and a PDF. The preview is the file just chosen.
   *
   * VALIDATION HERE IS A UX HINT, NOT A RULE. The serializer requires a name and
   * a numeric price and rejects a duplicate SKU within the org; a non-admin is
   * refused outright. curl and the mobile client reach the API without passing
   * through this page. The view is the trust boundary (see CLAUDE.md).
   */
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import ProductFiles from '$lib/v2/components/ProductFiles.svelte';
  import { tx } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/bill.js';
  import { untrack } from 'svelte';
  import { enhance } from '$app/forms';
  import { ChevronRight, Lock } from '@lucide/svelte';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();

  let values = $derived(form?.values ?? {});
  let kind = $state(untrack(() => (form?.values?.kind === 'catalog' ? 'catalog' : 'product')));
  let name = $state(untrack(() => form?.values?.name ?? ''));
  let price = $state(untrack(() => form?.values?.price ?? ''));
  let currency = $state(untrack(() => form?.values?.currency ?? 'USD'));
  let sku = $state(untrack(() => form?.values?.sku ?? ''));

  /* True from submit until the response lands, so a second press during a
     slow save cannot post the product again and create two catalogue rows. */
  let saving = $state(false);
</script>

<PageHeader title={tx('New product')} record center width="calc(720px + 2 * var(--v2-pad))">
  {#snippet crumb()}
    <a href={resolve('/invoices/products')}>{tx('Products')}</a>
    <ChevronRight size={12} />
    <span>{tx('New')}</span>
  {/snippet}
</PageHeader>

<div class="v2-scroll v2-pad" style="padding-top:18px">
  {#if !data.can_manage}
    <div class="v2-pad" style="padding-top:24px;max-width:56ch;margin-left:auto;margin-right:auto">
      <div class="v2-next" role="note">
        <Lock size={17} style="flex:none" />
        <div class="v2-next-body">
          <div style="font-weight:600">{tx('Admins only')}</div>
          <div class="v2-sub" style="margin-top:2px">
            {tx('The product catalogue is shared across the org, so only an administrator can add to it. You can still use any product on your invoices and estimates.')}
          </div>
        </div>
      </div>
      <a class="v2-btn" href={resolve('/invoices/products')} style="margin-top:16px"
        >{tx('Back to products')}</a
      >
    </div>
  {:else}
    <form
      method="POST"
      action="?/create"
      use:enhance={({ cancel }) => {
        if (saving) return cancel();
        saving = true;
        return async ({ update }) => {
          await update();
          saving = false;
        };
      }}
      class="v2-form v2-create"
      enctype="multipart/form-data"
    >
      {#if form?.error}
        <p style="color:var(--v2-rust);font-size:12.5px;margin:0 0 14px" role="alert">
          {form.error}
        </p>
      {/if}
      <section class="v2-create-section">
      <ProductFiles bind:kind title={name} />

      <label class="v2-field">
        <span class="v2-label req">{tx('Name')}</span>
        <input
          class="v2-input"
          name="name"
          required
          maxlength="255"
          bind:value={name}
          placeholder={kind === 'catalog'
            ? tx('Pool range, 2026')
            : tx('Platform licence, per seat')}
        />
      </label>

      {#if kind === 'product'}
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <label class="v2-field" style="flex:2;min-width:180px">
            <span class="v2-label req">{tx('List price')}</span>
            <input
              class="v2-input"
              name="price"
              type="number"
              min="0"
              step="0.01"
              required
              bind:value={price}
              placeholder="100.00"
            />
          </label>
          <label class="v2-field" style="flex:1;min-width:130px">
            <span class="v2-label">{tx('Currency')}</span>
            <select class="v2-input" name="currency" bind:value={currency}>
              {#each data.currencies as c (c.code)}
                <option value={c.code}>{c.label}</option>
              {/each}
            </select>
          </label>
        </div>
      {:else}
        <input type="hidden" name="price" value={price || '0'} />
        <input type="hidden" name="currency" value={currency} />
        <input type="hidden" name="sku" value={sku} />
        <p class="v2-hint">
          {tx('This catalogue is not a line on an invoice. It stays on this list so anyone can open the PDF and the photo.')}
        </p>
      {/if}

      <div class="v2-create-grid">
        <label class="v2-field" style="flex:1;min-width:160px">
          <span class="v2-label">{tx('Category')}</span>
          <input
            class="v2-input"
            name="category"
            maxlength="100"
            value={values.category ?? ''}
            placeholder={tx('Licence, Module, Service…')}
          />
        </label>
        {#if kind === 'product'}
          <label class="v2-field" style="flex:1;min-width:160px">
            <span class="v2-label">{tx('SKU')}</span>
            <input
              class="v2-input"
              name="sku"
              maxlength="100"
              bind:value={sku}
              placeholder="PLAT-SEAT"
            />
          </label>
        {/if}
      </div>
      <label class="v2-field">
        <span class="v2-label">{tx('Description')}</span>
        <textarea
          class="v2-input"
          name="description"
          rows="3"
          placeholder={tx('What it is, in the words a client would see on an invoice.')}
          >{values.description ?? ''}</textarea
        >
      </label>

      </section>

      <div class="v2-create-foot">
        <a class="v2-btn" href={resolve('/invoices/products')}>{tx('Cancel')}</a>
        <button class="v2-btn v2-btn-primary" type="submit" disabled={saving}>
          {saving
            ? tx('Adding…')
            : kind === 'catalog'
              ? tx('Add catalogue')
              : tx('Add product')}
        </button>
      </div>
    </form>
  {/if}
</div>

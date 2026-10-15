<script>
  /**
   * The two ways to add to the catalogue, and the photo and PDF each one takes.
   *
   * A product is one thing you sell. A catalogue is a PDF of the range, uploaded
   * the same way a document is. Both can carry a photo and a PDF, and the
   * preview is the file just chosen, or the one already stored.
   */
  import FilePreview from '$lib/v2/components/FilePreview.svelte';
  import { tx } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/bill.js';

  let {
    kind = $bindable('product'),
    title = '',
    imageHref = '',
    imageName = '',
    catalogHref = '',
    catalogName = ''
  } = $props();

  /** @type {File | null} */
  let photo = $state(null);
  /** @type {File | null} */
  let pdf = $state(null);

  function take(/** @type {Event} */ event, /** @type {'photo' | 'pdf'} */ slot) {
    const input = /** @type {HTMLInputElement} */ (event.currentTarget);
    const file = input.files?.[0] ?? null;
    if (slot === 'photo') photo = file;
    else pdf = file;
  }
</script>

<div class="kinds" role="radiogroup" aria-label={tx('What are you adding?')}>
  <label class="kind" class:on={kind === 'product'}>
    <input type="radio" name="kind" value="product" bind:group={kind} />
    <b>{tx('A product')}</b>
    <span>{tx('One thing you sell, with its price.')}</span>
  </label>
  <label class="kind" class:on={kind === 'catalog'}>
    <input type="radio" name="kind" value="catalog" bind:group={kind} />
    <b>{tx('A product catalogue')}</b>
    <span>{tx('A PDF of the range, the way you upload a document.')}</span>
  </label>
</div>

<div class="v2-field">
  <label for="product-photo">{kind === 'catalog' ? tx('Cover photo') : tx('Photo')}</label>
  <input
    id="product-photo"
    class="v2-input v2-file"
    name="image"
    type="file"
    accept="image/png,image/jpeg,image/gif,image/webp,.png,.jpg,.jpeg,.gif,.webp"
    onchange={(event) => take(event, 'photo')}
  />
  <p class="v2-hint">
    {kind === 'catalog'
      ? tx('A cover for the catalogue. PNG, JPG, GIF or WebP.')
      : tx('A picture of the product. PNG, JPG, GIF or WebP.')}
  </p>
  {#if photo}
    <div class="picked-preview">
      <FilePreview file={photo} {title} />
    </div>
  {:else if imageHref}
    <div class="picked-preview">
      <FilePreview src={imageHref} name={imageName} {title} />
    </div>
  {/if}
</div>

<div class="v2-field">
  <label for="product-pdf">
    {kind === 'catalog' ? tx('Catalogue PDF') : tx('Spec sheet (PDF)')}
  </label>
  <input
    id="product-pdf"
    class="v2-input v2-file"
    name="catalog_file"
    type="file"
    accept="application/pdf,.pdf"
    onchange={(event) => take(event, 'pdf')}
  />
  <p class="v2-hint">
    {kind === 'catalog'
      ? tx('The PDF itself. It opens here the same way a document does.')
      : tx('Optional. A data sheet or a one-product catalogue.')}
  </p>
  {#if pdf}
    <div class="picked-preview">
      <FilePreview file={pdf} {title} />
    </div>
  {:else if catalogHref}
    <div class="picked-preview">
      <FilePreview src={catalogHref} name={catalogName} {title} />
    </div>
  {/if}
</div>

<style>
  .kinds {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .kind {
    display: flex;
    flex-direction: column;
    gap: 3px;
    position: relative;
    margin: 0;
    padding: 12px 12px 12px 34px;
    border: 1px solid var(--v2-line);
    border-radius: 10px;
    cursor: pointer;
  }
  .kind.on {
    border-color: var(--v2-ink);
  }
  .kind input {
    position: absolute;
    left: 12px;
    top: 14px;
  }
  .kind b {
    font-size: 13px;
    font-weight: 650;
  }
  .kind span {
    color: var(--v2-slate);
    font-size: 12px;
    line-height: 1.35;
  }
  .picked-preview {
    margin-top: 12px;
  }
  @media (max-width: 640px) {
    .kinds {
      grid-template-columns: 1fr;
    }
  }
</style>

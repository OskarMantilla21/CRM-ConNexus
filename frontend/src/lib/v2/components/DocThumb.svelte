<script>
  /**
   * The small picture of a stored document, for a table row.
   *
   * Images render as themselves. A PDF renders its first page, scaled into
   * the same box, and only once the row is near the screen so a long list
   * does not open a viewer for every file. Anything else keeps the file icon:
   * an HTML or SVG file is not drawn here.
   *
   * @type {{ src?: string | null, name?: string, title?: string }}
   */
  let { src = '', name = '', title = '' } = $props();

  import { FileText, FileSpreadsheet, File } from '@lucide/svelte';

  const IMAGE = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);
  const SHEET = new Set(['xls', 'xlsx', 'csv', 'ods', 'numbers']);

  /** @param {string} value */
  function extOf(value) {
    const base = value.split(/[/\\]/).pop() ?? value;
    const dot = base.lastIndexOf('.');
    return dot >= 0 ? base.slice(dot + 1).toLowerCase() : '';
  }

  let ext = $derived(extOf(name));
  let kind = $derived(IMAGE.has(ext) ? 'image' : ext === 'pdf' ? 'pdf' : 'file');
  let Icon = $derived(ext === 'pdf' || ext === 'txt' || ext === 'md' ? FileText : SHEET.has(ext) ? FileSpreadsheet : File);

  /** @type {HTMLElement | null} */
  let box = $state(null);
  let showPdf = $state(false);

  $effect(() => {
    const node = box;
    if (!node || kind !== 'pdf' || !src) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        showPdf = true;
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  });

  let pdfSrc = $derived(src ? `${src}#toolbar=0&navpanes=0&scrollbar=0&view=FitH` : '');
</script>

<div class="thumb" bind:this={box}>
  {#if kind === 'image' && src}
    <img src={src} alt={title} loading="lazy" />
  {:else if kind === 'pdf' && showPdf}
    <iframe title={title} src={pdfSrc} tabindex="-1"></iframe>
  {:else}
    <Icon size={16} />
  {/if}
</div>

<style>
  .thumb {
    position: relative;
    width: 44px;
    height: 56px;
    overflow: hidden;
    border: 1px solid var(--v2-line);
    border-radius: 6px;
    background: color-mix(in srgb, var(--v2-slate) 8%, white);
    display: grid;
    place-items: center;
    color: var(--v2-slate);
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 220px;
    height: 280px;
    border: 0;
    background: white;
    transform: scale(0.2);
    transform-origin: top left;
    pointer-events: none;
  }
</style>

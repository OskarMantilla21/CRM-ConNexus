<script>
  /**
   * What a chosen or stored file looks like before anyone has to download it.
   *
   * Images, PDFs and plain text render in the stage. Other types stay a card:
   * an HTML or SVG file served inline from this origin would run as the app.
   * `file` is a local pick (not uploaded yet). `src` is the authenticated
   * preview route for a document that is already stored.
   *
   * @type {{
   *   file?: File | null,
   *   src?: string | null,
   *   name?: string,
   *   title?: string,
   *   size?: number | null,
   *   rows?: { label: string, value: string }[],
   *   flush?: boolean
   * }}
   */
  let {
    file = null,
    src = null,
    name = '',
    title = '',
    size = null,
    rows = [],
    flush = false
  } = $props();

  import { FileText, FileSpreadsheet, File } from '@lucide/svelte';
  import { tx } from '$lib/i18n/translate.js';

  const IMAGE = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);
  const TEXT = new Set(['txt', 'md', 'csv']);

  /** @param {string} value */
  function extOf(value) {
    const base = value.split(/[/\\]/).pop() ?? value;
    const dot = base.lastIndexOf('.');
    return dot >= 0 ? base.slice(dot + 1).toLowerCase() : '';
  }

  let ext = $derived(extOf(name || file?.name || ''));
  let kind = $derived(
    IMAGE.has(ext) ? 'image' : ext === 'pdf' ? 'pdf' : TEXT.has(ext) ? 'text' : 'file'
  );
  let objectUrl = $state('');
  let textBody = $state('');

  $effect(() => {
    if (!file) {
      objectUrl = '';
      return;
    }
    const url = URL.createObjectURL(file);
    objectUrl = url;
    return () => URL.revokeObjectURL(url);
  });

  let viewSrc = $derived(file ? objectUrl : src || '');

  $effect(() => {
    textBody = '';
    if (kind !== 'text') return;
    const current = file;
    const remote = src;
    let alive = true;
    const read = current
      ? current.text()
      : remote
        ? fetch(remote).then((response) => (response.ok ? response.text() : ''))
        : Promise.resolve('');
    read.then((body) => {
      if (alive) textBody = body.slice(0, 4000);
    });
    return () => {
      alive = false;
    };
  });

  /** @param {number | null | undefined} bytes */
  function fileSize(bytes) {
    if (bytes == null) return '—';
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1000))} kB`;
  }

  let shownSize = $derived(fileSize(size ?? file?.size ?? null));
  let shownName = $derived((name || file?.name || '').split(/[/\\]/).pop() || '');
  const SHEET = new Set(['xls', 'xlsx', 'ods', 'numbers']);
  let Icon = $derived(
    ext === 'pdf' || TEXT.has(ext) ? FileText : SHEET.has(ext) ? FileSpreadsheet : File
  );
</script>

<article class="preview" class:flush>
  <div class="stage">
    {#if kind === 'image' && viewSrc}
      <img src={viewSrc} alt={title || shownName} />
    {:else if kind === 'pdf' && viewSrc}
      <iframe title={title || shownName} src={viewSrc}></iframe>
    {:else if kind === 'text'}
      <pre>{textBody}</pre>
    {:else}
      <div class="fallback">
        <Icon size={28} />
        <p>{tx('This file type opens when you download it.')}</p>
      </div>
    {/if}
  </div>
  <dl>
    <div>
      <dt>{tx('Title')}</dt>
      <dd>{title || shownName || '—'}</dd>
    </div>
    <div>
      <dt>{tx('File')}</dt>
      <dd>{shownName || '—'}</dd>
    </div>
    <div>
      <dt>{tx('Size')}</dt>
      <dd class="v2-num">{shownSize}</dd>
    </div>
    {#each rows as row (row.label)}
      <div>
        <dt>{row.label}</dt>
        <dd>{row.value}</dd>
      </div>
    {/each}
  </dl>
</article>

<style>
  .preview {
    border: 1px solid var(--v2-line);
    border-radius: 12px;
    background: var(--v2-card);
    overflow: hidden;
  }
  .preview.flush {
    border: 0;
    border-radius: 0;
  }
  .stage {
    display: grid;
    place-items: center;
    min-height: 280px;
    max-height: 460px;
    background: color-mix(in srgb, var(--v2-slate) 8%, var(--v2-card));
    border-bottom: 1px solid var(--v2-line);
  }
  img,
  iframe,
  pre {
    width: 100%;
    height: 420px;
    border: 0;
    background: white;
  }
  img {
    object-fit: contain;
    height: auto;
    max-height: 420px;
  }
  pre {
    margin: 0;
    padding: 16px 18px;
    overflow: auto;
    white-space: pre-wrap;
    font-family: var(--v2-mono);
    font-size: 12px;
    text-align: left;
  }
  .fallback {
    display: grid;
    justify-items: center;
    gap: 8px;
    padding: 28px;
    color: var(--v2-slate);
    text-align: center;
    font-size: 13px;
  }
  dl {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px 18px;
    margin: 0;
    padding: 14px 16px 16px;
  }
  dt {
    font-size: 10px;
    font-weight: 650;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--v2-slate);
  }
  dd {
    margin: 3px 0 0;
    font-size: 13.5px;
    overflow-wrap: anywhere;
  }
  @media (max-width: 640px) {
    dl {
      grid-template-columns: 1fr;
    }
    iframe,
    pre {
      height: 280px;
    }
  }
</style>

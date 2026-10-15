<script>
  import { resolve } from '$app/paths';
  /**
   * Documents: a model with a full API and, until now, no screen anywhere.
   * `Document` has existed since the first migration and neither v1 nor the
   * Flutter client ever rendered one, so three defects in
   * `/api/documents/` went unnoticed for its whole life: the list crashed for
   * non-admins, uploading a file did not let you open it, and sharing with a
   * team granted nobody anything. All three are fixed;
   * `common/tests/test_documents_access.py` covers them in both directions,
   * and the page is drawn against the corrected rules.
   *
   * The column that matters here is **who can open it**. On every other v2
   * list the interesting fact is the work; on this one it is the audience,
   * because a document nobody has been given is a document that does not
   * exist as far as the rest of the team is concerned. So the share is a
   * column, not a detail-page field.
   *
   * Deletion is deliberately narrower than reading, on both sides: a share
   * hands someone a copy to work with, not the right to remove it from
   * everyone else. The row only offers Delete where the server would allow
   * it, rather than offering it to everyone and failing on press.
   */
  import { page } from '$app/state';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import FilePreview from '$lib/v2/components/FilePreview.svelte';
  import DocThumb from '$lib/v2/components/DocThumb.svelte';
  import StatCard from '$lib/v2/components/StatCard.svelte';
  import FilterBar from '$lib/v2/components/FilterBar.svelte';
  import EmptyState from '$lib/v2/components/EmptyState.svelte';
  import { count, relativeDays } from '$lib/v2/format.js';
  import { FileText, Users, Upload, Lock, Pencil } from '@lucide/svelte';
  import '$lib/i18n/pages/serve.js';
  import { tx } from '$lib/i18n/translate.js';

  /** @type {{ data: any }} */
  let { data } = $props();

  let documents = $derived(data.results);
  let totals = $derived(data.totals);
  // Uploading is open to any org member (the server checks only auth + org), so
  // the Upload button shows for everyone. Editing/deleting are the narrow writes
  //. Those are gated per row by `can_write` (creator or admin) below.

  /** kB and MB, never bytes. Nobody reads a file size in bytes. A missing file
      has no size the server could read, so it shows an em dash, not "0 kB". */
  function fileSize(bytes) {
    if (bytes == null) return '—';
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    return `${Math.round(bytes / 1000)} kB`;
  }

  /**
   * Who can open a document, in the same terms the server uses: the creator,
   * anyone in `shared_to`, anyone in a team it is shared with, plus admins.
   *
   * Names rather than a count while there are few enough to read; "Marcus
   * and Ken" is checkable at a glance and "2 people" is not. Teams are named
   * separately below because "the Support team" is the thing that was chosen,
   * and flattening it to three names loses the reason.
   */
  /** @type {any} */
  let openDoc = $state(null);
  /** @type {HTMLElement | null} */
  let dialog = $state(null);
  /** @type {HTMLElement | null} */
  let returnFocus = null;

  function openPreview(/** @type {any} */ doc, /** @type {Event} */ event) {
    returnFocus = /** @type {HTMLElement} */ (event.currentTarget);
    openDoc = doc;
  }

  function closePreview() {
    openDoc = null;
    returnFocus?.focus();
    returnFocus = null;
  }

  $effect(() => {
    if (!openDoc) return;
    dialog?.focus();
    const onKey = (/** @type {KeyboardEvent} */ event) => {
      if (event.key === 'Escape') closePreview();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function reachLabel(d) {
    const names = d.shared_to.map((p) => p.name.split(' ')[0]);
    if (!names.length) return d.teams.length ? '' : tx('Nobody yet');
    if (names.length <= 2) return names.join(tx(' and '));
    return tx('{names} and {n} more', {
      names: names.slice(0, 2).join(', '),
      n: names.length - 2
    });
  }

  /** The full audience, for the preview. The table keeps the short form. */
  function audienceOf(d) {
    if (!d.shared_to.length && !d.teams.length) return tx('Only the uploader and admins');
    const people = reachLabel(d);
    const teams = d.teams.map((/** @type {{ name: string }} */ t) => t.name).join(', ');
    return [people, teams].filter(Boolean).join(' · ');
  }

  let previewRows = $derived(
    openDoc
      ? [
          { label: tx('Uploaded by'), value: openDoc.created_by.name },
          { label: tx('Who can open it'), value: audienceOf(openDoc) },
          { label: tx('Added'), value: relativeDays(openDoc.created_at) }
        ]
      : []
  );
</script>

<PageHeader title={tx('Documents')}>
  {#snippet sub()}
    <span class="v2-num">{count(totals.active)}</span> {tx('active')} ·
    <span class="v2-num">{count(totals.inactive)}</span> {tx('archived')}
  {/snippet}
  {#snippet actions()}
    <a class="v2-btn v2-btn-primary" href={resolve('/documents/new')}><Upload />{tx('Upload')}</a>
  {/snippet}
</PageHeader>

{#if page.url.search}
  <p class="v2-sub" style="font-size:11.5px;margin:8px 0 0">
    {tx('These numbers describe the filtered list.')}
  </p>
{/if}

<div class="v2-pad" style="padding-top:14px;flex:none">
  <div class="v2-stats">
    <StatCard
      label={tx('Given to nobody')}
      value={count(totals.unshared)}
      tone={totals.unshared ? 'clay' : 'slate'}
      detail={tx('Only the uploader and admins')}
    />
    <StatCard label={tx('Active')} value={count(totals.active)} tone="ink" />
    <StatCard label={tx('Archived')} value={count(totals.inactive)} tone="slate" />
    <StatCard label={tx('Total')} value={count(totals.count)} tone="slate" />
  </div>
</div>

<FilterBar page="documents" url={page.url} meta={tx('Newest first')} />

<div class="v2-scroll">
  {#if documents.length === 0}
    <EmptyState
      title={tx('No documents yet')}
      body={tx(
        'Contracts, runbooks, price sheets. The things you send people often enough to stop hunting for. Share each one with the people or the team who need it; an unshared upload is visible only to you and to admins.'
      )}
    >
      {#snippet icon()}<FileText size={21} />{/snippet}
      {#snippet actions()}
        <a class="v2-btn v2-btn-primary" href={resolve('/documents/new')}>{tx('Upload a document')}</a>
      {/snippet}
    </EmptyState>
  {:else}
    <div class="v2-table-wrap">
      <table class="v2-table">
        <thead>
          <tr>
            <th>{tx('Document')}</th>
            <th>{tx('Who can open it')}</th>
            <th>{tx('Uploaded by')}</th>
            <th class="v2-r">{tx('Size')}</th>
            <th class="v2-r">{tx('Added')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each documents as d (d.id)}
            <tr class:archived={d.status === 'inactive'}>
              <td style="white-space:normal;max-width:420px">
                <span class="doc">
                  {#if d.preview_href}
                    <div
                      class="thumb-btn"
                      role="button"
                      tabindex="0"
                      aria-label={tx('Preview')}
                      onclick={(event) => openPreview(d, event)}
                      onkeydown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          openPreview(d, event);
                        }
                      }}
                    >
                      <DocThumb src={d.preview_href} name={d.document_file} title={d.title} />
                    </div>
                  {/if}
                  <span>
                    <!-- The title opens a preview of this document. Download,
                         inside that dialog, is still a route on this origin
                         that streams the file after the record's own read
                         check. A `/media/` link would be readable by every
                         tenant and would 403 for the person entitled to it. -->
                    {#if d.download_href}
                      <button
                        type="button"
                        class="v2-table-primary title"
                        aria-haspopup="dialog"
                        onclick={(event) => openPreview(d, event)}
                      >
                        {d.title}
                      </button>
                    {:else}
                      <span class="v2-table-primary">{d.title}</span>
                    {/if}
                    <span class="v2-table-secondary path">{d.document_file}</span>
                  </span>
                </span>
              </td>

              <td style="white-space:normal;max-width:280px">
                {#if reachLabel(d)}
                  <span class="reach" class:narrow={!d.shared_to.length && !d.teams.length}>
                    {#if !d.shared_to.length && !d.teams.length}<Lock size={11} />{/if}
                    {reachLabel(d)}
                  </span>
                {/if}

                <!-- Named as the team, not flattened into its members: the
                     team is what somebody chose, and it keeps being right as
                     people join and leave it. -->
                {#if d.teams.length}
                  <span class="team-share">
                    <Users size={11} />
                    {d.teams.map((t) => `${t.name} (${t.member_count})`).join(', ')}
                  </span>
                {/if}
              </td>

              <td>{d.created_by.name}</td>

              <td class="v2-r v2-num v2-muted">{fileSize(d.size_bytes)}</td>
              <td class="v2-r v2-muted">{relativeDays(d.created_at)}</td>

              <!-- Edit is offered only where the server would allow the write,
                   the uploader or an admin, so the row never presents an action
                   that would 403. Managing shares and deleting both live behind
                   it. Reading is broader, but that is what the row already is. -->
              <td class="v2-r">
                {#if d.can_write}
                  <a
                    class="edit"
                    href={resolve(`/documents/${d.id}/edit`)}
                    title={tx('Manage this document')}
                  >
                    <Pencil size={13} />
                  </a>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <p class="v2-sub v2-pad" style="font-size:12px;padding-bottom:24px">
      {tx('Showing')} <span class="v2-num">{documents.length}</span> {tx('of')}
      <span class="v2-num">{count(totals.count)}</span>
    </p>
  {/if}
</div>

{#if openDoc}
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
      aria-labelledby="doc-preview-title"
      tabindex="-1"
      bind:this={dialog}
    >
      <header>
        <h2 id="doc-preview-title">{openDoc.title}</h2>
        <a class="v2-btn" href={openDoc.download_href} download>{tx('Download')}</a>
        <button class="v2-btn" type="button" onclick={closePreview}>{tx('Close')}</button>
      </header>
      <FilePreview
        flush
        src={openDoc.preview_href}
        name={openDoc.document_file}
        title={openDoc.title}
        size={openDoc.size_bytes}
        rows={previewRows}
      />
    </div>
  </div>
{/if}

<style>
  .doc {
    display: flex;
    gap: 10px;
    align-items: center;
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
  .path {
    font-family: var(--v2-mono);
    font-size: 11px;
  }

  /* A block so the whole title line is the tap target on a phone, where the
     row is a card and there is no second column to aim at. */
  button.title {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    font: inherit;
    text-align: left;
    text-decoration: none;
    cursor: pointer;
  }

  button.title:hover {
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

  .reach {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12.5px;
  }
  .reach.narrow {
    color: var(--v2-clay);
  }

  .team-share {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 3px;
    font-size: 11.5px;
    color: var(--v2-slate);
  }

  /* Archived rows stay legible. Dimming them to near-invisible is how people
     stop believing the archive contains anything. */
  .archived .v2-table-primary {
    color: var(--v2-slate);
  }

  .edit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--v2-slate);
  }
  .edit:hover {
    color: var(--v2-ink);
  }
</style>

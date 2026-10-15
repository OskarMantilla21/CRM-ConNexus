<script>
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import SectionTabs from '$lib/v2/components/SectionTabs.svelte';
  import FilterBar from '$lib/v2/components/FilterBar.svelte';
  import StatCard from '$lib/v2/components/StatCard.svelte';
  import CurrencySwitch from '$lib/v2/components/CurrencySwitch.svelte';
  import Pill from '$lib/v2/components/Pill.svelte';
  import EmptyState from '$lib/v2/components/EmptyState.svelte';
  import FilePreview from '$lib/v2/components/FilePreview.svelte';
  import DocThumb from '$lib/v2/components/DocThumb.svelte';
  import { money, count, shortDate, daysSince } from '$lib/v2/format.js';
  import { INVOICE_STATUS_TONE, invoiceStatusLabel } from '$lib/v2/enums.js';
  import { invoiceRevision } from '$lib/v2/invoice-preview.js';
  import { tx } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/bill.js';
  import { enhance } from '$app/forms';
  import { Download, Plus, Receipt, Trash2 } from '@lucide/svelte';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();

  let invoices = $derived(data.invoices);
  let totals = $derived(data.totals);

  /**
   * The money is per currency: there are no exchange rates, so the header
   * shows one currency at a time with a switch when there are several. The
   * picked one, else the org's own, else the first one invoiced in.
   *
   * @type {string | null}
   */
  let picked = $state(null);
  let cur = $derived(
    totals.currencies.includes(picked)
      ? picked
      : totals.currencies.includes(data.org.currency)
        ? data.org.currency
        : (totals.currencies[0] ?? data.org.currency)
  );
  let m = $derived(totals.byCurrency[cur] ?? totals.blank);

  /** Rows with a send in flight, so the button can show it is working. */
  let sending = $state(/** @type {Record<string, boolean>} */ ({}));

  /**
   * Days past due, or days remaining. A settled invoice has no age, once it
   * is Paid or Cancelled the due date stops meaning anything, and showing
   * "4d late" against a paid invoice is just wrong.
   */
  const SETTLED = ['Paid', 'Cancelled'];

  function ageLabel(inv) {
    if (SETTLED.includes(inv.status)) return '—';
    if (!inv.due_date) return '—';
    const n = daysSince(inv.due_date);
    if (n > 0) return tx('{n}d late', { n });
    if (n === 0) return tx('due today');
    return tx('{n}d left', { n: Math.abs(n) });
  }

  const isLate = (inv) =>
    !SETTLED.includes(inv.status) && inv.due_date && daysSince(inv.due_date) > 0;

  /**
   * The generated PDF, on this origin. `v` changes with the money and the
   * status, so a payment does not leave the old page in the thumbnail.
   * Download stays a separate address: that one is an attachment.
   *
   * @param {any} inv
   * @param {boolean} [preview]
   */
  function pdfHref(inv, preview = false) {
    const path = resolve(`/invoices/${inv.id}/pdf`);
    if (!preview) return path;
    const rev = invoiceRevision({
      status: inv.status,
      total: inv.total_amount,
      due: inv.amount_due,
      paid: inv.amount_paid,
      lines: inv.line_items_count,
      dueDate: inv.due_date
    });
    return `${path}?preview=1&v=${rev}`;
  }

  /** @type {any} */
  let openInvoice = $state(null);
  /** @type {HTMLElement | null} */
  let dialog = $state(null);
  /** @type {HTMLElement | null} */
  let returnFocus = null;

  function openPreview(/** @type {any} */ inv, /** @type {Event} */ event) {
    returnFocus = /** @type {HTMLElement} */ (event.currentTarget);
    openInvoice = inv;
  }

  function closePreview() {
    openInvoice = null;
    returnFocus?.focus();
    returnFocus = null;
  }

  $effect(() => {
    if (!openInvoice) return;
    dialog?.focus();
    const onKey = (/** @type {KeyboardEvent} */ event) => {
      if (event.key === 'Escape') closePreview();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  let previewRows = $derived(
    openInvoice
      ? [
          { label: tx('Account'), value: openInvoice.account.name },
          { label: tx('Status'), value: invoiceStatusLabel(openInvoice.status) },
          { label: tx('Due'), value: shortDate(openInvoice.due_date) },
          {
            label: tx('Amount'),
            value: money(openInvoice.total_amount, openInvoice.currency)
          }
        ]
      : []
  );
</script>

<PageHeader title={tx('Invoices')} count={totals.count}>
  {#snippet sub()}
    <!--
      These aggregates come from the API over the whole result set. v1 summed
      the loaded page, so a 50-row list showed pills adding up to 10.
    -->
    <span class="v2-num">{count(totals.count)}</span> {tx('invoices')} ·
    <span class="v2-num">{money(m.outstanding, cur)}</span> {tx('outstanding')}
  {/snippet}
  {#snippet actions()}
    <!-- The page's own query string: the export rebuilds the same API query
         from it, so the file holds every row this list would page through. -->
    <a
      class="v2-btn"
      href="{resolve('/api/invoices/export')}?{page.url.searchParams}"
      data-sveltekit-reload
    >
      <Download />{tx('Export')}
    </a>
    <a class="v2-btn v2-btn-primary" href={resolve('/invoices/new')}><Plus />{tx('New invoice')}</a>
  {/snippet}
</PageHeader>

<!-- Estimates and Recurring were buttons in this header that went nowhere,
     while /invoices/estimates existed in v1 and was reachable only from a
     dropdown elsewhere. They are sibling pages; a tab strip says so. -->
<SectionTabs set="invoices" />

<div class="v2-pad" style="padding-top:16px;flex:none">
  <CurrencySwitch currencies={totals.currencies} current={cur} onpick={(c) => (picked = c)} />
  <div class="v2-stats">
    <StatCard
      label={tx('Overdue')}
      value={money(m.overdue, cur)}
      tone="rust"
      detail={tx('Chase these first')}
    />
    <StatCard label={tx('Due this month')} value={money(m.due_this_month, cur)} tone="clay" />
    <StatCard label={tx('Paid this quarter')} value={money(m.paid_this_quarter, cur)} tone="moss" />
    <StatCard label={tx('Draft')} value={money(m.draft, cur)} tone="slate" detail={tx('Not sent yet')} />
  </div>
</div>

<!-- No "filtered list" line here, unlike the other v2 list pages: the pills
     above come from `totals`, which the API deliberately computes over the
     whole role-scoped queryset regardless of the active filter (see the note
     on `listInvoices` in `$lib/server/v2/invoices.js`). Saying "these numbers
     describe the filtered list" would be false for this page. -->
<FilterBar
  page="invoices"
  url={page.url}
  people={data.people}
  accounts={data.accounts}
  meId={data.meId}
  saved={data.savedViews}
  meta={tx('Oldest due first')}
/>

{#if form?.error}
  <p class="v2-sub v2-pad" style="color:var(--v2-rust);font-size:12.5px;padding-top:10px">
    {form.error}
  </p>
{/if}

<div class="v2-scroll">
  {#if invoices.length === 0}
    <EmptyState
      title={tx('Nothing billed yet')}
      body={tx('Invoices show up here once you raise one. A won deal is usually the place to start. The amount and the account are already there.')}
    >
      {#snippet icon()}<Receipt size={21} />{/snippet}
      {#snippet actions()}
        <a class="v2-btn v2-btn-primary" href={resolve('/invoices/new')}>{tx('New invoice')}</a>
        <a class="v2-btn" href={resolve('/pipeline')}>{tx('Go to pipeline')}</a>
      {/snippet}
    </EmptyState>
  {:else}
    <div class="v2-table-wrap">
      <table class="v2-table">
        <thead>
          <tr>
            <th>{tx('Invoice')}</th>
            <th>{tx('Account')}</th>
            <th>{tx('Status')}</th>
            <th class="v2-r">{tx('Amount')}</th>
            <th>{tx('Due')}</th>
            <th class="v2-r">{tx('Age')}</th>
            <th style="width:168px"></th>
          </tr>
        </thead>
        <tbody>
          {#each invoices as inv (inv.id)}
            {@const late = isLate(inv)}
            <tr>
              <td style="white-space:normal">
                <span class="inv">
                  <div
                    class="thumb-btn"
                    role="button"
                    tabindex="0"
                    aria-label={tx('Preview')}
                    aria-haspopup="dialog"
                    onclick={(event) => openPreview(inv, event)}
                    onkeydown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        openPreview(inv, event);
                      }
                    }}
                  >
                    <DocThumb
                      src={pdfHref(inv, true)}
                      name="{inv.invoice_number}.pdf"
                      title={inv.invoice_number}
                    />
                  </div>
                  <a class="v2-row-link" href={resolve(`/invoices/${inv.id}`)}>
                    <span class="v2-table-primary v2-num" style="font-size:13px"
                      >{inv.invoice_number}</span
                    >
                  </a>
                </span>
              </td>
              <td>{inv.account.name}</td>
              <td>
                <Pill tone={INVOICE_STATUS_TONE[inv.status]}>{invoiceStatusLabel(inv.status)}</Pill>
              </td>
              <td class="v2-r v2-num" style="font-weight:600"
                >{money(inv.total_amount, inv.currency)}</td
              >
              <td>{shortDate(inv.due_date)}</td>
              <td
                class="v2-r v2-num"
                class:v2-muted={!late}
                style={late ? 'color:var(--v2-rust);font-weight:600' : ''}
              >
                {ageLabel(inv)}
              </td>
              <td>
                <div class="row-actions">
                  {#if inv.status === 'Overdue' || inv.status === 'Draft'}
                    <form
                      method="POST"
                      action="?/send"
                      use:enhance={() => {
                        sending[inv.id] = true;
                        return async ({ update }) => {
                          await update();
                          sending[inv.id] = false;
                        };
                      }}
                    >
                      <input type="hidden" name="id" value={inv.id} />
                      <button class="v2-btn v2-btn-sm" disabled={sending[inv.id]}>
                        {#if sending[inv.id]}{tx('Sending…')}{:else if inv.status === 'Overdue'}{tx('Send a reminder')}{:else}{tx('Send')}{/if}
                      </button>
                    </form>
                  {/if}
                  <form method="POST" action="?/remove" use:enhance>
                    <input type="hidden" name="id" value={inv.id} />
                    <button class="v2-btn v2-btn-sm row-delete" type="submit">
                      <Trash2 size={13} />{tx('Delete')}
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <p class="v2-sub v2-pad" style="font-size:12px;padding-bottom:24px">
      {tx('Showing')} <span class="v2-num">{invoices.length}</span> {tx('of')}
      <span class="v2-num">{count(totals.count)}</span>
    </p>
  {/if}
</div>

{#if openInvoice}
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
      aria-labelledby="invoice-preview-title"
      tabindex="-1"
      bind:this={dialog}
    >
      <header>
        <h2 id="invoice-preview-title">{openInvoice.invoice_number}</h2>
        <a class="v2-btn" href={pdfHref(openInvoice)} download>{tx('Download PDF')}</a>
        <button class="v2-btn" type="button" onclick={closePreview}>{tx('Close')}</button>
      </header>
      <FilePreview
        flush
        src={pdfHref(openInvoice, true)}
        name="{openInvoice.invoice_number}.pdf"
        title={openInvoice.invoice_number}
        rows={previewRows}
      />
    </div>
  </div>
{/if}

<style>
  .inv {
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
  .row-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: flex-end;
  }
  .row-delete {
    color: var(--v2-rust);
  }
</style>

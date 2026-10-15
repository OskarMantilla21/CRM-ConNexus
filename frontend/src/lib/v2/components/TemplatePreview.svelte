<script>
  /**
   * The invoice sheet a new template prints, drawn while the form is filled.
   *
   * Text is interpolated, never `{@html}`: notes, terms and the footer are
   * whatever the admin is typing. The two colours are the same hexes `pdf.py`
   * swaps into the stylesheet (`#3B82F6` primary, `#1E40AF` secondary).
   * The line items are a sample, so the table has a shape before a real
   * invoice exists.
   */
  import { tx } from '$lib/i18n/translate.js';

  /** @type {{
   *   orgName?: string,
   *   primary?: string,
   *   secondary?: string,
   *   logoUrl?: string,
   *   notes?: string,
   *   terms?: string,
   *   footer?: string
   * }} */
  let {
    orgName = '',
    primary = '#3B82F6',
    secondary = '#1E40AF',
    logoUrl = '',
    notes = '',
    terms = '',
    footer = ''
  } = $props();

  let mark = $derived((orgName || 'ORG').replace(/\s+/g, '').slice(0, 4).toUpperCase());
  let company = $derived(orgName || tx('Your company'));
</script>

<aside class="sheet-wrap" aria-label={tx('Preview')}>
  <div class="sheet-label">{tx('Preview')}</div>
  <div
    class="sheet"
    style:--brand={primary}
    style:--brand-2={secondary}
  >
    <header class="head">
      <div>
        <div class="company">{company}</div>
        <p>{tx('Address, phone and email come from the organisation.')}</p>
      </div>
      <div class="brand">
        <div class="doc-title">{tx('Invoice')}</div>
        {#if logoUrl}
          <img src={logoUrl} alt="" />
        {:else}
          <div class="mark">{mark}</div>
        {/if}
      </div>
    </header>

    <section class="parties">
      <div>
        <strong>{tx('Sample customer')}</strong>
        <p>{tx('The customer is filled in on the invoice, not on the template.')}</p>
      </div>
      <dl>
        <div><dt>{tx('Invoice #')}</dt><dd>INV-0001</dd></div>
        <div><dt>{tx('Invoice date')}</dt><dd>{tx('Sample date')}</dd></div>
        <div><dt>{tx('Due date')}</dt><dd>{tx('Sample date')}</dd></div>
      </dl>
    </section>

    <table>
      <thead>
        <tr>
          <th>{tx('Description')}</th>
          <th class="num">{tx('Quantity')}</th>
          <th class="num">{tx('Price')}</th>
          <th class="num">{tx('Total')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span class="item">{tx('Sample service')}</span>
            <span class="detail">{tx('Sample lines, so the table has a shape.')}</span>
          </td>
          <td class="num">2</td>
          <td class="num">120.00</td>
          <td class="num">240.00</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div><span>{tx('Subtotal')}</span><span>240.00</span></div>
      <div><span>{tx('Tax')}</span><span>0.00</span></div>
      <div class="grand"><span>{tx('Total')}</span><span>240.00</span></div>
    </div>

    {#if notes.trim()}
      <div class="block">
        <h3>{tx('Default notes')}</h3>
        <p>{notes}</p>
      </div>
    {/if}
    {#if terms.trim()}
      <div class="block">
        <h3>{tx('Default terms')}</h3>
        <p>{terms}</p>
      </div>
    {/if}

    <div class="sign">
      <p>{tx('Yours sincerely,')}</p>
      <p class="who">{company}</p>
    </div>

    <footer>
      {#if footer.trim()}<p>{footer}</p>{/if}
      <p>{tx('Copyright')} © {company}</p>
    </footer>
  </div>
</aside>

<style>
  .sheet-wrap {
    min-width: 0;
  }
  .sheet-label {
    font-size: 11px;
    font-weight: 650;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--v2-slate);
    margin-bottom: 8px;
  }
  .sheet {
    background: #fff;
    color: #333;
    border: 1px solid var(--v2-line);
    border-radius: 10px;
    box-shadow: var(--v2-shadow);
    padding: 18px 16px 14px;
    font-size: 11px;
    line-height: 1.4;
  }
  .head,
  .parties {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  .head {
    margin-bottom: 16px;
  }
  .company {
    font-size: 14px;
    font-weight: 700;
    color: #222;
  }
  .head p,
  .parties p,
  .detail {
    margin: 2px 0 0;
    color: #666;
    font-size: 10px;
  }
  .brand {
    text-align: right;
    flex: none;
  }
  .doc-title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.04em;
    color: var(--brand);
    margin-bottom: 4px;
  }
  .brand img {
    max-height: 36px;
    max-width: 110px;
    object-fit: contain;
  }
  .mark {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--brand-2);
  }
  .parties {
    margin-bottom: 12px;
  }
  dl {
    margin: 0;
    min-width: 46%;
  }
  dl div {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 2px;
  }
  dt {
    font-weight: 700;
  }
  dd {
    margin: 0;
    text-align: right;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 0;
  }
  th {
    background: var(--brand);
    color: #fff;
    text-align: left;
    font-weight: 700;
    padding: 6px 7px;
    border: 1px solid var(--brand-2);
  }
  td {
    border: 1px solid #bcc4cc;
    padding: 7px;
    vertical-align: top;
  }
  .num {
    text-align: right;
    white-space: nowrap;
  }
  .item {
    display: block;
    font-weight: 600;
  }
  .totals {
    width: 52%;
    margin-left: auto;
  }
  .totals div {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 4px 7px;
    background: #e8ecef;
    border-right: 1px solid #bcc4cc;
  }
  .grand {
    font-weight: 700;
    background: #d1d9e1;
  }
  .grand span:last-child {
    color: var(--brand);
  }
  .block {
    margin-top: 12px;
  }
  .block h3 {
    margin: 0 0 2px;
    font-size: 11px;
  }
  .block p,
  .sign p,
  footer p {
    margin: 0;
    white-space: pre-wrap;
  }
  .sign {
    margin-top: 14px;
  }
  .who {
    font-weight: 600;
    margin-top: 8px;
  }
  footer {
    margin-top: 14px;
    padding-top: 8px;
    border-top: 1px solid #ddd;
    text-align: center;
    color: #555;
    font-size: 10px;
  }
</style>

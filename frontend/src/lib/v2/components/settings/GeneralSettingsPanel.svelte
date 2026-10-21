<script>
  /**
   * Organization identity: the name, logo, clock and base currency.
   * Address and tax stay on the organization page, because they are printed
   * on invoices and are a longer form than this tab.
   *
   * Language is a browser preference. It is changed on the profile, under
   * Access, not from this form.
   */
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import { tx } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/migrate.js';
  import { CURRENCY_CODES } from '$lib/constants/filters.js';

  /** @type {{ data: any, form: any }} */
  let { data, form: result } = $props();

  const currencyOptions = CURRENCY_CODES.filter((/** @type {any} */ c) => c.value);
  let org = $derived(data.org ?? {});
  let timezones = $derived.by(() => {
    const list = data.timezones ?? [{ name: 'UTC', label: 'UTC' }];
    const current = org.timezone || 'UTC';
    if (list.some((/** @type {{ name: string }} */ zone) => zone.name === current)) return list;
    return [{ name: current, label: current }, ...list];
  });

  let name = $state('');
  let companyName = $state('');
  let timezone = $state('UTC');
  let currency = $state('USD');
  let seen = $state('');

  $effect(() => {
    const stamp = [
      org.name,
      org.company_name,
      org.timezone,
      org.default_currency,
      result?.saved ? 'saved' : ''
    ].join('|');
    if (stamp === seen || result?.error) return;
    seen = stamp;
    name = org.name ?? '';
    companyName = org.company_name ?? '';
    timezone = org.timezone || 'UTC';
    currency = org.default_currency || 'USD';
  });
</script>

<div class="v2-pad" style="padding-top:18px;padding-bottom:32px;max-width:720px">
  <form class="v2-form" method="POST" action="?/saveGeneral" enctype="multipart/form-data" use:enhance>
    {#if result?.action === 'general' && result?.error}
      <p class="err" role="alert">{result.error}</p>
    {:else if result?.action === 'general' && result?.saved}
      <p class="ok">{tx('Saved.')}</p>
    {/if}

    <div class="v2-field">
      <label for="org-name">{tx('Organization name')}</label>
      <input
        id="org-name"
        name="name"
        class="v2-input"
        maxlength="100"
        bind:value={name}
        disabled={!data.can_edit}
      />
    </div>

    <div class="v2-field">
      <label for="org-legal">{tx('Legal name')}</label>
      <input
        id="org-legal"
        name="company_name"
        class="v2-input"
        maxlength="255"
        bind:value={companyName}
        disabled={!data.can_edit}
      />
      <p class="v2-hint">{tx('Printed on invoices. Address and tax stay on the organization page.')}</p>
    </div>

    <div class="v2-field">
      <label for="org-logo">{tx('Logo')}</label>
      {#if org.logo_url}
        <img class="logo" src={org.logo_url} alt="" />
      {/if}
      {#if data.can_edit}
        <input id="org-logo" name="logo" class="v2-input" type="file" accept="image/png,image/jpeg,image/webp" />
        <p class="v2-hint">{tx('PNG, JPEG or WebP, up to 2 MB.')}</p>
      {/if}
    </div>

    <div class="v2-field">
      <label for="org-tz">{tx('Timezone')}</label>
      <select id="org-tz" name="timezone" class="v2-input" bind:value={timezone} disabled={!data.can_edit}>
        {#each timezones as zone (zone.name)}
          <option value={zone.name}>{zone.label}</option>
        {/each}
      </select>
    </div>

    <div class="v2-field">
      <label for="org-currency">{tx('Base currency')}</label>
      <select id="org-currency" name="default_currency" class="v2-input" bind:value={currency} disabled={!data.can_edit}>
        {#each currencyOptions as item (item.value)}
          <option value={item.value}>{item.label}</option>
        {/each}
      </select>
    </div>

    {#if data.can_edit}
      <button class="v2-btn v2-btn-primary" type="submit">{tx('Save')}</button>
    {/if}
  </form>

  <p class="v2-sub" style="margin-top:16px;font-size:12px">
    <a href={resolve('/settings/organization')}>{tx('Organization')}</a>
    — {tx('The company details printed on every invoice and estimate.')}
  </p>
  {#if data.role === 'CEO'}
    <p class="v2-sub" style="margin-top:8px;font-size:12px">
      <a href={resolve('/settings/migrate')}>{tx('Move records')}</a>
      — {tx('Bring records in from another company, or send this company\'s records out.')}
    </p>
  {/if}
</div>

<style>
  .logo {
    display: block;
    max-height: 48px;
    max-width: 180px;
    margin-bottom: 8px;
  }
  .ok,
  .err {
    margin: 0 0 12px;
    font-size: 13px;
  }
  .ok {
    color: var(--v2-moss);
  }
  .err {
    color: var(--v2-rust);
  }
</style>

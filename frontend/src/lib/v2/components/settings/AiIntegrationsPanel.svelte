<script>
  /**
   * AI integrations. Named providers and the address form live here.
   * The account page also accepts a key and names the assistant from it.
   * Today can ask a connected assistant. It does not configure one.
   */
  import { enhance } from '$app/forms';
  import { tx } from '$lib/i18n/translate.js';
  import AiProviderCard from './AiProviderCard.svelte';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();

  let busy = $state(false);
  const submit = () => {
    busy = true;
    return async (/** @type {any} */ { update }) => {
      await update();
      busy = false;
    };
  };

  let list = $derived(data.assistants?.assistants || []);
  let connected = $derived.by(() => {
    const rows = list.filter((/** @type {{ connected?: boolean, id: string }} */ item) => item.connected);
    const seen = new Set(rows.map((/** @type {{ id: string }} */ item) => item.id));
    for (const item of data.assistants?.using || []) {
      if (item?.id && !seen.has(item.id)) rows.push(item);
    }
    return rows;
  });
</script>

<div class="v2-pad" style="padding-top:18px;padding-bottom:32px;max-width:760px">
  <p class="v2-sub" style="margin:0 0 14px">
    {tx('The key stays on the server. This page does not show it again.')}
    {tx('Test connection checks the key without saving it.')}
  </p>

  {#if data.assistants?.unavailable}
    <p class="v2-sub">{tx('Assistants could not be loaded.')}</p>
  {:else}
    <form class="v2-card defaults" method="POST" action="?/defaultProvider" use:enhance={submit}>
      <div>
        <label class="v2-label" for="default-provider">{tx('Default provider')}</label>
        <p class="v2-sub note">
          {tx('Questions on Today and on the screen bar use this provider when it is connected.')}
        </p>
      </div>
      <select id="default-provider" class="v2-input" name="default_provider">
        <option value="" selected={!data.assistants?.default_provider}>{tx('First connected')}</option>
        {#each connected as item (item.id)}
          <option value={item.id} selected={data.assistants?.default_provider === item.id}>{item.name}</option>
        {/each}
      </select>
      <button class="v2-btn v2-btn-primary" type="submit" disabled={busy || !connected.length}>
        {tx('Save default')}
      </button>
      {#if form?.action === 'default' && form?.error}
        <p class="err">{form.error}</p>
      {:else if form?.action === 'default' && form?.saved}
        <p class="ok">{tx('Saved.')}</p>
      {/if}
    </form>

    {#each list as item (item.id)}
      <AiProviderCard
        {item}
        {busy}
        {form}
        tokenMin={data.assistants?.token_limit_min}
        tokenMax={data.assistants?.token_limit_max}
        onsubmit={submit}
      />
    {/each}
  {/if}
</div>

<style>
  .defaults {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: end;
    padding: 14px 16px;
    margin-bottom: 14px;
  }
  .defaults .v2-input {
    min-width: 180px;
  }
  .note {
    margin: 2px 0 0;
    font-size: 11.5px;
  }
  .ok,
  .err {
    flex-basis: 100%;
    margin: 0;
    font-size: 13px;
  }
  .ok {
    color: var(--v2-moss);
  }
  .err {
    color: var(--v2-rust);
  }
</style>

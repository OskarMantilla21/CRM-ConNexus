<script>
  /**
   * One provider on the AI integrations tab.
   *
   * The key is a password field. It is posted once and the server never sends
   * it back, so this card cannot show a saved key. Test does not store.
   * Connect stores, and only after the provider accepts the key.
   */
  import { enhance } from '$app/forms';
  import { tx } from '$lib/i18n/translate.js';

  /**
   * @type {{
   *   item: any,
   *   busy?: boolean,
   *   form?: any,
   *   tokenMin?: number,
   *   tokenMax?: number,
   *   onsubmit: import('@sveltejs/kit').SubmitFunction
   * }}
   */
  let { item, busy = false, form = null, tokenMin = 128, tokenMax = 4096, onsubmit } = $props();

  let mine = $derived(form?.provider === item.id);
</script>

<section class="v2-card card">
  <div class="head">
    <div>
      <b>{item.label ? item.name : tx(item.name)}</b>
      <p class="v2-sub">{tx(item.summary)}</p>
    </div>
    {#if item.connected}
      <span class="on">{tx('Connected')}</span>
    {:else}
      <span class="v2-sub">{tx('Not connected')}</span>
    {/if}
  </div>

  <form method="POST" use:enhance={onsubmit}>
    <input type="hidden" name="provider" value={item.id} />
    {#if item.custom}
      <label class="v2-label" for={'label-' + item.id}>{tx('Assistant name')}</label>
      <input
        id={'label-' + item.id}
        class="v2-input"
        name="label"
        type="text"
        maxlength="40"
        required
        autocomplete="off"
        value={item.label || ''}
      />
      <label class="v2-label" for={'url-' + item.id}>{tx('API address')}</label>
      <input
        id={'url-' + item.id}
        class="v2-input"
        name="base_url"
        type="text"
        inputmode="url"
        maxlength="200"
        required
        autocomplete="off"
        spellcheck="false"
        placeholder="https://api.example.com/v1"
        value={item.base_url || ''}
      />
      <p class="v2-sub note">{tx('https address, for example https://api.example.com/v1')}</p>
    {/if}
    <label class="v2-label" for={'key-' + item.id}>{tx('API key')}</label>
    <input
      id={'key-' + item.id}
      class="v2-input"
      name="api_key"
      type="password"
      autocomplete="off"
      minlength="8"
      maxlength="512"
      placeholder={item.connected ? tx('Paste a new key to replace it') : ''}
    />
    <p class="v2-sub note">{tx('The key stays on the server. This page does not show it again.')}</p>

    <div class="grid">
      <div>
        <label class="v2-label" for={'model-' + item.id}>{tx('Model')}</label>
        {#if item.custom}
          <input
            id={'model-' + item.id}
            class="v2-input"
            name="model"
            type="text"
            maxlength="80"
            required
            autocomplete="off"
            spellcheck="false"
            value={item.model || ''}
          />
        {:else}
          <select id={'model-' + item.id} class="v2-input" name="model">
            {#each item.models || [] as model (model)}
              <option value={model} selected={model === item.model}>{model}</option>
            {/each}
          </select>
        {/if}
      </div>
      <div>
        <label class="v2-label" for={'tokens-' + item.id}>{tx('Output token limit')}</label>
        <input
          id={'tokens-' + item.id}
          class="v2-input"
          name="max_output_tokens"
          type="number"
          min={tokenMin}
          max={tokenMax}
          step="64"
          value={item.max_output_tokens}
          required
        />
      </div>
    </div>

    <div class="actions">
      <button class="v2-btn" type="submit" formaction="?/test" disabled={busy}>{tx('Test connection')}</button>
      <button class="v2-btn v2-btn-primary" type="submit" formaction="?/connect" disabled={busy}>
        {item.connected ? tx('Replace key') : tx('Save and connect')}
      </button>
      {#if item.connected}
        <button class="v2-btn" type="submit" formaction="?/limits" disabled={busy}>{tx('Save model and limit')}</button>
      {/if}
    </div>
  </form>

  {#if item.connected}
    <form method="POST" action="?/disconnect" use:enhance={onsubmit}>
      <input type="hidden" name="provider" value={item.id} />
      <button class="v2-btn" type="submit" disabled={busy}>{tx('Disconnect')}</button>
    </form>
  {/if}

  {#if mine && form?.ok}
    <p class="ok">{tx('The connection succeeded.')}</p>
  {:else if mine && form?.connected}
    <p class="ok">{tx('Connected')}</p>
  {:else if mine && form?.saved}
    <p class="ok">{tx('Saved.')}</p>
  {:else if mine && form?.error}
    <p class="err">{form.error}</p>
  {/if}
</section>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px;
    margin-bottom: 12px;
  }
  .head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: flex-start;
  }
  .head p {
    margin: 2px 0 0;
  }
  .on {
    font-size: 12px;
    font-weight: 650;
    color: var(--v2-moss);
  }
  .note {
    margin: 4px 0 0;
    font-size: 11.5px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 160px;
    gap: 10px;
    margin-top: 10px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 10px;
  }
  .ok,
  .err {
    margin: 0;
    font-size: 13px;
  }
  .ok {
    color: var(--v2-moss);
  }
  .err {
    color: var(--v2-rust);
  }
  @media (max-width: 640px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script>
  import { page } from '$app/state';
  import { Globe } from '@lucide/svelte';
  import { LOCALES, DEFAULT_LOCALE } from '$lib/i18n/locale.js';
  import { tx } from '$lib/i18n/translate.js';

  /** Compact shows the locale code (ES, EN, PT) beside a globe, as in the top bar. */
  let { compact = false } = $props();

  /** The names in the list are endonyms, so they are not translated. */
  let current = $derived(page.data.locale || DEFAULT_LOCALE);
  let next = $derived(`${page.url.pathname}${page.url.search}`);

  /** @param {string} id */
  const code = (id) => (id === 'pt-BR' ? 'PT' : id.toUpperCase());
</script>

<form class="v2-lang" class:v2-lang-compact={compact} method="POST" action="/locale">
  <label>
    <span class="v2-sr-only">{tx('Language')}</span>
    {#if compact}<Globe size={14} />{/if}
    <select
      name="locale"
      aria-label={tx('Language')}
      value={current}
      onchange={(e) => e.currentTarget.form?.requestSubmit()}
    >
      {#each LOCALES as item (item.id)}
        <option value={item.id}>{compact ? code(item.id) : item.label}</option>
      {/each}
    </select>
  </label>
  <input type="hidden" name="next" value={next} />
</form>

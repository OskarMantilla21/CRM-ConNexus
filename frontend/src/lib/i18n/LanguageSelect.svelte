<script>
  import { page } from '$app/state';
  import { LOCALES, DEFAULT_LOCALE } from '$lib/i18n/locale.js';
  import { tx } from '$lib/i18n/translate.js';

  /** The names in the list are endonyms, so they are not translated. */
  let current = $derived(page.data.locale || DEFAULT_LOCALE);
  let next = $derived(`${page.url.pathname}${page.url.search}`);
</script>

<form class="v2-lang" method="POST" action="/locale">
  <label>
    <span class="v2-sr-only">{tx('Language')}</span>
    <select
      name="locale"
      aria-label={tx('Language')}
      value={current}
      onchange={(e) => e.currentTarget.form?.requestSubmit()}
    >
      {#each LOCALES as item (item.id)}
        <option value={item.id}>{item.label}</option>
      {/each}
    </select>
  </label>
  <input type="hidden" name="next" value={next} />
</form>

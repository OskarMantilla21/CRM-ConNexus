<script>
  import { browser } from '$app/environment';
  import { setClientLocale } from '$lib/i18n/locale.js';
  import { DEFAULT_LOCALE } from '$lib/i18n/locale.js';

  /** @type {{ data: { locale?: string }, children: import('svelte').Snippet }} */
  let { data, children } = $props();

  // The server reads the language from the request store. The browser has to
  // be told before the pages below this layout render their first words.
  if (browser) setClientLocale(data.locale || DEFAULT_LOCALE);
</script>

{@render children()}

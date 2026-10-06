<script>
  import { resolve } from '$app/paths';
  import { asInternalPath } from '$lib/utils/paths.js';
  import LanguageSelect from '$lib/i18n/LanguageSelect.svelte';
  import BrandMark from './BrandMark.svelte';

  /** @type {{ href?: string }} */
  let { href = '/' } = $props();
</script>

<header class="v2-topbar">
  <a class="v2-brand" href={resolve(asInternalPath(href))}>
    <BrandMark />
  </a>
  <div class="v2-topbar-end">
    <LanguageSelect compact />
  </div>
</header>

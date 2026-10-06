<script>
  import MergeCompare from '$lib/v2/components/MergeCompare.svelte';
  import { tx, choiceLabel } from '$lib/i18n/translate.js';
  import '$lib/i18n/pages/sell.js';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();
</script>

<svelte:head>
  <title>{tx('Merge {name}', { name: `${data.singular}s` })}</title>
</svelte:head>

<MergeCompare {data} {form} />

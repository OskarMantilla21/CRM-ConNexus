<script>
  /**
   * A small mark for the connected assistant. Each one is original. None of
   * them is a vendor logo.
   */
  import Spark from './Spark.svelte';

  /** @type {{ provider?: string }} */
  let { provider = '' } = $props();
</script>

{#if provider === 'grok'}
  <svg class="mark" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2.4 20.4 7.2v9.6L12 21.6 3.6 16.8V7.2L12 2.4Zm0 3.6L7.2 8.8v6.4L12 18l4.8-2.8V8.8L12 6Z"
    />
  </svg>
{:else if provider === 'openai'}
  <svg class="mark" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="2.3" />
    <circle cx="12" cy="4.8" r="1.7" />
    <circle cx="18.2" cy="8.4" r="1.7" />
    <circle cx="18.2" cy="15.6" r="1.7" />
    <circle cx="12" cy="19.2" r="1.7" />
    <circle cx="5.8" cy="15.6" r="1.7" />
    <circle cx="5.8" cy="8.4" r="1.7" />
  </svg>
{:else}
  <Spark />
{/if}

<style>
  .mark {
    width: 1em;
    height: 1em;
    display: block;
    fill: var(--v2-ember);
  }
</style>

<script>
  import { resolve } from '$app/paths';
  import { Bell } from '@lucide/svelte';
  import { tx } from '$lib/i18n/translate.js';

  /** @type {{ count?: number }} */
  let { count = 0 } = $props();
</script>

<a class="v2-icon-btn bell" href={resolve('/notifications')} aria-label={tx('Notifications')}>
  <Bell size={18} />
  {#if count > 0}
    <span class="v2-count">{count}</span>
  {/if}
</a>

<style>
  .bell {
    position: relative;
    text-decoration: none;
  }
  .v2-count {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 999px;
    background: var(--v2-ember);
    color: #fff;
    font-size: 10px;
    font-weight: 650;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>

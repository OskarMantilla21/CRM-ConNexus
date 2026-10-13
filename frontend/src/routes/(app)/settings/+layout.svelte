<script>
  import SettingsTabs from '$lib/v2/components/SettingsTabs.svelte';

  /** @type {{ data: { role?: string }, children: import('svelte').Snippet }} */
  let { data, children } = $props();
</script>

<div class="settings-shell">
  <SettingsTabs role={data.role ?? ''} />
  {@render children()}
</div>

<style>
  .settings-shell {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
</style>

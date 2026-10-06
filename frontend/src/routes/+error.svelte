<script>
  import '../app.css';
  import { page } from '$app/stores';
  import ErrorPage from '$lib/components/ErrorPage.svelte';
  import { tx } from '$lib/i18n/translate.js';
</script>

<svelte:head>
  <title>{$page.status} {$page.status === 404 ? tx('Not Found') : tx('Error')} | BottleCRM</title>
</svelte:head>

<main class="bg-background min-h-screen">
  <ErrorPage status={$page.status} message={$page.error?.message ?? ''} />
</main>

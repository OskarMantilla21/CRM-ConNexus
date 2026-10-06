<script>
  import { resolve } from '$app/paths';
  import '../../../../app.css';
  import '$lib/v2/styles/v2.css';
  import { tx } from '$lib/i18n/translate.js';
  import PublicBar from '$lib/v2/components/PublicBar.svelte';

  let { data, form } = $props();

  const error = $derived(form?.error ?? data.error);
  let submitting = $state(false);
</script>

<svelte:head>
  <title>{tx('Sign in · ConNexus-CRM')}</title>
  <!-- same-origin, not no-referrer: under no-referrer the browser sends
       `Origin: null` on the form POST, and SvelteKit's CSRF check refuses it
       as cross-site (403). same-origin still keeps the token in this URL out of
       any Referer sent to another site. -->
  <meta name="referrer" content="same-origin" />
</svelte:head>

<div class="v2-root v2-public">
  <PublicBar />
  <div class="v2-public-body">
  <div class="v2-auth-box">
    <div class="v2-auth-card" style="text-align:center">
      {#if error}
        <div class="v2-auth-head" style="margin-bottom:16px">
          <h1>{tx('Link expired or invalid')}</h1>
          <p>{error}</p>
        </div>
        <a href={resolve('/login')} class="v2-btn v2-btn-block">{tx('Back to sign in')}</a>
      {:else}
        <div class="v2-auth-head" style="margin-bottom:16px">
          <h1>{tx('Sign in to ConNexus-CRM')}</h1>
          <p>{tx('Press the button to finish signing in.')}</p>
        </div>
        <!-- A plain submit, never an automatic one: see +page.server.js. No
             `action` attribute, so it posts back to this URL, token included. -->
        <form method="POST" onsubmit={() => (submitting = true)}>
          <button type="submit" class="v2-btn v2-btn-primary v2-btn-block" disabled={submitting}>
            {#if submitting}
              <span class="v2-spin"></span>
              <span>{tx('Signing in…')}</span>
            {:else}
              <span>{tx('Continue to ConNexus-CRM')}</span>
            {/if}
          </button>
        </form>
      {/if}
    </div>
  </div>
  </div>
</div>

<script>
  import { resolve } from '$app/paths';
  import '../../../../app.css';
  import '$lib/v2/styles/v2.css';
  import imgLogo from '$lib/assets/images/logo.png';
  import { tx } from '$lib/i18n/translate.js';
  import LanguageSelect from '$lib/i18n/LanguageSelect.svelte';

  let { data, form } = $props();

  const error = $derived(form?.error ?? data.error);
  let submitting = $state(false);
</script>

<svelte:head>
  <title>{tx('Sign in · BottleCRM')}</title>
  <!-- same-origin, not no-referrer: under no-referrer the browser sends
       `Origin: null` on the form POST, and SvelteKit's CSRF check refuses it
       as cross-site (403). same-origin still keeps the token in this URL out of
       any Referer sent to another site. -->
  <meta name="referrer" content="same-origin" />
</svelte:head>

<div class="v2-root v2-auth">
  <div class="v2-auth-box">
    <a href={resolve('/')} class="v2-auth-brand">
      <img src={imgLogo} alt="" />
      <b>BottleCRM</b>
    </a>

    <div class="v2-auth-card" style="text-align:center">
      {#if error}
        <div class="v2-auth-head" style="margin-bottom:16px">
          <h1>{tx('Link expired or invalid')}</h1>
          <p>{error}</p>
        </div>
        <a href={resolve('/login')} class="v2-btn v2-btn-block">{tx('Back to sign in')}</a>
      {:else}
        <div class="v2-auth-head" style="margin-bottom:16px">
          <h1>{tx('Sign in to BottleCRM')}</h1>
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
              <span>{tx('Continue to BottleCRM')}</span>
            {/if}
          </button>
        </form>
      {/if}
    </div>
    <LanguageSelect />
  </div>
</div>

<script>
  import '../../../app.css';
  import '$lib/v2/styles/v2.css';
  import { enhance } from '$app/forms';

  import { Check } from '@lucide/svelte';
  import { tx } from '$lib/i18n/translate.js';
  import PublicBar from '$lib/v2/components/PublicBar.svelte';

  let { data = {} } = $props();

  let isLoading = $state(false);
  let email = $state('');
  let magicLinkSent = $state(false);
  let isSendingLink = $state(false);
  let magicLinkError = $state('');

  function handleGoogleLogin() {
    isLoading = true;
  }

  function handleMagicLink() {
    isSendingLink = true;
    magicLinkError = '';
    return async ({ result }) => {
      isSendingLink = false;
      if (result?.type === 'success') {
        magicLinkSent = true;
      } else if (result?.type === 'failure') {
        magicLinkError = result.data?.error || tx('Something went wrong. Please try again.');
      } else if (!result) {
        magicLinkError = tx('Something went wrong. Please try again.');
      }
    };
  }
</script>

<svelte:head>
  <title>{tx('Sign in · BottleCRM')}</title>
  <meta
    name="description"
    content={tx('Sign in to BottleCRM to manage your contacts, deals, and grow your business.')}
  />
</svelte:head>

<div class="v2-root v2-public">
  <PublicBar />
  <div class="v2-public-body">
    <div class="v2-signin">
      <h1>{tx('Sign in to your workspace')}</h1>

      {#if magicLinkSent}
        <div class="v2-auth-note v2-auth-note-ok">
          <Check />
          <div>
            <b>{tx('Check your email.')}</b>
            <div style="font-weight:400;margin-top:2px">
              {tx('We sent a sign-in link. It expires in 10 minutes.')}
            </div>
          </div>
        </div>
      {:else}
        <form method="POST" use:enhance={handleMagicLink}>
          <label class="v2-signin-label" for="email">{tx('Work email')}</label>
          <input
            id="email"
            type="email"
            name="email"
            class="v2-input"
            placeholder="you@company.com"
            required
            bind:value={email}
            disabled={isSendingLink}
          />
          <div class="v2-google-pill">
            {#if data['google_url']}
              <a
                href={data['google_url']}
                rel="external"
                onclick={handleGoogleLogin}
                style:pointer-events={isLoading ? 'none' : null}
              >
                {#if isLoading}
                  <span class="v2-spin"></span>
                  <span>{tx('Redirecting…')}</span>
                {:else}
                  <span>{tx('Continue with Google')}</span>
                {/if}
              </a>
            {:else}
              <span>{tx('Google is unavailable')}</span>
            {/if}
          </div>
          <button type="submit" class="v2-btn v2-btn-primary" disabled={isSendingLink}>
            {#if isSendingLink}
              <span class="v2-spin"></span>
              <span>{tx('Sending…')}</span>
            {:else}
              <span>{tx('Send link')}</span>
            {/if}
          </button>
        </form>
        {#if magicLinkError}
          <div class="v2-auth-note v2-auth-note-bad" style="margin-top:14px">
            <span>{magicLinkError}</span>
          </div>
        {/if}
      {/if}
    </div>
  </div>
</div>

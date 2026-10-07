<script>
  import '../../../app.css';
  import '$lib/v2/styles/v2.css';
  import { enhance } from '$app/forms';
  import { tx } from '$lib/i18n/translate.js';
  import PublicBar from '$lib/v2/components/PublicBar.svelte';

  let { data = {}, form = null } = $props();

  let submitting = $state(false);
  let username = $state('');
  let password = $state('');

  function handleSubmit() {
    submitting = true;
    return async ({ result, update }) => {
      submitting = false;
      if (result.type === 'redirect') {
        await update();
        return;
      }
      await update({ reset: false });
    };
  }
</script>

<svelte:head>
  <title>{tx('Sign in · ConNexus-CRM')}</title>
  <meta
    name="description"
    content={tx('Sign in to ConNexus-CRM to manage your contacts, deals, and grow your business.')}
  />
</svelte:head>

<div class="v2-root v2-public">
  <PublicBar />
  <div class="v2-public-body">
    <div class="v2-signin">
      <h1>{tx('Sign in to your workspace')}</h1>
      <p class="v2-signin-lead">{tx('Sign in with your username and password.')}</p>
      <form method="POST" use:enhance={handleSubmit}>
        <label class="v2-signin-label" for="username">{tx('Username')}</label>
        <input
          id="username"
          name="username"
          class="v2-input"
          autocomplete="username"
          required
          bind:value={username}
          disabled={submitting}
        />
        <label class="v2-signin-label" for="password">{tx('Password')}</label>
        <input
          id="password"
          name="password"
          type="password"
          class="v2-input"
          autocomplete="current-password"
          required
          bind:value={password}
          disabled={submitting}
        />
        <button type="submit" class="v2-btn v2-btn-primary" disabled={submitting}>
          {#if submitting}
            <span class="v2-spin"></span>
            <span>{tx('Signing you in…')}</span>
          {:else}
            <span>{tx('Sign in')}</span>
          {/if}
        </button>
      </form>
      {#if form?.error || data.error}
        <div class="v2-auth-note v2-auth-note-bad" style="margin-top:14px">
          <span>{form?.error || data.error}</span>
        </div>
      {/if}
    </div>
  </div>
</div>

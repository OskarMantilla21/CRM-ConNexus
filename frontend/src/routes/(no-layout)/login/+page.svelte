<script>
  import { resolve } from '$app/paths';
  import '../../../app.css';
  import '$lib/v2/styles/v2.css';
  import { enhance } from '$app/forms';

  import imgLogo from '$lib/assets/images/logo.png';
  import { tx } from '$lib/i18n/translate.js';
  import LanguageSelect from '$lib/i18n/LanguageSelect.svelte';

  let { data = {}, form = null } = $props();

  let isSending = $state(false);
  let username = $state('');
  let password = $state('');

  function handleSubmit() {
    isSending = true;
    return async ({ result, update }) => {
      isSending = false;
      if (result.type === 'redirect') {
        await update();
        return;
      }
      await update({ reset: false });
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

<div class="v2-root v2-auth">
  <div class="v2-auth-box">
    <a href={resolve('/')} class="v2-auth-brand">
      <img src={imgLogo} alt="" />
      <b>BottleCRM</b>
    </a>

    <div class="v2-auth-card">
      <div class="v2-auth-head">
        <h1>{tx('Sign in')}</h1>
        <p>{tx('Sign in with your username and password.')}</p>
      </div>

      <form method="POST" use:enhance={handleSubmit} style="display:flex;flex-direction:column;gap:4px">
        <div class="v2-field">
          <label for="username">{tx('Username')}</label>
          <input
            id="username"
            name="username"
            type="text"
            class="v2-input"
            autocomplete="username"
            required
            bind:value={username}
            disabled={isSending}
          />
        </div>
        <div class="v2-field">
          <label for="password">{tx('Password')}</label>
          <input
            id="password"
            name="password"
            type="password"
            class="v2-input"
            autocomplete="current-password"
            required
            bind:value={password}
            disabled={isSending}
          />
        </div>
        <button type="submit" class="v2-btn v2-btn-primary v2-btn-block" disabled={isSending}>
          {#if isSending}
            <span class="v2-spin"></span>
            <span>{tx('Signing you in…')}</span>
          {:else}
            <span>{tx('Sign in')}</span>
          {/if}
        </button>
      </form>
      {#if form?.error || data.error}
        <div class="v2-auth-note v2-auth-note-bad" style="margin-top:11px">
          <span>{form?.error || tx('Something went wrong. Please try again.')}</span>
        </div>
      {/if}
    </div>

    <LanguageSelect />
    <div class="v2-auth-foot">
      <a href="https://bottlecrm.io/privacy-policy">{tx('Privacy')}</a>
      <span class="v2-auth-dot"></span>
      <a href="https://bottlecrm.io/terms">{tx('Terms')}</a>
      <span class="v2-auth-dot"></span>
      <a href="https://github.com/django-crm/Django-CRM" target="_blank" rel="noopener">GitHub</a>
    </div>
  </div>
</div>

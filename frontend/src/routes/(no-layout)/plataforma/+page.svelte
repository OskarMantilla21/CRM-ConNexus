<script>
  import { resolve } from '$app/paths';
  import '../../../app.css';
  import '$lib/v2/styles/v2.css';
  import imgLogo from '$lib/assets/images/logo.png';
  import { tx, choiceLabel } from '$lib/i18n/translate.js';
  import LanguageSelect from '$lib/i18n/LanguageSelect.svelte';

  let { data = { users: [], error: '' } } = $props();
  let users = $derived(data?.users ?? []);
</script>

<svelte:head>
  <title>{tx('User directory · BottleCRM')}</title>
</svelte:head>

<div class="v2-root v2-auth">
  <div class="v2-auth-box" style="max-width: 46rem;">
    <a href={resolve('/plataforma')} class="v2-auth-brand">
      <img src={imgLogo} alt="" />
      <b>BottleCRM</b>
    </a>

    <div class="v2-auth-card">
      <div class="v2-auth-head">
        <h1>{tx('User directory')}</h1>
        <p>
          {tx(
            'This role sees who has an account and which company they belong to. It does not open customers, invoices, or payments.'
          )}
        </p>
      </div>

      {#if data.error}
        <p>{data.error}</p>
      {:else if users.length === 0}
        <p>{tx('No users.')}</p>
      {:else}
        <ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: 0.75rem;">
          {#each users as user (user.id)}
            <li style="border-top: 1px solid var(--v2-line, #e6e6e6); padding-top: 0.75rem;">
              <strong>{user.name || user.email}</strong>
              <div>{user.email}</div>
              <div>
                {user.is_active ? tx('Active') : tx('Inactive')}
                {#if user.is_platform_admin}
                  · {tx('platform admin')}
                {/if}
              </div>
              {#if user.organizations.length === 0}
                <div>{tx('No organisation')}</div>
              {:else}
                {#each user.organizations as org}
                  <div>
                    {org.name} · {choiceLabel(org.role)}{org.is_active ? '' : ` · ${tx('inactive')}`}
                  </div>
                {/each}
              {/if}
            </li>
          {/each}
        </ul>
      {/if}

      <p style="margin-top: 1.25rem;">
        <a href={resolve('/logout')}>{tx('Sign out')}</a>
      </p>
      <LanguageSelect />
    </div>
  </div>
</div>

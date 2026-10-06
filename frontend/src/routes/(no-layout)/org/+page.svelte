<script>
  import { resolve } from '$app/paths';
  import '../../../app.css';
  import '$lib/v2/styles/v2.css';
  import { Building2, LogOut, Plus, ChevronRight } from '@lucide/svelte';
  import { enhance } from '$app/forms';
  import { tx, choiceLabel } from '$lib/i18n/translate.js';
  import PublicBar from '$lib/v2/components/PublicBar.svelte';

  let { data = { orgs: [] } } = $props();
  let orgs = $derived(data?.orgs ?? []);

  let loading = $state(false);
  let selectedOrgId = $state(null);
</script>

<svelte:head>
  <title>{tx('Choose organisation · ConNexus-CRM')}</title>
</svelte:head>

<div class="v2-root v2-public">
  <PublicBar />
  <div class="v2-public-body">
  <div class="v2-auth-box">
    <div class="v2-auth-card">
      <div class="v2-auth-head">
        <h1>{tx('Choose an organisation')}</h1>
        <p>
          {orgs.length
            ? tx("Pick the workspace you'd like to open.")
            : tx('Create your first workspace to get started.')}
        </p>
      </div>

      {#if orgs.length > 0}
        {#each orgs as org (org.id)}
          <form
            method="POST"
            action="?/selectOrg"
            use:enhance={() => {
              loading = true;
              selectedOrgId = org.id;
              return async ({ update }) => {
                await update();
                loading = false;
                selectedOrgId = null;
              };
            }}
          >
            <input type="hidden" name="org_id" value={org.id} />
            <input type="hidden" name="org_name" value={org.name} />
            <button type="submit" class="v2-auth-org" disabled={loading}>
              <span class="v2-mark" style="width:30px;height:30px;border-radius:8px;font-size:13px">
                {org.name?.slice(0, 1)?.toUpperCase() || '?'}
              </span>
              <span class="v2-auth-org-body">
                <b>{org.name}</b>
                <span class="v2-sub" style="display:block;text-transform:capitalize">
                  {choiceLabel(org.role || 'member')}
                </span>
              </span>
              {#if loading && selectedOrgId === org.id}
                <span class="v2-spin"></span>
              {:else}
                <ChevronRight />
              {/if}
            </button>
          </form>
        {/each}

        <a href={resolve('/org/new')} class="v2-auth-add">
          <Plus />
          {tx('Create new organisation')}
        </a>
      {:else}
        <div class="v2-state" style="padding:22px 0 8px">
          <div class="v2-state-icon"><Building2 size={22} /></div>
          <h3>{tx('No organisations yet')}</h3>
          <p>{tx('Create your first workspace to start using ConNexus-CRM.')}</p>
          <a href={resolve('/org/new')} class="v2-btn v2-btn-primary">
            <Plus size={15} />
            {tx('Create organisation')}
          </a>
        </div>
      {/if}
    </div>

    <div class="v2-auth-foot">
      <a href={resolve('/logout')} style="display:inline-flex;align-items:center;gap:5px">
        <LogOut size={13} /> {tx('Sign out')}
      </a>
    </div>
  </div>
  </div>
</div>

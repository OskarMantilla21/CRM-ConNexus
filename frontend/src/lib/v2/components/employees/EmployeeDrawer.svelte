<script>
  /**
   * Create or edit without leaving the directory.
   * Create posts the employee invite. Edit posts the role and the areas.
   * The server decides whether either is allowed.
   */
  import { enhance } from '$app/forms';
  import { tx } from '$lib/i18n/translate.js';
  import PersonForm from '$lib/v2/components/PersonForm.svelte';
  import { ROLE_LABEL } from '$lib/v2/enums.js';
  import { PERMISSION_LABEL } from '$lib/access.js';
  import { grantsFor, permissionKeys } from '$lib/v2/employee-directory.js';

  /**
   * @type {{
   *   mode: 'create' | 'edit',
   *   member?: any,
   *   roles?: string[],
   *   canAssignRole?: boolean,
   *   lastAdminId?: string | null,
   *   busy?: boolean,
   *   error?: string,
   *   onsubmit: import('@sveltejs/kit').SubmitFunction,
   *   onclose: () => void
   * }}
   */
  let {
    mode,
    member = null,
    roles = [],
    canAssignRole = false,
    lastAdminId = null,
    busy = false,
    error = '',
    onsubmit,
    onclose
  } = $props();

  let role = $state('EMPLOYEE');
  /** @type {Record<string, boolean>} */
  let grants = $state({});
  let seen = $state('');

  $effect(() => {
    if (mode !== 'edit' || !member) return;
    const stamp = `${member.user_id}:${member.role}`;
    if (stamp === seen) return;
    seen = stamp;
    role = ['ADMIN', 'USER', 'EMPLOYEE'].includes(member.role) ? member.role : 'EMPLOYEE';
    grants = grantsFor(member, role);
  });

  let choices = $derived(
    roles.filter((item) => {
      if (item !== 'ADMIN' && item !== 'USER' && item !== 'EMPLOYEE') return false;
      if (member?.user_id && lastAdminId && member.user_id === lastAdminId && item !== 'ADMIN') {
        return false;
      }
      return true;
    })
  );

  $effect(() => {
    const onKey = (/** @type {KeyboardEvent} */ event) => {
      if (event.key === 'Escape') onclose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function onRoleChange(/** @type {Event} */ event) {
    const next = /** @type {HTMLSelectElement} */ (event.currentTarget).value;
    role = next;
    if (member) grants = grantsFor(member, next);
  }

  let keys = $derived(permissionKeys(role));
</script>

<div class="scrim" onclick={onclose}></div>
<aside class="panel" role="dialog" aria-modal="true" aria-labelledby="employee-drawer-title">
  <div class="top">
    <h2 id="employee-drawer-title">
      {mode === 'create' ? tx('Invite / Create employee') : tx('Edit employee')}
    </h2>
    <button class="v2-btn v2-btn-sm" type="button" onclick={onclose}>{tx('Close')}</button>
  </div>

  {#if mode === 'create'}
    <PersonForm role="EMPLOYEE" {busy} {error} {onsubmit} oncancel={onclose} />
  {:else if member?.role === 'CEO'}
    <p class="v2-sub">{tx('This account is the CEO. The role is not changed from this form.')}</p>
  {:else if member}
    <form method="POST" action="?/setRole" use:enhance={onsubmit} class="v2-card edit">
      <p class="v2-sub" style="margin:0">{member.name}</p>
      <input type="hidden" name="userId" value={member.user_id} />
      {#if canAssignRole}
        <label class="v2-label" for="edit-role">{tx('Role')}</label>
        <select id="edit-role" name="role" class="v2-input" onchange={onRoleChange}>
          {#each choices as item (item)}
            <option value={item} selected={item === role}>{ROLE_LABEL[item] ?? item}</option>
          {/each}
        </select>
      {:else}
        <input type="hidden" name="role" value="EMPLOYEE" />
      {/if}
      {#if keys.length}
        <div class="checks">
          <span class="v2-label">{tx('Permissions')}</span>
          {#each keys as key (key)}
            <label>
              <input type="checkbox" name="permissions" value={key} bind:checked={grants[key]} />
              {tx(PERMISSION_LABEL[key])}
            </label>
          {/each}
        </div>
      {/if}
      {#if error}<p class="err">{error}</p>{/if}
      <div class="actions">
        <button class="v2-btn v2-btn-primary" type="submit" disabled={busy}>{tx('Save')}</button>
        <button class="v2-btn" type="button" disabled={busy} onclick={onclose}>{tx('Cancel')}</button>
      </div>
    </form>
  {/if}
</aside>

<style>
  .scrim {
    position: fixed;
    inset: 0;
    background: color-mix(in srgb, var(--v2-ink) 28%, transparent);
    z-index: 40;
  }
  .panel {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 50;
    width: min(440px, 100%);
    height: 100%;
    overflow: auto;
    background: var(--v2-card);
    padding: 18px 16px 32px;
    box-shadow: -12px 0 40px color-mix(in srgb, var(--v2-ink) 12%, transparent);
  }
  .top {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: center;
    margin-bottom: 14px;
  }
  h2 {
    margin: 0;
    font-size: 18px;
    letter-spacing: -0.02em;
  }
  .edit {
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .checks {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
  }
  .checks label {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    font-size: 13px;
  }
  .actions {
    display: flex;
    gap: 8px;
  }
  .err {
    margin: 0;
    color: var(--v2-rust);
    font-size: 13px;
  }
</style>

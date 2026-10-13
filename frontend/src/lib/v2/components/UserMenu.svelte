<script>
  /**
   * Avatar menu in the top bar. Organisation, account settings and sign-out
   * live here so the sidebar can stay a list of work.
   */
  import { resolve } from '$app/paths';
  import { tx } from '$lib/i18n/translate.js';
  import { ROLE_LABEL } from '$lib/v2/enums.js';

  /** @type {{ user?: { name?: string, email?: string }, role?: string }} */
  let { user = { name: '', email: '' }, role = '' } = $props();

  let open = $state(false);

  let displayName = $derived(
    (user.name || '').trim() || (user.email || '').split('@')[0] || ''
  );
  let initials = $derived.by(() => {
    const parts = displayName.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  });
  let roleLabel = $derived(role && ROLE_LABEL[role] ? ROLE_LABEL[role] : '');

  function close() {
    open = false;
  }

  /** @param {MouseEvent} event */
  function onWindowClick(event) {
    if (!open) return;
    const root = document.getElementById('user-menu');
    const target = event.target;
    if (root && target instanceof Node && root.contains(target)) return;
    close();
  }

  /** @param {KeyboardEvent} event */
  function onWindowKey(event) {
    if (event.key === 'Escape') close();
  }
</script>

<svelte:window onclick={onWindowClick} onkeydown={onWindowKey} />

<div class="menu" id="user-menu">
  <button
    class="v2-icon-btn avatar"
    type="button"
    aria-haspopup="menu"
    aria-expanded={open}
    aria-label={tx('Account settings')}
    onclick={(event) => {
      event.stopPropagation();
      open = !open;
    }}
  >
    {initials}
  </button>
  {#if open}
    <div
      class="panel"
      role="menu"
      onclick={(event) => event.stopPropagation()}
      onkeydown={(event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const items = [...event.currentTarget.querySelectorAll('[role="menuitem"]')];
        const index = items.indexOf(document.activeElement);
        const next = event.key === 'ArrowDown' ? index + 1 : index - 1;
        const item = items[(next + items.length) % items.length];
        if (item instanceof HTMLElement) item.focus();
      }}
    >
      <div class="who">
        <b>{displayName}</b>
        {#if roleLabel}<span class="role">{roleLabel}</span>{/if}
        {#if user.email}<span class="mail">{user.email}</span>{/if}
      </div>
      <a role="menuitem" href={resolve('/org')} onclick={close}>{tx('Switch organisation')}</a>
      <a role="menuitem" href={resolve('/profile')} onclick={close}>{tx('Account settings')}</a>
      <a class="out" role="menuitem" href={resolve('/logout')} data-sveltekit-reload onclick={close}>
        {tx('Sign out of this account')}
      </a>
    </div>
  {/if}
</div>

<style>
  .menu {
    position: relative;
  }
  .avatar {
    border-radius: 8px;
    background: var(--v2-ember);
    color: #fff;
    font-size: 12px;
    font-weight: 650;
  }
  .panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 280px;
    padding: 8px;
    background: var(--v2-card);
    color: var(--v2-ink);
    border: 1px solid var(--v2-line);
    border-radius: var(--v2-radius-lg, 12px);
    box-shadow: var(--v2-shadow-pop, 0 8px 24px rgba(28, 31, 38, 0.08));
    z-index: 5;
  }
  .who {
    padding: 8px 10px 10px;
    border-bottom: 1px solid var(--v2-line-soft);
    margin-bottom: 4px;
  }
  .who b,
  .who span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .who .role,
  .who .mail {
    margin-top: 2px;
    font-size: 12px;
    font-weight: 450;
    color: var(--v2-slate);
  }
  a {
    display: block;
    padding: 8px 10px;
    border-radius: 8px;
    color: inherit;
    text-decoration: none;
    font-size: 14px;
  }
  a:hover {
    background: var(--v2-line-soft);
  }
  .out {
    margin-top: 4px;
    color: var(--v2-danger);
  }
  .out:hover {
    background: color-mix(in srgb, var(--v2-danger) 8%, transparent);
  }
</style>

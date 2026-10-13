<script>
  /**
   * One invite form for an employee or an administrator.
   * Step 1 is the account. Step 2 is the areas. One POST sends both.
   */
  import { enhance } from '$app/forms';
  import { tx } from '$lib/i18n/translate.js';
  import { ALL_PERMISSIONS, EMPLOYEE_PERMISSIONS, PERMISSION_LABEL } from '$lib/access.js';

  /**
   * @type {{
   *   role?: string,
   *   busy?: boolean,
   *   error?: string,
   *   onsubmit: import('@sveltejs/kit').SubmitFunction,
   *   oncancel: () => void
   * }}
   */
  let { role = 'EMPLOYEE', busy = false, error = '', onsubmit, oncancel } = $props();

  let step = $state(1);
  let tried = $state(false);
  let name = $state('');
  let username = $state('');
  let password = $state('');

  /** @param {string} next */
  function freshGrants(next) {
    /** @type {Record<string, boolean>} */
    const grants = {};
    const keys = next === 'EMPLOYEE' ? EMPLOYEE_PERMISSIONS : ALL_PERMISSIONS;
    for (const key of keys) {
      grants[key] =
        next === 'EMPLOYEE'
          ? key === 'daily_work'
          : key === 'sell' || key === 'serve' || key === 'daily_work';
    }
    return grants;
  }

  let grants = $state(freshGrants(role));
  let seenRole = role;

  $effect(() => {
    if (role === seenRole) return;
    seenRole = role;
    grants = freshGrants(role);
    step = 1;
    tried = false;
  });

  let keys = $derived(role === 'EMPLOYEE' ? EMPLOYEE_PERMISSIONS : ALL_PERMISSIONS);
  let step1ok = $derived(name.trim().length > 0 && username.trim().length > 0 && password.length >= 8);
  let unrestricted = $derived(role === 'ADMIN' && ALL_PERMISSIONS.every((key) => grants[key]));

  function revealStep2() {
    tried = true;
    if (step1ok) step = 2;
  }
</script>

<form
  method="POST"
  action="?/invite"
  class="v2-card form"
  use:enhance={(input) => {
    if (step < 2) {
      input.cancel();
      revealStep2();
      return;
    }
    return onsubmit(input);
  }}
>
  <b>{role === 'ADMIN' ? tx('Creating an administrator') : tx('Creating an employee')}</b>
  <p class="v2-sub progress">{tx('Step {n} of {total}', { n: step, total: 2 })}</p>
  <input type="hidden" name="role" value={role} />

  <div hidden={step !== 1}>
    <div class="row">
      <div>
        <label class="v2-label" for="invite-name">{tx('Name')}</label>
        <input
          id="invite-name"
          name="name"
          type="text"
          required
          maxlength="255"
          autocomplete="name"
          class="v2-input"
          bind:value={name}
        />
      </div>
      <div>
        <label class="v2-label" for="invite-username">{tx('Username')}</label>
        <input
          id="invite-username"
          name="username"
          type="text"
          required
          maxlength="254"
          autocomplete="off"
          class="v2-input"
          placeholder="ana"
          bind:value={username}
        />
      </div>
      <div>
        <label class="v2-label" for="invite-password">{tx('Password')}</label>
        <input
          id="invite-password"
          name="password"
          type="password"
          required
          minlength="8"
          maxlength="256"
          autocomplete="new-password"
          class="v2-input"
          bind:value={password}
        />
      </div>
    </div>
    {#if tried && !step1ok}
      <p class="miss">{tx('Enter a username.')}</p>
    {/if}
  </div>

  <p class="v2-sub note">
    {tx(
      'They sign in with this username and the password. No @ is required. An employee does not create the account.'
    )}
    {tx('If this person already has an account, their name and password stay as they are.')}
  </p>

  <div hidden={step !== 2}>
    <div class="checks">
      <span class="v2-label">{tx('Permissions')}</span>
      {#each keys as key (key)}
        <label>
          <input type="checkbox" name="permissions" value={key} bind:checked={grants[key]} />
          {tx(PERMISSION_LABEL[key])}
        </label>
      {/each}
      <span class="v2-sub hint">
        {role === 'EMPLOYEE'
          ? tx(
              'An employee can record the day\'s work, handle tickets and tasks, or work on sales. They cannot open billing, settings, or the team.'
            )
          : tx('The CEO chooses what this administrator can open.')}
      </span>
      {#if unrestricted}
        <span class="v2-sub hint">
          {tx('Marking every area stores this administrator without a restriction.')}
        </span>
      {/if}
    </div>
  </div>

  <div class="actions">
    {#if step < 2}
      <button class="v2-btn v2-btn-primary" type="button" disabled={busy} onclick={revealStep2}>
        {tx('Next')}
      </button>
    {:else}
      <button class="v2-btn v2-btn-primary" disabled={busy}>{tx('Create profile')}</button>
      <button class="v2-btn" type="button" disabled={busy} onclick={() => (step = 1)}>
        {tx('Back')}
      </button>
    {/if}
    <button class="v2-btn" type="button" disabled={busy} onclick={oncancel}>{tx('Cancel')}</button>
  </div>
  {#if error}
    <p class="miss">{error}</p>
  {/if}
</form>

<style>
  .form {
    padding: 14px 15px;
    margin-bottom: 18px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .progress,
  .note,
  .hint,
  .miss {
    margin: 0;
    font-size: 11.5px;
  }
  .miss {
    color: var(--v2-rust);
  }
  .row,
  .checks,
  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: flex-end;
  }
  .row > div {
    flex: 1;
    min-width: 180px;
  }
  .row label,
  .checks {
    align-items: center;
  }
  label {
    display: block;
    margin-bottom: 4px;
  }
  .checks label {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    margin: 0;
    font-size: 13px;
  }
  .hint {
    flex-basis: 100%;
  }
  input.v2-input {
    width: 100%;
  }
</style>

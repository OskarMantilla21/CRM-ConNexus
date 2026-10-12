<script>
  /**
   * Phone-first chat. The thread is plain text from the server action, so it
   * works before the page hydrates. Nothing here calls a model or holds a key.
   */
  import { enhance } from '$app/forms';
  import HelpCenterShell from '$lib/v2/components/HelpCenterShell.svelte';
  import { tx } from '$lib/i18n/translate.js';

  let { data, form } = $props();

  let sending = $state(false);
  // A full postback (no JavaScript) comes back with the message still filled
  // in when sending failed, and empty when it was accepted.
  let draft = $state(form?.message ?? '');

  let messages = $derived(form?.messages ?? []);
  let title = $derived(tx('Chat | {name} help center', { name: data.name }));
  let description = $derived(tx('Ask {name} about a product or a service.', { name: data.name }));

  /** @type {import('@sveltejs/kit').SubmitFunction} */
  function send() {
    sending = true;
    return async ({ result, update }) => {
      sending = false;
      if (result.type === 'success') draft = '';
      await update({ reset: false });
    };
  }
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={data.canonical} />
  <meta name="robots" content="noindex, follow" />
</svelte:head>

<HelpCenterShell name={data.name} slug={data.slug}>
  <h1>{tx('Chat with us')}</h1>
  <p class="intro">
    {tx('Hello! I am with the {name} team. Tell me what you need.', { name: data.name })}
  </p>

  {#if messages.length}
    <ol class="thread">
      {#each messages as item, index (index)}
        <li class={item.role === 'user' ? 'mine' : 'theirs'}>{item.content}</li>
      {/each}
    </ol>
  {/if}

  {#if form?.transferred}
    <p class="handed">{tx('A person from the team will continue this chat.')}</p>
  {/if}
  {#if form?.error}
    <p class="err">{form.error}</p>
  {/if}

  <form method="POST" use:enhance={send} aria-busy={sending}>
    <input type="hidden" name="history" value={JSON.stringify(messages)} />
    <label for="message">{tx('Message')}</label>
    <textarea
      id="message"
      name="message"
      maxlength="500"
      rows="3"
      required
      bind:value={draft}
      placeholder={tx('What do you need?')}
    ></textarea>
    <button type="submit" disabled={sending}>{tx('Send')}</button>
  </form>
</HelpCenterShell>

<style>
  h1 {
    margin: 0 0 8px;
    font-size: 22px;
    font-weight: 600;
    line-height: 1.3;
  }
  .intro {
    margin: 0 0 16px;
    color: var(--v2-slate, #6b7280);
    font-size: 14px;
    line-height: 1.45;
  }
  .thread {
    list-style: none;
    margin: 0 0 16px;
    padding: 0;
    display: grid;
    gap: 8px;
  }
  .thread li {
    max-width: 100%;
    padding: 12px 14px;
    border-radius: 12px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    font-size: 16px;
    line-height: 1.45;
  }
  .theirs {
    justify-self: start;
    border: 1px solid var(--v2-rule, #e5e7eb);
    background: #fff;
  }
  .mine {
    justify-self: end;
    background: var(--v2-ink, #111827);
    color: #fff;
  }
  .handed,
  .err {
    margin: 0 0 12px;
    font-size: 14px;
    line-height: 1.45;
  }
  .handed {
    color: var(--v2-slate, #6b7280);
  }
  .err {
    color: var(--v2-rust, #9f1239);
  }
  form {
    display: grid;
    gap: 8px;
  }
  label {
    font-size: 14px;
    font-weight: 500;
  }
  textarea {
    box-sizing: border-box;
    width: 100%;
    min-height: 88px;
    font: inherit;
    font-size: 16px;
    padding: 10px 11px;
    border: 1px solid var(--v2-rule, #d1d5db);
    border-radius: 8px;
    background: #fff;
    color: inherit;
    resize: vertical;
  }
  button {
    min-height: 44px;
    padding: 0 16px;
    font-size: 14px;
    border: 0;
    border-radius: 8px;
    background: var(--v2-ink, #111827);
    color: #fff;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.6;
    cursor: default;
  }
  @media (min-width: 768px) {
    form {
      grid-template-columns: 1fr auto;
      align-items: end;
    }
    label {
      grid-column: 1 / -1;
    }
  }
</style>

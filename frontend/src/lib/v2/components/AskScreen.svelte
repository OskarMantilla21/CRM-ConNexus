<script>
  /**
   * The assistant canvas. It opens as a right-hand column, the same width
   * Chrome uses for Ask Gemini (about 360px), and keeps the thread when it closes.
   *
   * States, on the root as `data-state`:
   * - idle: welcome, greeting, model, suggestion cards
   * - thinking: the reply is in flight; the row shows dots and a shimmer
   * - responding: a finished answer, with the tool row under it
   * - error: the last reply failed; regenerate sends the same question again
   *
   * The browser never sees a key. The model list is only providers this
   * organization already connected. A file is a text excerpt, capped before
   * it is posted.
   */
  import { page } from '$app/state';
  import { resolve } from '$app/paths';
  import { tx } from '$lib/i18n/translate.js';
  import { visibleScreen, withVisible } from '$lib/screen-brief.js';
  import ChatMarkdown from '$lib/v2/components/assistant/ChatMarkdown.svelte';
  import ProviderMark from '$lib/v2/components/assistant/ProviderMark.svelte';
  import { ArrowUp, Copy, Paperclip, Pencil, RefreshCw, Square, ThumbsDown, ThumbsUp, X } from '@lucide/svelte';

  /**
   * @type {{
   *   open?: boolean,
   *   assistant?: { connected?: boolean, provider?: string, name?: string, model?: string, models?: { id: string, provider: string, name: string }[] } | null,
   *   user?: { name?: string } | null,
   *   onclose?: () => void
   * }}
   */
  let { open = false, assistant = null, user = null, onclose = () => {} } = $props();

  /**
   * @typedef {{
   *   id: number,
   *   role: 'user' | 'assistant',
   *   text: string,
   *   error?: boolean,
   *   pending?: boolean,
   *   feedback?: 'up' | 'down' | null,
   *   fileName?: string,
   *   attachment?: string
   * }} Turn
   */

  const SUGGESTIONS = [
    { title: 'Create one task', prompt: 'How do I create a task for one person?' },
    { title: 'What you can open', prompt: 'What can I open?' },
    { title: 'Where settings live', prompt: 'Where are settings?' },
    { title: 'This screen', prompt: 'Summarize what is on this screen.' }
  ];

  let question = $state('');
  let busy = $state(false);
  /** @type {Turn[]} */
  let thread = $state([]);
  let seq = 0;
  /** @type {Record<number, string>} */
  let copied = $state({});
  /** @type {{ name: string, text: string } | null} */
  let file = $state(null);
  let fileError = $state('');
  let modelId = $state('');
  let seenModels = $state('');
  /** @type {HTMLTextAreaElement | null} */
  let field = $state(null);
  /** @type {HTMLElement | null} */
  let scroller = $state(null);
  /** @type {AbortController | null} */
  let inflight = null;

  let models = $derived(
    (assistant?.models || []).filter(
      (item) => item && typeof item.id === 'string' && typeof item.provider === 'string'
    )
  );
  let selected = $derived(models.find((item) => item.id === modelId) || models[0] || null);
  let assistantName = $derived(selected?.name || assistant?.name || 'Gemini');
  let providerId = $derived(selected?.provider || assistant?.provider || 'gemini');

  let phase = $derived.by(() => {
    if (busy) return 'thinking';
    const last = thread[thread.length - 1];
    if (last?.role === 'assistant' && last.error) return 'error';
    if (thread.some((turn) => turn.role === 'assistant' && !turn.pending && !turn.error)) return 'responding';
    return 'idle';
  });

  let greeting = $derived.by(() => {
    const hour = new Date().getHours();
    const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const first = String(user?.name || '')
      .trim()
      .split(/\s+/)[0];
    if (!first) return tx(part);
    return tx('{greeting}, {name}', { greeting: tx(part), name: first });
  });

  $effect(() => {
    const stamp = `${models.map((item) => item.id).join('|')}|${assistant?.model || ''}`;
    if (stamp === seenModels) return;
    seenModels = stamp;
    const preferred = assistant?.model || '';
    modelId = models.some((item) => item.id === preferred) ? preferred : models[0]?.id || '';
  });

  $effect(() => {
    if (!open) return;
    field?.focus();
  });

  $effect(() => {
    question;
    if (!field) return;
    field.style.height = 'auto';
    field.style.height = `${Math.min(field.scrollHeight, 160)}px`;
  });

  $effect(() => {
    thread.length;
    busy;
    if (scroller) scroller.scrollTop = scroller.scrollHeight;
  });

  const offline = () => tx('An assistant has to be connected in Settings before this can answer.');

  /**
   * @param {string} text
   * @param {{ reuseUser?: boolean, attachment?: string, fileName?: string }} [opts]
   */
  async function ask(text, opts = {}) {
    const attachment = (opts.attachment || '').slice(0, 2000);
    const trimmed = text.trim().slice(0, 400);
    if ((!trimmed && !attachment) || busy) return;
    const asked = trimmed || tx('What is in this document?');
    if (!opts.reuseUser) {
      thread = [
        ...thread,
        {
          id: ++seq,
          role: 'user',
          text: asked,
          fileName: opts.fileName || '',
          attachment
        }
      ];
      question = '';
      file = null;
      fileError = '';
    }
    const pendingId = ++seq;
    thread = [...thread, { id: pendingId, role: 'assistant', text: '', pending: true }];
    if (!assistant?.connected) {
      settle(pendingId, offline(), true);
      return;
    }
    inflight?.abort();
    const controller = new AbortController();
    inflight = controller;
    busy = true;
    try {
      /** @type {Record<string, unknown>} */
      const payload = {
        question: asked,
        path: page.url.pathname,
        screen: withVisible(page.data, visibleScreen()),
        model: modelId
      };
      if (attachment) {
        payload.attachment = attachment;
        if (opts.fileName) payload.filename = opts.fileName;
      }
      const response = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        settle(
          pendingId,
          response.status === 429
            ? tx('Too many requests. Try again shortly.')
            : body.error === 'not_connected'
              ? offline()
              : tx('The assistant did not answer. Try again shortly.'),
          true
        );
        return;
      }
      const answer = typeof body.answer === 'string' ? body.answer.trim() : '';
      settle(pendingId, answer || tx('The assistant did not answer. Try again shortly.'), !answer);
    } catch (/** @type {any} */ err) {
      if (err?.name === 'AbortError') {
        thread = thread.filter((turn) => turn.id !== pendingId);
        return;
      }
      settle(pendingId, tx('The assistant did not answer. Try again shortly.'), true);
    } finally {
      if (inflight === controller) inflight = null;
      busy = false;
    }
  }

  /**
   * @param {number} id
   * @param {string} text
   * @param {boolean} error
   */
  function settle(id, text, error) {
    thread = thread.map((turn) =>
      turn.id === id ? { ...turn, text, error, pending: false, feedback: null } : turn
    );
  }

  function stop() {
    inflight?.abort();
  }

  /** @param {SubmitEvent | KeyboardEvent} event */
  function submit(event) {
    event.preventDefault();
    if (busy) return;
    ask(question, { attachment: file?.text || '', fileName: file?.name || '' });
  }

  /** @param {KeyboardEvent} event */
  function onkeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) submit(event);
  }

  /** @param {KeyboardEvent} event */
  function onDialogKey(event) {
    // The column sits beside the CRM, the way Chrome's Ask Gemini panel does.
    // Escape closes it. Tab is free to leave, so the page stays usable.
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    onclose();
  }

  /** @param {number} id */
  function priorUser(id) {
    const index = thread.findIndex((turn) => turn.id === id);
    return (
      thread
        .slice(0, index)
        .reverse()
        .find((turn) => turn.role === 'user') || null
    );
  }

  /** @param {number} id */
  function regenerate(id) {
    const prior = priorUser(id);
    if (!prior || busy) return;
    const index = thread.findIndex((turn) => turn.id === prior.id);
    thread = thread.slice(0, index + 1);
    ask(prior.text, { reuseUser: true, attachment: prior.attachment || '', fileName: prior.fileName || '' });
  }

  /** @param {number} id */
  function editUser(id) {
    if (busy) return;
    const turn = thread.find((item) => item.id === id && item.role === 'user');
    if (!turn) return;
    const index = thread.findIndex((item) => item.id === id);
    question = turn.text;
    file = turn.attachment ? { name: turn.fileName || 'document.txt', text: turn.attachment } : null;
    thread = thread.slice(0, index);
    field?.focus();
  }

  /**
   * @param {number} id
   * @param {'up' | 'down'} mark
   */
  function feedback(id, mark) {
    thread = thread.map((turn) =>
      turn.id === id ? { ...turn, feedback: turn.feedback === mark ? null : mark } : turn
    );
  }

  /** @param {number} id @param {string} text */
  async function copyText(id, text) {
    try {
      await navigator.clipboard.writeText(text);
      copied = { ...copied, [id]: tx('Copied') };
    } catch {
      copied = { ...copied, [id]: tx('Copy') };
    }
  }

  /** @param {Event} event */
  async function onFile(event) {
    const input = /** @type {HTMLInputElement} */ (event.currentTarget);
    const picked = input.files?.[0];
    input.value = '';
    if (!picked) return;
    const named = /\.(txt|md|csv|json|log)$/i.test(picked.name) || picked.type.startsWith('text/');
    if (!named || picked.size > 100 * 1024) {
      file = null;
      fileError = tx('Attach a text file up to 100 KB.');
      return;
    }
    const text = await picked.text();
    file = { name: picked.name.slice(0, 80), text: text.slice(0, 2000) };
    fileError = '';
  }

  /** @param {HTMLTextAreaElement} node */
  function grow(node) {
    const fit = () => {
      node.style.height = 'auto';
      node.style.height = `${Math.min(node.scrollHeight, 160)}px`;
    };
    node.addEventListener('input', fit);
    fit();
    return {
      destroy() {
        node.removeEventListener('input', fit);
      }
    };
  }
</script>

{#if open}
  <div
    class="canvas"
    data-state={phase}
    role="dialog"
    aria-modal="false"
    aria-labelledby="assistant-title"
    tabindex="-1"
    onkeydown={onDialogKey}
  >
    <header class="top">
      <p class="brand" id="assistant-title">
        <span class="brand-spark"><ProviderMark provider={providerId} /></span>
        {assistantName}
      </p>
      {#if models.length && phase !== 'idle'}
        <label class="model">
          <span class="sr">{tx('Model')}</span>
          <select bind:value={modelId}>
            {#each models as item (`${item.provider}-${item.id}`)}
              <option value={item.id}>{item.name} · {item.id}</option>
            {/each}
          </select>
        </label>
      {/if}
      <button class="icon" type="button" onclick={onclose} aria-label={tx('Close assistant')}>
        <X size={18} />
      </button>
    </header>

    <div class="thread" id="assistant-status" bind:this={scroller} aria-live="polite">
      {#if thread.length === 0}
        <div class="welcome">
          <h2>{greeting}</h2>
          <p class="lead">{tx('Answers from what this screen shows.')}</p>
          {#if models.length}
            <label class="model welcome-model">
              <span class="sr">{tx('Model')}</span>
              <select bind:value={modelId}>
                {#each models as item (`welcome-${item.provider}-${item.id}`)}
                  <option value={item.id}>{item.name} · {item.id}</option>
                {/each}
              </select>
            </label>
          {:else}
            <p class="offline">
              {offline()}
              <a href="{resolve('/settings')}?area=ia">{tx('AI integrations')}</a>
            </p>
          {/if}
          <div class="cards">
            {#each SUGGESTIONS as card (card.prompt)}
              <button type="button" class="card" onclick={() => ask(tx(card.prompt))} disabled={busy}>
                <b>{tx(card.title)}</b>
                <span>{tx(card.prompt)}</span>
              </button>
            {/each}
          </div>
        </div>
      {:else}
        <div class="talk">
          {#each thread as turn (turn.id)}
            <article class="row" class:user={turn.role === 'user'} class:assistant={turn.role === 'assistant'} class:fail={turn.error}>
              {#if turn.role === 'assistant'}
                <span class="mark"><ProviderMark provider={providerId} /></span>
              {/if}
              <div class="body">
                {#if turn.pending}
                  <div class="thinking" aria-label={tx('The assistant is answering.')}>
                    <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
                    <span class="shimmer"></span>
                  </div>
                {:else if turn.role === 'assistant' && !turn.error}
                  <ChatMarkdown text={turn.text} />
                {:else}
                  <div class="said">
                    <p class="plain">{turn.text}</p>
                    {#if turn.fileName}<p class="file-note">{turn.fileName}</p>{/if}
                  </div>
                {/if}
                {#if !turn.pending}
                  <div class="tools">
                    {#if turn.role === 'user'}
                      <button type="button" aria-label={tx('Edit message')} onclick={() => editUser(turn.id)}>
                        <Pencil size={15} />
                      </button>
                    {:else}
                      <button type="button" aria-label={copied[turn.id] || tx('Copy')} onclick={() => copyText(turn.id, turn.text)}>
                        <Copy size={15} />
                      </button>
                      <button type="button" aria-label={tx('Regenerate')} onclick={() => regenerate(turn.id)} disabled={busy}>
                        <RefreshCw size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label={tx('Good answer')}
                        aria-pressed={turn.feedback === 'up'}
                        onclick={() => feedback(turn.id, 'up')}
                      >
                        <ThumbsUp size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label={tx('Poor answer')}
                        aria-pressed={turn.feedback === 'down'}
                        onclick={() => feedback(turn.id, 'down')}
                      >
                        <ThumbsDown size={15} />
                      </button>
                      {#if priorUser(turn.id)}
                        <button
                          type="button"
                          aria-label={tx('Edit message')}
                          onclick={() => {
                            const prior = priorUser(turn.id);
                            if (prior) editUser(prior.id);
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                      {/if}
                    {/if}
                  </div>
                {/if}
              </div>
            </article>
          {/each}
        </div>
      {/if}
    </div>

    <form class="dock" onsubmit={submit}>
      {#if file}
        <div class="chip">
          <span>{file.name}</span>
          <button type="button" aria-label={tx('Remove attachment')} onclick={() => (file = null)}>
            <X size={14} />
          </button>
        </div>
      {/if}
      {#if fileError}<p class="file-error">{fileError}</p>{/if}
      <div class="pill">
        <label class="clip">
          <span class="sr">{tx('Attach a text file')}</span>
          <input
            type="file"
            accept=".txt,.md,.csv,.json,.log,text/plain"
            onchange={onFile}
            disabled={busy}
          />
          <Paperclip size={18} />
        </label>
        <label class="sr" for="assistant-question">{tx('Ask about this screen')}</label>
        <textarea
          id="assistant-question"
          rows="1"
          maxlength="400"
          autocomplete="off"
          bind:this={field}
          bind:value={question}
          use:grow
          placeholder={tx('Ask about this screen')}
          aria-describedby="assistant-status"
          disabled={busy}
          {onkeydown}
        ></textarea>
        {#if busy}
          <button class="send" type="button" onclick={stop} aria-label={tx('Stop generating')}>
            <Square size={14} />
          </button>
        {:else}
          <button class="send" type="submit" disabled={!question.trim() && !file} aria-label={tx('Send')}>
            <ArrowUp size={18} />
          </button>
        {/if}
      </div>
    </form>
  </div>
{/if}

<style>
  .canvas {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(360px, calc(100vw - 48px));
    z-index: 70;
    display: flex;
    flex-direction: column;
    background: var(--v2-paper);
    color: var(--v2-ink);
    border-left: 1px solid var(--v2-line);
    box-shadow: -12px 0 32px rgba(28, 31, 38, 0.08);
  }
  .canvas:focus {
    outline: none;
  }
  .top {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 56px;
    padding: 0 8px 0 16px;
    min-width: 0;
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    min-width: 0;
    flex: none;
    font-size: 15px;
    font-weight: 650;
    letter-spacing: -0.02em;
  }
  .brand-spark {
    font-size: 20px;
    display: grid;
  }
  .top .icon {
    margin-left: auto;
  }
  .icon,
  .clip,
  .tools button,
  .chip button {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--v2-slate);
    cursor: pointer;
  }
  .icon:hover,
  .clip:hover,
  .tools button:hover,
  .chip button:hover {
    background: var(--v2-hover);
    color: var(--v2-ink);
  }
  .thread {
    flex: 1;
    min-height: 0;
    overflow: auto;
  }
  .canvas[data-state='idle'] .thread {
    display: flex;
    align-items: flex-start;
  }
  .welcome,
  .talk,
  .dock {
    width: auto;
    margin: 0 16px;
  }
  .welcome {
    padding: 24px 0 8px;
  }
  h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 560;
    letter-spacing: -0.03em;
    line-height: 1.15;
  }
  .lead,
  .offline {
    margin: 10px 0 0;
    color: var(--v2-slate);
    font-size: 15px;
  }
  .offline a {
    color: var(--v2-ember);
  }
  .model {
    display: flex;
    min-width: 0;
    max-width: 100%;
  }
  .top .model {
    flex: 1 1 auto;
  }
  .welcome-model {
    margin-top: 16px;
  }
  .model select {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--v2-slate);
    font: inherit;
    font-size: 13px;
    padding: 6px 4px;
    cursor: pointer;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .model select:hover,
  .model select:focus {
    color: var(--v2-ink);
  }
  .cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 20px;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 4px;
    text-align: left;
    padding: 16px;
    border: 1px solid var(--v2-line);
    border-radius: 18px;
    background: var(--v2-card);
    color: inherit;
    font: inherit;
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease;
  }
  .card b {
    font-size: 14px;
    font-weight: 650;
  }
  .card span {
    color: var(--v2-slate);
    font-size: 13px;
    line-height: 1.4;
  }
  .card:hover {
    transform: translateY(-2px);
    box-shadow: var(--v2-shadow-pop);
  }
  .talk {
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding: 12px 0 20px;
  }
  .row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .row.user {
    justify-content: flex-end;
  }
  .mark {
    flex: none;
    margin-top: 2px;
    font-size: 22px;
    display: grid;
  }
  .body {
    min-width: 0;
  }
  .row.user .body {
    max-width: min(82%, 560px);
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .row.user .said {
    padding: 12px 16px;
    border-radius: 22px;
    background: var(--v2-line-soft);
  }
  .row.assistant .body {
    flex: 1;
  }
  .plain {
    margin: 0;
    white-space: pre-wrap;
    line-height: 1.55;
  }
  .file-note {
    margin: 6px 0 0;
    color: var(--v2-slate);
    font-size: 12px;
  }
  .row.fail .plain {
    color: var(--v2-rust);
  }
  .thinking {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 6px;
  }
  .dots {
    display: inline-flex;
    gap: 5px;
  }
  .dots i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--v2-slate);
    animation: pulse 1.1s ease-in-out infinite;
  }
  .dots i:nth-child(2) {
    animation-delay: 0.15s;
  }
  .dots i:nth-child(3) {
    animation-delay: 0.3s;
  }
  .shimmer {
    display: block;
    width: min(240px, 70%);
    height: 10px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--v2-line), var(--v2-card), var(--v2-line));
    background-size: 200% 100%;
    animation: slide 1.2s linear infinite;
  }
  .tools {
    display: flex;
    gap: 2px;
    margin-top: 6px;
  }
  .row.user .tools {
    justify-content: flex-end;
  }
  .tools button[aria-pressed='true'] {
    color: var(--v2-ember);
    background: var(--v2-ember-soft);
  }
  .tools button:disabled {
    opacity: 0.4;
    cursor: default;
  }
  .dock {
    flex: none;
    padding: 8px 0 22px;
  }
  .chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    margin: 0 0 8px 12px;
    padding: 4px 4px 4px 12px;
    border-radius: 999px;
    background: var(--v2-card);
    border: 1px solid var(--v2-line);
    font-size: 13px;
  }
  .chip span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .file-error {
    margin: 0 0 8px 12px;
    color: var(--v2-rust);
    font-size: 13px;
  }
  .pill {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    padding: 6px 6px 6px 8px;
    border-radius: 28px;
    background: var(--v2-card);
    border: 1px solid var(--v2-line);
    box-shadow: 0 8px 28px rgba(28, 31, 38, 0.06);
    transition: box-shadow 0.16s ease, border-color 0.16s ease;
  }
  .pill:focus-within {
    border-color: transparent;
    box-shadow:
      0 10px 32px rgba(28, 31, 38, 0.08),
      0 0 0 3px color-mix(in srgb, var(--v2-ember) 32%, transparent);
  }
  .clip {
    position: relative;
    flex: none;
  }
  .clip input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
  textarea {
    flex: 1;
    width: 100%;
    max-height: 160px;
    resize: none;
    border: 0;
    margin: 0;
    padding: 10px 4px;
    background: transparent;
    color: inherit;
    font: inherit;
    font-size: 16px;
    line-height: 1.45;
  }
  textarea:focus {
    outline: none;
  }
  .send {
    flex: none;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    background: var(--v2-ink);
    color: var(--v2-paper);
    cursor: pointer;
  }
  .send:disabled {
    opacity: 0.35;
    cursor: default;
  }
  .canvas[data-state='thinking'] .send {
    background: var(--v2-ember);
  }
  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  @keyframes pulse {
    0%,
    80%,
    100% {
      opacity: 0.25;
      transform: translateY(0);
    }
    40% {
      opacity: 1;
      transform: translateY(-2px);
    }
  }
  @keyframes slide {
    from {
      background-position: 100% 0;
    }
    to {
      background-position: -100% 0;
    }
  }
  @media (max-width: 640px) {
    .cards {
      grid-template-columns: 1fr;
    }
    .dock {
      padding-bottom: 16px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .card,
    .pill,
    .dots i,
    .shimmer {
      transition: none;
      animation: none;
    }
    .card:hover {
      transform: none;
    }
  }
</style>

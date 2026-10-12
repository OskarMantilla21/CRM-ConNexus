<script>
  /**
   * The column on the right of every signed-in screen. It asks about the
   * CRM and about the data that screen already loaded. The key never comes
   * to the browser.
   */
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';
  import { tx } from '$lib/i18n/translate.js';
  import { visibleScreen, withVisible } from '$lib/screen-brief.js';

  /** @type {{ assistant?: { connected?: boolean, provider?: string, name?: string } | null }} */
  let { assistant = null } = $props();

  let question = $state('');
  let answer = $state('');
  let errorText = $state('');
  let busy = $state(false);

  afterNavigate(() => {
    answer = '';
    errorText = '';
    question = '';
  });

  let placeholder = $derived(
    assistant?.connected && assistant.provider === 'grok' ? tx('Ask Grok') : tx('Ask Gemini')
  );

  /** @param {SubmitEvent | KeyboardEvent} event */
  async function submit(event) {
    event.preventDefault();
    const text = question.trim();
    if (!text || busy) return;
    if (!assistant?.connected) {
      errorText = tx('An assistant has to be connected on Today before this can answer.');
      answer = '';
      return;
    }
    busy = true;
    errorText = '';
    answer = '';
    try {
      const response = await fetch('/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          question: text.slice(0, 400),
          path: page.url.pathname,
          screen: withVisible(page.data, visibleScreen())
        })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        errorText =
          response.status === 429
            ? tx('Too many requests. Try again shortly.')
            : body.error === 'not_connected'
              ? tx('An assistant has to be connected on Today before this can answer.')
              : tx('The assistant did not answer. Try again shortly.');
        return;
      }
      answer = typeof body.answer === 'string' ? body.answer.trim() : '';
      if (!answer) errorText = tx('The assistant did not answer. Try again shortly.');
    } catch {
      errorText = tx('The assistant did not answer. Try again shortly.');
    } finally {
      busy = false;
    }
  }

  /** @param {KeyboardEvent} event */
  function onkeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) submit(event);
  }
</script>

<aside class="ask">
  <p class="title">
    <svg class="spark" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.2c.4 3.6 1.6 6.2 4.2 8.3-2.6 1.6-3.8 4.2-4.2 8.3-.4-4.1-1.6-6.7-4.2-8.3C10.4 8.4 11.6 5.8 12 2.2Z"
      />
      <path d="M18.2 3.2c.2 1.5.7 2.6 1.8 3.4-1.1.7-1.6 1.8-1.8 3.4-.2-1.6-.7-2.7-1.8-3.4 1.1-.8 1.6-1.9 1.8-3.4Z" />
    </svg>
    {placeholder}
  </p>
  <div class="thread">
    {#if answer}
      <p class="reply" id="ask-screen-status">{answer}</p>
    {:else if errorText}
      <p class="err" id="ask-screen-status">{errorText}</p>
    {:else}
      <p class="hint" id="ask-screen-status">{tx('Answers from what this screen shows.')}</p>
    {/if}
  </div>
  <form class="ask-form" onsubmit={submit}>
    <label class="sr" for="ask-screen">{placeholder}</label>
    <textarea
      id="ask-screen"
      name="question"
      rows="4"
      maxlength="400"
      autocomplete="off"
      bind:value={question}
      placeholder={placeholder}
      aria-describedby="ask-screen-status"
      {onkeydown}
    ></textarea>
    <button type="submit" disabled={busy || !question.trim()}>{tx('Send')}</button>
  </form>
</aside>

<style>
  .ask {
    width: var(--v2-ask, 320px);
    flex: none;
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    background: var(--v2-card, #fff);
    border-left: 1px solid var(--v2-line, #e5e7eb);
  }
  .title {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    padding: 16px 14px;
    border-bottom: 1px solid var(--v2-line, #e5e7eb);
    font-size: 15px;
    font-weight: 650;
  }
  .spark {
    width: 18px;
    height: 18px;
    flex: none;
    fill: var(--v2-ink, #111827);
  }
  .thread {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 14px;
  }
  .reply,
  .err,
  .hint {
    margin: 0;
    font-size: 14px;
    line-height: 1.45;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .err {
    color: var(--v2-rust, #9f1239);
  }
  .hint {
    color: var(--v2-slate, #6b7280);
  }
  form {
    flex: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border-top: 1px solid var(--v2-line, #e5e7eb);
  }
  textarea {
    width: 100%;
    min-height: 96px;
    resize: vertical;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 1px solid var(--v2-line, #d1d5db);
    border-radius: 12px;
    background: var(--v2-paper, #fff);
    color: inherit;
    font: inherit;
    font-size: 16px;
  }
  textarea:focus {
    outline: none;
  }
  button {
    height: 40px;
    border: 0;
    border-radius: 999px;
    background: var(--v2-ink, #111827);
    color: #fff;
    font: inherit;
    font-size: 14px;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.45;
    cursor: default;
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
</style>

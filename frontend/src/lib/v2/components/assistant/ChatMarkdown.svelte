<script>
  /**
   * Assistant text as elements. Headings, lists, code and tables stay data
   * until this component draws them, so a model cannot inject markup.
   */
  import { tx } from '$lib/i18n/translate.js';
  import { highlightCode } from '$lib/v2/highlight.js';
  import { inline, markdownBlocks } from '$lib/v2/markdown.js';
  import { Copy } from '@lucide/svelte';

  /** @type {{ text: string }} */
  let { text } = $props();

  let blocks = $derived(markdownBlocks(text));
  let copiedAt = $state(-1);

  /** @param {number} index @param {string} value */
  async function copyCode(index, value) {
    try {
      await navigator.clipboard.writeText(value);
      copiedAt = index;
    } catch {
      copiedAt = -1;
    }
  }
</script>

{#snippet rich(parts)}
  {#each parts as part, index (`${part.kind}-${index}`)}
    {#if part.kind === 'strong'}<strong>{part.text}</strong>{:else if part.kind === 'code'}<code class="inline">{part.text}</code>{:else}{part.text}{/if}
  {/each}
{/snippet}

<div class="md">
  {#each blocks as block, index (`${block.type}-${index}`)}
    {#if block.type === 'heading'}
      {#if block.level === 1}
        <h2>{@render rich(block.parts)}</h2>
      {:else if block.level === 2}
        <h3>{@render rich(block.parts)}</h3>
      {:else}
        <h4>{@render rich(block.parts)}</h4>
      {/if}
    {:else if block.type === 'paragraph'}
      <p>{@render rich(block.parts)}</p>
    {:else if block.type === 'list'}
      {#if block.ordered}
        <ol>
          {#each block.items as item, itemIndex (`ol-${itemIndex}`)}
            <li>{@render rich(item)}</li>
          {/each}
        </ol>
      {:else}
        <ul>
          {#each block.items as item, itemIndex (`ul-${itemIndex}`)}
            <li>{@render rich(item)}</li>
          {/each}
        </ul>
      {/if}
    {:else if block.type === 'code'}
      <div class="code">
        <div class="codebar">
          <span>{block.lang}</span>
          <button type="button" onclick={() => copyCode(index, block.text)}>
            <Copy size={13} />
            {copiedAt === index ? tx('Copied') : tx('Copy code')}
          </button>
        </div>
        <pre><code
            >{#each highlightCode(block.text, block.lang) as token, tokenIndex (`tok-${tokenIndex}`)}<span
                class={token.kind}>{token.text}</span
              >{/each}</code
          ></pre>
      </div>
    {:else if block.type === 'table'}
      <div class="table-wrap">
        <table>
          {#if block.rows[0]}
            <thead>
              <tr>
                {#each block.rows[0] as cell, cellIndex (`head-${cellIndex}`)}
                  <th>{@render rich(inline(cell))}</th>
                {/each}
              </tr>
            </thead>
          {/if}
          <tbody>
            {#each block.rows.slice(1) as row, rowIndex (`row-${rowIndex}`)}
              <tr class:band={rowIndex % 2 === 1}>
                {#each row as cell, cellIndex (`${rowIndex}-${cellIndex}`)}
                  <td>{@render rich(inline(cell))}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/each}
</div>

<style>
  .md {
    font-size: 15.5px;
    line-height: 1.6;
    color: var(--v2-ink);
  }
  h2,
  h3,
  h4,
  p {
    margin: 0 0 10px;
  }
  h2 {
    font-size: 22px;
    letter-spacing: -0.03em;
    line-height: 1.25;
  }
  h3 {
    font-size: 18px;
    letter-spacing: -0.02em;
  }
  h4 {
    font-size: 16px;
  }
  .md > :last-child {
    margin-bottom: 0;
  }
  ul,
  ol {
    margin: 0 0 12px;
    padding-left: 1.25em;
  }
  li + li {
    margin-top: 4px;
  }
  .inline {
    font-family: var(--v2-mono);
    font-size: 0.86em;
    padding: 1px 5px;
    border-radius: 6px;
    background: var(--v2-line-soft);
  }
  .code {
    margin: 0 0 12px;
    border-radius: 14px;
    overflow: hidden;
    background: color-mix(in srgb, var(--v2-ink) 4%, var(--v2-card));
    border: 1px solid var(--v2-line);
  }
  .codebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-height: 34px;
    padding: 0 8px 0 12px;
    color: var(--v2-slate);
    font-family: var(--v2-mono);
    font-size: 12px;
  }
  .codebar button {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 26px;
    padding: 0 8px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--v2-slate);
    font: inherit;
    font-family: var(--v2-sans);
    font-size: 12px;
    cursor: pointer;
  }
  .codebar button:hover {
    background: var(--v2-hover);
    color: var(--v2-ink);
  }
  pre {
    margin: 0;
    padding: 4px 14px 14px;
    overflow: auto;
  }
  pre code {
    font-family: var(--v2-mono);
    font-size: 13px;
    line-height: 1.55;
    white-space: pre;
  }
  .keyword {
    color: var(--v2-ember);
  }
  .string {
    color: var(--v2-moss);
  }
  .comment {
    color: var(--v2-slate);
    font-style: italic;
  }
  .number {
    color: var(--v2-clay);
  }
  .table-wrap {
    margin: 0 0 12px;
    overflow: auto;
    border: 1px solid var(--v2-line);
    border-radius: 14px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }
  th,
  td {
    padding: 9px 12px;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid var(--v2-line);
  }
  tr:last-child th,
  tr:last-child td {
    border-bottom: 0;
  }
  th {
    background: var(--v2-line-soft);
    font-weight: 650;
  }
  .band td {
    background: color-mix(in srgb, var(--v2-line-soft) 70%, transparent);
  }
</style>

<script>
  import { enhance } from '$app/forms';
  import { resolve } from '$app/paths';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import '$lib/i18n/pages/serve.js';
  import { tx } from '$lib/i18n/translate.js';

  /** @type {{ data: any, form: any }} */
  let { data, form } = $props();
  let submitting = $state(false);
</script>

<PageHeader title={tx('New support ticket')} center width="720px">
  {#snippet sub()}{tx('Tell us what happened and what you expected instead')}{/snippet}
</PageHeader>

<div class="v2-scroll">
  <div
    class="v2-pad"
    style="padding-top:18px;padding-bottom:32px;max-width:720px;margin-inline:auto"
  >
    {#if form?.error}
      <p class="v2-card error">{form.error}</p>
    {/if}

    <form
      method="POST"
      enctype="multipart/form-data"
      class="v2-card form"
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          await update();
          submitting = false;
        };
      }}
    >
      <div class="v2-field">
        <label for="subject">{tx('Subject')}</label>
        <input
          id="subject"
          class="v2-input"
          name="subject"
          maxlength="200"
          required
          value={form?.subject ?? ''}
          placeholder={tx('A short summary of the problem')}
        />
      </div>

      <div class="v2-field">
        <label for="category">{tx('Category')}</label>
        <select id="category" class="v2-input" name="category" required>
          <option value="">{tx('Choose a category')}</option>
          {#each data.categories as category (category.value)}
            <option value={category.value} selected={form?.category === category.value}
              >{tx(category.label)}</option
            >
          {/each}
        </select>
      </div>

      <div class="v2-field">
        <label for="body">{tx('What do you need help with?')}</label>
        <textarea
          id="body"
          class="v2-input"
          name="body"
          rows="8"
          maxlength="10000"
          required
          placeholder={tx('Include what you tried, what you expected, and the exact error you saw.')}
          >{form?.body ?? ''}</textarea
        >
      </div>

      <div class="v2-field">
        <label for="attachment">{tx('Attachment (optional)')}</label>
        <input id="attachment" class="v2-input" type="file" name="attachment" />
        <span class="v2-sub" style="font-size:11.5px"
          >{tx('Up to 25 MB. Remove secrets and personal data before uploading.')}</span
        >
      </div>

      <div class="actions">
        <button class="v2-btn v2-btn-primary" type="submit" disabled={submitting}
          >{submitting ? tx('Opening…') : tx('Open ticket')}</button
        >
        <a class="v2-btn" href={resolve('/help')}>{tx('Cancel')}</a>
      </div>
    </form>
  </div>
</div>

<style>
  .form {
    padding: 18px;
    display: grid;
    gap: 18px;
  }
  .error {
    padding: 10px 13px;
    margin-bottom: 16px;
    color: var(--v2-rust);
    font-size: 13px;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
</style>

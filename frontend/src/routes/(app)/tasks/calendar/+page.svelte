<script>
  import { resolve } from '$app/paths';
  /**
   * The task calendar. One month at a time, dated tasks sitting on the day they
   * are due. The view that answers "what is coming" the way a list can't.
   *
   * Two layouts from one set of cells: a seven-column grid on a wide screen, an
   * agenda on a phone. Drag a task onto another day and it lands there; the
   * due date is the only field the drop writes.
   */
  import { deserialize } from '$app/forms';
  import PageHeader from '$lib/v2/components/PageHeader.svelte';
  import SectionTabs from '$lib/v2/components/SectionTabs.svelte';
  import { count } from '$lib/v2/format.js';
  import { TASK_PRIORITY_TONE } from '$lib/v2/enums.js';
  import { ChevronLeft, ChevronRight, CalendarDays } from '@lucide/svelte';
  import '$lib/i18n/pages/serve.js';
  import { tx } from '$lib/i18n/translate.js';

  /** @type {{ data: any }} */
  let { data } = $props();

  const TONE_VAR = {
    ink: 'var(--v2-ink)',
    slate: 'var(--v2-slate)',
    clay: 'var(--v2-clay)',
    rust: 'var(--v2-rust)',
    moss: 'var(--v2-moss)'
  };

  /** Overdue trumps priority. A late card is rust whatever it was set to. */
  const dot = (/** @type {any} */ t) =>
    t.overdue ? TONE_VAR.rust : (TONE_VAR[TASK_PRIORITY_TONE[t.priority]] ?? TONE_VAR.slate);

  const CAP = 4; // chips per cell before it collapses to "+N more"

  /** @param {any[][]} source */
  function copyWeeks(source) {
    return source.map((week) =>
      week.map((cell) => ({
        ...cell,
        tasks: cell.tasks.map((/** @type {any} */ task) => ({ ...task, landed: false }))
      }))
    );
  }

  let weeks = $state(copyWeeks(data.weeks));
  /** @type {{ task: any, from: string, startX: number, startY: number, offsetX: number, offsetY: number, width: number, x: number, y: number, active: boolean, over: string } | null} */
  let drag = $state(null);
  let moveError = $state('');
  let swallowClick = false;

  $effect(() => {
    weeks = copyWeeks(data.weeks);
  });

  let datedCount = $derived(
    weeks
      .flat()
      .filter((cell) => cell.inMonth)
      .reduce((sum, cell) => sum + cell.tasks.length, 0)
  );

  let agenda = $derived.by(() => {
    const days = weeks.flat().filter((cell) => cell.inMonth);
    const shown = drag?.active ? days : days.filter((cell) => cell.tasks.length > 0);
    return shown.map((cell) => ({
      date: cell.date,
      day: cell.day,
      isToday: cell.isToday,
      tasks: cell.tasks
    }));
  });

  /**
   * @param {any} task
   * @param {string} from
   * @param {string} to
   * @param {boolean} landed
   */
  function place(task, from, to, landed) {
    let found = /** @type {any} */ (null);
    weeks = weeks.map((week) =>
      week.map((cell) => {
        if (cell.date !== from) return cell;
        const hit = cell.tasks.find((/** @type {any} */ item) => item.id === task.id);
        if (hit) found = hit;
        return {
          ...cell,
          tasks: cell.tasks.filter((/** @type {any} */ item) => item.id !== task.id)
        };
      })
    );
    if (!found) return;
    const next = {
      ...found,
      overdue: !found.is_done && to < data.today,
      landed
    };
    weeks = weeks.map((week) =>
      week.map((cell) =>
        cell.date === to ? { ...cell, tasks: [...cell.tasks, next] } : cell
      )
    );
    if (landed) {
      setTimeout(() => {
        weeks = weeks.map((week) =>
          week.map((cell) => ({
            ...cell,
            tasks: cell.tasks.map((/** @type {any} */ item) =>
              item.id === next.id ? { ...item, landed: false } : item
            )
          }))
        );
      }, 320);
    }
  }

  /**
   * @param {any} task
   * @param {string} from
   * @param {string} to
   */
  async function commitMove(task, from, to) {
    moveError = '';
    place(task, from, to, true);
    const body = new FormData();
    body.set('id', task.id);
    body.set('due_date', to);
    try {
      const response = await fetch('?/move', { method: 'POST', body });
      const result = deserialize(await response.text());
      if (result.type !== 'success') throw new Error('move');
    } catch {
      place(task, to, from, false);
      moveError = tx('Could not move this task.');
    }
  }

  /** @param {PointerEvent} event */
  function pointerMove(event) {
    if (!drag) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.active && dx * dx + dy * dy < 36) return;
    event.preventDefault();
    const under = document.elementFromPoint(event.clientX, event.clientY);
    const over = under?.closest?.('[data-date]')?.getAttribute('data-date') ?? '';
    drag = {
      ...drag,
      active: true,
      x: event.clientX - drag.offsetX,
      y: event.clientY - drag.offsetY,
      over
    };
  }

  function pointerUp() {
    window.removeEventListener('pointermove', pointerMove);
    window.removeEventListener('pointerup', pointerUp);
    const current = drag;
    drag = null;
    if (!current?.active) return;
    swallowClick = true;
    if (current.over && current.over !== current.from) {
      commitMove(current.task, current.from, current.over);
    }
  }

  /**
   * @param {PointerEvent} event
   * @param {any} task
   * @param {string} date
   */
  function pointerDown(event, task, date) {
    if (event.button !== 0) return;
    const rect = /** @type {HTMLElement} */ (event.currentTarget).getBoundingClientRect();
    drag = {
      task,
      from: date,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      x: rect.left,
      y: rect.top,
      active: false,
      over: ''
    };
    window.addEventListener('pointermove', pointerMove, { passive: false });
    window.addEventListener('pointerup', pointerUp);
  }

  /** @param {MouseEvent} event */
  function chipClick(event) {
    if (!swallowClick) return;
    event.preventDefault();
    swallowClick = false;
  }
</script>

<PageHeader title={tx('Tasks')}>
  {#snippet sub()}
    {data.monthLabel} · <span class="v2-num">{count(datedCount)}</span> {tx('scheduled')}
  {/snippet}
  {#snippet actions()}
    <div class="v2-cal-nav">
      <a
        class="v2-btn v2-btn-icon"
        href={resolve(`/tasks/calendar?month=${data.prevMonth}`)}
        aria-label={tx('Previous month')}
        data-sveltekit-noscroll
      >
        <ChevronLeft size={15} />
      </a>
      {#if !data.isThisMonth}
        <a
          class="v2-btn v2-btn-sm"
          href={resolve(`/tasks/calendar?month=${data.thisMonth}`)}
          data-sveltekit-noscroll>{tx('Today')}</a
        >
      {/if}
      <a
        class="v2-btn v2-btn-icon"
        href={resolve(`/tasks/calendar?month=${data.nextMonth}`)}
        aria-label={tx('Next month')}
        data-sveltekit-noscroll
      >
        <ChevronRight size={15} />
      </a>
    </div>
  {/snippet}
</PageHeader>

<SectionTabs set="tasks" />

<div class="v2-scroll">
  <!-- Wide screens: the month grid. -->
  <div class="v2-cal-grid-wrap">
    <div class="v2-cal-head">
      {#each data.weekdays as label (label)}
        <span class="v2-label">{label}</span>
      {/each}
    </div>
    <div class="v2-cal-grid">
      {#each weeks as week, w (w)}
        {#each week as cell (cell.date)}
          <div
            class="v2-cal-cell"
            class:v2-cal-out={!cell.inMonth}
            class:v2-cal-weekend={cell.isWeekend}
            class:v2-cal-today={cell.isToday}
            class:v2-cal-over={drag?.active && drag.over === cell.date}
            data-date={cell.date}
          >
            <div class="v2-cal-daynum">
              {#if cell.isToday}
                <span class="v2-cal-today-badge">{cell.day}</span>
              {:else}
                {cell.day}
              {/if}
            </div>
            <div class="v2-cal-cell-body">
              {#each cell.tasks.slice(0, CAP) as t (t.id)}
                <a
                  class="v2-cal-chip"
                  class:v2-cal-chip-done={t.is_done}
                  class:v2-cal-chip-lift={drag?.active && drag.task.id === t.id}
                  class:v2-cal-land={t.landed}
                  href={resolve(`/tasks/${t.id}`)}
                  title={t.title}
                  draggable="false"
                  onpointerdown={(event) => pointerDown(event, t, cell.date)}
                  onclick={chipClick}
                >
                  <i class="v2-cal-dot" style="background:{dot(t)}"></i>
                  <span class="v2-cal-chip-text">{t.title}</span>
                </a>
              {/each}
              {#if cell.tasks.length > CAP}
                <span class="v2-cal-more">{tx('+{n} more', { n: cell.tasks.length - CAP })}</span>
              {/if}
            </div>
          </div>
        {/each}
      {/each}
    </div>
  </div>

  <!-- Narrow screens: an agenda of the days that actually have work. -->
  <div class="v2-cal-agenda">
    {#if agenda.length === 0}
      <div class="v2-state" style="padding:34px 0">
        <div class="v2-state-icon"><CalendarDays size={22} /></div>
        <h3>{tx('Nothing scheduled')}</h3>
        <p>{tx('No tasks fall due in {month}.', { month: data.monthLabel })}</p>
      </div>
    {:else}
      {#each agenda as day (day.date)}
        <div
          class="v2-cal-agenda-day"
          class:v2-cal-over={drag?.active && drag.over === day.date}
          data-date={day.date}
        >
          <div class="v2-cal-agenda-date" class:v2-cal-agenda-today={day.isToday}>
            <span class="v2-num">{day.day}</span>
            {#if day.isToday}<span class="v2-cal-agenda-todaytag">{tx('Today')}</span>{/if}
          </div>
          <div class="v2-cal-agenda-list">
            {#each day.tasks as t (t.id)}
              <a
                class="v2-cal-chip"
                class:v2-cal-chip-done={t.is_done}
                class:v2-cal-chip-lift={drag?.active && drag.task.id === t.id}
                class:v2-cal-land={t.landed}
                href={resolve(`/tasks/${t.id}`)}
                draggable="false"
                onpointerdown={(event) => pointerDown(event, t, day.date)}
                onclick={chipClick}
              >
                <i class="v2-cal-dot" style="background:{dot(t)}"></i>
                <span class="v2-cal-chip-text">{t.title}</span>
                {#if t.overdue}<span class="v2-cal-overdue">{tx('overdue')}</span>{/if}
              </a>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
  </div>

  {#if drag && drag.active}
    <div
      class="v2-cal-ghost"
      style="left:{drag.x}px;top:{drag.y}px;width:{drag.width}px"
    >
      <i class="v2-cal-dot" style="background:{dot(drag.task)}"></i>
      <span class="v2-cal-chip-text">{drag.task.title}</span>
    </div>
  {/if}

  <p class="v2-sub v2-pad v2-cal-foot">
    {tx('Drag a task onto a day to move it there.')}
    {#if moveError}<span class="v2-cal-move-error">{moveError}</span>{/if}
    {tx("Tasks without a due date don't appear here,")}
    <a href={resolve('/tasks')} style="color:inherit">{tx('see the task list')}</a>.
    {#if data.truncated}
      {tx('This month has more scheduled tasks than fit on the calendar; the list shows them all.')}
    {/if}
  </p>
</div>

<style>
  .v2-cal-nav {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .v2-btn-icon {
    padding-left: 8px;
    padding-right: 8px;
  }

  /* Weekday header, aligned to the grid below it. */
  .v2-cal-head {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    padding: 14px 16px 6px;
    flex: none;
  }
  .v2-cal-head .v2-label {
    padding-left: 2px;
  }

  .v2-cal-grid-wrap {
    padding: 0 16px 8px;
  }
  .v2-cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: minmax(96px, auto);
    gap: 6px;
  }
  .v2-cal-cell {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px;
    background: var(--v2-card);
    border: 1px solid var(--v2-line);
    border-radius: 8px;
    min-width: 0;
    transition:
      background 160ms ease,
      border-color 160ms ease,
      transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .v2-cal-over {
    border-color: var(--v2-ember);
    background: color-mix(in srgb, var(--v2-ember) 12%, var(--v2-card));
    transform: scale(1.02);
  }
  /* Days spilling in from the neighbouring months recede, so the current month
     reads as one block. */
  .v2-cal-out {
    background: none;
    border-color: transparent;
  }
  .v2-cal-out .v2-cal-daynum {
    color: var(--v2-slate);
    opacity: 0.55;
  }
  .v2-cal-weekend:not(.v2-cal-out) {
    background: color-mix(in srgb, var(--v2-slate) 5%, var(--v2-card));
  }
  .v2-cal-today {
    border-color: var(--v2-ember);
  }
  .v2-cal-daynum {
    font-size: 12px;
    font-weight: 600;
    color: var(--v2-ink);
    line-height: 1;
    display: flex;
    justify-content: flex-end;
  }
  /* Today is the one Ember mark on the page. It is "you are here", the nearest
     thing a calendar has to something that needs you. */
  .v2-cal-today-badge {
    display: inline-grid;
    place-items: center;
    min-width: 19px;
    height: 19px;
    padding: 0 5px;
    border-radius: 9px;
    background: var(--v2-ember);
    color: #fff;
    font-size: 11.5px;
  }
  .v2-cal-cell-body {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
  }

  .v2-cal-chip {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 2px 5px;
    border-radius: 5px;
    background: var(--v2-paper);
    color: var(--v2-ink);
    font-size: 11.5px;
    line-height: 1.35;
    text-decoration: none;
    min-width: 0;
    cursor: grab;
    touch-action: none;
  }
  .v2-cal-chip-lift {
    opacity: 0.28;
  }
  .v2-cal-land {
    animation: v2-cal-land 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .v2-cal-ghost {
    position: fixed;
    z-index: 80;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 3px 6px;
    border-radius: 6px;
    background: var(--v2-card);
    color: var(--v2-ink);
    font-size: 11.5px;
    line-height: 1.35;
    pointer-events: none;
    box-shadow: var(--v2-shadow-pop, 0 10px 28px rgb(15 23 42 / 18%));
    transform: scale(1.05);
  }
  @keyframes v2-cal-land {
    from {
      transform: translateY(-8px) scale(0.92);
      opacity: 0.35;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }
  .v2-cal-chip:hover {
    background: color-mix(in srgb, var(--v2-slate) 12%, var(--v2-card));
  }
  .v2-cal-chip-done {
    opacity: 0.55;
  }
  .v2-cal-chip-done .v2-cal-chip-text {
    text-decoration: line-through;
  }
  .v2-cal-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex: none;
  }
  .v2-cal-chip-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }
  .v2-cal-more {
    font-size: 11px;
    color: var(--v2-slate);
    padding: 1px 5px;
  }
  .v2-cal-overdue {
    margin-left: auto;
    font-size: 10.5px;
    color: var(--v2-rust);
    font-weight: 600;
    flex: none;
  }
  .v2-cal-foot {
    font-size: 12px;
    padding-top: 14px;
    padding-bottom: 24px;
  }
  .v2-cal-move-error {
    display: block;
    color: var(--v2-rust);
    margin: 4px 0;
  }

  /* Agenda is the phone view; hidden on wide screens. */
  .v2-cal-agenda {
    display: none;
  }
  .v2-cal-agenda-day {
    display: flex;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--v2-line-soft);
  }
  .v2-cal-agenda-date {
    flex: none;
    width: 40px;
    text-align: center;
    color: var(--v2-ink);
  }
  .v2-cal-agenda-date .v2-num {
    font-size: 18px;
    font-weight: 650;
  }
  .v2-cal-agenda-today .v2-num {
    color: var(--v2-ember);
  }
  .v2-cal-agenda-todaytag {
    display: block;
    font-size: 10px;
    color: var(--v2-ember);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .v2-cal-agenda-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
    flex: 1;
  }
  .v2-cal-agenda .v2-cal-chip {
    font-size: 13px;
    padding: 6px 9px;
    border: 1px solid var(--v2-line);
    background: var(--v2-card);
  }

  @media (prefers-reduced-motion: reduce) {
    .v2-cal-cell,
    .v2-cal-over,
    .v2-cal-land,
    .v2-cal-ghost {
      transition: none;
      animation: none;
      transform: none;
    }
  }

  @media (max-width: 767px) {
    .v2-cal-grid-wrap,
    .v2-cal-head {
      display: none;
    }
    .v2-cal-agenda {
      display: block;
    }
  }
</style>

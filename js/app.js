(function () {
  const DB_KEY = "connexus-records-v1";
  const SESSION_KEY = "connexus-session-v1";
  const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const WEEKDAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
  const ICONS = {
    home: '<path d="M4 11 12 4l8 7"/><path d="M7 10.5V20h10v-9.5"/>',
    accounts: '<path d="M4 20V9l8-5 8 5v11"/><path d="M10 20v-6h4v6"/>',
    contacts: '<circle cx="12" cy="8" r="3"/><path d="M5 19c1.4-3 3.8-4.5 7-4.5S17.6 16 19 19"/>',
    opportunities: '<path d="M4 16l5-5 3 3 8-8"/><path d="M14 6h6v6"/>',
    leads: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
    contracts: '<path d="M7 3h8l4 4v14H7z"/><path d="M15 3v5h5"/><path d="M9 13h6M9 17h4"/>',
    quotes: '<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    campaigns: '<path d="M4 10v4l10 4V6L4 10z"/><path d="M14 9.5c2 .8 2 4.2 0 5"/>',
    prospects: '<circle cx="9" cy="9" r="3"/><circle cx="16" cy="10" r="2"/><path d="M4 18c.8-2.4 2.6-3.5 5-3.5s4.2 1.1 5 3.5"/><path d="M14 18c.4-1.4 1.4-2.2 3-2.2 1.2 0 2.2.5 2.8 1.6"/>',
    lists: '<path d="M8 7h12M8 12h12M8 17h12"/><path d="M4 7h.01M4 12h.01M4 17h.01"/>',
    cases: '<path d="M4 8h16v11H4z"/><path d="M9 8V6h6v2"/>',
    bugs: '<circle cx="12" cy="13" r="6"/><path d="M12 7V4M8 8 6 6M16 8l2-2M6 13H3M21 13h-3M8 18l-2 2M16 18l2 2"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>',
    calls: '<path d="M8 4h3l1 4-2 1a12 12 0 0 0 5 5l1-2 4 1v3c0 1-1 2-2 2A14 14 0 0 1 6 6c0-1 1-2 2-2z"/>',
    meetings: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M8 14h4"/>',
    emails: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="m4 7 8 6 8-6"/>',
    tasks: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m4 6 1.2 1.2L7.5 5M4 12l1.2 1.2L7.5 11M4 18l1.2 1.2L7.5 17"/>',
    notes: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h5"/>',
    documents: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/>',
    projects: '<path d="M4 7h16v4H4zM4 13h10v4H4z"/>',
    invoices: '<path d="M6 3h12v18l-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M9 8h6M9 12h6"/>',
    products: '<path d="M3 8 12 4l9 4-9 4-9-4z"/><path d="M3 8v8l9 4 9-4V8"/>',
    reports: '<path d="M5 19V10M12 19V5M19 19v-7"/>',
    employees: '<circle cx="12" cy="8" r="3"/><path d="M6 19v-1c0-2.5 2.5-4 6-4s6 1.5 6 4v1"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1 2H5l1-2z"/><path d="M10 18a2 2 0 0 0 4 0"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  };

  const state = {
    user: null,
    group: "sales",
    query: "",
    statusFilter: "all",
    favoritesOnly: false,
    routeModule: null,
    readAlerts: [],
    createOpen: false,
    alertsOpen: false,
    userOpen: false,
    searchOpen: false,
    navOpen: false,
    pendingDelete: null,
    cursor: null,
    selectedDay: "",
  };

  let db = {};
  let toastTimer = 0;

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[char]));
  }

  function icon(name) {
    return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ICONS.notes}</svg>`;
  }

  function star(on) {
    return `<svg class="star ${on ? "is-on" : ""}" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3.6 2.4 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.2 7 19l1.1-5.6L3.9 9.5l5.7-.7L12 3.6z"/></svg>`;
  }

  function logo() {
    return `<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#1e6b4e"/><path d="M20.8 11.2a6.2 6.2 0 1 0 0 9.6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="21.4" cy="16" r="1.7" fill="#e7c27a"/></svg>`;
  }

  function isoFromDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  function todayISO() {
    return isoFromDate(new Date());
  }

  function formatDate(iso) {
    if (!iso) return "—";
    const [year, month, day] = String(iso).split("-").map(Number);
    if (!year || !month || !day) return String(iso);
    return new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric" }).format(new Date(year, month - 1, day));
  }

  function money(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "—";
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(number);
  }

  function safeUrl(value) {
    try {
      const url = new URL(value);
      if (url.protocol === "http:" || url.protocol === "https:") return url.href;
    } catch (error) {
      return "";
    }
    return "";
  }

  function safeMail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? value : "";
  }

  function optionValue(option) {
    return typeof option === "string" ? option : option.value;
  }

  function optionTone(option) {
    return typeof option === "string" ? "info" : (option.tone || "info");
  }

  function toneFor(field, value) {
    if (!field || !field.options) return "info";
    const found = field.options.find((option) => optionValue(option) === value);
    return found ? optionTone(found) : "info";
  }

  function pill(field, value) {
    if (!value) return "—";
    return `<span class="pill ${toneFor(field, value)}">${esc(value)}</span>`;
  }

  function getRecords(moduleId) {
    return db[moduleId] || [];
  }

  function findRecord(moduleId, id) {
    return getRecords(moduleId).find((row) => row.id === id) || null;
  }

  function nameOf(moduleId, id) {
    const record = findRecord(moduleId, id);
    return record ? record.name : "";
  }

  function displayText(moduleId, field, record) {
    const value = record[field.key];
    if (value === "" || value == null) return "—";
    if (field.type === "lookup") return nameOf(field.module, value) || "—";
    if (field.type === "currency") return money(value);
    if (field.type === "date") return formatDate(value);
    if (field.type === "percent") return `${value}%`;
    return String(value);
  }

  function detailValue(field, record, asPill) {
    const value = record[field.key];
    if (value === "" || value == null) return "—";
    if (field.type === "lookup") {
      const name = nameOf(field.module, value);
      if (!name) return "—";
      return `<a href="#/${field.module}/${encodeURIComponent(value)}">${esc(name)}</a>`;
    }
    if (field.type === "email") {
      const mail = safeMail(String(value));
      return mail ? `<a href="mailto:${esc(mail)}">${esc(mail)}</a>` : esc(value);
    }
    if (field.type === "tel") {
      const tel = String(value).replace(/[^\d+]/g, "");
      return tel ? `<a href="tel:${esc(tel)}">${esc(value)}</a>` : esc(value);
    }
    if (field.type === "url") {
      const url = safeUrl(String(value));
      return url ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(url)}</a>` : esc(value);
    }
    if (field.type === "textarea") return `<p class="prose">${esc(value)}</p>`;
    if (field.type === "currency") return esc(money(value));
    if (field.type === "date") return esc(formatDate(value));
    if (field.type === "percent") {
      const width = Math.max(0, Math.min(100, Number(value) || 0));
      return `<span class="progress"><span style="width:${width}%"></span></span>${esc(value)}%`;
    }
    if (field.type === "select" && asPill) return pill(field, value);
    return esc(value);
  }

  function haystack(moduleId, record) {
    const module = CONNEXUS.modules[moduleId];
    return module.fields.map((field) => displayText(moduleId, field, record)).join(" ").toLowerCase();
  }

  function route() {
    const raw = location.hash || "#/home";
    const [pathPart, queryPart] = raw.split("?");
    const parts = pathPart.replace(/^#\/?/, "").split("/").filter(Boolean);
    const params = new URLSearchParams(queryPart || "");
    const moduleId = parts[0] || "home";
    if (parts[1] === "new") return { moduleId, mode: "create", id: null, params };
    if (parts[2] === "edit") return { moduleId, mode: "edit", id: decodeURIComponent(parts[1]), params };
    if (parts[1]) return { moduleId, mode: "detail", id: decodeURIComponent(parts[1]), params };
    const module = CONNEXUS.modules[moduleId];
    if (moduleId === "home") return { moduleId, mode: "dashboard", id: null, params };
    if (module && module.view === "calendar") return { moduleId, mode: "calendar", id: null, params };
    return { moduleId, mode: "list", id: null, params };
  }

  function go(hash) {
    if (location.hash === hash) render();
    else location.hash = hash;
  }

  function persistDb() {
    try { sessionStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (error) { /* la sesión del navegador puede estar bloqueada */ }
  }

  function persistSession() {
    if (!state.user) return;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        user: state.user,
        group: state.group,
        readAlerts: state.readAlerts,
      }));
    } catch (error) { /* igual que arriba */ }
  }

  function loadDb() {
    try {
      const raw = sessionStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (error) { /* usa la semilla */ }
    return structuredClone(CONNEXUS.seed);
  }

  function restoreSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      state.user = saved.user || null;
      state.group = saved.group || "sales";
      state.readAlerts = saved.readAlerts || [];
    } catch (error) { /* entra de nuevo */ }
  }

  function closeMenus() {
    state.createOpen = false;
    state.alertsOpen = false;
    state.userOpen = false;
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2800);
  }

  function initials(name) {
    return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }

  function groupLabel(groupId) {
    const group = CONNEXUS.groups.find((item) => item.id === groupId);
    return group ? group.label : "";
  }

  function titleFor(current) {
    if (current.moduleId === "home") return "Inicio";
    const module = CONNEXUS.modules[current.moduleId];
    if (!module) return "ConNexus";
    if (current.mode === "create") return `Crear ${module.singular}`;
    if (current.mode === "edit" || current.mode === "detail") {
      const record = findRecord(current.moduleId, current.id);
      return record ? record.name : module.label;
    }
    return module.label;
  }

  function countLabel(total, module) {
    return total === 1 ? `1 ${module.singular}` : `${total} ${module.label.toLowerCase()}`;
  }

  function filteredRecords(moduleId) {
    const module = CONNEXUS.modules[moduleId];
    let rows = getRecords(moduleId).slice();
    if (state.favoritesOnly) rows = rows.filter((row) => row.favorite);
    if (state.statusFilter !== "all" && module.statusKey) {
      rows = rows.filter((row) => row[module.statusKey] === state.statusFilter);
    }
    const query = state.query.trim().toLowerCase();
    if (query) rows = rows.filter((row) => haystack(moduleId, row).includes(query));
    return rows;
  }

  function listFields(module) {
    return module.fields.filter((field) => field.list);
  }

  function rowHtml(moduleId, record) {
    const module = CONNEXUS.modules[moduleId];
    const href = `#/${moduleId}/${encodeURIComponent(record.id)}`;
    const cells = listFields(module).map((field) => {
      const compact = field.compact ? " hide-sm" : "";
      let inner = esc(displayText(moduleId, field, record));
      if (field.key === "name") inner = `<a href="${href}">${inner}</a>`;
      if (field.key === module.statusKey && record[field.key]) inner = pill(field, record[field.key]);
      if (field.type === "percent" && record[field.key] !== "" && record[field.key] != null) {
        const width = Math.max(0, Math.min(100, Number(record[field.key]) || 0));
        inner = `<span class="progress"><span style="width:${width}%"></span></span>${esc(record[field.key])}%`;
      }
      return `<td class="${compact.trim()}">${inner}</td>`;
    }).join("");
    const label = record.favorite ? "Quitar de favoritos" : "Marcar como favorito";
    return `<tr data-href="${href}">
      <td><button class="star-btn" type="button" data-action="toggle-fav" data-module="${moduleId}" data-id="${esc(record.id)}" aria-label="${label}">${star(record.favorite)}</button></td>
      ${cells}
    </tr>`;
  }

  function emptyRow(colspan) {
    return `<tr class="empty"><td colspan="${colspan}">No hay registros con este criterio.</td></tr>`;
  }

  function paintRows() {
    const current = route();
    const body = document.getElementById("list-body");
    const module = CONNEXUS.modules[current.moduleId];
    if (!body || !module) return;
    const rows = filteredRecords(current.moduleId);
    const colspan = listFields(module).length + 1;
    body.innerHTML = rows.length ? rows.map((row) => rowHtml(current.moduleId, row)).join("") : emptyRow(colspan);
    const count = document.getElementById("list-count");
    if (count) count.textContent = countLabel(rows.length, module);
  }

  function statusChips(module) {
    if (!module.statusKey) return "";
    const field = module.fields.find((item) => item.key === module.statusKey);
    if (!field) return "";
    const chips = [{ value: "all", label: "Todos" }].concat(field.options.map((option) => ({ value: optionValue(option), label: optionValue(option) })));
    return chips.map((chip) => {
      const active = state.statusFilter === chip.value ? " is-active" : "";
      return `<button class="chip${active}" type="button" data-action="set-filter" data-filter="${esc(chip.value)}">${esc(chip.label)}</button>`;
    }).join("");
  }

  function renderList(current) {
    const module = CONNEXUS.modules[current.moduleId];
    const rows = filteredRecords(current.moduleId);
    const fields = listFields(module);
    const heads = fields.map((field) => `<th class="${field.compact ? "hide-sm" : ""}">${esc(field.label)}</th>`).join("");
    const colspan = fields.length + 1;
    const fav = state.favoritesOnly ? " is-active" : "";
    return `<section class="page">
      <header class="page-head">
        <div>
          <p class="crumb">${esc(groupLabel(module.group))}</p>
          <h1>${esc(module.label)}</h1>
          <p class="muted" id="list-count">${esc(countLabel(rows.length, module))}</p>
        </div>
        <div class="page-actions">
          <a class="btn btn-primary" href="#/${current.moduleId}/new">Nuevo</a>
        </div>
      </header>
      <div class="list-tools">
        <input id="list-search" class="list-search" type="search" placeholder="Buscar en ${esc(module.label.toLowerCase())}" value="${esc(state.query)}" autocomplete="off">
        <div class="filters">
          <button class="chip${fav}" type="button" data-action="toggle-favorites">Favoritos</button>
          ${statusChips(module)}
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th aria-label="Favorito"></th>${heads}</tr></thead>
          <tbody id="list-body">${rows.length ? rows.map((row) => rowHtml(current.moduleId, row)).join("") : emptyRow(colspan)}</tbody>
        </table>
      </div>
    </section>`;
  }

  function relatedRows(spec, record) {
    const value = spec.match ? record[spec.match] : record.id;
    if (!value) return [];
    return getRecords(spec.module).filter((row) => row[spec.foreignKey] === value);
  }

  function subpanelHtml(spec, record) {
    const rows = relatedRows(spec, record);
    const module = CONNEXUS.modules[spec.module];
    const createValue = spec.match ? record[spec.match] : record.id;
    const createHref = createValue
      ? `#/${spec.module}/new?${encodeURIComponent(spec.foreignKey)}=${encodeURIComponent(createValue)}`
      : `#/${spec.module}/new`;
    const statusField = module.fields.find((field) => field.key === module.statusKey);
    const body = rows.length
      ? rows.map((row) => {
        const status = statusField ? row[statusField.key] : "";
        const badge = status ? pill(statusField, status) : "";
        return `<a class="case-row" href="#/${spec.module}/${encodeURIComponent(row.id)}"><span class="case-main"><strong>${esc(row.name)}</strong></span>${badge}</a>`;
      }).join("")
      : `<p class="muted">No hay registros relacionados.</p>`;
    return `<section class="panel">
      <header class="panel-head"><h2>${esc(spec.label)}</h2><a class="btn btn-ghost" href="${createHref}">Nuevo</a></header>
      ${body}
    </section>`;
  }

  function metricsHtml(record) {
    if (!record.metrics || !record.metrics.length) return "";
    const max = Math.max.apply(null, record.metrics.map((item) => Number(item.value) || 0).concat([1]));
    const rows = record.metrics.map((item) => {
      const width = Math.round(((Number(item.value) || 0) / max) * 100);
      const printed = record.metricKind === "money" ? money(item.value) : String(item.value);
      return `<div class="bar-row"><span>${esc(item.label)}</span><span class="bar"><span style="width:${width}%"></span></span><strong>${esc(printed)}</strong></div>`;
    }).join("");
    return `<section class="panel"><h2>Resultado</h2>${rows}</section>`;
  }

  function renderDetail(current) {
    const module = CONNEXUS.modules[current.moduleId];
    const record = findRecord(current.moduleId, current.id);
    if (!record) {
      return `<section class="page"><h1>Ese registro ya no está</h1><p><a href="#/${current.moduleId}">Volver a ${esc(module.label.toLowerCase())}</a></p></section>`;
    }
    const statusField = module.fields.find((field) => field.key === module.statusKey);
    const status = statusField ? pill(statusField, record[statusField.key]) : "";
    const facts = module.fields.filter((field) => field.key !== "name").map((field) => {
      const wide = field.type === "textarea" ? " wide" : "";
      return `<div class="${wide.trim()}"><dt>${esc(field.label)}</dt><dd>${detailValue(field, record, field.key === module.statusKey)}</dd></div>`;
    }).join("");
    const panels = (module.subpanels || []).map((spec) => subpanelHtml(spec, record)).join("");
    const favLabel = record.favorite ? "Quitar de favoritos" : "Marcar como favorito";
    return `<section class="page">
      <header class="page-head">
        <div>
          <p class="crumb">${esc(groupLabel(module.group))} · <a href="#/${current.moduleId}">${esc(module.label)}</a></p>
          <h1>${esc(record.name)}</h1>
          <div class="meta-row">${status}<span class="muted">${esc(record.assigned || "")}</span>
            <button class="star-btn" type="button" data-action="toggle-fav" data-module="${current.moduleId}" data-id="${esc(record.id)}" aria-label="${favLabel}">${star(record.favorite)}</button>
          </div>
        </div>
        <div class="page-actions">
          <a class="btn btn-primary" href="#/${current.moduleId}/${encodeURIComponent(record.id)}/edit">Editar</a>
          <button class="btn btn-ghost" type="button" data-action="duplicate-record" data-module="${current.moduleId}" data-id="${esc(record.id)}">Duplicar</button>
          <button class="btn btn-ghost" type="button" data-action="ask-delete" data-module="${current.moduleId}" data-id="${esc(record.id)}">Eliminar</button>
        </div>
      </header>
      <section class="panel"><dl class="facts">${facts}</dl></section>
      ${metricsHtml(record)}
      <div class="stack">${panels}</div>
    </section>`;
  }

  function inputControl(field, value) {
    const required = field.required ? "required" : "";
    if (field.type === "select" || field.type === "lookup") {
      const options = field.type === "lookup"
        ? getRecords(field.module).map((row) => ({ value: row.id, label: row.name }))
        : field.options.map((option) => ({ value: optionValue(option), label: optionValue(option) }));
      const choices = options.map((option) => `<option value="${esc(option.value)}"${option.value === value ? " selected" : ""}>${esc(option.label)}</option>`).join("");
      return `<select name="${esc(field.key)}" ${required}><option value="">Selecciona</option>${choices}</select>`;
    }
    if (field.type === "textarea") return `<textarea name="${esc(field.key)}" rows="4" ${required}>${esc(value)}</textarea>`;
    const types = { currency: "number", number: "number", percent: "number", date: "date", email: "email", tel: "tel", url: "url" };
    const type = types[field.type] || "text";
    const min = field.min != null ? `min="${field.min}"` : "";
    const max = field.max != null ? `max="${field.max}"` : "";
    const step = type === "number" ? 'step="1"' : "";
    return `<input name="${esc(field.key)}" type="${type}" ${min} ${max} ${step} value="${esc(value)}" ${required}>`;
  }

  function renderForm(current) {
    const module = CONNEXUS.modules[current.moduleId];
    const existing = current.mode === "edit" ? findRecord(current.moduleId, current.id) : null;
    if (current.mode === "edit" && !existing) {
      return `<section class="page"><h1>Ese registro ya no está</h1><p><a href="#/${current.moduleId}">Volver</a></p></section>`;
    }
    const fields = module.fields.map((field) => {
      const preset = existing ? existing[field.key] : (current.params.get(field.key) || "");
      const value = preset == null ? "" : preset;
      const wide = field.type === "textarea" ? " wide" : "";
      const starMark = field.required ? '<span class="req">*</span>' : "";
      return `<label class="field${wide}"><span>${esc(field.label)}${starMark}</span>${inputControl(field, value)}</label>`;
    }).join("");
    const heading = current.mode === "edit" ? `Editar ${module.singular}` : `Crear ${module.singular}`;
    const back = current.mode === "edit"
      ? `#/${current.moduleId}/${encodeURIComponent(existing.id)}`
      : `#/${current.moduleId}`;
    return `<section class="page">
      <header class="page-head">
        <div>
          <p class="crumb"><a href="${back}">${esc(module.label)}</a></p>
          <h1>${esc(heading)}</h1>
        </div>
      </header>
      <form id="record-form" class="panel form-grid" data-module="${current.moduleId}" data-id="${existing ? esc(existing.id) : ""}">
        ${fields}
        <div class="form-actions">
          <button class="btn btn-ghost" type="button" data-action="cancel-form">Cancelar</button>
          <button class="btn btn-primary" type="submit">Guardar</button>
        </div>
      </form>
    </section>`;
  }

  function collectEvents() {
    const items = [];
    getRecords("meetings").forEach((row) => items.push({ date: row.date, time: row.time || "", name: row.name, module: "meetings", id: row.id, kind: "Reunión" }));
    getRecords("calls").forEach((row) => items.push({ date: row.date, time: row.time || "", name: row.name, module: "calls", id: row.id, kind: "Llamada" }));
    getRecords("tasks").forEach((row) => items.push({ date: row.due, time: "", name: row.name, module: "tasks", id: row.id, kind: "Tarea", status: row.status }));
    return items.filter((item) => item.date);
  }

  function renderCalendar() {
    const cursor = state.cursor;
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const pad = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const events = collectEvents();
    const today = todayISO();
    const cells = [];
    for (let index = 0; index < pad; index += 1) {
      const date = new Date(year, month, index - pad + 1);
      cells.push(`<button class="day is-out" type="button" data-action="pick-day" data-date="${isoFromDate(date)}">${date.getDate()}</button>`);
    }
    for (let day = 1; day <= days; day += 1) {
      const date = new Date(year, month, day);
      const iso = isoFromDate(date);
      const marks = events.filter((item) => item.date === iso).slice(0, 3);
      const dots = `<span class="dots">${marks.map(() => "<i></i>").join("")}</span>`;
      const classes = ["day"];
      if (iso === today) classes.push("is-today");
      if (iso === state.selectedDay) classes.push("is-selected");
      cells.push(`<button class="${classes.join(" ")}" type="button" data-action="pick-day" data-date="${iso}">${day}${dots}</button>`);
    }
    const selected = events.filter((item) => item.date === state.selectedDay).sort((a, b) => a.time.localeCompare(b.time));
    const agenda = selected.length
      ? selected.map((item) => `<a class="agenda-item" href="#/${item.module}/${encodeURIComponent(item.id)}"><small>${esc(item.kind)}${item.time ? ` · ${esc(item.time)}` : ""}</small><strong>${esc(item.name)}</strong></a>`).join("")
      : `<p class="muted">Nada programado este día.</p>`;
    const heading = `${MONTHS[month]} ${year}`;
    return `<section class="page">
      <header class="page-head">
        <div>
          <p class="crumb">Actividades</p>
          <h1>Calendario</h1>
        </div>
        <div class="page-actions">
          <button class="btn btn-ghost" type="button" data-action="prev-month">Anterior</button>
          <button class="btn btn-ghost" type="button" data-action="today">Hoy</button>
          <button class="btn btn-ghost" type="button" data-action="next-month">Siguiente</button>
        </div>
      </header>
      <div class="cal-layout">
        <section class="panel">
          <p class="cal-month">${esc(heading)}</p>
          <div class="cal-grid">${WEEKDAYS.map((day) => `<span class="dow">${day}</span>`).join("")}${cells.join("")}</div>
        </section>
        <aside class="panel agenda">
          <h2>${esc(formatDate(state.selectedDay))}</h2>
          ${agenda}
        </aside>
      </div>
    </section>`;
  }

  function greeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";
    return "Buenas noches";
  }

  function renderDashboard() {
    const openStages = ["Prospección", "Calificación", "Propuesta", "Negociación"];
    const opportunities = getRecords("opportunities").filter((row) => openStages.indexOf(row.stage) !== -1);
    const pipeline = opportunities.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
    const openCases = getRecords("cases").filter((row) => row.status !== "Resuelto");
    const today = todayISO();
    const openTasks = getRecords("tasks").filter((row) => row.status !== "Completada" && row.due && row.due <= today);
    const meetingsToday = getRecords("meetings").filter((row) => row.date === today);
    const stages = openStages.map((stage) => {
      const amount = opportunities.filter((row) => row.stage === stage).reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
      return { label: stage, value: amount };
    });
    const max = Math.max.apply(null, stages.map((stage) => stage.value).concat([1]));
    const bars = stages.map((stage) => {
      const width = Math.round((stage.value / max) * 100);
      return `<div class="bar-row"><span>${esc(stage.label)}</span><span class="bar"><span style="width:${width}%"></span></span><strong>${esc(money(stage.value))}</strong></div>`;
    }).join("");
    const agenda = collectEvents()
      .filter((item) => item.date === today || (item.kind === "Tarea" && item.date < today && item.status !== "Completada"))
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    const agendaHtml = agenda.length
      ? agenda.map((item) => `<a class="feed-item" href="#/${item.module}/${encodeURIComponent(item.id)}"><span>${esc(item.kind)}</span><strong>${esc(item.name)}</strong><span>${item.date < today ? "Vencida" : esc(item.time || "Hoy")}</span></a>`).join("")
      : `<p class="muted">No hay actividades para hoy.</p>`;
    const cases = getRecords("cases").slice(0, 4).map((row) => {
      const field = CONNEXUS.modules.cases.fields.find((item) => item.key === "status");
      return `<a class="case-row" href="#/cases/${encodeURIComponent(row.id)}"><span class="case-main"><strong>${esc(row.name)}</strong><small>${esc(nameOf("accounts", row.accountId) || "Sin cuenta")}</small></span>${pill(field, row.status)}</a>`;
    }).join("");
    const first = state.user.name.split(" ")[0];
    return `<section class="page">
      <header class="page-head">
        <div>
          <p class="crumb">Inicio</p>
          <h1>${greeting()}, ${esc(first)}</h1>
          <p class="muted">Esto es lo que pide atención hoy.</p>
        </div>
      </header>
      <div class="stats">
        <a class="stat" href="#/opportunities"><span>Pipeline abierto</span><strong>${esc(money(pipeline))}</strong><small>${opportunities.length} oportunidades</small></a>
        <a class="stat" href="#/cases"><span>Casos abiertos</span><strong>${openCases.length}</strong><small>Sin resolver</small></a>
        <a class="stat" href="#/tasks"><span>Tareas para hoy</span><strong>${openTasks.length}</strong><small>Vencen hoy o ya vencieron</small></a>
        <a class="stat" href="#/meetings"><span>Reuniones de hoy</span><strong>${meetingsToday.length}</strong><small>${esc(formatDate(today))}</small></a>
      </div>
      <div class="split">
        <section class="panel"><h2>Pipeline por etapa</h2>${bars}</section>
        <section class="panel"><h2>Para hoy</h2>${agendaHtml}</section>
      </div>
      <section class="panel"><header class="panel-head"><h2>Casos recientes</h2><a href="#/cases">Ver todos</a></header>${cases}</section>
    </section>`;
  }

  function viewHtml(current) {
    if (current.moduleId !== "home" && !CONNEXUS.modules[current.moduleId]) {
      return `<section class="page"><h1>No encontramos esa sección</h1><p><a href="#/home">Volver al inicio</a></p></section>`;
    }
    if (current.mode === "dashboard") return renderDashboard();
    if (current.mode === "calendar") return renderCalendar();
    if (current.mode === "detail") return renderDetail(current);
    if (current.mode === "create" || current.mode === "edit") return renderForm(current);
    return renderList(current);
  }

  function renderChrome() {
    const current = route();
    const unread = CONNEXUS.alerts.filter((alert) => state.readAlerts.indexOf(alert.id) === -1).length;
    const groups = CONNEXUS.groups.map((group) => {
      const active = group.id === state.group ? " is-active" : "";
      return `<button class="group${active}" type="button" data-action="set-group" data-group="${group.id}">${esc(group.label)}</button>`;
    }).join("");
    const createItems = CONNEXUS.quickCreate.map((item) => `<a href="#/${item.module}/new">${esc(item.label)}</a>`).join("");
    const alertItems = CONNEXUS.alerts.map((alert) => `<a data-action="mark-alert" data-id="${alert.id}" href="${esc(alert.href)}"><strong>${esc(alert.title)}</strong><small>${esc(alert.body)} · ${esc(alert.time)}</small></a>`).join("");
    document.getElementById("topbar").innerHTML = `
      <div class="brand-wrap">
        <button class="nav-toggle" type="button" data-action="toggle-nav" aria-label="Abrir módulos">${icon("menu")}</button>
        <a class="brand" href="#/home">${logo()}<span>ConNexus</span></a>
      </div>
      <nav class="groups" aria-label="Grupos">${groups}</nav>
      <div class="top-tools">
        <button class="search-launch" type="button" data-action="open-search">${icon("search")}<span>Buscar en el CRM</span><kbd>/</kbd></button>
        <div class="menu" data-menu>
          <button class="icon-btn" type="button" data-action="toggle-create" aria-label="Crear registro">${icon("plus")}</button>
          ${state.createOpen ? `<div class="menu-pop">${createItems}</div>` : ""}
        </div>
        <div class="menu" data-menu>
          <button class="icon-btn" type="button" data-action="toggle-alerts" aria-label="Alertas">${icon("bell")}${unread ? `<span class="badge">${unread}</span>` : ""}</button>
          ${state.alertsOpen ? `<div class="menu-pop">${alertItems}</div>` : ""}
        </div>
        <div class="menu" data-menu>
          <button class="icon-btn" type="button" data-action="toggle-user" aria-label="Menú de ${esc(state.user.name)}"><span class="avatar">${esc(initials(state.user.name))}</span></button>
          ${state.userOpen ? `<div class="menu-pop"><div class="user-card"><strong>${esc(state.user.name)}</strong><p>${esc(state.user.role)}</p><p>${esc(state.user.email)}</p></div><button class="menu-item" type="button" data-action="reset-demo">Restablecer datos de demostración</button><button class="menu-item" type="button" data-action="logout">Cerrar sesión</button></div>` : ""}
        </div>
      </div>`;
    const group = CONNEXUS.groups.find((item) => item.id === state.group) || CONNEXUS.groups[0];
    const homeActive = current.moduleId === "home" ? " is-active" : "";
    const links = group.modules.map((moduleId) => {
      const module = CONNEXUS.modules[moduleId];
      const active = current.moduleId === moduleId ? " is-active" : "";
      const currentAttr = current.moduleId === moduleId ? ' aria-current="page"' : "";
      return `<a class="nav-link${active}" href="#/${moduleId}"${currentAttr}>${icon(module.icon)}${esc(module.label)}</a>`;
    }).join("");
    document.getElementById("sidebar").innerHTML = `<a class="nav-link${homeActive}" href="#/home"${current.moduleId === "home" ? ' aria-current="page"' : ""}>${icon("home")}Inicio</a><p class="nav-label">${esc(group.label)}</p>${links}`;
    document.getElementById("sidebar").classList.toggle("is-open", state.navOpen);
    document.getElementById("nav-backdrop").hidden = !state.navOpen;
  }

  function render() {
    const logged = Boolean(state.user);
    document.getElementById("login").hidden = logged;
    document.getElementById("app").hidden = !logged;
    if (!logged) {
      document.title = "Entrar · ConNexus";
      return;
    }
    const current = route();
    if (state.routeModule !== current.moduleId) {
      state.routeModule = current.moduleId;
      state.query = "";
      state.statusFilter = "all";
      state.favoritesOnly = false;
    }
    renderChrome();
    const content = document.getElementById("content");
    try {
      content.innerHTML = viewHtml(current);
    } catch (error) {
      content.innerHTML = `<section class="page"><h1>No se pudo abrir esta pantalla</h1><p>Vuelve al inicio e inténtalo de nuevo.</p></section>`;
    }
    document.title = `${titleFor(current)} · ConNexus`;
  }

  function syncSearchModal() {
    const modal = document.getElementById("search-modal");
    modal.hidden = !state.searchOpen;
    if (state.searchOpen) document.getElementById("global-search").focus();
  }

  function openSearch() {
    state.searchOpen = true;
    closeMenus();
    document.getElementById("global-search").value = "";
    document.getElementById("search-results").innerHTML = '<p class="muted search-hint">Escribe al menos dos letras.</p>';
    syncSearchModal();
  }

  function paintSearch(query) {
    const box = document.getElementById("search-results");
    const clean = query.trim().toLowerCase();
    if (clean.length < 2) {
      box.innerHTML = '<p class="muted search-hint">Escribe al menos dos letras.</p>';
      return;
    }
    const groups = [];
    Object.keys(CONNEXUS.modules).forEach((moduleId) => {
      if (moduleId === "calendar") return;
      const hits = getRecords(moduleId).filter((row) => haystack(moduleId, row).includes(clean)).slice(0, 4);
      if (!hits.length) return;
      const items = hits.map((row) => {
        const module = CONNEXUS.modules[moduleId];
        const extra = row.city || row.company || row.status || row.stage || "";
        return `<a class="search-hit" href="#/${moduleId}/${encodeURIComponent(row.id)}"><strong>${esc(row.name)}</strong><br><small>${esc(extra)}</small></a>`;
      }).join("");
      groups.push(`<p class="search-label">${esc(CONNEXUS.modules[moduleId].label)}</p>${items}`);
    });
    box.innerHTML = groups.length ? groups.join("") : '<p class="muted search-hint">Sin resultados.</p>';
  }

  function showLoginError(message) {
    const error = document.getElementById("login-error");
    error.hidden = !message;
    error.textContent = message || "";
  }

  function doLogin(form) {
    const username = form.username.value.trim();
    if (!username) {
      showLoginError("Escribe un nombre para continuar.");
      return;
    }
    const known = CONNEXUS.users[username.toLowerCase()];
    state.user = known || {
      name: username,
      role: "Demostración",
      email: "",
    };
    persistSession();
    showLoginError("");
    if (!location.hash || location.hash === "#") location.hash = "#/home";
    render();
  }

  function doSave(form) {
    const moduleId = form.dataset.module;
    const module = CONNEXUS.modules[moduleId];
    const existing = form.dataset.id ? findRecord(moduleId, form.dataset.id) : null;
    const payload = {};
    module.fields.forEach((field) => {
      let value = form.elements[field.key].value;
      if (field.type !== "textarea") value = value.trim();
      if (field.type === "currency" || field.type === "number" || field.type === "percent") {
        value = value === "" ? "" : Number(value);
      }
      payload[field.key] = value;
    });
    const id = existing ? existing.id : `${module.prefix}-${Date.now().toString(36)}`;
    const next = Object.assign({}, existing || {}, payload, { id: id, favorite: existing ? Boolean(existing.favorite) : false });
    if (!db[moduleId]) db[moduleId] = [];
    if (existing) {
      const index = db[moduleId].findIndex((row) => row.id === existing.id);
      db[moduleId].splice(index, 1, next);
    } else {
      db[moduleId].unshift(next);
    }
    persistDb();
    showToast(existing ? "Cambios guardados" : "Registro creado");
    go(`#/${moduleId}/${encodeURIComponent(id)}`);
  }

  function shiftMonth(delta) {
    const cursor = state.cursor;
    state.cursor = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
    state.selectedDay = isoFromDate(state.cursor);
    render();
  }

  function resetDemo() {
    try { sessionStorage.removeItem(DB_KEY); } catch (error) { /* sigue en memoria */ }
    db = structuredClone(CONNEXUS.seed);
    state.readAlerts = [];
    persistSession();
    closeMenus();
    showToast("Datos de demostración restablecidos");
    go("#/home");
  }

  function onClick(event) {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) {
      if (!event.target.closest("[data-menu]") && (state.createOpen || state.alertsOpen || state.userOpen)) {
        closeMenus();
        renderChrome();
      }
      const row = event.target.closest("[data-href]");
      if (row && !event.target.closest("a, button")) go(row.dataset.href);
      return;
    }
    const action = actionEl.dataset.action;
    if (action === "open-search") { openSearch(); return; }
    if (action === "close-search") { state.searchOpen = false; syncSearchModal(); return; }
    if (action === "close-confirm") {
      state.pendingDelete = null;
      document.getElementById("confirm").hidden = true;
      return;
    }
    if (action === "confirm-delete") {
      const pending = state.pendingDelete;
      if (!pending) return;
      db[pending.moduleId] = getRecords(pending.moduleId).filter((row) => row.id !== pending.id);
      persistDb();
      state.pendingDelete = null;
      document.getElementById("confirm").hidden = true;
      showToast("Registro eliminado");
      go(`#/${pending.moduleId}`);
      return;
    }
    if (action === "toggle-nav") { state.navOpen = !state.navOpen; renderChrome(); return; }
    if (action === "close-nav") { state.navOpen = false; renderChrome(); return; }
    if (action === "toggle-create" || action === "toggle-alerts" || action === "toggle-user") {
      const key = action === "toggle-create" ? "createOpen" : action === "toggle-alerts" ? "alertsOpen" : "userOpen";
      const next = !state[key];
      closeMenus();
      state[key] = next;
      renderChrome();
      return;
    }
    if (action === "set-group") {
      state.group = actionEl.dataset.group;
      persistSession();
      renderChrome();
      return;
    }
    if (action === "set-filter") {
      state.statusFilter = actionEl.dataset.filter;
      render();
      return;
    }
    if (action === "toggle-favorites") {
      state.favoritesOnly = !state.favoritesOnly;
      render();
      return;
    }
    if (action === "toggle-fav") {
      const record = findRecord(actionEl.dataset.module, actionEl.dataset.id);
      if (!record) return;
      record.favorite = !record.favorite;
      persistDb();
      const current = route();
      if (current.mode === "list" && current.moduleId === actionEl.dataset.module) paintRows();
      else render();
      showToast(record.favorite ? "Añadido a favoritos" : "Quitado de favoritos");
      return;
    }
    if (action === "duplicate-record") {
      const module = CONNEXUS.modules[actionEl.dataset.module];
      const record = findRecord(actionEl.dataset.module, actionEl.dataset.id);
      if (!record) return;
      const copy = Object.assign({}, record, {
        id: `${module.prefix}-${Date.now().toString(36)}`,
        name: `${record.name} (copia)`,
        favorite: false,
      });
      db[actionEl.dataset.module].unshift(copy);
      persistDb();
      showToast("Se creó una copia");
      go(`#/${actionEl.dataset.module}/${encodeURIComponent(copy.id)}/edit`);
      return;
    }
    if (action === "ask-delete") {
      const record = findRecord(actionEl.dataset.module, actionEl.dataset.id);
      if (!record) return;
      state.pendingDelete = { moduleId: actionEl.dataset.module, id: record.id };
      document.getElementById("confirm-text").textContent = `¿Eliminar «${record.name}»? Esta acción no se puede deshacer.`;
      document.getElementById("confirm").hidden = false;
      return;
    }
    if (action === "cancel-form") {
      const current = route();
      go(current.mode === "edit" ? `#/${current.moduleId}/${encodeURIComponent(current.id)}` : `#/${current.moduleId}`);
      return;
    }
    if (action === "mark-alert") {
      const id = actionEl.dataset.id;
      if (state.readAlerts.indexOf(id) === -1) state.readAlerts.push(id);
      persistSession();
      state.alertsOpen = false;
      return;
    }
    if (action === "prev-month") { shiftMonth(-1); return; }
    if (action === "next-month") { shiftMonth(1); return; }
    if (action === "today") {
      const now = new Date();
      state.cursor = new Date(now.getFullYear(), now.getMonth(), 1);
      state.selectedDay = todayISO();
      render();
      return;
    }
    if (action === "pick-day") {
      state.selectedDay = actionEl.dataset.date;
      const picked = new Date(state.selectedDay + "T12:00:00");
      state.cursor = new Date(picked.getFullYear(), picked.getMonth(), 1);
      render();
      return;
    }
    if (action === "logout") {
      state.user = null;
      closeMenus();
      try { sessionStorage.removeItem(SESSION_KEY); } catch (error) { /* sale igual */ }
      render();
      return;
    }
    if (action === "reset-demo") resetDemo();
  }

  function bind() {
    document.addEventListener("click", onClick);
    document.addEventListener("submit", (event) => {
      if (event.target.id === "login-form") {
        event.preventDefault();
        doLogin(event.target);
      }
      if (event.target.id === "record-form") {
        event.preventDefault();
        doSave(event.target);
      }
    });
    document.addEventListener("input", (event) => {
      if (event.target.id === "list-search") {
        state.query = event.target.value;
        paintRows();
      }
      if (event.target.id === "global-search") paintSearch(event.target.value);
    });
    document.addEventListener("keydown", (event) => {
      const typing = event.target && (event.target.closest("input, textarea, select"));
      if (event.key === "Escape") {
        if (state.searchOpen) { state.searchOpen = false; syncSearchModal(); return; }
        if (!document.getElementById("confirm").hidden) {
          state.pendingDelete = null;
          document.getElementById("confirm").hidden = true;
          return;
        }
        if (state.userOpen || state.alertsOpen || state.createOpen || state.navOpen) {
          closeMenus();
          state.navOpen = false;
          render();
        }
        return;
      }
      if (event.key === "/" && !typing && state.user) {
        event.preventDefault();
        openSearch();
      }
    });
    window.addEventListener("hashchange", () => {
      state.searchOpen = false;
      state.navOpen = false;
      closeMenus();
      syncSearchModal();
      render();
    });
  }

  function boot() {
    const now = new Date();
    state.cursor = new Date(now.getFullYear(), now.getMonth(), 1);
    state.selectedDay = todayISO();
    db = loadDb();
    restoreSession();
    if (state.user && (!location.hash || location.hash === "#")) location.hash = "#/home";
    bind();
    render();
  }

  boot();
})();

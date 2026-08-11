// pagina "tutti i salvataggi": legge i piani nominati salvati in localStorage
// (stessa chiave usata da js/app.js) e li mostra in una tabella con dettaglio
// ad accordion per riga. Pagina a sé stante, nessun poll/stato live: solo lettura.
const LANG_KEY = 'claude-monitor-lang';
function detectLocale() {
  return (navigator.language || 'en').toLowerCase().startsWith('it') ? 'it' : 'en';
}
const LOCALE = localStorage.getItem(LANG_KEY) || detectLocale();
const T = window.I18N[LOCALE];

const THEME_KEY = 'claude-monitor-theme';
function applyTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) document.documentElement.setAttribute('data-theme', stored);
}

const NAMED_PLANS_KEY = 'claude-monitor-named-plans';

function loadNamedPlans() {
  try {
    return JSON.parse(localStorage.getItem(NAMED_PLANS_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

// stesso formato duplicato da js/app.js: i piani salvati prima dell'introduzione
// di savedAt sono lo snapshot "nudo", quelli nuovi sono {snapshot, savedAt}.
function planEntrySnapshot(entry) {
  return entry && typeof entry === 'object' && entry.snapshot ? entry.snapshot : entry;
}
function planEntrySavedAt(entry) {
  return entry && typeof entry === 'object' && entry.savedAt ? entry.savedAt : null;
}

// ordine delle fasce nel dettaglio: preset di default per nome, altrimenti
// numerico — non dipende dalla configurazione slot ATTUALE (che potrebbe non
// coincidere più con quella con cui il piano era stato salvato).
const DEFAULT_ORDER = ['mattina', 'pomeriggio', 'sera'];
function slotSortRank(key) {
  const idx = DEFAULT_ORDER.indexOf(key);
  if (idx !== -1) return idx;
  const n = Number(key);
  return Number.isNaN(n) ? 99 : n;
}
function slotLabel(key) {
  const n = Number(key);
  if (!Number.isNaN(n) && String(n) === key) return T.slotLabelPrefix + (n + 1);
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function formatSavedAt(iso) {
  if (!iso) return T.savedPlansUnknownDate;
  const d = new Date(iso);
  return d.toLocaleString(T.localeCode, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// giorni della settimana in ordine lun..dom (Date.getDay(): 0=dom..6=sab); il
// piano vero e proprio non ha un ordine settimanale fisso (dipende dalla data
// di reset con cui era stato costruito), quindi qui usiamo il consueto ordine
// lun..dom come riepilogo leggibile, non una ricostruzione esatta del calendario.
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

function buildDetailHTML(entry) {
  const snapshot = planEntrySnapshot(entry) || {};
  const byDay = {};
  Object.keys(snapshot).forEach(k => {
    if (!snapshot[k]) return;
    const sep = k.indexOf(':');
    if (sep === -1) return;
    const weekdayNum = Number(k.slice(0, sep));
    const slotKey = k.slice(sep + 1);
    if (!byDay[weekdayNum]) byDay[weekdayNum] = [];
    byDay[weekdayNum].push(slotKey);
  });
  const rows = WEEK_ORDER.map(w => {
    const active = (byDay[w] || []).slice().sort((a, b) => slotSortRank(a) - slotSortRank(b));
    const label = active.length ? active.map(slotLabel).join(', ') : T.savedPlansNoActive;
    return '<div class="detail-day"><span class="detail-dow">' + T.dow[w] + '</span><span class="detail-slots">' + label + '</span></div>';
  }).join('');
  return '<div class="detail-days">' + rows + '</div>';
}

function init() {
  applyTheme();
  document.documentElement.lang = LOCALE;
  document.title = T.savedPlansTitle;
  document.getElementById('title').textContent = T.savedPlansTitle;
  document.getElementById('tagline').textContent = T.savedPlansTagline;
  document.getElementById('col-name').textContent = T.savedPlansColName;
  document.getElementById('col-saved-at').textContent = T.savedPlansColSavedAt;

  const named = loadNamedPlans();
  const names = Object.keys(named);
  const tbody = document.getElementById('plans-tbody');
  const empty = document.getElementById('plans-empty');
  empty.textContent = T.savedPlansEmpty;

  if (!names.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  // più recenti prima; i piani legacy senza data di salvataggio vanno in coda, per nome
  names.sort((a, b) => {
    const ta = planEntrySavedAt(named[a]);
    const tb = planEntrySavedAt(named[b]);
    if (ta && tb) return new Date(tb) - new Date(ta);
    if (ta) return -1;
    if (tb) return 1;
    return a.localeCompare(b);
  });
  const lastName = names.find(n => planEntrySavedAt(named[n])) || null;

  names.forEach(name => {
    const entry = named[name];
    const savedAt = planEntrySavedAt(entry);
    const row = document.createElement('tr');
    row.className = 'plan-row';
    row.innerHTML = '<td>' + escapeHTML(name) + (name === lastName ? ' <span class="badge">' + T.savedPlansLastBadge + '</span>' : '') + '</td>' +
      '<td>' + formatSavedAt(savedAt) + '</td>';
    tbody.appendChild(row);

    const detailRow = document.createElement('tr');
    detailRow.className = 'plan-detail-row';
    detailRow.hidden = true;
    const detailCell = document.createElement('td');
    detailCell.colSpan = 2;
    detailCell.innerHTML = buildDetailHTML(entry);
    detailRow.appendChild(detailCell);
    tbody.appendChild(detailRow);

    row.addEventListener('click', () => {
      detailRow.hidden = !detailRow.hidden;
      row.classList.toggle('open', !detailRow.hidden);
    });
  });
}

init();

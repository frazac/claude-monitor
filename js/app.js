const LANG_KEY = 'claude-monitor-lang';
function detectLocale() {
  return (navigator.language || 'en').toLowerCase().startsWith('it') ? 'it' : 'en';
}
let LOCALE = localStorage.getItem(LANG_KEY) || detectLocale();

const ICONS = {
  coffee: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 11.6V15C17 18.3137 14.3137 21 11 21H9C5.68629 21 3 18.3137 3 15V11.6C3 11.2686 3.26863 11 3.6 11H16.4C16.7314 11 17 11.2686 17 11.6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 9C12 8 12.7143 7 14.1429 7V7C15.7208 7 17 5.72081 17 4.14286V3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 9V8.5C8 6.84315 9.34315 5.5 11 5.5V5.5C12.1046 5.5 13 4.60457 13 3.5V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 11H18.5C19.8807 11 21 12.1193 21 13.5C21 14.8807 19.8807 16 18.5 16H17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  apple: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1471 21.2646L12 21.2351L11.8529 21.2646C9.47627 21.7399 7.23257 21.4756 5.59352 20.1643C3.96312 18.86 2.75 16.374 2.75 12C2.75 7.52684 3.75792 5.70955 5.08541 5.04581C5.77977 4.69863 6.67771 4.59759 7.82028 4.72943C8.96149 4.86111 10.2783 5.21669 11.7628 5.71153L12.0235 5.79841L12.2785 5.69638C14.7602 4.70367 16.9909 4.3234 18.5578 5.05463C20.0271 5.7403 21.25 7.59326 21.25 12C21.25 16.374 20.0369 18.86 18.4065 20.1643C16.7674 21.4756 14.5237 21.7399 12.1471 21.2646Z" stroke="currentColor" stroke-width="1.5"></path><path d="M12 5.5C12 3 11 2 9 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 6V21" stroke="currentColor" stroke-width="1.5"></path><path d="M15 12L15 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  pizza: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 9.01L14.01 8.99889" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 8.01L8.01 7.99889" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 14.01L8.01 13.9989" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 19L2.23626 3.0041C2.13087 2.55618 2.54815 2.16122 2.98961 2.29106L19 7" stroke="currentColor" stroke-width="1.5"></path><path d="M22.198 8.42467C22.4324 7.48703 21.8623 6.5369 20.9247 6.30249C19.987 6.06808 19.0369 6.63816 18.8025 7.5758C18.4106 9.14318 16.9015 11.6241 14.5753 13.9503C12.2743 16.2513 9.42714 18.1442 6.60672 18.7951C5.66497 19.0124 5.07771 19.952 5.29504 20.8937C5.51236 21.8355 6.45198 22.4227 7.39373 22.2054C11.0734 21.3563 14.4762 18.9991 17.0502 16.4252C19.5989 13.8764 21.5898 10.8573 22.198 8.42467Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 12L23 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 2V1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 23V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 20L19 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 4L19 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 20L5 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4 4L5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 12L2 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5066C3 16.7497 7.25034 21 12.4934 21C16.2209 21 19.4466 18.8518 21 15.7259C12.4934 15.7259 8.27411 11.5066 8.27411 3C5.14821 4.55344 3 7.77915 3 11.5066Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  // icone extra di default per l'asse dei confini quando personalizzi il numero
  // di fasce oltre le 4 tematiche (caffè/mela/pizza/letto): usale nell'ordine
  // che preferisci, o sostituiscile con le tue nel pool più sotto.
  extra1: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 14C9 15.6099 10.3771 16 12.0758 16C14.9661 16 15.9206 14.3333 13.9982 11C11.3069 14 10.9224 9.33333 11.3069 8C10.1534 10 9 11.8785 9 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 16C15.1559 16 17 13.9024 17 10.3125C17 6.72265 12 3 12 3C12 3 7 6.72265 7 10.3125C7 13.9024 8.84409 16 12 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.27258 21.0703L19.7274 16.9292" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M4.27259 16.9292L12 18.9998" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M19.7274 21.0703L15.8637 20.035" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>',
  extra2: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 12H17M8 12L6 10H2L4 12L2 14H6L8 12ZM17 12L15 10M17 12L15 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 22.5C18.7614 22.5 21 17.799 21 12C21 6.20101 18.7614 1.5 16 1.5C13.2386 1.5 11 6.20101 11 12C11 17.799 13.2386 22.5 16 22.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  extra3: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 7C15.1046 7 16 6.10457 16 5C16 3.89543 15.1046 3 14 3C12.8954 3 12 3.89543 12 5C12 6.10457 12.8954 7 14 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15C16.3431 15 15 16.3431 15 18C15 19.6569 16.3431 21 18 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 21C7.65685 21 9 19.6569 9 18C9 16.3431 7.65685 15 6 15C4.34315 15 3 16.3431 3 18C3 19.6569 4.34315 21 6 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.5 18L13 14L8.11768 12L11.1179 8.50006L14.1179 11.0001L17.6179 11.0001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  extra4: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 19L7.33333 20L16.6667 20L19 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 22.01L8.01 21.9989" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 22.01L16.01 21.9989" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 7.8335C7 7.8335 8.82843 6.91929 10 6.3335C12 5.3335 14.2705 6.90111 14.2705 6.90111L9.96227 10.0363L14 13.3335V17.3335" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.54875 13.3445L8.30818 14.1716H5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.1653 9.20935H17.887" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 6C18.1046 6 19 5.10457 19 4C19 2.89543 18.1046 2 17 2C15.8954 2 15 2.89543 15 4C15 5.10457 15.8954 6 17 6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  extra5: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 13V16C21 18.2091 19.2091 20 17 20H7C4.79086 20 3 18.2091 3 16V13.6C3 13.2686 3.26863 13 3.6 13H21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16 20L17 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 20L7 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 13V7C21 4.79086 19.2091 3 17 3H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15.4 8H8.60003C8.26865 8 8.00393 7.7317 8.04019 7.4023C8.18624 6.07539 8.86312 3 12 3C15.1369 3 15.8138 6.07539 15.9598 7.4023C15.9961 7.73169 15.7314 8 15.4 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  extra6: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.7781 4.04337C17.7007 2.08074 14.9382 1 12 1C9.0618 1 6.29934 2.08089 4.2217 4.04337C2.14423 6.00617 1 8.61557 1 11.3911C1 11.7274 1.28853 12 1.64437 12C2.00038 12 2.28891 11.7274 2.28891 11.3911C2.28891 10.3784 3.16123 9.55439 4.23328 9.55439C6.12573 9.55439 5.43138 12 6.82219 12C8.21299 12 7.51871 9.55439 9.41109 9.55439C11.3035 9.55439 12 12 12 12C12 12 12.6965 9.55439 14.5889 9.55439C16.4813 9.55439 15.988 12 17.1778 12C18.3677 12 17.8743 9.55439 19.7667 9.55439C20.8388 9.55439 21.7111 10.3784 21.7111 11.3911C21.7111 11.7274 21.9996 12 22.3556 12C22.7115 12 23 11.7274 23 11.3911C23 8.61557 21.8559 6.00617 19.7781 4.04337Z" stroke="currentColor" stroke-width="1.5"></path><path d="M12 12C12 12 12 16.0948 12 20C12 24 6 24 6 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  extra7: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 12.5C17.2761 12.5 17.5 12.2761 17.5 12C17.5 11.7239 17.2761 11.5 17 11.5C16.7239 11.5 16.5 11.7239 16.5 12C16.5 12.2761 16.7239 12.5 17 12.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 12.5C12.2761 12.5 12.5 12.2761 12.5 12C12.5 11.7239 12.2761 11.5 12 11.5C11.7239 11.5 11.5 11.7239 11.5 12C11.5 12.2761 11.7239 12.5 12 12.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M7 12.5C7.27614 12.5 7.5 12.2761 7.5 12C7.5 11.7239 7.27614 11.5 7 11.5C6.72386 11.5 6.5 11.7239 6.5 12C6.5 12.2761 6.72386 12.5 7 12.5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17L2.5 21.5L7 20.6622C8.47087 21.513 10.1786 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
  extra8: '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 15.5V2.6C2 2.26863 2.26863 2 2.6 2H21.4C21.7314 2 22 2.26863 22 2.6V15.5M2 15.5V17.4C2 17.7314 2.26863 18 2.6 18H21.4C21.7314 18 22 17.7314 22 17.4V15.5M2 15.5H22M9 22H10.5M10.5 22V18M10.5 22H13.5M13.5 22H15M13.5 22L13.5 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
};

// =========================================================================
// PERSONALIZZAZIONE: fasce della giornata (righe del calendario) e icone che
// ne segnano i confini.
//
// Preset di default (nessuna personalizzazione salvata): 3 fasce fisse
// (mattina/pomeriggio/sera, orari asimmetrici pensati per una giornata tipo)
// con le 4 icone tematiche originali — comportamento identico a sempre.
//
// Se l'utente personalizza tramite `configure-slots.py` (ora di inizio/fine
// giornata attiva + numero di fasce, 1-12, condiviso con statusline.py via
// data/slot-config.json — vedi loadSlotConfig()), le fasce diventano N
// intervalli di uguale durata tra le due ore scelte, con chiavi numeriche
// ("0".."N-1") invece dei nomi mattina/pomeriggio/sera, e i confini pescano
// le icone dal pool DEFAULT_BOUNDARY_ICON_POOL qui sotto, in ciclo se N+1
// supera la lunghezza del pool. Personalizza il pool (o la sua lunghezza)
// per usare le tue icone al posto delle 8 extra di default.
// =========================================================================
const DEFAULT_SLOT_KEYS = ['mattina', 'pomeriggio', 'sera'];
const DEFAULT_SLOT_BOUNDS = { mattina: { start: 0, end: 12 }, pomeriggio: { start: 12, end: 19 }, sera: { start: 19, end: 24 } };
const DEFAULT_BOUNDARY_ICON_KEYS = ['coffee', 'apple', 'pizza', 'bed'];
const DEFAULT_BOUNDARY_ICON_POOL = ['coffee', 'apple', 'pizza', 'bed', 'extra1', 'extra2', 'extra3', 'extra4', 'extra5', 'extra6', 'extra7', 'extra8'];

let SLOT_KEYS = DEFAULT_SLOT_KEYS;
let SLOT_BOUNDS = DEFAULT_SLOT_BOUNDS;
let BOUNDARY_ICON_KEYS = DEFAULT_BOUNDARY_ICON_KEYS;

// genera N fasce di uguale durata tra dayStart e dayEnd (ore, 0-24); slot_for_hour
// (qui e in statusline.py, dove la stessa logica è duplicata in Python) assegna
// ogni ora della fascia [dayStart, dayEnd) allo slot corrispondente, e qualunque
// ora FUORI da quell'intervallo all'ultimo slot (stesso comportamento del preset
// di default, dove "sera" raccoglie anche l'eventuale notte fuori 0-24).
function buildSlotsFromConfig(cfg) {
  const n = cfg.slot_count;
  const keys = Array.from({ length: n }, (_, i) => String(i));
  const bounds = {};
  const step = (cfg.day_end - cfg.day_start) / n;
  keys.forEach((key, i) => {
    bounds[key] = { start: cfg.day_start + i * step, end: cfg.day_start + (i + 1) * step };
  });
  const icons = Array.from({ length: n + 1 }, (_, i) => DEFAULT_BOUNDARY_ICON_POOL[i % DEFAULT_BOUNDARY_ICON_POOL.length]);
  return { keys, bounds, icons };
}

// data/slot-config.json non esiste finché non lanci `configure-slots.py` (stesso
// pattern di data/display-config.json per la scelta della statusline): in sua
// assenza si resta sul preset di default sopra, invariato.
async function loadSlotConfig() {
  try {
    const res = await fetch('data/slot-config.json?_=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) return;
    const cfg = await res.json();
    if (!cfg || !cfg.slot_count) return;
    const built = buildSlotsFromConfig(cfg);
    SLOT_KEYS = built.keys;
    SLOT_BOUNDS = built.bounds;
    BOUNDARY_ICON_KEYS = built.icons;
  } catch (e) {
    // nessun file, o non valido: resta sul preset di default
  }
}
// =========================================================================

// traduzioni caricate da file esterni (i18n/it.js, i18n/en.js): per aggiungere
// una lingua basta un nuovo i18n/<lang>.js con lo stesso set di chiavi, più il
// suo <script> in fondo all'head e l'opzione nel lang-switch.
const STRINGS = window.I18N;
let T = STRINGS[LOCALE];

const POLL_MS = 5000;
const STALE_THRESHOLD_MS = 20 * 60 * 1000; // dati più vecchi di 20 min: statusline.py scrive solo con una sessione Claude Code interattiva attiva
const PLAN_KEY = 'claude-monitor-plan';
const NAMED_PLANS_KEY = 'claude-monitor-named-plans';
const MAX_SAVED_PLANS = 112; // come le settimane dell'anno
const THEME_KEY = 'claude-monitor-theme';
const TZ_KEY = 'claude-monitor-tz';
const HOUR12_KEY = 'claude-monitor-hour12';
const TIMEZONES = ['local', 'UTC', 'Europe/Rome', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo', 'Asia/Shanghai'];

let planDays = null; // costruito una volta noto resets_at
let lastData = null; // ultimo state.json valido, per riformattare gli orari senza ripollare

function buildExplanationHTML() {
  const boundaryLine = BOUNDARY_ICON_KEYS.map((iconKey, i) =>
    (T.boundaryLabels[i] || '') + ' <span class="inline-icon">' + ICONS[iconKey] + '</span>'
  ).join(' · ');
  return '<p>' + T.explanation + '</p>' +
    '<p>' + T.boundaryIntro + ' ' + boundaryLine + '.</p>' +
    '<p>' + T.planSaved + ' (<a href="cookies.html">' + T.planSavedDetails + '</a>)' + T.planSavedRest + '</p>';
}

function applyStrings() {
  document.documentElement.lang = LOCALE;
  document.title = T.title;
  document.getElementById('title').textContent = T.title;
  document.getElementById('tagline').textContent = T.tagline;
  document.getElementById('lbl-session').textContent = T.session;
  document.getElementById('lbl-week').textContent = T.week;
  document.getElementById('lbl-week-reset').textContent = T.weekReset;
  document.getElementById('lbl-session-reset').textContent = T.sessionReset;
  document.getElementById('lbl-threshold').textContent = T.threshold;
  document.getElementById('lbl-plan-target-slot').textContent = T.planTargetSlot;
  document.getElementById('lbl-plan-target-day').textContent = T.planTargetDay;
  document.getElementById('lbl-legend-plan').textContent = T.legendPlan;
  document.getElementById('lbl-legend-log').textContent = T.legendLog;
  document.getElementById('lbl-legend-under').textContent = T.legendUnder;
  document.getElementById('lbl-legend-over').textContent = T.legendOver;
  document.getElementById('reset-plan').textContent = T.resetPlan;
  document.getElementById('plan-name').placeholder = T.planNamePlaceholder;
  document.getElementById('save-plan').textContent = T.savePlan;
  document.getElementById('explanation').innerHTML = buildExplanationHTML();
  document.getElementById('icon-sun').innerHTML = ICONS.sun;
  document.getElementById('icon-moon').innerHTML = ICONS.moon;
  document.getElementById('icon-globe').innerHTML = ICONS.globe;
  document.getElementById('lbl-privacy-link2').textContent = T.privacyLink;
  document.getElementById('lbl-storage-link2').textContent = T.storageLink;
  document.getElementById('lbl-saved-plans-link').textContent = T.savedPlansLink;
  document.getElementById('lbl-icons-credit').innerHTML = T.iconsCreditPrefix +
    '<a href="https://iconoir.com/" target="_blank" rel="noopener">iconoir.com</a> &amp; ' +
    '<a href="https://lucide.dev/" target="_blank" rel="noopener">lucide.dev</a>';
  document.getElementById('lbl-made-with').innerHTML = T.madeWithPrefix +
    '<a href="https://short.masterismi.com/sitoistituzionale" target="_blank" rel="noopener">masterismi.com</a>' +
    T.madeWithSuffix;
  document.getElementById('stream-banner-cmd').innerHTML = T.streamDisconnectedHint + '<br><code>python3 install-statusline.py</code>';
  setStreamBanner(streamConnected);
}

let streamConnected = false;
function setStreamBanner(connected) {
  streamConnected = connected;
  const banner = document.getElementById('stream-banner');
  banner.classList.toggle('connected', connected);
  banner.classList.toggle('disconnected', !connected);
  document.getElementById('stream-banner-title').textContent = connected ? T.streamConnected : T.streamDisconnected;
}

function parseResetDate(str) {
  // formato "dd/mm/yyyy HH:MM"
  const [datePart, timePart] = str.split(' ');
  const [dd, mm, yyyy] = datePart.split('/').map(Number);
  const [HH, MI] = timePart.split(':').map(Number);
  return new Date(yyyy, mm - 1, dd, HH, MI, 0);
}

function dateOnly(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isoDateLocal(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function computeSevenDays(resetsAt) {
  const windowStart = new Date(resetsAt.getTime() - 7 * 86400 * 1000);
  let startDate;
  if (windowStart.getHours() < 11) {
    startDate = dateOnly(windowStart);
  } else {
    startDate = new Date(dateOnly(windowStart).getTime() + 86400 * 1000);
  }
  const result = [];
  for (let offset = 0; offset < 7; offset++) {
    result.push(new Date(startDate.getTime() + offset * 86400 * 1000));
  }
  return result;
}

function loadPlan() {
  try {
    return JSON.parse(localStorage.getItem(PLAN_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function savePlan(plan) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
}

function loadNamedPlans() {
  try {
    return JSON.parse(localStorage.getItem(NAMED_PLANS_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function saveNamedPlans(named) {
  localStorage.setItem(NAMED_PLANS_KEY, JSON.stringify(named));
}

// i piani nominati salvati prima dell'introduzione di savedAt sono ancora lo
// snapshot "nudo" ({"weekday:slotKey": bool}); quelli nuovi sono avvolti in
// {snapshot, savedAt}. Questi due accessor normalizzano entrambi i formati,
// così il resto del codice (qui e in saved-plans.js) non deve distinguerli.
function planEntrySnapshot(entry) {
  return entry && typeof entry === 'object' && entry.snapshot ? entry.snapshot : entry;
}
function planEntrySavedAt(entry) {
  return entry && typeof entry === 'object' && entry.savedAt ? entry.savedAt : null;
}
function lastSavedPlanName(named) {
  let best = null;
  let bestTime = -Infinity;
  Object.keys(named).forEach(name => {
    const savedAt = planEntrySavedAt(named[name]);
    if (!savedAt) return;
    const t = new Date(savedAt).getTime();
    if (t > bestTime) { bestTime = t; best = name; }
  });
  return best;
}

// le chiavi di piano usano il numero del giorno (0-6, come Date.getDay()) e non
// l'abbreviazione localizzata, così il piano salvato non dipende dalla lingua.
function defaultActive(weekdayNum, key) {
  if (weekdayNum === 0 || weekdayNum === 6) return false; // domenica, sabato
  return SLOT_KEYS.indexOf(key) < 2; // le prime due fasce del giorno sono attive di default
}

function buildDayModel(dates, plan) {
  return dates.map(d => {
    const weekdayNum = d.getDay();
    const slots = SLOT_KEYS.map(key => {
      const planKey = weekdayNum + ':' + key;
      const active = Object.prototype.hasOwnProperty.call(plan, planKey) ? plan[planKey] : defaultActive(weekdayNum, key);
      return { key, active };
    });
    return { date: d, weekdayNum, slots };
  });
}

function persistPlan(days) {
  const plan = {};
  days.forEach(day => {
    day.slots.forEach(slot => { plan[day.weekdayNum + ':' + slot.key] = slot.active; });
  });
  savePlan(plan);
}

function planSnapshot(days) {
  const plan = {};
  days.forEach(day => {
    day.slots.forEach(slot => { plan[day.weekdayNum + ':' + slot.key] = slot.active; });
  });
  return plan;
}

function flatten(days) {
  const tiles = [];
  days.forEach((day, dayIdx) => {
    day.slots.forEach((slot, slotIdx) => tiles.push({ day, dayIdx, slot, slotIdx }));
  });
  return tiles;
}

function computePlanTargets(days, now) {
  const all = flatten(days);
  const total = all.filter(t => t.slot.active).length;
  const weight = total > 0 ? 100 / total : 0;
  const today = dateOnly(now);
  const nowHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

  let targetDay = 0;
  let targetSlot = 0;
  let currentTile = null;
  let counter = 0;
  const numbering = new Map(); // "dayIdx:slotKey" -> numero progressivo

  for (const t of all) {
    if (t.slot.active) {
      counter++;
      numbering.set(t.dayIdx + ':' + t.slot.key, counter);
    }
    const tDate = dateOnly(t.day.date);
    if (tDate.getTime() < today.getTime()) {
      if (t.slot.active) { targetDay += weight; targetSlot += weight; }
    } else if (tDate.getTime() === today.getTime()) {
      if (t.slot.active) targetDay += weight;
      const b = SLOT_BOUNDS[t.slot.key];
      if (nowHour >= b.start) {
        if (t.slot.active) targetSlot += weight;
      }
      if (nowHour >= b.start && nowHour < b.end) {
        const fraction = (nowHour - b.start) / (b.end - b.start);
        currentTile = { dayIdx: t.dayIdx, slotKey: t.slot.key, fraction };
      }
    }
  }
  return { total, weight, targetDay, targetSlot, currentTile, numbering };
}

function renderPlan() {
  if (!planDays) return;
  const now = new Date();
  const { targetDay, targetSlot, weight, currentTile, numbering } = computePlanTargets(planDays, now);

  document.getElementById('plan-target-slot').textContent = targetSlot.toFixed(0) + '%';
  document.getElementById('plan-target-day').textContent = targetDay.toFixed(0) + '%';

  // "soglia attuale" dipende dal piano: confronta l'uso reale con la soglia di fine slot
  // (non con la quota fissa del backend), così cambia in base a quanti slot hai pianificato.
  const usedPct = (lastData && lastData.status === 'ok') ? lastData.used_pct : null;
  const overPace = usedPct !== null ? usedPct > targetSlot : null;
  const thresholdEl = document.getElementById('threshold');
  const thresholdRow = document.getElementById('threshold-row');
  if (usedPct !== null) {
    const diff = usedPct - targetSlot;
    const diffStr = (diff > 0 ? '+' : '') + diff.toFixed(0) + '%';
    thresholdEl.textContent = diffStr + ' ' + (overPace ? T.overLimit : T.underLimit);
    thresholdRow.classList.toggle('over', overPace);
    thresholdRow.classList.toggle('under', !overPace);
  } else {
    thresholdEl.textContent = '--';
    thresholdRow.classList.remove('over', 'under');
  }

  // righe più basse quando le fasce sono di più (fino a 12): rimane leggibile
  // sia col preset di default (3 fasce, 46px) sia con configurazioni più fitte.
  const tileHeight = Math.max(24, 46 - (SLOT_KEYS.length - 3) * 2);
  document.documentElement.style.setProperty('--tile-h', tileHeight + 'px');

  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // riga di intestazione: 7 giorni, dalla colonna 2 in poi (la colonna 1 è
  // riservata all'asse delle icone, vedi sotto)
  planDays.forEach((day, dayIdx) => {
    const head = document.createElement('div');
    head.className = 'daycol-head';
    head.style.gridColumn = String(dayIdx + 2);
    head.style.gridRow = '1';
    head.innerHTML = '<div class="dow">' + T.dow[day.weekdayNum] + '</div><div class="date">' +
      String(day.date.getDate()).padStart(2, '0') + '/' + String(day.date.getMonth() + 1).padStart(2, '0') + '</div>';
    grid.appendChild(head);
  });

  // asse verticale: colonna 1 del grid, subgrid sulle righe delle fasce (righe 2..N+1)
  // così eredita esattamente le stesse linee di riga del grid principale — nessun
  // offset o altezza calcolati a mano. Ogni icona è posizionata sul *confine* tra le
  // fasce (non al centro di una fascia): le prime SLOT_KEYS.length sull'inizio della
  // propria riga (allineate al bordo superiore), l'ultima sulla fine dell'ultima riga.
  const axis = document.createElement('div');
  axis.className = 'axis-cell';
  axis.style.gridColumn = '1';
  axis.style.gridRow = '2 / span ' + SLOT_KEYS.length;
  BOUNDARY_ICON_KEYS.forEach((key, i) => {
    const icon = document.createElement('div');
    icon.className = 'axis-icon';
    icon.innerHTML = ICONS[key];
    icon.style.gridColumn = '1'; // esplicito: l'ultima icona condivide la riga della penultima
    // (entrambe ai due bordi dell'ultima fascia), senza questo l'auto-placement le
    // metterebbe in colonne diverse pensando che si sovrappongano
    if (i < SLOT_KEYS.length) {
      icon.style.gridRow = String(i + 1);
      icon.style.alignSelf = 'start';
      icon.style.transform = 'translateY(-50%)';
    } else {
      icon.style.gridRow = String(SLOT_KEYS.length);
      icon.style.alignSelf = 'end';
      icon.style.transform = 'translateY(50%)';
    }
    axis.appendChild(icon);
  });
  grid.appendChild(axis);

  for (let row = 0; row < SLOT_KEYS.length; row++) {
    planDays.forEach((day, dayIdx) => {
      const slot = day.slots[row];
      const cell = document.createElement('div');
      const workedKey = isoDateLocal(day.date) + ':' + slot.key;
      const worked = !!(lastData && lastData.worked_slots && lastData.worked_slots[workedKey]);
      cell.className = 'tile ' + (slot.active ? 'active' : 'inactive') + (worked ? ' worked' : '');
      cell.style.gridColumn = String(dayIdx + 2);
      cell.style.gridRow = String(row + 2);
      const num = numbering.get(dayIdx + ':' + slot.key);
      cell.textContent = slot.active ? String(num) : '–';
      cell.title = (slot.active ? T.deactivate : T.activate);

      cell.addEventListener('click', () => {
        slot.active = !slot.active;
        persistPlan(planDays);
        renderPlan();
      });

      const isCurrent = currentTile && currentTile.dayIdx === dayIdx && currentTile.slotKey === slot.key;
      if (isCurrent) {
        cell.classList.add('current', overPace ? 'over' : 'under');
        const marker = document.createElement('div');
        marker.className = 'now-marker' + (overPace ? ' over' : '');
        marker.style.left = (currentTile.fraction * 100) + '%';
        cell.appendChild(marker);
      }

      grid.appendChild(cell);
    });
  }

  // riga finale: quota della settimana rappresentata da ciascun giorno, calcolata
  // sugli slot attivi di quel giorno (non sul tempo trascorso, a differenza di
  // "soglia di fine giornata" che riguarda solo oggi).
  const footerRow = SLOT_KEYS.length + 2;
  planDays.forEach((day, dayIdx) => {
    const activeCount = day.slots.filter(s => s.active).length;
    const dayShare = activeCount * weight;
    const foot = document.createElement('div');
    foot.className = 'daycol-target';
    foot.style.gridColumn = String(dayIdx + 2);
    foot.style.gridRow = String(footerRow);
    foot.textContent = dayShare.toFixed(0) + '%';
    grid.appendChild(foot);
  });
}

function refreshLoadSelect() {
  const select = document.getElementById('load-plan');
  const named = loadNamedPlans();
  const names = Object.keys(named).sort();
  select.innerHTML = '<option value="">' + T.loadPlanDefault + '</option>' +
    names.map(n => '<option value="' + n.replace(/"/g, '&quot;') + '">' + n + '</option>').join('');
  // all'apertura, mostra subito quale piano è stato salvato per ultimo (senza
  // applicarlo al piano corrente: è solo un'indicazione, il piano a schermo
  // resta quello che era già attivo, letto da PLAN_KEY come sempre)
  const last = lastSavedPlanName(named);
  if (last) select.value = last;
}

function setupPlanToolbar() {
  document.getElementById('reset-plan').addEventListener('click', () => {
    localStorage.removeItem(PLAN_KEY);
    if (planDays) {
      planDays.forEach(day => day.slots.forEach(slot => { slot.active = defaultActive(day.weekdayNum, slot.key); }));
      persistPlan(planDays);
    }
    renderPlan();
  });

  document.getElementById('save-plan').addEventListener('click', () => {
    const input = document.getElementById('plan-name');
    const name = input.value.trim();
    if (!name || !planDays) return;
    const named = loadNamedPlans();
    if (!Object.prototype.hasOwnProperty.call(named, name) && Object.keys(named).length >= MAX_SAVED_PLANS) {
      alert(T.maxPlansReached);
      return;
    }
    named[name] = { snapshot: planSnapshot(planDays), savedAt: new Date().toISOString() };
    saveNamedPlans(named);
    refreshLoadSelect();
    document.getElementById('load-plan').value = name;
    input.value = '';
  });

  document.getElementById('load-plan').addEventListener('change', e => {
    const name = e.target.value;
    if (!name || !planDays) return;
    const named = loadNamedPlans();
    const snapshot = planEntrySnapshot(named[name]);
    if (!snapshot) return;
    planDays.forEach(day => day.slots.forEach(slot => {
      const key = day.weekdayNum + ':' + slot.key;
      slot.active = Object.prototype.hasOwnProperty.call(snapshot, key) ? snapshot[key] : defaultActive(day.weekdayNum, slot.key);
    }));
    persistPlan(planDays);
    renderPlan();
  });

  refreshLoadSelect();
}

// --- banner informativo su local storage (non cookie) ---
const CONSENT_KEY = 'claude-monitor-consent-ack';
function refreshConsentText() {
  document.getElementById('consent-text').innerHTML = T.consentText;
}
function setupConsentBanner() {
  refreshConsentText();
  const banner = document.getElementById('consent-banner');
  if (!localStorage.getItem(CONSENT_KEY)) {
    banner.hidden = false;
  }
  document.getElementById('consent-ok').addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, '1');
    banner.hidden = true;
  });
}

// --- lingua IT/EN: pill con le due lingue cliccabili separatamente (stile orco.it) ---
function updateLangSwitchUI() {
  document.getElementById('lang-opt-it').classList.toggle('active', LOCALE === 'it');
  document.getElementById('lang-opt-en').classList.toggle('active', LOCALE === 'en');
}
function setLocale(lang) {
  LOCALE = lang;
  localStorage.setItem(LANG_KEY, lang);
  T = STRINGS[LOCALE];
  applyStrings();
  refreshLoadSelect();
  renderTzOptions();
  refreshFormatUI();
  refreshConsentText();
  updateLangSwitchUI();
  if (lastData) render(lastData);
}
function setupLangSwitch() {
  document.getElementById('lang-opt-it').addEventListener('click', () => setLocale('it'));
  document.getElementById('lang-opt-en').addEventListener('click', () => setLocale('en'));
  updateLangSwitchUI();
}

// --- tema chiaro/scuro ---
function systemPrefersDark() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function effectiveTheme() {
  return localStorage.getItem(THEME_KEY) || (systemPrefersDark() ? 'dark' : 'light');
}
function applyTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  const knob = document.getElementById('theme-knob');
  knob.style.transform = effectiveTheme() === 'dark' ? 'translateX(24px)' : 'translateX(0)';
}
function setupThemeSwitch() {
  document.getElementById('theme-switch').addEventListener('click', () => {
    localStorage.setItem(THEME_KEY, effectiveTheme() === 'dark' ? 'light' : 'dark');
    applyTheme();
  });
  applyTheme();
}

// --- fuso orario e formato ora ---
function getTz() { return localStorage.getItem(TZ_KEY) || 'local'; }
function getHour12() { return localStorage.getItem(HOUR12_KEY) === '1'; }

function formatDateTime(date) {
  const opts = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: getHour12() };
  const tz = getTz();
  if (tz !== 'local') opts.timeZone = tz;
  return date.toLocaleString(T.localeCode, opts);
}
function formatTime(date) {
  const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: getHour12() };
  const tz = getTz();
  if (tz !== 'local') opts.timeZone = tz;
  return date.toLocaleTimeString(T.localeCode, opts);
}
function formatDuration(ms) {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return hours + T.hourUnit + ' ' + minutes + T.minuteUnit;
  return minutes + T.minuteUnit;
}

function updateTimeDisplays() {
  if (!lastData || lastData.status !== 'ok') {
    setStreamBanner(false);
    return;
  }
  const now = Date.now();

  const weekResetDate = parseResetDate(lastData.reset_date);
  const daysLeft = Math.max(0, Math.ceil((weekResetDate.getTime() - now) / 86400000));
  document.getElementById('week-reset').textContent = formatDateTime(weekResetDate) +
    ' (' + T.inPrefix + daysLeft + T.dayUnit + ')';

  if (lastData.five_hour_reset_date) {
    const sessionResetDate = parseResetDate(lastData.five_hour_reset_date);
    const hoursLeft = Math.max(0, Math.ceil((sessionResetDate.getTime() - now) / 3600000));
    document.getElementById('hour-reset').textContent = formatDateTime(sessionResetDate) +
      ' (' + T.inPrefix + hoursLeft + T.hourUnit + ')';
  } else {
    document.getElementById('hour-reset').textContent = '--';
  }

  const updatedAtDate = new Date(lastData.updated_at * 1000);
  const staleMs = now - updatedAtDate.getTime();
  const isStale = staleMs > STALE_THRESHOLD_MS;
  setUpdatedMessage(
    (isStale ? T.staleDataPrefix + formatDuration(staleMs) + ' — ' : T.updatedPrefix) + formatTime(updatedAtDate),
    isStale
  );
  setStreamBanner(!isStale);
}

function renderTzOptions() {
  const select = document.getElementById('tz-select');
  const current = select.value || getTz();
  select.innerHTML = TIMEZONES.map(tz =>
    '<option value="' + tz + '">' + (tz === 'local' ? T.localTz : tz) + '</option>'
  ).join('');
  select.value = current;
}

function refreshFormatUI() {
  const isAmpm = getHour12();
  document.getElementById('format-knob').style.transform = isAmpm ? 'translateX(24px)' : 'translateX(0)';
  document.getElementById('fmt-label-24h').classList.toggle('active', !isAmpm);
  document.getElementById('fmt-label-ampm').classList.toggle('active', isAmpm);
}

function setupTzControls() {
  renderTzOptions();
  const select = document.getElementById('tz-select');
  select.addEventListener('change', () => {
    localStorage.setItem(TZ_KEY, select.value);
    updateTimeDisplays();
  });

  refreshFormatUI();
  document.getElementById('format-toggle').addEventListener('click', () => {
    localStorage.setItem(HOUR12_KEY, getHour12() ? '0' : '1');
    refreshFormatUI();
    updateTimeDisplays();
  });
}

function setUpdatedMessage(text, isError) {
  const updated = document.getElementById('updated');
  updated.textContent = text;
  updated.classList.toggle('error', !!isError);
}

function render(data) {
  if (!data || data.status !== 'ok') {
    document.getElementById('week-pct').textContent = '--%';
    document.getElementById('hour-pct').textContent = '--%';
    setUpdatedMessage(data && data.status === 'n/d' ? T.noApiResponse : T.waitingData, data && data.status === 'n/d');
    setStreamBanner(false);
    return;
  }
  lastData = data;

  document.getElementById('hour-pct').textContent = (data.five_hour_pct !== null && data.five_hour_pct !== undefined)
    ? data.five_hour_pct.toFixed(0) + '%' : '--%';
  document.getElementById('hour-bar-fill').style.width = (data.five_hour_pct || 0) + '%';
  document.getElementById('week-pct').textContent = data.used_pct.toFixed(0) + '%';
  document.getElementById('week-bar-fill').style.width = data.used_pct + '%';

  updateTimeDisplays();

  if (!planDays && data.reset_date) {
    const resetsAt = parseResetDate(data.reset_date);
    const dates = computeSevenDays(resetsAt);
    planDays = buildDayModel(dates, loadPlan());
  }
  renderPlan();
}

// metti a true dalla console del browser (window.DEBUG_PAUSE_REFRESH = true) per
// bloccare i refresh automatici e lavorare sui devtools senza che il DOM del
// calendario venga ricostruito sotto di te ogni pochi secondi
window.DEBUG_PAUSE_REFRESH = false;

async function poll() {
  if (window.DEBUG_PAUSE_REFRESH) return;
  try {
    const res = await fetch('data/state.json?_=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      render(await res.json());
    } else {
      setUpdatedMessage(T.stateNotFound, true);
      setStreamBanner(false);
    }
  } catch (e) {
    setUpdatedMessage(T.stateNotFound, true);
    setStreamBanner(false);
  }
}

(async function init() {
  await loadSlotConfig(); // deve completare prima del primo render: SLOT_KEYS/SLOT_BOUNDS
  // influenzano sia il testo (buildExplanationHTML) sia il modello del piano
  applyStrings();
  setupPlanToolbar();
  setupThemeSwitch();
  setupTzControls();
  setupConsentBanner();
  setupLangSwitch();
  poll();
  setInterval(poll, POLL_MS);
  setInterval(() => { if (!window.DEBUG_PAUSE_REFRESH) renderPlan(); }, 30000); // aggiorna la posizione dell'asticella anche senza nuovi dati
})();

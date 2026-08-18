#!/usr/bin/env python3
"""Configura i confini orari delle fasce del calendario (anche di durata diversa
tra loro, es. una fascia notturna più lunga) e il numero di giorni mostrati nella
dashboard, scrivendo data/slot-config.json — letto sia dalla dashboard web
(js/app.js) sia da statusline.py, così restano sempre sincronizzati sulla stessa
identica definizione di fascia.

Senza questo file, claude-monitor resta sul preset di default invariato: 3 fasce
(mattina/pomeriggio/sera, orari asimmetrici pensati per una giornata tipo) con le
4 icone tematiche originali (caffè/mela/pizza/letto), 7 giorni mostrati.

Con una configurazione personalizzata, le fasce sono un elenco esplicito di
confini orari ("boundaries", N+1 valori per N fasce, chiavi numeriche invece di
"mattina" ecc.) e le icone dei confini vengono assegnate automaticamente in base
alla loro ora (vedi defaultIconForHour in js/app.js) — nessuna scelta manuale
dell'icona da qui, il pannello nella dashboard genera il comando --apply da
incollare qui sotto.

Uso:
  python3 configure-slots.py                 interattivo, chiede orari/fasce/giorni
  python3 configure-slots.py --apply '<json>' non interattivo, es. da un comando
                                               generato dal pannello di
                                               personalizzazione nella dashboard
  python3 configure-slots.py --reset          torna al preset di default
"""
import json
import os
import re
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SLOT_CONFIG_FILE = os.path.join(SCRIPT_DIR, "data", "slot-config.json")

ICON_KEY_RE = re.compile(r"^[a-zA-Z0-9_]+$")

WARNING_LINES = [
    "ATTENZIONE: cambiare fasce/giorni cambia anche il formato delle chiavi con",
    "cui il piano viene salvato nel browser (localStorage). I piani già salvati",
    "con la configurazione precedente NON verranno riconosciuti e torneranno ai",
    "valori di default per ogni giorno — non sono persi (restano nel browser),",
    "ma non saranno più applicati finché non torni alla stessa configurazione",
    "con cui erano stati creati.",
]


def ask_int(prompt, default, min_value, max_value):
    while True:
        answer = input(prompt + " [" + str(default) + "]: ").strip()
        if not answer:
            return default
        try:
            value = int(answer)
        except ValueError:
            print("Inserisci un numero intero.")
            continue
        if not (min_value <= value <= max_value):
            print("Deve essere tra " + str(min_value) + " e " + str(max_value) + ".")
            continue
        return value


def validate_boundaries(boundaries):
    if not isinstance(boundaries, list) or not (2 <= len(boundaries) <= 13):
        return "'boundaries' deve essere una lista di 2-13 numeri."
    for i, v in enumerate(boundaries):
        if isinstance(v, bool) or not isinstance(v, (int, float)):
            return "'boundaries' deve contenere solo numeri."
        if i > 0 and v <= boundaries[i - 1]:
            return "'boundaries' deve essere strettamente crescente."
    if boundaries[0] < 0 or boundaries[-1] > 24:
        return "i confini devono essere tra 0 e 24."
    return None


def run_apply(raw_json):
    try:
        cfg = json.loads(raw_json)
    except json.JSONDecodeError as e:
        print("Errore: JSON non valido (" + str(e) + ").")
        sys.exit(1)

    boundaries = cfg.get("boundaries")
    err = validate_boundaries(boundaries)
    if err:
        print("Errore: " + err)
        sys.exit(1)

    day_count = cfg.get("day_count", 7)
    if isinstance(day_count, bool) or not isinstance(day_count, int) or not (1 <= day_count <= 7):
        print("Errore: 'day_count' deve essere un intero tra 1 e 7.")
        sys.exit(1)

    out = {"boundaries": boundaries, "day_count": day_count}
    icons = cfg.get("icons")
    # validazione volutamente superficiale (solo forma, non contro il set reale
    # di ICONS in js/app.js): Python non renderizza mai le icone, un valore
    # non riconosciuto è solo un problema di rendering lato JS, non qui.
    if isinstance(icons, list) and len(icons) == len(boundaries) and all(
        isinstance(k, str) and ICON_KEY_RE.match(k) for k in icons
    ):
        out["icons"] = icons

    os.makedirs(os.path.dirname(SLOT_CONFIG_FILE), exist_ok=True)
    with open(SLOT_CONFIG_FILE, "w") as f:
        json.dump(out, f, indent=2)
        f.write("\n")

    n = len(boundaries) - 1
    print("Scritto " + SLOT_CONFIG_FILE)
    print(str(n) + " fasce, " + str(day_count) + " giorni mostrati.")
    print("La dashboard web applica la nuova configurazione al prossimo refresh.")
    print("statusline.py la applica dalla prossima invocazione (prossimo aggiornamento della statusline).")
    print()
    print("Nota: questo cambia anche il formato delle chiavi con cui il piano viene salvato")
    print("nel browser — i piani già salvati con la configurazione precedente torneranno ai")
    print("valori di default per ogni giorno finché non richiami la stessa configurazione.")


def current_defaults():
    """Legge data/slot-config.json se presente e ne ricava i valori da precompilare
    nei prompt interattivi sotto — capendo sia il formato nuovo (boundaries) sia
    quello di installazioni precedenti a questa modifica (day_start/day_end/
    slot_count, divisione equa): non tocca il file, serve solo a non far sparire
    i valori dell'utente dai default mostrati finché non conferma di nuovo."""
    if not os.path.isfile(SLOT_CONFIG_FILE):
        return None, None, None, 7
    try:
        with open(SLOT_CONFIG_FILE) as f:
            current = json.load(f)
    except Exception:
        return None, None, None, 7

    day_count = current.get("day_count", 7)
    if "boundaries" in current and isinstance(current["boundaries"], list) and len(current["boundaries"]) >= 2:
        b = current["boundaries"]
        return b[0], b[-1], len(b) - 1, day_count
    if "slot_count" in current:
        return current.get("day_start", 0), current.get("day_end", 24), current.get("slot_count", 3), day_count
    return None, None, None, day_count


def main():
    if "--reset" in sys.argv:
        if os.path.isfile(SLOT_CONFIG_FILE):
            os.remove(SLOT_CONFIG_FILE)
            print("Rimosso " + SLOT_CONFIG_FILE + " — tornato al preset di default (3 fasce mattina/pomeriggio/sera).")
        else:
            print("Nessuna configurazione personalizzata presente, già sul preset di default.")
        return

    if "--apply" in sys.argv:
        idx = sys.argv.index("--apply")
        if idx + 1 >= len(sys.argv):
            print("Errore: --apply richiede un argomento JSON, es. --apply '{\"boundaries\":[0,12,24]}'")
            sys.exit(1)
        run_apply(sys.argv[idx + 1])
        return

    cur_day_start, cur_day_end, cur_slot_count, cur_day_count = current_defaults()
    have_current = cur_day_start is not None

    print("Configurazione attuale: " + (
        f"{cur_slot_count} fasce tra le {cur_day_start}:00 e le {cur_day_end}:00, {cur_day_count} giorni mostrati"
        if have_current else "preset di default (3 fasce mattina/pomeriggio/sera, 7 giorni)"
    ))
    print()
    print("Premi Invio per tenere il valore tra parentesi quadre.")
    print()

    day_start = ask_int("Ora di inizio della giornata attiva (0-23)", cur_day_start if have_current else 0, 0, 23)
    day_end = ask_int("Ora di fine della giornata attiva (1-24)", cur_day_end if have_current else 24, day_start + 1, 24)
    slot_count = ask_int("Numero di fasce (1-12)", cur_slot_count if have_current else 3, 1, 12)
    day_count = ask_int("Numero di giorni mostrati nella dashboard (1-7)", cur_day_count, 1, 7)

    print()
    for line in WARNING_LINES:
        print(line)
    answer = input("Continuare? [y/N] ")
    if answer.strip().lower() != "y":
        print("Aborted, nothing changed.")
        return

    step = (day_end - day_start) / slot_count
    boundaries = [day_start + i * step for i in range(slot_count + 1)]

    os.makedirs(os.path.dirname(SLOT_CONFIG_FILE), exist_ok=True)
    with open(SLOT_CONFIG_FILE, "w") as f:
        json.dump({"boundaries": boundaries, "day_count": day_count}, f, indent=2)
        f.write("\n")

    print()
    print("Scritto " + SLOT_CONFIG_FILE)
    print(str(slot_count) + " fasce di " + f"{(day_end - day_start) / slot_count:.2f}" + "h ciascuna, tra le " +
          str(day_start) + ":00 e le " + str(day_end) + ":00, " + str(day_count) + " giorni mostrati.")
    print("La dashboard web applica la nuova configurazione al prossimo refresh.")
    print("statusline.py la applica dalla prossima invocazione (prossimo aggiornamento della statusline).")
    print()
    print("Per tornare al preset di default in qualsiasi momento: python3 configure-slots.py --reset")


if __name__ == "__main__":
    main()

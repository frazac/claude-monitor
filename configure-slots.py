#!/usr/bin/env python3
"""Configura il numero di fasce del calendario (1-12) e l'orario di inizio/fine
della giornata attiva, scrivendo data/slot-config.json — letto sia dalla
dashboard web (js/app.js) sia da statusline.py, così restano sempre sincronizzati
sulla stessa identica definizione di fascia.

Senza questo file, claude-monitor resta sul preset di default invariato: 3 fasce
(mattina/pomeriggio/sera, orari asimmetrici pensati per una giornata tipo) con le
4 icone tematiche originali (caffè/mela/pizza/letto).

Con un numero di fasce personalizzato, le fasce diventano N intervalli di uguale
durata tra le due ore scelte, con chiavi numeriche (non più "mattina" ecc.) e le
icone pescate in ciclo da un pool più ampio (vedi DEFAULT_BOUNDARY_ICON_POOL in
js/app.js) — personalizzabile anche quello, direttamente nel codice.
"""
import json
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SLOT_CONFIG_FILE = os.path.join(SCRIPT_DIR, "data", "slot-config.json")


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


def main():
    if "--reset" in sys.argv:
        if os.path.isfile(SLOT_CONFIG_FILE):
            os.remove(SLOT_CONFIG_FILE)
            print("Rimosso " + SLOT_CONFIG_FILE + " — tornato al preset di default (3 fasce mattina/pomeriggio/sera).")
        else:
            print("Nessuna configurazione personalizzata presente, già sul preset di default.")
        return

    current = None
    if os.path.isfile(SLOT_CONFIG_FILE):
        try:
            with open(SLOT_CONFIG_FILE) as f:
                current = json.load(f)
        except Exception:
            current = None

    print("Configurazione attuale: " + (json.dumps(current) if current else "preset di default (3 fasce mattina/pomeriggio/sera)"))
    print()
    print("Premi Invio per tenere il valore tra parentesi quadre.")
    print()

    day_start = ask_int("Ora di inizio della giornata attiva (0-23)", (current or {}).get("day_start", 0), 0, 23)
    day_end = ask_int("Ora di fine della giornata attiva (1-24)", (current or {}).get("day_end", 24), day_start + 1, 24)
    slot_count = ask_int("Numero di fasce (1-12)", (current or {}).get("slot_count", 3), 1, 12)

    print()
    print("ATTENZIONE: cambiare numero di fasce/orari cambia anche il formato delle")
    print("chiavi con cui il piano viene salvato nel browser (localStorage). I piani")
    print("già salvati con la configurazione precedente NON verranno riconosciuti e")
    print("torneranno ai valori di default per ogni giorno — non sono persi (restano")
    print("nel browser), ma non saranno più applicati finché non torni alla stessa")
    print("configurazione con cui erano stati creati.")
    answer = input("Continuare? [y/N] ")
    if answer.strip().lower() != "y":
        print("Aborted, nothing changed.")
        return

    os.makedirs(os.path.dirname(SLOT_CONFIG_FILE), exist_ok=True)
    with open(SLOT_CONFIG_FILE, "w") as f:
        json.dump({"day_start": day_start, "day_end": day_end, "slot_count": slot_count}, f, indent=2)
        f.write("\n")

    print()
    print("Scritto " + SLOT_CONFIG_FILE)
    print(str(slot_count) + " fasce di " + f"{(day_end - day_start) / slot_count:.2f}" + "h ciascuna, tra le " + str(day_start) + ":00 e le " + str(day_end) + ":00.")
    print("La dashboard web applica la nuova configurazione al prossimo refresh.")
    print("statusline.py la applica dalla prossima invocazione (prossimo aggiornamento della statusline).")
    print()
    print("Per tornare al preset di default in qualsiasi momento: python3 configure-slots.py --reset")


if __name__ == "__main__":
    main()

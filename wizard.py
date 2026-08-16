#!/usr/bin/env python3
"""Wizard di installazione bilingue (IT/EN) — orchestratore dei tre passi manuali già
documentati in README.md/README.it.md (aggancio statusline, fasce del calendario opzionali,
server locale), pensato per la distribuzione pubblica: chi scarica il progetto lancia
`python3 wizard.py` invece di seguire i tre passi a mano. Non duplica la logica di
`install-statusline.py`/`configure-slots.py` — li richiama come sottoprocessi (stdin/stdout
ereditati, quindi le loro domande interattive restano identiche e già testate), aggiungendo
solo la cornice bilingue e l'avvio automatico del server locale a fine percorso.

Per testare senza toccare la macchina reale: HOME=/percorso/fittizio python3 wizard.py
(install-statusline.py risolve ~/.claude/settings.json da $HOME, quindi rispetta l'override).
"""
import os
import subprocess
import sys
import time
import webbrowser

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_PORT = 8931

STRINGS = {
    "it": {
        "welcome": "=== Claude Monitor Limes — wizard di installazione ===",
        "intro": (
            "Questo wizard fa tre cose, in ordine: (1) collega claude-monitor come\n"
            "statusline di Claude Code — l'unico modo per ricevere i dati di utilizzo —\n"
            "(2) ti chiede se vuoi personalizzare le fasce del calendario (opzionale),\n"
            "(3) avvia un server locale e apre la dashboard nel browser.\n"
            "Ogni passo è a sé: puoi interrompere con Ctrl+C in qualsiasi momento senza\n"
            "che i passi successivi vengano eseguiti."
        ),
        "step1_title": "--- Passo 1/3: aggancio ai dati di utilizzo ---",
        "step2_title": "--- Passo 2/3: fasce del calendario (opzionale) ---",
        "step2_ask": "Vuoi personalizzare numero/orari delle fasce ora? [y/N]: ",
        "step2_skip": "Salta pure: resta il preset di default (3 fasce mattina/pomeriggio/sera). Puoi farlo in qualsiasi momento con: python3 configure-slots.py",
        "step3_title": "--- Passo 3/3: server locale e dashboard ---",
        "step3_has_server": (
            "Se usi già un server web locale (MAMP, XAMPP, nginx, Live Server...),\n"
            "puoi puntarlo su questa cartella e aprire l'URL che ti dà — salta pure questo passo."
        ),
        "step3_ask": "Avviare ora un server locale su questa cartella e aprire la dashboard nel browser? [Y/n]: ",
        "step3_port": "Porta da usare",
        "step3_starting": "Avvio del server su http://localhost:{port}/ (solo localhost, --bind 127.0.0.1)...",
        "step3_started": "Server avviato (pid {pid}). Dashboard aperta nel browser.",
        "step3_stop": "Per fermarlo quando vuoi: kill {pid}",
        "step3_failed": "Non sono riuscito ad avviare il server (porta {port} già in uso? prova un'altra porta o avvialo a mano):",
        "step3_manual": "python3 -m http.server {port} --bind 127.0.0.1",
        "step3_skipped": "Ok, nessun server avviato. Quando vuoi: python3 -m http.server 8931 --bind 127.0.0.1",
        "done_title": "=== Fatto ===",
        "done_body": (
            "Tieni aperta almeno una sessione interattiva di Claude Code: è l'unico modo\n"
            "in cui claude-monitor riceve dati aggiornati (vedi README.md, \"How it works\").\n"
            "La dashboard mostra un banner rosso \"Stream non collegato\" se i dati mancano\n"
            "o sono vecchi di più di 20 minuti — sparisce da solo appena arrivano dati freschi."
        ),
        "lang_prompt": "Lingua / Language [it/en] (it): ",
        "interrupted": "\nInterrotto. Nessun passo successivo eseguito.",
    },
    "en": {
        "welcome": "=== Claude Monitor Limes — install wizard ===",
        "intro": (
            "This wizard does three things, in order: (1) wires claude-monitor up as\n"
            "Claude Code's statusline — the only way to receive usage data — (2) asks if\n"
            "you want to customize the calendar's day slots (optional), (3) starts a local\n"
            "server and opens the dashboard in your browser.\n"
            "Each step stands on its own: press Ctrl+C at any point and later steps simply\n"
            "won't run."
        ),
        "step1_title": "--- Step 1/3: wiring up usage data ---",
        "step2_title": "--- Step 2/3: calendar day slots (optional) ---",
        "step2_ask": "Customize the number/hours of day slots now? [y/N]: ",
        "step2_skip": "Skipping: default preset stays (3 slots, morning/afternoon/evening). Do it anytime with: python3 configure-slots.py",
        "step3_title": "--- Step 3/3: local server and dashboard ---",
        "step3_has_server": (
            "If you already run a local web server (MAMP, XAMPP, nginx, Live Server...),\n"
            "point it at this folder and open the URL it gives you — feel free to skip this step."
        ),
        "step3_ask": "Start a local server on this folder now and open the dashboard in your browser? [Y/n]: ",
        "step3_port": "Port to use",
        "step3_starting": "Starting server at http://localhost:{port}/ (localhost only, --bind 127.0.0.1)...",
        "step3_started": "Server started (pid {pid}). Dashboard opened in your browser.",
        "step3_stop": "To stop it whenever you like: kill {pid}",
        "step3_failed": "Couldn't start the server (port {port} already in use? try another port, or start it by hand):",
        "step3_manual": "python3 -m http.server {port} --bind 127.0.0.1",
        "step3_skipped": "Ok, no server started. Whenever you like: python3 -m http.server 8931 --bind 127.0.0.1",
        "done_title": "=== Done ===",
        "done_body": (
            "Keep at least one interactive Claude Code session open: it's the only way\n"
            "claude-monitor receives fresh data (see README.md, \"How it works\").\n"
            "The dashboard shows a red \"Stream not connected\" banner whenever data is\n"
            "missing or more than 20 minutes old — it clears itself once fresh data arrives."
        ),
        "lang_prompt": "Lingua / Language [it/en] (it): ",
        "interrupted": "\nInterrupted. No further steps were run.",
    },
}


def ask_lang():
    for arg in sys.argv[1:]:
        if arg in ("--lang=it", "--it"):
            return "it"
        if arg in ("--lang=en", "--en"):
            return "en"
    answer = input(STRINGS["it"]["lang_prompt"]).strip().lower()
    return "en" if answer.startswith("en") else "it"


def ask_yes_no(prompt, default_yes):
    suffix = "y/N" if not default_yes else "Y/n"
    answer = input(prompt).strip().lower()
    if not answer:
        return default_yes
    return answer.startswith("y")


def ask_port(t):
    answer = input(t["step3_port"] + f" [{DEFAULT_PORT}]: ").strip()
    if not answer:
        return DEFAULT_PORT
    try:
        return int(answer)
    except ValueError:
        return DEFAULT_PORT


def run_script(name):
    subprocess.run([sys.executable, os.path.join(SCRIPT_DIR, name)], check=False)


def start_server(t, port):
    print(t["step3_starting"].format(port=port))
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", str(port), "--bind", "127.0.0.1"],
        cwd=SCRIPT_DIR,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
        text=True,
    )
    time.sleep(0.6)
    if proc.poll() is not None:
        # died immediately, most likely the port is already taken
        _, stderr = proc.communicate()
        print(t["step3_failed"].format(port=port))
        if stderr:
            print(stderr.strip())
        print(t["step3_manual"].format(port=port))
        return
    print(t["step3_started"].format(pid=proc.pid))
    print(t["step3_stop"].format(pid=proc.pid))
    try:
        webbrowser.open(f"http://localhost:{port}/")
    except Exception:
        pass


def main():
    lang = ask_lang()
    t = STRINGS[lang]
    try:
        print()
        print(t["welcome"])
        print()
        print(t["intro"])

        print()
        print(t["step1_title"])
        run_script("install-statusline.py")

        print()
        print(t["step2_title"])
        if ask_yes_no(t["step2_ask"], default_yes=False):
            run_script("configure-slots.py")
        else:
            print(t["step2_skip"])

        print()
        print(t["step3_title"])
        print(t["step3_has_server"])
        if ask_yes_no(t["step3_ask"], default_yes=True):
            port = ask_port(t)
            start_server(t, port)
        else:
            print(t["step3_skipped"])

        print()
        print(t["done_title"])
        print(t["done_body"])
    except KeyboardInterrupt:
        print(t["interrupted"])


if __name__ == "__main__":
    main()

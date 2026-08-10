#!/usr/bin/env python3
"""Wires this project's statusline.py into the user's Claude Code statusLine hook
(~/.claude/settings.json), so data/state.json starts receiving live rate-limit data.

Claude Code only exposes rate-limit usage through that hook — there is no other way
to get it (see README). Because of that, statusline.py always has to be the configured
statusLine command. What it PRINTS to the terminal is a separate, independent choice:
by default it keeps showing whatever your terminal showed before (this script detects
and preserves that), so installing claude-monitor doesn't change your terminal's look
unless you explicitly ask it to.

Safe to run on any machine/user: paths are resolved relative to this script and to
the user's home directory, nothing is hardcoded. Backs up the existing settings file
before changing it, and asks for confirmation before replacing an existing statusLine
command that isn't already ours.
"""
import glob
import json
import os
import shutil
import sys
import time

SETTINGS_PATH = os.path.expanduser("~/.claude/settings.json")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STATUSLINE_PATH = os.path.join(SCRIPT_DIR, "statusline.py")
DISPLAY_CONFIG_PATH = os.path.join(SCRIPT_DIR, "data", "display-config.json")
REFRESH_INTERVAL = 15

NEW_COMMAND = {
    "type": "command",
    "command": "python3 " + STATUSLINE_PATH,
    "refreshInterval": REFRESH_INTERVAL,
}


def is_ours(command):
    return isinstance(command, dict) and command.get("command", "").strip() == NEW_COMMAND["command"]


def find_previous_command_from_backups():
    """Se statusLine punta già a noi ma non esiste ancora data/display-config.json (es. questo
    script è già stato eseguito prima che questa scelta esistesse), prova a recuperare il comando
    originale dal backup più recente creato dall'esecuzione precedente."""
    for path in sorted(glob.glob(SETTINGS_PATH + ".bak-*"), reverse=True):
        try:
            with open(path) as f:
                backup = json.load(f)
        except Exception:
            continue
        cmd = backup.get("statusLine")
        if cmd and not is_ours(cmd):
            return cmd.get("command"), path
    return None, None


def choose_display_mode(previous_command_str):
    print()
    print("Claude Code only exposes usage data through its statusLine hook, so")
    print("claude-monitor has to be that hook to receive it. What it PRINTS in your")
    print("terminal is a separate choice:")
    print()
    if previous_command_str:
        print("  [1] Keep showing what your terminal shows today (recommended)")
        print("      Found: " + previous_command_str)
    else:
        print("  [1] Show nothing extra, same as before (recommended — no statusline was configured)")
    print("  [2] Show claude-monitor's usage bar in the terminal instead")
    print()
    answer = input("Choice [1]: ").strip()
    return "bar" if answer == "2" else "passthrough"


def save_display_config(mode, original_command):
    os.makedirs(os.path.dirname(DISPLAY_CONFIG_PATH), exist_ok=True)
    with open(DISPLAY_CONFIG_PATH, "w") as f:
        json.dump({"mode": mode, "original_command": original_command}, f, indent=2)
        f.write("\n")


def main():
    if not os.path.isfile(STATUSLINE_PATH):
        sys.exit("statusline.py not found at " + STATUSLINE_PATH)

    settings = {}
    if os.path.isfile(SETTINGS_PATH):
        with open(SETTINGS_PATH) as f:
            settings = json.load(f)

    current = settings.get("statusLine")
    already_wired = is_ours(current)
    display_config_exists = os.path.isfile(DISPLAY_CONFIG_PATH)

    if already_wired and display_config_exists:
        print("Already wired up, nothing to do.")
        return

    print("Claude Code settings file: " + SETTINGS_PATH)

    previous_command_str = None
    if already_wired:
        previous_command_str, backup_path = find_previous_command_from_backups()
        if previous_command_str:
            print("Recovered your pre-claude-monitor statusLine command from " + backup_path)
    else:
        if current:
            previous_command_str = current.get("command")
            print("Current statusLine command:")
            print(json.dumps(current, indent=2))
        print("New statusLine command:")
        print(json.dumps(NEW_COMMAND, indent=2))
        if current and "--force" not in sys.argv:
            answer = input(
                "This will replace the statusLine command above so claude-monitor can "
                "receive data (the next question lets you keep the same terminal output "
                "regardless). Continue? [y/N] "
            )
            if answer.strip().lower() != "y":
                print("Aborted, nothing changed.")
                return

    mode = choose_display_mode(previous_command_str)

    if not already_wired:
        if os.path.isfile(SETTINGS_PATH):
            backup_path = SETTINGS_PATH + ".bak-" + str(int(time.time()))
            shutil.copy2(SETTINGS_PATH, backup_path)
            print("Backed up existing settings to " + backup_path)

        settings["statusLine"] = NEW_COMMAND
        os.makedirs(os.path.dirname(SETTINGS_PATH), exist_ok=True)
        with open(SETTINGS_PATH, "w") as f:
            json.dump(settings, f, indent=2)
            f.write("\n")

    save_display_config(mode, previous_command_str)

    print()
    if mode == "passthrough":
        print("Done. Your terminal will keep showing what it showed before.")
    else:
        print("Done. Your terminal will show claude-monitor's usage bar.")
    print("Restart any open Claude Code session (or wait for the next statusline refresh) to pick up the change.")


if __name__ == "__main__":
    main()

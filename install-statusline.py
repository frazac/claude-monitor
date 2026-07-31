#!/usr/bin/env python3
"""Wires this project's statusline.py into the user's Claude Code statusLine hook
(~/.claude/settings.json), so data/state.json starts receiving live rate-limit data.

Safe to run on any machine/user: paths are resolved relative to this script and to
the user's home directory, nothing is hardcoded. Backs up the existing settings file
and asks for confirmation before overwriting an existing statusLine command.
"""
import json
import os
import shutil
import sys
import time

SETTINGS_PATH = os.path.expanduser("~/.claude/settings.json")
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
STATUSLINE_PATH = os.path.join(SCRIPT_DIR, "statusline.py")
REFRESH_INTERVAL = 15

NEW_COMMAND = {
    "type": "command",
    "command": "python3 " + STATUSLINE_PATH,
    "refreshInterval": REFRESH_INTERVAL,
}


def main():
    if not os.path.isfile(STATUSLINE_PATH):
        sys.exit("statusline.py not found at " + STATUSLINE_PATH)

    settings = {}
    if os.path.isfile(SETTINGS_PATH):
        with open(SETTINGS_PATH) as f:
            settings = json.load(f)

    current = settings.get("statusLine")
    if current == NEW_COMMAND:
        print("Already wired up, nothing to do.")
        return

    print("Claude Code settings file: " + SETTINGS_PATH)
    if current:
        print("Current statusLine command:")
        print(json.dumps(current, indent=2))
    print("New statusLine command:")
    print(json.dumps(NEW_COMMAND, indent=2))

    if current and "--force" not in sys.argv:
        answer = input("This will REPLACE your current statusLine command. Continue? [y/N] ")
        if answer.strip().lower() != "y":
            print("Aborted, nothing changed.")
            return

    if os.path.isfile(SETTINGS_PATH):
        backup_path = SETTINGS_PATH + ".bak-" + str(int(time.time()))
        shutil.copy2(SETTINGS_PATH, backup_path)
        print("Backed up existing settings to " + backup_path)

    settings["statusLine"] = NEW_COMMAND
    os.makedirs(os.path.dirname(SETTINGS_PATH), exist_ok=True)
    with open(SETTINGS_PATH, "w") as f:
        json.dump(settings, f, indent=2)
        f.write("\n")

    print("Done. Restart any open Claude Code session (or wait for the next statusline refresh) to pick up the change.")


if __name__ == "__main__":
    main()

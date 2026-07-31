# Claude Monitor Limes

A small local dashboard that tracks your Claude Code usage against Anthropic's weekly
and 5-hour rate limits, and lets you plan your work slots around them.

## How it works

Claude Code exposes rate-limit usage (`five_hour` / `seven_day` percentages) only
through its **statusline hook** — there is no separate API or CLI command to query it
on demand. `statusline.py` is designed to be that hook: every time Claude Code
re-renders its statusline (on a new response, on session start, or every
`refreshInterval` seconds while idle), it receives the current rate-limit data on
stdin, prints a compact status line for the terminal, and writes a snapshot to
`data/state.json`. The web dashboard (`index.html`) just polls that file.

**Limitation, inherent to how Claude Code works, not a bug in this project:** the file
only updates while at least one interactive Claude Code session is open. If every
terminal is closed, the last known percentages go stale. The dashboard shows a
staleness warning in that case (⚠, once the data is more than 20 minutes old) instead
of silently displaying an outdated number.

## Setup

1. `python3 install-statusline.py` — wires `statusline.py` into your
   `~/.claude/settings.json` as the `statusLine` command. Backs up your previous
   settings file first, and asks for confirmation before replacing an existing
   `statusLine` command.
2. Serve the dashboard locally, e.g. `python3 -m http.server 8931` from this folder,
   then open `http://localhost:8931/`.
3. Open (or keep open) a Claude Code session — the dashboard updates as Claude Code
   refreshes its statusline (every 15s while idle, immediately on each response).

## Requirements

- Python 3
- Claude Code, with statusline hook support (`statusLine` in `~/.claude/settings.json`)

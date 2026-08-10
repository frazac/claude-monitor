# Claude Monitor Limes

*[Italian version] [Leggi questo testo in lingua italiana.](README.it.md)*

A small local dashboard that tracks your Claude Code usage against Anthropic's weekly
and 5-hour rate limits, and lets you plan your work slots around them.

## How it works

Claude Code exposes rate-limit usage (`five_hour` / `seven_day` percentages) only
through its **statusline hook** — there is no separate API or CLI command to query it
on demand. `statusline.py` is designed to be that hook: every time Claude Code
re-renders its statusline (on a new response, on session start, or every
`refreshInterval` seconds while idle), it receives the current rate-limit data on
stdin, prints a compact status line for the terminal, and writes a snapshot to
`data/state.json`. The web dashboard (`index.html`) just reads that file and displays
it — it never talks to Claude Code or Anthropic directly.

**Limitation, inherent to how Claude Code works, not a bug in this project:** the file
only updates while at least one interactive Claude Code session is open. If every
terminal is closed, the last known percentages go stale. The dashboard makes this
visible instead of silently showing an outdated number: a red banner at the top reads
"Stream not connected" whenever there's no data yet or the data is more than 20
minutes old, with the exact command to fix it; it turns green ("Stream connected")
as soon as fresh data comes in.

## Setup

1. **Wire up the data source.** Run `python3 install-statusline.py` from this folder.
   It edits your `~/.claude/settings.json` so Claude Code's `statusLine` hook points
   at `statusline.py` — that's the only way to receive usage data (see "How it works"
   above), so this step is mandatory. It backs up your previous settings file first,
   and asks for confirmation before replacing an existing `statusLine` command, so
   it's safe to run even if you already had one configured.

   It will then ask a **separate** question: what should your terminal show? By
   default (just press Enter) it keeps showing exactly what it showed before —
   `statusline.py` runs your previous command behind the scenes and prints its output
   unchanged, while still writing `data/state.json` for the dashboard. Answer `2` if
   you'd rather see claude-monitor's usage bar in the terminal instead. This choice is
   saved in `data/display-config.json` and can be changed any time by re-running the
   script.
2. **Open the dashboard in a browser.** `index.html` is a static file, but browsers
   block it from loading `data/state.json` correctly when opened directly (`file://`),
   so it needs to be served over HTTP. Two ways to do that:
   - **You already run a local/personal web server** (e.g. MAMP, XAMPP, `nginx`,
     VS Code's Live Server extension): point it at this folder and open the URL it
     gives you.
   - **You don't have one set up**: Python already includes a minimal one. From this
     folder, run:
     ```
     python3 -m http.server 8931
     ```
     then open `http://localhost:8931/` in your browser. Leave that terminal running
     for as long as you want to use the dashboard; press `Ctrl+C` there to stop it.
3. **Keep a Claude Code session open.** The dashboard only shows live numbers while
   at least one interactive Claude Code terminal is open — see "How it works" above.
   It refreshes on its own every 15 seconds while idle, and immediately after every
   response.

## Requirements

- Python 3
- Claude Code, with statusline hook support (`statusLine` in `~/.claude/settings.json`)

# Claude Monitor Limes

*[English version] [Read this text in English.](README.md)*

Una piccola dashboard locale che mostra l'uso di Claude Code rispetto ai limiti
settimanali e alle 5 ore di Anthropic, e ti permette di pianificare i tuoi slot di
lavoro attorno a quei limiti.

## Come funziona

Claude Code espone i dati di utilizzo (percentuali `five_hour` / `seven_day`) solo
tramite il suo **hook della statusline** — non esiste un'API o un comando CLI separato
per interrogarli on demand. `statusline.py` è pensato per essere proprio quell'hook:
ogni volta che Claude Code ridisegna la sua statusline (a una nuova risposta, all'avvio
di una sessione, o ogni `refreshInterval` secondi mentre è inattiva), riceve i dati di
utilizzo correnti su stdin, stampa una riga di stato compatta per il terminale, e
scrive uno snapshot in `data/state.json`. La dashboard web (`index.html`) si limita a
leggere quel file e a mostrarlo — non parla mai direttamente con Claude Code o con
Anthropic.

**Limite strutturale, dovuto a come funziona Claude Code, non un bug di questo
progetto:** il file si aggiorna solo mentre almeno una sessione Claude Code
interattiva è aperta. Se chiudi tutti i terminali, le ultime percentuali note restano
ferme. La dashboard lo rende visibile invece di mostrare in silenzio un numero
vecchio: un banner rosso in cima dice "Stream non collegato" ogni volta che non ci
sono ancora dati o i dati hanno più di 20 minuti, con il comando esatto per
sistemarlo; diventa verde ("Stream collegato") appena arrivano dati freschi.

## Setup

1. **Collega la fonte dei dati.** Lancia `python3 install-statusline.py` da questa
   cartella. Modifica il tuo `~/.claude/settings.json` in modo che l'hook `statusLine`
   di Claude Code punti a `statusline.py` — è l'unico modo per ricevere i dati di
   utilizzo (vedi "Come funziona" sopra), quindi questo passo è obbligatorio. Fa prima
   un backup del tuo file di configurazione esistente, e chiede conferma prima di
   sostituire un comando `statusLine` già presente — è sicuro da lanciare anche se ne
   avevi già uno configurato.

   Dopodiché farà una domanda **separata**: cosa deve mostrare il tuo terminale? Di
   default (basta premere Invio) continua a mostrare esattamente quello che mostrava
   prima — `statusline.py` richiama il tuo comando precedente dietro le quinte e ne
   stampa l'output invariato, scrivendo comunque `data/state.json` per la dashboard.
   Rispondi `2` se preferisci vedere invece la barra di utilizzo di claude-monitor nel
   terminale. Questa scelta viene salvata in `data/display-config.json` e può essere
   cambiata in qualsiasi momento rilanciando lo script.
2. **Apri la dashboard nel browser.** `index.html` è un file statico, ma i browser
   bloccano il caricamento corretto di `data/state.json` se lo apri direttamente
   (`file://`), quindi va servito via HTTP. Due modi per farlo:
   - **Hai già un server web locale/personale** (es. MAMP, XAMPP, `nginx`,
     l'estensione Live Server di VS Code): puntalo su questa cartella e apri l'URL
     che ti restituisce.
   - **Non ne hai uno configurato**: Python ne include già uno minimale. Da questa
     cartella lancia:
     ```
     python3 -m http.server 8931
     ```
     poi apri `http://localhost:8931/` nel browser. Lascia quel terminale aperto per
     tutto il tempo in cui vuoi usare la dashboard; premi `Ctrl+C` in quella finestra
     per fermarlo.
3. **Tieni aperta una sessione Claude Code.** La dashboard mostra numeri live solo
   mentre almeno un terminale Claude Code interattivo è aperto — vedi "Come funziona"
   sopra. Si aggiorna da sola ogni 15 secondi mentre è inattiva, e subito dopo ogni
   risposta.

## Requisiti

- Python 3
- Claude Code, con supporto all'hook della statusline (`statusLine` in
  `~/.claude/settings.json`)

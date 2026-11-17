# djnitanova.de

Statische Website für **DJ Nita Nova** (Hochzeits- & Event-DJ, Berlin). Umgesetzt aus dem Design-Board „C Editorial“. Kein Build-Schritt: Der Ordner `site/` ist die fertige Seite (Cloudflare Pages, Output-Verzeichnis `site`).

```
site/            fertige Seite (wird deployt)
  index.html     Startseite, Texte werden hier von Hand gepflegt
  impressum/  datenschutz/  404.html     Rechtstexte (Stand Nov. 2026, Anitas Angaben), offene Punkte als [[BITTE PRÜFEN]]
  css/           site.css (Board-CSS + Ergänzungen), fonts.css
  js/            main.js (Logik), data.js (Playlists, Line-ups, Artists, Videos), have.js (automatisch)
  fonts/ img/ video/   selbst gehostete Schriften, Bilder, Konditionen-Loop
  _headers  _redirects  robots.txt  sitemap.xml  site.webmanifest  Icons
source/          Rohdateien und das Original-Board (wird nicht deployt)
tools/           Werkzeuge (siehe unten)
tests/           Playwright-Tests (node tests/run.mjs)
```

## Pflege

- **Texte ändern:** direkt in `site/index.html` (Suchen & Ersetzen). Die Inline-Styles sind Absicht (die Mobil-Regeln in `css/site.css` überschreiben sie mit `!important`).
- **Playlists, Tracks, Line-ups, Artist-Bios, Video-IDs:** `site/js/data.js`. Eine Artist-Bio, die mit `[` beginnt, wird nicht angezeigt. Echte Bio einsetzen, dann erscheint sie.
- **Bilder tauschen:** Geänderte Bilder bekommen immer einen **neuen Dateinamen** (z. B. `sax-2.webp`), sonst zeigt der Browser wegen des langen Caches (`/img/*`: 30 Tage) noch das alte Bild. Den Namen in `data.js` bzw. `index.html` anpassen.
- **Optionale Bilder** (Video-Thumbnails, Playlist-Cover, Instagram-Kacheln, Piano-Foto; Thumbnails, Cover und Piano-Foto sind bereits eingebaut): Rohdatei nach `source/assets/…` legen (siehe Kopf von `tools/optimize_assets.py`), dann `python3 tools/optimize_assets.py`. Das Skript erzeugt WebP und schreibt `site/js/have.js`. Nur Bilder, die dort stehen, werden geladen; fehlt ein Bild, bleibt der Verlaufs-Hintergrund aus dem Design.
- `tools/convert_chic.py` ist ein **Einmal-Konverter** (Board → `site/index.html`). Nicht erneut ausführen, sonst werden Handänderungen an `index.html` überschrieben (ohne `--write` schreibt es nur nach `build/`).
- `tools/fetch_remote.sh` lädt die 6 YouTube-Thumbnails und 6 Spotify-Cover einmal herunter (Anita auf ihrem Rechner; im Container ist das Netz blockiert).

## Tests

```bash
npm install                       # axe-core, html-validate (Playwright + Chrome müssen vorhanden sein)
node tests/run.mjs                # startet selbst einen Server auf :4173 (wertet _headers inkl. CSP aus)
npx html-validate site/index.html site/impressum/index.html site/datenschutz/index.html site/404.html
node tools/check_previews.mjs     # prüft die Spotify-Hörproben (braucht Netz, läuft wöchentlich als GitHub-Action)
```

YouTube, Spotify und Formspree werden in den Tests gemockt (`page.route`). Screenshots landen in `tests/shots/` (nicht im Git).

## Bewusste Entscheidungen / Abweichungen vom Board

- **Hero-YouTube-Video bleibt (Wunsch von Anita):** stummes Autoplay-Loop-Video (`zmBi-acoRCk` ist ein **Platzhalter**) über `youtube-nocookie.com` rechts im Hero, graustufig mit Korall-Overlay wie im Board. Es lädt nach dem `load`-Event, **ohne Klick**. Bei „Bewegung reduzieren“ und Datensparmodus wird es nicht geladen (dann nur Verlauf). **Offener Punkt für Anita (Datenschutz):** Ein Autoplay-Iframe überträgt schon beim Seitenaufruf die IP an Google, ohne Einwilligung (§ 25 TDDDG, DSGVO; Muster: Google-Fonts-Abmahnwelle 2022). Außerdem ca. 1 MB JavaScript von YouTube. Empfehlung: das Video als stummen MP4/WebM-Loop selbst hosten (Befehle: `ffmpeg … hue=s=0 …` siehe Bauplan AP2). Der Hinweis steht auch rot im Datenschutz-Entwurf.
- **YouTube-Videos und Spotify-Hörproben nur nach Klick** (Hinweis + „Video laden“ / „Abspielen“, optional „immer“ gemerkt in `localStorage`; „Einwilligungen zurücksetzen“ im Footer).
- **Keine Remote-Bilder:** Thumbnails (WebP 960 px) und Playlist-Cover (WebP 300 px, quadratisch zugeschnitten) liegen lokal in `img/thumbs`, `img/covers`; fehlt eine Datei, bleibt der Board-Verlauf.
- **Piano-Foto (Wido Kim):** Das Instagram-Profilbild hat nur 150×150 px. Es wurde mit Lanczos auf 600×600 hochskaliert, leicht weichgezeichnet und mit demselben Koralle/Orange-Duotone wie die anderen Artist-Fotos versehen (`tools/optimize_assets.py`, `source/assets/duotone-clut.png`); Ausschnitt links-mittig (`pos: 36% 50%`). **Ein höher aufgelöstes Foto von Wido Kim wäre deutlich besser** (≥ 800×800 px als `source/assets/wido-profile150.jpg` ersetzen bzw. Skript anpassen, neuen Dateinamen vergeben).
- **Instagram statisch:** 6 Kacheln verlinken aufs Profil. **Stimmen:** die grauen Platzhalter-Karten sind per `hidden` ausgeblendet (Kommentar im HTML), die linke Spalte („5,0“ …) bleibt.
- **Overlays als `<dialog>`** (ESC, Fokusfalle, inerter Hintergrund). Beim Anfrage-Formular schließt ein Klick auf die Karte nicht.
- **Anfrage-Buttons** auf den Flip-Karten und bei den Line-ups öffnen das Formular (Anlass bzw. Line-up vorbelegt; `mailto:` bleibt als Fallback ohne JavaScript).
- **Formular → Formspree** (`https://formspree.io/f/xvkaaqqd`), Honeypot `_gotcha`, Zeitfalle (< 3 s: nicht gesendet, Hinweis), Entwurf in `sessionStorage`. Native Browser-Pflichtfeldprüfung statt `novalidate`. Formular-Kontrast nach WCAG AA angepasst (dunkle Schrift auf Korall).
- **Mobil:** Die drei Live-Gesang-Videos bleiben auf dem Handy dreispaltig (statt drei bildschirmhoher Karten), die Line-up- und Playlist-Schriften sind verkleinert.
- Footer-Links → `/datenschutz/`, `/impressum/`. Kanonische Domain `https://www.djnitanova.de`.
- Laufband hat einen Pause-Knopf (WCAG 2.2.2). Skip-Link, h1 („Hochzeits- & Event-DJ aus Berlin mit Live-Gesang.“), JSON-LD (EntertainmentBusiness, Person, WebSite; bewusst **ohne** `aggregateRating` und ohne `FAQPage`).

## Platzhalter und Übergangstexte (öffentlich sichtbar, Freigabe durch Anita)

| Stelle | Übergangstext |
|---|---|
| „Zusatzstunde [PREIS] €“ (2×, Flip-Karten) | „Zusatzstunde“ (keine Preise) |
| Ablauf 01 | „Ich melde mich zeitnah persönlich bei dir.“ (statt „innerhalb von [X] Tagen“) |
| FAQ Kosten | „Jede Feier ist anders: Nach dem Vorgespräch bekommst du ein individuelles Angebot.“ |
| FAQ Vorlauf, FAQ außerhalb Berlins | Klammer-Platzhalter gestrichen |
| FAQ Anzahlung | „… Details zu Anzahlung und Storno bekommst du mit dem Angebot.“ |
| Artist-Bios (4×) | ausgeblendet, bis echte Texte in `data.js` stehen |
| Piano-Foto (Wido Kim) | 150-px-Profilbild hochskaliert (siehe oben) |
| Impressum / Datenschutz | Anitas Daten eingetragen; offene Punkte als `[[BITTE PRÜFEN: …]]` rot markiert, **müssen vor dem Go-Live raus** (Formspree-DPA/Speicherdauer, Cloudflare-DPF, Löschfrist Anfragen, Hero-Video-Entscheidung, Bildnachweise) |

## Anitas Checkliste

**Erledigt**
- Thumbnails (6), Playlist-Cover (6) und Piano-Foto eingebaut. Tippfehler im Seitentext korrigiert (Anita hat es erlaubt). Impressum und Datenschutz neu geschrieben (Stand November 2026, Name/Anschrift/Telefon eingetragen, Kleinunternehmerin § 19 UStG).

**Offen: liefern**
1. Entscheidung zum Hero-Video (siehe oben) und ggf. die Originaldatei (15–20 s).
2. Titel der 3 Live-Gesang-Videos (statt „Live Gesang 1–3“).
3. Playlist-Cover: besser eigene Grafiken (Spotify-Mosaik-Cover zeigen fremde Albumcover, urheberrechtlich heikel).
4. Höher aufgelöstes Foto von Wido Kim, 4 Artist-Bios, ggf. Homepage-Links statt Instagram-Links.
5. Echte Rezensions-Zitate (3–6, Vorname + Anlass); bestätigen, dass „5,0 / 9 Google-Rezensionen“ noch stimmt.
6. 6 Instagram-Bilder (optional) oder Entscheidung für Elfsight.
7. Rechtstexte: alle `[[BITTE PRÜFEN]]` klären (Formspree-DPA akzeptieren, Speicherdauer, Cloudflare-DPA/DPF, Löschfrist unbeantworteter Anfragen, Bildnachweise); mit eRecht24 / Dr. Schwenke abgleichen oder anwaltlich prüfen lassen. Cloudflare Web Analytics im Pages-Projekt ausgeschaltet lassen (sonst stimmt „kein Tracking“ nicht). Bestätigen, dass die Privatanschrift öffentlich im Impressum stehen darf (bei Gewerbe nötig, kein Postfach).

**Freigeben**
- Übergangstexte (Tabelle oben), 404-Text („Hier läuft gerade kein Song.“), Erlaubnis, die Partnerlogos zu zeigen.
- Line-up-Abgleich: früher „DJ + Vocals + Saxophon“, Chor als Extra; im Board „DJ + Chor“ und „DJ + Technik“. Artist-Links: Homepages statt Instagram?
- Aussage „Über 15 Jahre Erfahrung“.

**Tippfehler:** am 17.11.2026 mit Anitas Erlaubnis korrigiert („Nita..“ → „Nita.“, „Event-& Hochzeits DJ“ → „Event- & Hochzeits-DJ“, „Psychologie Wissen“, „BLuetooth“, „Wlan“, „0,70 cm“ → „70 cm“, „zu jedem Paket“ u. a.). Bewusst belassen: „im knospigen Alter von 10“, „Do's & Don'ts“.

## Deployment (Cloudflare Pages)

Lokal ist alles fertig und getestet. Folgendes macht Anita (Claude hat nichts gepusht oder eingerichtet):

1. **GitHub:** leeres privates Repo `djnitanova-website` anlegen, dann im Projektordner `git remote add origin <URL> && git push -u origin main`.
2. **Cloudflare Pages:** Workers & Pages → Create → Pages → Connect to Git → Repo wählen. Framework „None“, Build-Befehl leer, Output-Verzeichnis `site` → Deploy. `djnitanova.pages.dev` testen (trägt automatisch `X-Robots-Tag: noindex`). Bietet das Dashboard nur „Workers“ an: Import Repository mit Assets-Verzeichnis `site` (`_headers` funktioniert dort ebenfalls).
3. **Formspree:** Zieladresse bestätigen, Domain-Beschränkung auf `djnitanova.de` (falls im Tarif), reCAPTCHA ausschalten (würde Google laden und die AJAX-Absendung stören), DPA akzeptieren. Gratis-Tarif: 50 Anfragen/Monat.
4. **DNS zu Cloudflare** (nötig für Email Routing; Domain bleibt bei INWX): Cloudflare → Add site `djnitanova.de` (Free). **Vorher bei INWX DNSSEC deaktivieren.** Bei INWX die 2 Cloudflare-Nameserver eintragen, warten bis „Active“.
5. **Pages → Custom domains:** `www.djnitanova.de` und `djnitanova.de` hinzufügen. Unter Rules → Redirect Rules „Root → WWW“ (301, Pfad und Query behalten).
6. **Email Routing:** aktivieren, MX/SPF übernehmen, Ziel `djnitanova@gmail.com` bestätigen, Adresse (`hallo@`/`booking@`) anlegen, optional `_dmarc` TXT `v=DMARC1; p=none`, Testmail. „Senden als“ aus Gmail braucht einen SMTP-Server (nicht Teil von Cloudflare): Antworten gehen vorerst von Gmail raus. Erst nach erfolgreichem Test entscheiden, ob auf der Seite `hallo@djnitanova.de` statt der Gmail-Adresse stehen soll.
7. **onepage.me:** prüfen, welche URL auf den Visitenkarten steht. Steht dort `djnitanova.onepage.me`: onepage **nicht kündigen**, solange die Karten im Umlauf sind; Inhalt durch großen Link „Neue Website: www.djnitanova.de“ ersetzen (oder Weiterleitung). Neue Karten mit `djnitanova.de` drucken.
8. **Danach:** Google Search Console (Domain-Property per DNS-TXT, Sitemap `https://www.djnitanova.de/sitemap.xml` einreichen), Website-URL im Google-Unternehmensprofil, Instagram-Bio und YouTube ändern, DNSSEC über Cloudflare wieder einschalten (DS-Eintrag bei INWX).

**Abnahme live (Anita):** iPhone Safari und Android Chrome (Hero, Flip-Karten, Overlays, Menü) · echtes YouTube-Video und echte Spotify-Hörprobe · echte Formular-Anfrage (Mail kommt an) · WhatsApp-Linkvorschau (og-Bild) · Platzhalter in Impressum/Datenschutz gefüllt · `https://djnitanova.de` leitet per 301 auf `https://www.djnitanova.de/` · Header-Check zeigt die CSP.

## Bekannte Risiken

- **Spotify-Hörproben (`p.scdn.co`):** Spotify hat `preview_url` für neue API-Apps abgekündigt; die Hash-URLs können jederzeit verschwinden (Hotlinking ist grenzwertig). Gegenmaßnahmen: Laden nur nach Klick, freundliche Fehlermeldung, wöchentlicher Check (`.github/workflows/check-previews.yml`), Link „Ganze Playlist auf Spotify“.
- **Performance:** viele `backdrop-filter`/`mix-blend-mode`-Flächen; Kondi-Videos laufen nur im Sichtbereich. Auf älteren Handys prüfen.
- **Rechtstexte sind Entwürfe**, keine Rechtsberatung. Steuernummer, Identifikationsnummer und Finanzamt stehen bewusst **nicht** im Impressum.

/* djnitanova.de – Vanilla-JS, keine Abhaengigkeiten.
   Module: dialogs, reels, flip, lineups, playlists, faq, nav, media, marquee, consent, form.
   Ein einziger Klick-Listener am document verteilt per data-action. */
(function () {
  'use strict';
  var D = document, W = window;
  function $(s, r) { return (r || D).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); }
  var reduced = !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion:reduce)').matches);
  var NN = W.NN || null;
  var HAVE = W.NN_HAVE || [];
  function have(p) { return HAVE.indexOf(String(p).replace(/^\//, '')) > -1; }

  function store(kind) {
    return {
      get: function (k) { try { return W[kind].getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { W[kind].setItem(k, v); } catch (e) { /* privat/blockiert */ } },
      del: function (k) { try { W[kind].removeItem(k); } catch (e) { /* ignore */ } },
      keys: function () { try { return Object.keys(W[kind]); } catch (e) { return []; } }
    };
  }
  var LS = store('localStorage'), SS = store('sessionStorage');
  var BLANK = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function restart(el, remove, add) { el.classList.remove.apply(el.classList, remove); void el.offsetWidth; el.classList.add(add); }

  /* ------------------------------------------------------------ dialogs */
  var Dlg = {
    open: function (id, opener) {
      var d = typeof id === 'string' ? D.getElementById(id) : id;
      if (!d || d.open) return;
      d._opener = opener || D.activeElement;
      d._closing = false;
      d.classList.remove('is-closing');
      d.showModal();
      d.classList.add('is-open');
      D.documentElement.classList.add('has-modal');
      d.scrollTop = 0;
    },
    close: function (d) {
      if (typeof d === 'string') d = D.getElementById(d);
      if (!d || !d.open || d._closing) return;
      d._closing = true;
      if (d.id === 'reel') { var f = $('#reel-iframe'); if (f) f.src = 'about:blank'; }
      var done = false;
      function fin() {
        if (done) return; done = true;
        d.classList.remove('is-open', 'is-closing');
        d._closing = false;
        d.close();
        if (!$('dialog[open]')) D.documentElement.classList.remove('has-modal');
        var o = d._opener;
        if (o && o.focus && D.documentElement.contains(o)) { try { o.focus({ preventScroll: true }); } catch (e) { o.focus(); } }
      }
      d.classList.add('is-closing');
      if (reduced) { fin(); return; }
      var card = $('.dlg-card', d);
      if (card) card.addEventListener('animationend', function h(e) { if (e.target !== card) return; card.removeEventListener('animationend', h); fin(); });
      setTimeout(fin, 800);
    }
  };
  D.addEventListener('cancel', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('dlg')) { e.preventDefault(); Dlg.close(e.target); }
  }, true);

  /* ------------------------------------------------------------ Anfrage-Formular */
  var Anf = {
    openedAt: 0,
    form: function () { return $('#anf-form'); },
    save: function () {
      var f = Anf.form(); if (!f) return;
      var o = {};
      new FormData(f).forEach(function (v, k) { if (k.charAt(0) !== '_' && k !== 'lineup') o[k] = String(v); });
      SS.set('nn_anfrage', JSON.stringify(o));
    },
    restore: function () {
      var f = Anf.form(), raw = SS.get('nn_anfrage'); if (!f || !raw) return;
      try {
        var o = JSON.parse(raw);
        Object.keys(o).forEach(function (k) { var el = f.elements[k]; if (el && !el.value && typeof el.value === 'string') el.value = o[k]; });
      } catch (e) { /* defekter Entwurf */ }
    },
    open: function (opener) {
      var f = Anf.form(); if (!f) return;
      Anf.restore();
      var anlass = opener && opener.getAttribute('data-anlass');
      if (anlass) f.elements.anlass.value = anlass;
      var lu = opener && opener.getAttribute('data-lineup');
      if (lu === 'current') { var t = $('#ln-title'); lu = t ? t.textContent.trim() : ''; }
      f.elements.lineup.value = lu || '';
      f.hidden = false; $('#anf-thanks').hidden = true; $('#anf-err').hidden = true;
      var b = $('#anf-submit'); b.disabled = false; b.textContent = 'Anfrage senden';
      Anf.openedAt = Date.now();
      Dlg.open('anfrage-form', opener);
    },
    thanks: function (name) {
      var f = Anf.form();
      $('#anf-thanks-text').textContent = 'Danke' + (name ? ', ' + name : '') + '!';
      f.hidden = true; $('#anf-thanks').hidden = false;
      var b = $('#anf-thanks button'); if (b) b.focus();
    },
    fail: function (f) {
      var err = $('#anf-err'), b = $('#anf-submit');
      var body = 'Name: ' + f.elements.name.value + '\nDatum: ' + f.elements.datum.value + '\nOrt: ' + f.elements.ort.value +
        '\nAnlass: ' + f.elements.anlass.value + '\n\n' + f.elements.nachricht.value;
      var href = 'mailto:djnitanova@gmail.com?subject=' + encodeURIComponent('Buchungsanfrage djnitanova.de – ' + f.elements.anlass.value) + '&body=' + encodeURIComponent(body);
      err.innerHTML = 'Das hat leider nicht geklappt. Bitte versuche es noch einmal oder schreib mir direkt: <a href="' + esc(href) + '" style="color:#141216">djnitanova@gmail.com</a>';
      err.hidden = false;
      b.disabled = false; b.textContent = 'Anfrage senden';
    },
    submit: function (e) {
      var f = e.target; e.preventDefault();
      var err = $('#anf-err'); err.hidden = true;
      if (f.elements._gotcha.value) { Anf.thanks(f.elements.name.value); return; } /* Bot: stilles Verwerfen, kein Request */
      if (Date.now() - Anf.openedAt < 3000) { err.textContent = 'Einen Moment bitte, dann noch einmal absenden.'; err.hidden = false; return; }
      f.elements._subject.value = 'Buchungsanfrage djnitanova.de – ' + f.elements.anlass.value;
      var b = $('#anf-submit'); b.disabled = true; b.textContent = 'Wird gesendet…';
      fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } }).then(function (r) {
        if (r.ok) { SS.del('nn_anfrage'); var n = f.elements.name.value; f.reset(); Anf.thanks(n); } else { Anf.fail(f); }
      }).catch(function () { Anf.fail(f); });
    }
  };

  /* ------------------------------------------------------------ reels (YouTube nach Klick) */
  var Reels = {
    cur: 0,
    open: function (k, opener) {
      if (!NN) return;
      var r = NN.reels[k], bg = NN.reelBgs[k]; if (!r) return;
      Reels.cur = k;
      $('#reel-title').textContent = r.t;
      $('#reel-card').style.background = bg.g;
      var fr = $('#reel-frame');
      if (r.v) { fr.style.width = 'min(320px,100%)'; fr.style.aspectRatio = '9/16'; fr.style.margin = '0 auto'; }
      else { fr.style.width = ''; fr.style.aspectRatio = '16/9'; fr.style.margin = ''; }
      $('#reel-iframe').src = 'about:blank';
      $('#reel-consent').hidden = false;
      Dlg.open('reel', opener);
      if (LS.get('nn-consent-yt') === '1') Reels.load();
    },
    load: function () {
      var r = NN && NN.reels[Reels.cur]; if (!r) return;
      $('#reel-consent').hidden = true;
      $('#reel-iframe').src = 'https://www.youtube-nocookie.com/embed/' + r.id + '?autoplay=1&rel=0';
    }
  };

  /* ------------------------------------------------------------ flip */
  function flip(btn) {
    var fc = btn.closest('.fc'); if (!fc) return;
    var on = fc.classList.toggle('is-flipped');
    var front = $('.fc-front', fc), back = $('.fc-back', fc);
    if (on) { front.setAttribute('inert', ''); back.removeAttribute('inert'); var z = $('[data-action="flip"]', back); if (z) z.focus({ preventScroll: true }); }
    else { back.setAttribute('inert', ''); front.removeAttribute('inert'); var s = $('[data-action="flip"]', front); if (s) s.focus({ preventScroll: true }); }
  }

  /* ------------------------------------------------------------ lineups */
  /* Deckblatt <-> aufgeschlagene Karte: Ausgangszustand ist das Deckblatt (nichts gewaehlt), Klick auf eine Zeile schlaegt die Karte auf,
     erneuter Klick auf die aktive Zeile oder "Uebersicht" blaettert zurueck. */
  function face(pre, open, w, g) {
    var front = $('#' + pre + '-front'), card = $('#' + pre + '-card');
    front.hidden = open; card.hidden = !open;
    var n = (face[pre] = (face[pre] || 0) + 1) % 2 ? 'a' : 'b';
    restart(w, ['ln-a', 'ln-b'], 'ln-' + n);
    if (open && g) restart(g, ['ln-ga', 'ln-gb'], 'ln-g' + n);
    if (open && W.matchMedia && W.matchMedia('(max-width:720px)').matches) {
      /* Mobil steht die Karte ueber der Liste: bei Bedarf ins Bild holen */
      var p = $('#' + pre + '-panel'), r = p.getBoundingClientRect();
      if (r.top < 0 || r.top > W.innerHeight * 0.6) p.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
  }
  var Ln = { cur: -1 };
  function shine(el) { if (el && !reduced) restart(el, ['is-shine'], 'is-shine'); }
  Ln.rows = function () { $$('.ln-row').forEach(function (b, n) { b.setAttribute('aria-pressed', n === Ln.cur ? 'true' : 'false'); }); };
  Ln.reset = function (focusRow) {
    var prev = Ln.cur; Ln.cur = -1; Ln.rows();
    face('ln', false, $('#ln-w'));
    if (focusRow && prev > -1) { var r = $$('.ln-row')[prev]; if (r) r.focus(); }
  };
  Ln.set = function (i) {
    shine($$('.ln-row')[i]);
    if (!NN) return;
    if (i === Ln.cur) { Ln.reset(false); return; }
    Ln.cur = i; Ln.rows();
    var c = NN.combos[i];
    $('#ln-title').textContent = c.t; $('#ln-desc').textContent = c.d; $('#ln-for').textContent = c.f;
    var box = $('.ln-art'), list = $('.ln-art-list');
    if (c.a.length) {
      list.innerHTML = c.a.map(function (k) {
        var a = NN.artists[k];
        return '<button type="button" class="ln-ab" data-action="artist" data-artist="' + esc(k) + '" aria-haspopup="dialog" style="all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:8px;border:1.5px solid #141216;border-radius:999px;background:rgba(255,255,255,.5);padding:10px 18px;font-weight:600;color:#141216">' +
          esc(a.role + ': ' + a.name) + ' <span aria-hidden="true" style="color:#C9505F">→</span></button>';
      }).join('');
      box.hidden = false;
    } else { box.hidden = true; list.innerHTML = ''; }
    face('ln', true, $('#ln-w'), $('#ln-panel .ln-g'));
  };

  /* ------------------------------------------------------------ artist */
  function openArtist(k, opener) {
    if (!NN) return;
    var a = NN.artists[k]; if (!a) return;
    $('#art-role').textContent = a.role; $('#art-name').textContent = a.name;
    var bio = $('#art-bio'); bio.textContent = a.bio || ''; bio.hidden = !a.bio || a.bio.charAt(0) === '[';
    var img = $('#art-img');
    if (a.photo && have(a.photo)) { img.src = a.photo; img.alt = a.name; img.style.objectPosition = a.pos || '50% 50%'; img.hidden = false; }
    else { img.hidden = true; img.src = BLANK; img.alt = ''; }
    var l = $('#art-link'); l.href = a.url; $('#art-handle').textContent = a.handle;
    $('.i-insta', l).hidden = !a.insta; $('.i-web', l).hidden = !!a.insta;
    Dlg.open('artist', opener);
  }

  /* ------------------------------------------------------------ playlists (Spotify nach Klick) */
  var Pl = { cur: -1, k: -1, pending: -1, sessionOk: false, token: 0, skips: 0, au: null };
  Pl.audio = function () { if (!Pl.au) { Pl.au = new Audio(); Pl.au.preload = 'none'; } return Pl.au; };
  Pl.ok = function () { return Pl.sessionOk || LS.get('nn-consent-spotify') === '1'; };
  Pl.mark = function () {
    $$('.trk-b').forEach(function (b) {
      var on = Number(b.getAttribute('data-k')) === Pl.k;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      $('.i-play', b).toggleAttribute('hidden', on); $('.i-pause', b).toggleAttribute('hidden', !on);
    });
  };
  Pl.err = function (msg) { var e = $('#pl-err'); e.textContent = msg || ''; e.hidden = !msg; };
  Pl.stop = function () { Pl.token++; Pl.k = -1; if (Pl.au) { try { Pl.au.pause(); } catch (e) { /* ignore */ } } Pl.mark(); };
  Pl.render = function () {
    var l = NN.lists[Pl.cur], data = NN.plData[l.id] || [];
    $('#pl-title').textContent = l.title; $('#pl-sub').textContent = l.sub || '';
    $('#pl-link').href = 'https://open.spotify.com/playlist/' + l.id;
    Pl.rows();
    $('#pl-tracks').innerHTML = data.map(function (t, k) {
      return '<button type="button" class="trk-b" data-action="track" data-k="' + k + '" aria-pressed="false" style="all:unset;box-sizing:border-box;position:relative;cursor:pointer;display:flex;align-items:center;gap:16px;width:100%;padding:12px 14px;border-radius:14px;">' +
        '<span style="flex:none;width:46px;height:46px;border-radius:50%;background:linear-gradient(180deg,#F58F77,#D9606B);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 12px rgba(90,20,40,.3),inset 0 2px 0 rgba(255,255,255,.5)">' +
        '<svg class="i-play" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#141216"></path></svg>' +
        '<svg class="i-pause" hidden width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="#141216"></path></svg></span>' +
        '<span style="display:flex;flex-direction:column;gap:2px;min-width:0"><span class="trk-t" style="font-weight:700;line-height:1.2">' + esc(t[0]) + '</span>' +
        '<span class="trk-a" style="color:#4a3a40;line-height:1.25">' + esc(t[1]) + '</span></span></button>';
    }).join('');
    var cover = $('#pl-cover');
    cover.style.backgroundImage = have('img/covers/' + l.id + '.webp') ? 'url(/img/covers/' + l.id + '.webp),linear-gradient(200deg,#FAA68C,#D45F5E)' : '';
    $('#pl-consent').hidden = true; Pl.err('');
  };
  Pl.rows = function () { $$('.pl-row').forEach(function (b, n) { b.setAttribute('aria-pressed', n === Pl.cur ? 'true' : 'false'); }); };
  Pl.reset = function (focusRow) {
    var prev = Pl.cur; Pl.stop(); Pl.cur = -1; Pl.rows(); Pl.pending = -1;
    face('pl', false, $('#pl-w'));
    if (focusRow && prev > -1) { var r = $$('.pl-row')[prev]; if (r) r.focus(); }
  };
  Pl.set = function (i) {
    shine($$('.pl-row')[i]);
    if (!NN) return;
    if (i === Pl.cur) { Pl.reset(false); return; }
    Pl.stop(); Pl.cur = i;
    Pl.render();
    face('pl', true, $('#pl-w'), $('#pl-g'));
  };
  Pl.fail = function (k) {
    var b = $('.trk-b[data-k="' + k + '"]');
    if (b) { b.classList.add('trk-na'); b.setAttribute('aria-label', b.textContent.replace(/\s+/g, ' ').trim() + ' (Hörprobe nicht verfügbar)'); }
    Pl.err('Hörprobe gerade nicht verfügbar – hör dir die ganze Playlist auf Spotify an.');
    var n = k + 1, len = (NN.plData[NN.lists[Pl.cur].id] || []).length;
    if (Pl.skips < 1 && n < len) { Pl.skips++; Pl.play(n); } else { Pl.k = -1; Pl.mark(); }
  };
  Pl.play = function (k) {
    var data = NN.plData[NN.lists[Pl.cur].id] || [], t = data[k]; if (!t) { Pl.k = -1; Pl.mark(); return; }
    var au = Pl.audio(), tok = ++Pl.token, handled = false;
    function bad() { if (handled || tok !== Pl.token) return; handled = true; Pl.fail(k); }
    au.onended = function () { if (tok !== Pl.token) return; if (k + 1 < data.length) { Pl.skips = 0; Pl.play(k + 1); } else { Pl.k = -1; Pl.mark(); } };
    au.onerror = bad;
    try {
      au.src = 'https://p.scdn.co/mp3-preview/' + t[2];
      var pr = au.play();
      if (pr && pr.catch) pr.catch(function (e) { if (e && e.name === 'AbortError') return; if (e && e.name === 'NotAllowedError') { Pl.k = -1; Pl.mark(); return; } bad(); });
    } catch (e) { bad(); return; }
    Pl.k = k; Pl.mark();
  };
  Pl.track = function (k) {
    if (!NN) return;
    if (Pl.k === k) { Pl.stop(); return; }
    Pl.err('');
    if (!Pl.ok()) { Pl.pending = k; var c = $('#pl-consent'); c.hidden = false; var b = $('[data-action="spotify-ok"]', c); if (b) b.focus({ preventScroll: true }); return; }
    Pl.skips = 0; Pl.play(k);
  };

  /* ------------------------------------------------------------ faq */
  function faq(open) {
    var closed = $('#faq-closed'), list = $('#faq-liste'); if (!closed || !list) return;
    closed.hidden = open; list.hidden = !open;
    if (open) { var s = $('summary', list); if (s) s.focus({ preventScroll: true }); }
    else { var t = $('[data-action="faq-toggle"]', closed); if (t) t.focus({ preventScroll: true }); }
  }

  /* ------------------------------------------------------------ Klick-Verteiler */
  var actions = {
    'open-anf': function (t, e) { e.preventDefault(); Anf.open(t); },
    'close-dlg': function (t) { Dlg.close(t.closest('dialog')); },
    'reel': function (t) { Reels.open(Number(t.getAttribute('data-reel')), t); },
    'reel-load': function () { if ($('#reel-always').checked) LS.set('nn-consent-yt', '1'); Reels.load(); },
    'flip': function (t) { flip(t); },
    'combo': function (t) { Ln.set(Number(t.getAttribute('data-i'))); },
    'ln-reset': function () { Ln.reset(true); },
    'pl-reset': function () { Pl.reset(true); },
    'artist': function (t) { openArtist(t.getAttribute('data-artist'), t); },
    'playlist': function (t) { Pl.set(Number(t.getAttribute('data-i'))); },
    'track': function (t) { Pl.track(Number(t.getAttribute('data-k'))); },
    'spotify-ok': function () {
      Pl.sessionOk = true; if ($('#pl-always').checked) LS.set('nn-consent-spotify', '1');
      $('#pl-consent').hidden = true; var k = Pl.pending; Pl.pending = -1; if (k > -1) { Pl.skips = 0; Pl.play(k); }
    },
    'faq-toggle': function () { faq($('#faq-liste').hidden); },
    'faq-open': function () { faq(true); },
    'reset-consent': function (t) {
      LS.keys().filter(function (k) { return k.indexOf('nn-consent-') === 0; }).forEach(function (k) { LS.del(k); });
      Pl.sessionOk = false; var old = t.textContent; t.textContent = 'Zurückgesetzt ✓'; setTimeout(function () { t.textContent = old; }, 2500);
    }
  };
  D.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-action]') : null;
    if (t) { var fn = actions[t.getAttribute('data-action')]; if (fn) fn(t, e); }
    else {
      var fcb = e.target.closest && e.target.closest('.fc.is-flipped');
      if (fcb && !e.target.closest('a,button,input,select,textarea,label,[data-keep]')) flip(fcb);
      var dlg = e.target.closest && e.target.closest('dialog.dlg');
      if (dlg && dlg.getAttribute('data-card-closes') === '1' && e.target.closest('.dlg-card') && !e.target.closest('a,button,iframe,input,select,textarea,label,[data-keep]')) Dlg.close(dlg);
    }
    var m = $('#menu');
    if (m && m.open && (!m.contains(e.target) || e.target.closest('#menu a'))) m.open = false;
  });
  /* Fokusfalle: Tab im offenen Dialog springt von letztem zu erstem Element (und zurueck), statt in die Browser-Leiste */
  D.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var d = $('dialog[open]'); if (!d) return;
    var l = $$('a[href],button,input,select,textarea,iframe,summary,[tabindex]', d).filter(function (el) {
      return !el.disabled && el.type !== 'hidden' && el.tabIndex >= 0 && el.getClientRects().length && !el.closest('[inert],[hidden]');
    });
    if (!l.length) return;
    var a = D.activeElement, i = l.indexOf(a);
    if (i === -1 && !d.contains(a)) { e.preventDefault(); l[0].focus(); }
    else if (!e.shiftKey && a === l[l.length - 1]) { e.preventDefault(); l[0].focus(); }
    else if (e.shiftKey && a === l[0]) { e.preventDefault(); l[l.length - 1].focus(); }
  });
  D.addEventListener('keydown', function (e) { var m = $('#menu'); if (e.key === 'Escape' && m && m.open) { m.open = false; var s = $('summary', m); if (s) s.focus(); } });

  /* ------------------------------------------------------------ nav (Scrollspy) */
  var navMap = { top: 'top', showreels: 'showreels', anlaesse: 'anlaesse', live: 'live', lineups: 'lineups', about: 'about', ablauf: 'about', anfrage: 'anfrage', testimonials: 'testimonials', playlists: 'testimonials', instagram: 'testimonials', faq: 'faq' };
  function setActive(id) {
    $$('[data-nav]').forEach(function (a) {
      var on = a.getAttribute('data-nav') === id;
      a.classList.toggle('is-on', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  function atEnd() { return W.innerHeight + W.scrollY >= D.documentElement.scrollHeight - 4; }
  function initNav() {
    if (!('IntersectionObserver' in W) || !$('#showreels')) return;
    var io = new IntersectionObserver(function (es) {
      if (atEnd()) { setActive('faq'); return; }
      es.forEach(function (en) { if (en.isIntersecting && navMap[en.target.id]) setActive(navMap[en.target.id]); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(navMap).forEach(function (id) { var el = D.getElementById(id); if (el) io.observe(el); });
    /* Die FAQ ist kurz und steht ganz am Ende: am Seitenende gilt sie als aktiv, auch wenn sie nie das Beobachtungsband erreicht */
    var tick = false;
    W.addEventListener('scroll', function () {
      if (tick) return; tick = true;
      W.requestAnimationFrame(function () {
        tick = false;
        if (atEnd()) setActive('faq');
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------ media */
  function initMedia() {
    var sd = !!(navigator.connection && navigator.connection.saveData);
    var hero = $('#hero-yt');
    if (hero) {
      if (reduced || sd) { hero.hidden = true; }
      else {
        var go = function () { hero.src = hero.getAttribute('data-src'); };
        if (D.readyState === 'complete') go(); else W.addEventListener('load', function () { setTimeout(go, 200); });
      }
    }
    var vids = $$('.kk-v');
    if (reduced || sd || !('IntersectionObserver' in W)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () { /* Autoplay verweigert */ }); } else v.pause();
      });
    }, { threshold: 0.1 });
    vids.forEach(function (v) { io.observe(v); });
  }
  function initOptionalImages() {
    $$('.thumb[data-thumb]').forEach(function (d) {
      var p = 'img/thumbs/' + d.getAttribute('data-thumb') + '.webp';
      if (have(p)) d.style.backgroundImage = 'url(/' + p + ')';
    });
  }

  /* ------------------------------------------------------------ marquee */
  function initMarquee() {
    var b = $('.mq-pause'), mq = $('.mq'); if (!b || !mq) return;
    b.addEventListener('click', function () {
      var p = mq.classList.toggle('is-paused');
      b.setAttribute('aria-pressed', p ? 'true' : 'false');
      b.setAttribute('aria-label', p ? 'Laufband abspielen' : 'Laufband anhalten');
      $('.i-pause', b).style.display = p ? 'none' : ''; $('.i-play', b).style.display = p ? '' : 'none';
    });
  }

  /* ------------------------------------------------------------ start */
  function init() {
    initNav(); initMedia(); initMarquee(); initOptionalImages();
    var f = Anf.form();
    if (f) { f.addEventListener('submit', Anf.submit); f.addEventListener('input', Anf.save); }
  }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', init); else init();
})();

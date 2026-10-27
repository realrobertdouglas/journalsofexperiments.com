/*  Audio card (_includes/audio-player.html): a small player over the entry's hidden <audio> element. Back and
    forward ten seconds, play and pause, a seek bar, a status line ("Listen · 26:26 left at 1.5×" or "Younger
    version · …" before the first play, then "Playing · …", "Paused · …" and "Finished", and "Resume · …" when this
    browser remembers where the reader stopped), the clock, speed pills and, for an entry with a narration of its
    younger-readers text, Full/Younger pills. The button carries the class is-playing while the audio plays.
    Until the file has loaded (it is not preloaded) the length comes from the entry's audio_duration, carried on the
    card as data-full-duration / data-young-duration. The chosen speed is kept in this browser under the key
    "listening-speed" and applied to the next entry too.
    Where the reader is in each file is kept under "listening-position:<file>" (whole seconds; written every few
    seconds while it plays and whenever it pauses, is scrubbed, or the page is hidden). A page that reloads, as a
    phone's does when it has put the tab to sleep or the reader pulls down on it, comes back with the clock and the
    bar where they were, and play carries on from there. A file played to the end forgets its position.
    The phone's lock screen and earbuds get the same controls through the Media Session API where there is one:
    the entry's title and cover, play and pause, ten seconds either way, and the position for scrubbing.
    The version pills and the reader toggle (static/js/reader-toggle.js) stay in step: the pills send a
    "reader:set" event, the toggle switches the text and answers with "reader:change", and the card follows that.
    Without JavaScript the native player shows and the card stays hidden.
*/
(function () {
  var KEY = 'listening-speed';
  var POSITION = 'listening-position:';
  var SKIP = 10;                             // seconds, for the back and forward buttons
  var card = document.getElementById('js-audio-player');
  var audio = card && card.querySelector('audio');
  var ui = card && card.querySelector('.audio-card__ui');
  var play = document.getElementById('js-audio-play');
  var back = document.getElementById('js-audio-back');
  var forward = document.getElementById('js-audio-forward');
  var seek = document.getElementById('js-audio-seek');
  var status = document.getElementById('js-audio-status');
  var clock = document.getElementById('js-audio-clock');
  if (!card || !audio || !ui || !play || !seek || !status || !clock) return;
  var ratePills = Array.prototype.slice.call(card.querySelectorAll('[data-rate]'));
  var versionPills = Array.prototype.slice.call(card.querySelectorAll('[data-version]'));
  var title = card.getAttribute('data-title') || document.title;
  var session = ('mediaSession' in navigator) ? navigator.mediaSession : null;

  function parseDuration(text) {           // "39:39" or "1:02:03" -> seconds
    var parts = String(text || '').split(':').map(Number);
    if (!parts.length || parts.some(isNaN)) return 0;
    return parts.reduce(function (total, part) { return total * 60 + part; }, 0);
  }
  function format(seconds) {               // seconds -> "26:26" or "1:02:03"
    seconds = Math.max(0, Math.floor(seconds));
    var h = Math.floor(seconds / 3600), m = Math.floor(seconds % 3600 / 60), s = seconds % 60;
    var mm = (h ? String(m).padStart(2, '0') : String(m)), ss = String(s).padStart(2, '0');
    return h ? h + ':' + mm + ':' + ss : mm + ':' + ss;
  }
  function rateLabel(rate) { return (rate % 1 === 0 ? rate.toFixed(0) : String(rate)) + '×'; }
  function stored() {
    try { var v = parseFloat(localStorage.getItem(KEY)); return v > 0 ? v : 1; } catch (e) { return 1; }
  }
  function remember(rate) {
    try { if (rate === 1) localStorage.removeItem(KEY); else localStorage.setItem(KEY, String(rate)); } catch (e) {}
  }
  function positionKey(src) { return POSITION + String(src || '').split('?')[0]; }   // the file, whatever its ?v=
  function storedPosition(src) {
    try { var v = parseFloat(localStorage.getItem(positionKey(src))); return v > 0 ? v : null; } catch (e) { return null; }
  }
  function rememberPosition(src, seconds) {
    try {
      if (seconds === null) localStorage.removeItem(positionKey(src));
      else localStorage.setItem(positionKey(src), String(Math.floor(seconds)));
    } catch (e) {}
  }

  var versions = {
    full: { src: card.getAttribute('data-full-src'), duration: card.getAttribute('data-full-duration') || '' },
    young: { src: card.getAttribute('data-young-src'), duration: card.getAttribute('data-young-duration') || '' }
  };
  var version = 'full';
  var fallback = parseDuration(versions.full.duration);
  var scrubbing = false;
  var pending = null;                       // a remembered position the element cannot take yet (no metadata until play)
  var lastSaved = null;

  function loaded() { return audio.readyState > 0; }   // metadata is in, so currentTime can be set
  function total() {
    return isFinite(audio.duration) && audio.duration > 0 ? audio.duration : fallback;
  }
  function position() { return pending !== null && !loaded() ? pending : (audio.currentTime || 0); }
  function applyPending() {                 // once the metadata is in, move the element to the remembered position
    if (pending === null || !loaded()) return;
    var t = pending;
    pending = null;
    if (t < total() - 3) { try { audio.currentTime = t; } catch (e) {} }
    else rememberPosition(audio.getAttribute('src'), null);
  }
  function savePosition() {
    var src = audio.getAttribute('src'), t = position(), length = total();
    lastSaved = t;
    if (audio.ended || t < 1 || (length && t > length - 3)) rememberPosition(src, null);
    else rememberPosition(src, t);
  }
  function savePositionSometimes() {        // timeupdate comes several times a second; write every few seconds
    if (lastSaved === null || Math.abs(position() - lastSaved) >= 3) savePosition();
  }
  function pressed(pills, test) {
    pills.forEach(function (p) { p.setAttribute('aria-pressed', test(p) ? 'true' : 'false'); });
  }
  function describe() {                     // the lock screen's title and cover
    if (!session || typeof MediaMetadata === 'undefined') return;
    try {
      session.metadata = new MediaMetadata({
        title: version === 'young' ? title + ' (for younger readers)' : title,
        artist: 'Journal of Experiments',
        artwork: [{ src: location.origin + '/static/img/podcast-cover.png', sizes: '1400x1400', type: 'image/png' }]
      });
    } catch (e) {}
  }
  function handle(action, fn) {             // an action this browser lacks throws; the rest still work
    if (!session || !session.setActionHandler) return;
    try { session.setActionHandler(action, fn); } catch (e) {}
  }
  function mediaPosition() {                // the lock screen's bar
    if (!session || !session.setPositionState || !isFinite(audio.duration) || audio.duration <= 0) return;
    try {
      session.setPositionState({ duration: audio.duration, playbackRate: audio.playbackRate || 1, position: Math.min(audio.currentTime || 0, audio.duration) });
    } catch (e) {}
  }
  function update() {
    applyPending();
    var rate = audio.playbackRate || 1, length = total(), now = position();
    var left = Math.max(0, length - now), started = now > 0;
    pressed(ratePills, function (p) { return Math.abs(parseFloat(p.getAttribute('data-rate')) - rate) < 0.01; });
    pressed(versionPills, function (p) { return p.getAttribute('data-version') === version; });
    var ended = audio.ended, playing = !audio.paused && !ended;
    var resuming = pending !== null && !loaded();   // a remembered position, not played yet
    var who = playing ? 'Playing' : ended ? 'Finished' : resuming ? 'Resume' : started ? 'Paused' : version === 'young' ? 'Younger version' : 'Listen';
    var when = length && !ended ? format(left / rate) + (started ? ' left' : '') + (rate !== 1 ? ' at ' + rateLabel(rate) : '') : '';
    status.textContent = when ? who + ' · ' + when : who;
    clock.textContent = format(now) + ' / ' + format(length);
    if (!scrubbing) {
      seek.max = Math.max(1, Math.round(length));
      seek.value = Math.round(now);
    }
    var pct = length ? Math.min(100, 100 * (scrubbing ? seek.value : now) / length) : 0;
    seek.style.background = 'linear-gradient(90deg, var(--seek-fill) ' + pct + '%, var(--seek-track) ' + pct + '%)';
    play.classList.toggle('is-playing', playing);   // main.css shows the pause icon and a ring while playing
    play.setAttribute('aria-label', playing ? 'Pause the narration' : 'Play the narration');
    mediaPosition();
  }
  function seekTo(seconds) {
    var length = total();
    seconds = Math.max(0, length ? Math.min(length, seconds) : seconds);
    if (loaded()) { pending = null; audio.currentTime = seconds; }
    else pending = seconds;                 // given to the element when its metadata arrives
    savePosition();
    update();
  }
  function skip(delta) { seekTo(position() + delta); }
  function setRate(rate) {
    audio.defaultPlaybackRate = rate;
    audio.playbackRate = rate;
    remember(rate);
    update();
  }
  function adopt() {                        // the length and the remembered position of the version in the element
    fallback = parseDuration(versions[version].duration);
    pending = storedPosition(versions[version].src);
    if (pending !== null && fallback && pending >= fallback - 3) {   // a stale position past the end of the file
      pending = null;
      rememberPosition(versions[version].src, null);
    }
    lastSaved = pending;
    describe();
    update();
  }
  function setVersion(mode) {
    var next = (mode === 'young' && versions.young.src) ? 'young' : 'full';
    if (next === version && audio.getAttribute('src') === versions[next].src) { update(); return; }
    savePosition();                         // where the reader is in the version being left
    version = next;
    audio.pause();
    audio.setAttribute('src', versions[next].src);
    audio.load();                           // preload="none": nothing is fetched until play
    audio.playbackRate = audio.defaultPlaybackRate;
    adopt();
  }
  function showingYoung() {
    var young = document.getElementById('reader-young');
    return !!(young && !young.hidden);
  }
  function start() {
    var p = audio.play();
    if (p && p.catch) p.catch(function () { update(); });
  }

  play.addEventListener('click', function () {
    if (audio.paused || audio.ended) start();
    else audio.pause();
  });
  if (back) back.addEventListener('click', function () { skip(-SKIP); });
  if (forward) forward.addEventListener('click', function () { skip(SKIP); });
  seek.addEventListener('pointerdown', function () { scrubbing = true; });
  seek.addEventListener('keydown', function () { scrubbing = true; });
  seek.addEventListener('input', function () {
    scrubbing = true;
    var length = total();
    clock.textContent = format(seek.value) + ' / ' + format(length);
    var pct = length ? Math.min(100, 100 * seek.value / length) : 0;
    seek.style.background = 'linear-gradient(90deg, var(--seek-fill) ' + pct + '%, var(--seek-track) ' + pct + '%)';
  });
  seek.addEventListener('change', function () {
    scrubbing = false;
    seekTo(Number(seek.value));
  });
  ratePills.forEach(function (p) {
    p.addEventListener('click', function () { setRate(parseFloat(p.getAttribute('data-rate'))); });
  });
  versionPills.forEach(function (p) {
    p.addEventListener('click', function () {
      var mode = p.getAttribute('data-version');
      if (document.getElementById('js-reader-toggle')) {
        try { document.dispatchEvent(new CustomEvent('reader:set', { detail: { mode: mode } })); return; } catch (e) {}
      }
      setVersion(mode);
    });
  });
  ['timeupdate', 'ratechange', 'loadedmetadata', 'durationchange', 'seeked', 'play', 'pause', 'ended', 'waiting', 'playing'].forEach(function (name) {
    audio.addEventListener(name, update);
  });
  audio.addEventListener('timeupdate', savePositionSometimes);
  ['pause', 'seeked', 'ended'].forEach(function (name) { audio.addEventListener(name, savePosition); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') savePosition(); });
  window.addEventListener('pagehide', savePosition);
  // Some browsers reset the rate when the file starts loading; put the chosen one back.
  audio.addEventListener('play', function () { if (audio.playbackRate !== audio.defaultPlaybackRate) audio.playbackRate = audio.defaultPlaybackRate; });
  document.addEventListener('reader:change', function (e) { setVersion(e.detail && e.detail.mode); });
  handle('play', start);
  handle('pause', function () { audio.pause(); });
  handle('seekbackward', function (d) { skip(-((d && d.seekOffset) || SKIP)); });
  handle('seekforward', function (d) { skip((d && d.seekOffset) || SKIP); });
  handle('seekto', function (d) { if (d && typeof d.seekTime === 'number') seekTo(d.seekTime); });

  audio.removeAttribute('controls');
  audio.hidden = true;
  setRate(stored());
  adopt();
  setVersion(showingYoung() ? 'young' : 'full');
  ui.hidden = false;
})();
